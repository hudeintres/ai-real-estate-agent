"""
Webhook API routes (Stripe webhooks)
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.database import get_db
from app.models.user import User
from app.models.offer import Offer, OfferStatus, AgentReviewStatus
from app.models.payment import Payment, PaymentStatus, PaymentType
from app.models.subscription import Subscription, SubscriptionStatus
from app.config import settings

router = APIRouter()


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Handle Stripe webhook events
    """
    if not settings.STRIPE_SECRET_KEY or not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    
    try:
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
    except ImportError:
        raise HTTPException(status_code=500, detail="Stripe package not installed")
    
    # Get the raw body and signature
    body = await request.body()
    signature = request.headers.get("stripe-signature")
    
    if not signature:
        raise HTTPException(status_code=400, detail="Missing stripe-signature header")
    
    try:
        event = stripe.Webhook.construct_event(
            body,
            signature,
            settings.STRIPE_WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError as e:
        print(f"Webhook signature verification failed: {e}")
        raise HTTPException(status_code=400, detail="Webhook signature verification failed")
    except Exception as e:
        print(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    
    try:
        event_type = event.get("type")
        
        if event_type == "checkout.session.completed":
            session = event["data"]["object"]
            
            # Update payment status
            offer_id = session.get("metadata", {}).get("offerId")
            if offer_id:
                result = await db.execute(
                    select(Payment).where(
                        Payment.stripe_checkout_session_id == session["id"]
                    )
                )
                payment = result.scalar_one_or_none()
                
                if payment:
                    payment.status = PaymentStatus.COMPLETED
                    payment.paid_at = datetime.utcnow()
                    payment.stripe_payment_intent_id = session.get("payment_intent")
                    
                    # If it's a download payment, mark offer as downloaded
                    if payment.payment_type in [
                        PaymentType.SINGLE_DOWNLOAD,
                        PaymentType.SINGLE_DOWNLOAD_WITH_REVIEW
                    ]:
                        await db.execute(
                            update(Offer)
                            .where(Offer.id == payment.offer_id)
                            .values(status=OfferStatus.DOWNLOADED)
                        )
                    
                    # If agent review is requested
                    if payment.payment_type in [
                        PaymentType.SINGLE_DOWNLOAD_WITH_REVIEW,
                        PaymentType.AGENT_REVIEW_ONLY
                    ]:
                        await db.execute(
                            update(Offer)
                            .where(Offer.id == payment.offer_id)
                            .values(
                                requires_agent_review=True,
                                agent_review_status=AgentReviewStatus.REQUESTED
                            )
                        )
                    
                    await db.commit()
            
            # Handle subscription creation
            if session.get("mode") == "subscription" and session.get("subscription"):
                subscription_id = session["subscription"]
                subscription = stripe.Subscription.retrieve(subscription_id)
                
                # Find user by email
                customer_id = session["customer"]
                customer = stripe.Customer.retrieve(customer_id)
                
                if customer and not customer.get("deleted") and customer.get("email"):
                    result = await db.execute(
                        select(User).where(User.email == customer["email"])
                    )
                    user = result.scalar_one_or_none()
                    
                    if user:
                        # Check if subscription exists
                        result = await db.execute(
                            select(Subscription).where(
                                Subscription.stripe_subscription_id == subscription_id
                            )
                        )
                        existing_sub = result.scalar_one_or_none()
                        
                        current_period_end = datetime.fromtimestamp(
                            subscription["current_period_end"]
                        )
                        
                        if existing_sub:
                            existing_sub.status = SubscriptionStatus.ACTIVE
                            existing_sub.current_period_end = current_period_end
                        else:
                            new_sub = Subscription(
                                user_id=user.id,
                                stripe_customer_id=customer_id,
                                stripe_subscription_id=subscription_id,
                                status=SubscriptionStatus.ACTIVE,
                                current_period_end=current_period_end,
                            )
                            db.add(new_sub)
                        
                        await db.commit()
        
        elif event_type in ["customer.subscription.updated", "customer.subscription.deleted"]:
            subscription = event["data"]["object"]
            subscription_id = subscription["id"]
            
            # Map Stripe status to our status
            stripe_status = subscription["status"]
            if stripe_status == "active":
                status = SubscriptionStatus.ACTIVE
            elif stripe_status == "canceled":
                status = SubscriptionStatus.CANCELED
            elif stripe_status == "past_due":
                status = SubscriptionStatus.PAST_DUE
            else:
                status = SubscriptionStatus.UNPAID
            
            current_period_end = datetime.fromtimestamp(
                subscription["current_period_end"]
            )
            
            await db.execute(
                update(Subscription)
                .where(Subscription.stripe_subscription_id == subscription_id)
                .values(
                    status=status,
                    current_period_end=current_period_end
                )
            )
            await db.commit()
        
        else:
            print(f"Unhandled event type: {event_type}")
        
        return {"received": True}
    
    except Exception as e:
        print(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")
