"""
Offer API routes
"""
import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.property import Property
from app.models.offer import Offer, OfferStatus
from app.models.payment import Payment, PaymentStatus, PaymentType
from app.schemas.offer import OfferCreate, OfferResponse, OfferWithProperty, OfferCreateResponse
from app.utils.pdf_generator import generate_offer_letter_pdf, OfferData
from app.utils.email import send_offer_notification, OfferNotificationData
from app.config import settings

router = APIRouter()


@router.post("/create", response_model=OfferCreateResponse)
async def create_offer(
    request: OfferCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new offer
    
    Creates the property if it doesn't exist, generates the offer letter PDF,
    and sends an email notification.
    """
    # TODO: Get user from session/auth
    # For now, use a placeholder user
    
    # Check if user exists, create if not
    result = await db.execute(
        select(User).where(User.email == "temp@example.com")
    )
    user = result.scalar_one_or_none()
    
    if not user:
        user = User(email="temp@example.com")
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    # Create or find the property
    result = await db.execute(
        select(Property).where(
            Property.address == request.address,
            Property.city == request.city,
            Property.state == request.state,
            Property.zip_code == request.zip_code,
            Property.property_type == request.property_type,
        )
    )
    property_obj = result.scalar_one_or_none()
    
    if not property_obj:
        property_obj = Property(
            address=request.address,
            city=request.city,
            state=request.state,
            zip_code=request.zip_code,
            property_type=request.property_type,
        )
        db.add(property_obj)
        await db.commit()
        await db.refresh(property_obj)
    
    # Create the offer
    offer = Offer(
        user_id=user.id,
        property_id=property_obj.id,
        financing_type=request.financing_type,
        offer_price=request.offer_price,
        contingencies=request.contingencies,
        timeline_preferences=request.timeline_preferences,
        concessions=request.concessions,
        additional_notes=request.additional_notes,
        status=OfferStatus.GENERATED,
        offer_letter_preview=None,
    )
    db.add(offer)
    await db.commit()
    await db.refresh(offer)
    
    # Generate PDF offer letter
    offer_letter_url = None
    try:
        # Prepare offer data for PDF generation
        closing_date = ""
        if request.timeline_preferences:
            closing_date = request.timeline_preferences.get("closingDate", "") or request.timeline_preferences.get("closing_date", "")
        
        seller_credits = None
        if request.concessions:
            credits_str = request.concessions.get("sellerCredits") or request.concessions.get("seller_credits")
            if credits_str:
                try:
                    seller_credits = float(credits_str)
                except (ValueError, TypeError):
                    pass
        
        offer_data = OfferData(
            property_address=request.address,
            city=request.city,
            state=request.state,
            zip_code=request.zip_code,
            offer_price=request.offer_price,
            closing_date=closing_date,
            financing_type=request.financing_type,
            buyer_name=user.name,
            buyer_email=user.email,
            seller_credits=seller_credits,
            additional_notes=request.additional_notes,
        )
        
        # Generate the PDF
        pdf_bytes = await generate_offer_letter_pdf(offer_data, request.property_type)
        
        # Create offers directory if it doesn't exist
        os.makedirs(settings.OFFERS_DIR, exist_ok=True)
        
        # Save PDF to offers directory
        pdf_filename = f"offer-{offer.id}.pdf"
        pdf_path = os.path.join(settings.OFFERS_DIR, pdf_filename)
        
        with open(pdf_path, 'wb') as f:
            f.write(pdf_bytes)
        
        # Set the URL
        offer_letter_url = f"/offers/{pdf_filename}"
        
        # Update offer with PDF URL
        offer.offer_letter_url = offer_letter_url
        offer.status = OfferStatus.GENERATED
        await db.commit()
        
    except Exception as e:
        print(f"Error generating PDF offer letter: {e}")
        # Don't fail the request if PDF generation fails
    
    # Send email notification
    try:
        await send_offer_notification(OfferNotificationData(
            offer_id=offer.id,
            property_address=property_obj.address,
            offer_price=offer.offer_price,
            financing_type=offer.financing_type,
            buyer_email=user.email,
        ))
        
        offer.notification_sent = True
        offer.notification_sent_at = datetime.utcnow()
        await db.commit()
    except Exception as e:
        print(f"Failed to send email notification: {e}")
        # Don't fail the request if email fails
    
    return OfferCreateResponse(offer_id=offer.id)


@router.get("/{offer_id}", response_model=OfferWithProperty)
async def get_offer(
    offer_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get offer by ID with property details"""
    result = await db.execute(
        select(Offer)
        .options(selectinload(Offer.property))
        .where(Offer.id == offer_id)
    )
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    return offer


@router.get("/{offer_id}/download")
async def download_offer(
    offer_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Download the offer letter PDF
    
    Requires payment to be completed for SINGLE_DOWNLOAD or SINGLE_DOWNLOAD_WITH_REVIEW.
    """
    # Get offer with payments
    result = await db.execute(
        select(Offer)
        .options(
            selectinload(Offer.property),
            selectinload(Offer.payments)
        )
        .where(Offer.id == offer_id)
    )
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    # Check if user has paid for download
    has_paid_download = any(
        payment.status == PaymentStatus.COMPLETED and
        payment.payment_type in [PaymentType.SINGLE_DOWNLOAD, PaymentType.SINGLE_DOWNLOAD_WITH_REVIEW]
        for payment in offer.payments
    )
    # TODO: Also check for active subscription
    
    if not has_paid_download:
        raise HTTPException(status_code=403, detail="Payment required to download")
    
    # Check if offer letter is available
    if not offer.offer_letter_url and not offer.offer_letter_preview:
        raise HTTPException(status_code=404, detail="Offer letter not yet available")
    
    # If there's a URL to the actual PDF document, serve it
    if offer.offer_letter_url:
        # If it's a local path
        if offer.offer_letter_url.startswith('/offers/'):
            pdf_path = os.path.join(settings.OFFERS_DIR, os.path.basename(offer.offer_letter_url))
            
            if not os.path.exists(pdf_path):
                raise HTTPException(status_code=404, detail="PDF file not found")
            
            return FileResponse(
                path=pdf_path,
                media_type="application/pdf",
                filename=f"offer-letter-{offer_id}.pdf"
            )
        else:
            # External URL - redirect
            from fastapi.responses import RedirectResponse
            return RedirectResponse(url=offer.offer_letter_url)
    
    # Otherwise, return the preview as text (fallback)
    content = offer.offer_letter_preview or "Offer letter not available"
    
    return Response(
        content=content,
        media_type="text/plain",
        headers={
            "Content-Disposition": f'attachment; filename="offer-letter-{offer_id}.txt"'
        }
    )
