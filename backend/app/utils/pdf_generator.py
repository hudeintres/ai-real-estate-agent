"""
PDF generation utilities for filling contract templates
"""
import os
from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime
from pathlib import Path
from app.config import settings


@dataclass
class OfferData:
    """Data class for offer information used in PDF generation"""
    property_address: str
    city: str
    state: str
    zip_code: str
    offer_price: float
    closing_date: str  # YYYY-MM-DD format
    financing_type: Optional[str] = None
    buyer_name: Optional[str] = None
    buyer_email: Optional[str] = None
    buyer_phone: Optional[str] = None
    mls_number: Optional[str] = None
    listing_agent_name: Optional[str] = None
    listing_agent_email: Optional[str] = None
    listing_agent_phone: Optional[str] = None
    seller_credits: Optional[float] = None
    additional_notes: Optional[str] = None
    earnest_money: Optional[float] = None
    option_fee: Optional[float] = None
    seller_name: Optional[str] = None


def get_contract_template_path(state: str, property_type: Optional[str] = None) -> str:
    """
    Get the path to the contract template based on state and property type
    """
    state_lower = state.lower()
    
    template_filename = 'singlefamily-resale.pdf'
    if property_type:
        prop_type_lower = property_type.lower()
        if 'condo' in prop_type_lower or 'condominium' in prop_type_lower:
            template_filename = 'condo-resale.pdf'
    
    template_path = os.path.join(settings.TEMPLATES_DIR, state_lower, template_filename)
    return template_path


def get_tx_singlefamily_field_mappings(offer_data: 'OfferData') -> Dict[str, str]:
    """
    Get field mappings for Texas Single Family Resale contract
    Based on actual PDF form field names from the TREC form
    """
    # Format values
    formatted_price = f"{offer_data.offer_price:,.2f}"
    
    # Format closing date
    try:
        closing_date_obj = datetime.strptime(offer_data.closing_date, "%Y-%m-%d")
        closing_month_day = closing_date_obj.strftime("%B %d")  # e.g., "March 01"
        closing_year = closing_date_obj.strftime("%y")  # e.g., "24"
    except (ValueError, TypeError):
        closing_month_day = offer_data.closing_date or ""
        closing_year = ""
    
    mappings = {
        # Parties (Buyer name field)
        "1 PARTIES The parties to this contract are": offer_data.buyer_name or "",
        
        # Seller name
        "Seller and": offer_data.seller_name or "",
        
        # Property Address - "Texas known as" is the street address field
        "Texas known as": offer_data.property_address,
        
        # City
        "Addition City of": offer_data.city,
        
        # Address fields used in multiple places
        "Address of Property": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Address of Property_2": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Contract Concerning": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Contract Concerning_2": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Contract Concerning_3": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Contract Concerning_4": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        
        # Closing date
        "A The closing of the sale will be on or before": closing_month_day,
        "20": closing_year,
        
        # Earnest money
        "earnest money of": f"{offer_data.earnest_money or 1000:,.2f}",
        
        # Seller credits/concessions
        "Buyers Expenses as allowed by the lender": f"{offer_data.seller_credits or 0:,.2f}" if offer_data.seller_credits else "",
        
        # Buyer email
        "Email": offer_data.buyer_email or "",
        
        # Listing agent info
        "Listing Associates Name": offer_data.listing_agent_name or "",
        "Listing Associates Email Address": offer_data.listing_agent_email or "",
        "Phone_3": offer_data.listing_agent_phone or "",
    }
    
    return mappings


def get_tx_condo_field_mappings(offer_data: 'OfferData') -> Dict[str, str]:
    """
    Get field mappings for Texas Condo Resale contract
    """
    # Format closing date
    try:
        closing_date_obj = datetime.strptime(offer_data.closing_date, "%Y-%m-%d")
        closing_month_day = closing_date_obj.strftime("%B %d")
        closing_year = closing_date_obj.strftime("%y")
    except (ValueError, TypeError):
        closing_month_day = offer_data.closing_date or ""
        closing_year = ""
    
    mappings = {
        # Parties
        "1 PARTIES The parties to this contract are": offer_data.buyer_name or "",
        
        # Address - for condo the unit address field
        "addresszip code City of": offer_data.city,
        
        # Contract address references
        "Address of Property": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Address of Property_2": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Address of Property_3": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Contract Concerning": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Contract Concerning_2": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Contract Concerning_3": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Contract Concerning_4": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        "Contract Concerning_5": f"{offer_data.property_address}, {offer_data.city}, {offer_data.state} {offer_data.zip_code}",
        
        # Closing date
        "20": closing_year,
        
        # Earnest money
        "as earnest money to": f"{offer_data.earnest_money or 1000:,.2f}",
        
        # Email
        "Email": offer_data.buyer_email or "",
        
        # Listing agent
        "Listing Associates Name": offer_data.listing_agent_name or "",
        "Listing Associates Email Address": offer_data.listing_agent_email or "",
        "Phone_3": offer_data.listing_agent_phone or "",
    }
    
    return mappings


async def generate_offer_letter_pdf(
    offer_data: OfferData,
    property_type: Optional[str] = None
) -> bytes:
    """
    Generate a filled PDF offer letter from a template
    """
    try:
        from pypdf import PdfReader, PdfWriter
    except ImportError:
        from PyPDF2 import PdfReader, PdfWriter
    
    # Get the template path
    template_path = get_contract_template_path(offer_data.state, property_type)
    
    # Check if template exists
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Template not found at {template_path}. Please ensure the template file exists.")
    
    # Read the PDF template
    reader = PdfReader(template_path)
    writer = PdfWriter()
    
    # Clone the document to preserve form fields
    writer.clone_document_from_reader(reader)
    
    # Get the appropriate field mappings based on state and property type
    is_condo = property_type and ('condo' in property_type.lower() or 'condominium' in property_type.lower())
    
    if offer_data.state.upper() == 'TX':
        if is_condo:
            field_mappings = get_tx_condo_field_mappings(offer_data)
        else:
            field_mappings = get_tx_singlefamily_field_mappings(offer_data)
    else:
        # For other states, use generic mappings (fallback)
        field_mappings = get_tx_singlefamily_field_mappings(offer_data)
    
    # Update form fields - try on all pages
    for page_num in range(len(writer.pages)):
        for field_name, value in field_mappings.items():
            if value:  # Only set if value is not empty
                try:
                    writer.update_page_form_field_values(
                        writer.pages[page_num],
                        {field_name: str(value)}
                    )
                except Exception:
                    pass  # Field doesn't exist on this page, skip it
    
    # Write to bytes
    from io import BytesIO
    output = BytesIO()
    writer.write(output)
    return output.getvalue()


async def save_pdf_to_file(pdf_bytes: bytes, output_path: str) -> None:
    """
    Save the generated PDF to a file
    """
    import aiofiles
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    async with aiofiles.open(output_path, 'wb') as f:
        await f.write(pdf_bytes)
