"""
Email utility for sending notifications

TODO: Implement actual email sending using a service like:
- Resend (https://resend.com)
- SendGrid (https://sendgrid.com)
- SMTP
"""
from typing import Optional
from dataclasses import dataclass
from app.config import settings


@dataclass
class EmailOptions:
    """Email options data class"""
    to: str
    subject: str
    text: str
    html: Optional[str] = None


async def send_email(options: EmailOptions) -> None:
    """
    Send an email
    
    For now, just logs the email. In production, implement actual email sending.
    
    Args:
        options: Email options containing to, subject, text, and optional html
    """
    notification_email = settings.NOTIFICATION_EMAIL
    if not notification_email:
        print("Warning: NOTIFICATION_EMAIL not set, skipping email")
        return
    
    # Log the email for now
    print(f"Email would be sent:")
    print(f"  To: {options.to}")
    print(f"  Subject: {options.subject}")
    print(f"  Text: {options.text}")
    
    # Example implementation with Resend:
    # import resend
    # resend.api_key = settings.RESEND_API_KEY
    # await resend.Emails.send({
    #     "from": "noreply@yourdomain.com",
    #     "to": options.to,
    #     "subject": options.subject,
    #     "text": options.text,
    #     "html": options.html,
    # })


@dataclass
class OfferNotificationData:
    """Data for offer notification email"""
    offer_id: str
    property_address: str
    offer_price: float
    financing_type: str
    buyer_email: Optional[str] = None


async def send_offer_notification(offer_data: OfferNotificationData) -> None:
    """
    Send notification email for a new offer
    
    Args:
        offer_data: Offer notification data
    """
    notification_email = settings.NOTIFICATION_EMAIL
    if not notification_email:
        return
    
    email_body = f"""
New Offer Created

Offer ID: {offer_data.offer_id}
Property: {offer_data.property_address}
Offer Price: ${offer_data.offer_price:,.2f}
Financing Type: {offer_data.financing_type}
{f'Buyer Email: {offer_data.buyer_email}' if offer_data.buyer_email else ''}

Please review and generate the offer letter.
    """.strip()
    
    await send_email(EmailOptions(
        to=notification_email,
        subject=f"New Offer Created - {offer_data.property_address}",
        text=email_body,
    ))
