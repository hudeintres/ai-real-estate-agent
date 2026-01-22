"""
Payment API routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.offer import Offer
from app.models.payment import Payment, PaymentStatus, PaymentType
from app.schemas.payment import (
    CreateCheckoutRequest,
    CreateCheckoutResponse,
    VerifyPaymentResponse,
)
from app.config import settings

router = APIRouter()

# Pricing in cents
PRICING = {
    PaymentType.SINGLE_DOWNLOAD: 1000,  # $10.00
    PaymentType.SINGLE_DOWNLOAD_WITH_REVIEW: 3000,  # $30.00
    PaymentType.AGENT_REVIEW_ONLY: 2000,  # $20.00
    PaymentType.MONTHLY_SUBSCRIPTION: 2000,  # $20.00
}


@router.post("/create-checkout", response_model=CreateCheckoutResponse)
async def create_checkout(
    request: CreateCheckoutRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a Stripe checkout session for payment
    """
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    
    try:
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
    except ImportError:
        raise HTTPException(status_code=500, detail="Stripe package not installed")
    
    offer_id = request.offer_id
    payment_type_str = request.payment_type
    requires_review = request.requires_review
    
    if not offer_id or not payment_type_str:
        raise HTTPException(
            status_code=400,
            detail="offer_id and payment_type are required"
        )
    
    # Get the offer
    result = await db.execute(
        select(Offer)
        .options(selectinload(Offer.user), selectinload(Offer.property))
        .where(Offer.id == offer_id)
    )
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    # Determine final payment type and amount
    final_payment_type_str = payment_type_str
    if payment_type_str == "SINGLE_DOWNLOAD" and requires_review:
        final_payment_type_str = "SINGLE_DOWNLOAD_WITH_REVIEW"
    
    try:
        final_payment_type = PaymentType(final_payment_type_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payment type")
    
    amount = PRICING.get(final_payment_type)
    if not amount:
        raise HTTPException(status_code=400, detail="Invalid payment type")
    
    # Get or create Stripe customer
    customer_id = None
    if offer.user.email:
        customers = stripe.Customer.list(email=offer.user.email, limit=1)
        
        if customers.data:
            customer_id = customers.data[0].id
        else:
            customer = stripe.Customer.create(
                email=offer.user.email,
                name=offer.user.name or None,
            )
            customer_id = customer.id
    
    # Handle subscription differently
    if final_payment_type == PaymentType.MONTHLY_SUBSCRIPTION:
        session = stripe.checkout.Session.create(
            customer=customer_id,
            mode="subscription",
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "Monthly Subscription - AI Real Estate Agent",
                            "description": "Unlimited access to AI agent for generating offer letters",
                        },
                        "recurring": {
                            "interval": "month",
                        },
                        "unit_amount": amount,
                    },
                    "quantity": 1,
                },
            ],
            success_url=f"{settings.APP_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.APP_URL}/offer/{offer_id}/preview",
            metadata={
                "offerId": offer_id,
                "paymentType": final_payment_type.value,
            },
        )
        
        return CreateCheckoutResponse(url=session.url)
    
    # Create one-time payment
    product_name = {
        PaymentType.SINGLE_DOWNLOAD: "Single Download - Offer Letter",
        PaymentType.SINGLE_DOWNLOAD_WITH_REVIEW: "Single Download + Agent Review - Offer Letter",
        PaymentType.AGENT_REVIEW_ONLY: "Agent Review - Offer Letter",
    }.get(final_payment_type, "Offer Letter")
    
    session = stripe.checkout.Session.create(
        customer=customer_id,
        mode="payment",
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": product_name,
                        "description": f"Property: {offer.property.address}",
                    },
                    "unit_amount": amount,
                },
                "quantity": 1,
            },
        ],
        success_url=f"{settings.APP_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{settings.APP_URL}/offer/{offer_id}/preview",
        metadata={
            "offerId": offer_id,
            "paymentType": final_payment_type.value,
        },
    )
    
    # Create payment record
    payment = Payment(
        user_id=offer.user_id,
        offer_id=offer.id,
        stripe_checkout_session_id=session.id,
        amount=amount,
        status=PaymentStatus.PENDING,
        payment_type=final_payment_type,
    )
    db.add(payment)
    await db.commit()
    
    return CreateCheckoutResponse(url=session.url)


@router.get("/verify", response_model=VerifyPaymentResponse)
async def verify_payment(
    session_id: str = Query(..., description="Stripe checkout session ID"),
    db: AsyncSession = Depends(get_db)
):
    """
    Verify a payment by checkout session ID
    """
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id is required")
    
    result = await db.execute(
        select(Payment)
        .options(selectinload(Payment.offer))
        .where(Payment.stripe_checkout_session_id == session_id)
    )
    payment = result.scalar_one_or_none()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return VerifyPaymentResponse(
        payment_id=payment.id,
        offer_id=payment.offer_id,
        status=payment.status,
    )
