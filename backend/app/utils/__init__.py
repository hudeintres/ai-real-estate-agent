"""
Utility functions
"""
from app.utils.property_extractor import extract_property_from_url, get_source_type
from app.utils.pdf_generator import generate_offer_letter_pdf, OfferData
from app.utils.email import send_email, send_offer_notification

__all__ = [
    "extract_property_from_url",
    "get_source_type",
    "generate_offer_letter_pdf",
    "OfferData",
    "send_email",
    "send_offer_notification",
]
