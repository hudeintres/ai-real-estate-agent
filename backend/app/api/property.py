"""
Property API routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.property import Property
from app.schemas.property import (
    PropertyExtractRequest,
    PropertyExtractResponse,
    PropertyResponse,
)
from app.utils.property_extractor import extract_property_from_url, get_source_type

router = APIRouter()


@router.post("/extract", response_model=PropertyExtractResponse)
async def extract_property(
    request: PropertyExtractRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Extract property information from a URL using LLM
    
    If the property already exists (by URL or address), returns the existing property.
    Otherwise, extracts data from the URL and creates a new property.
    """
    url = request.url
    
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    # Determine source type
    source_type = get_source_type(url)
    
    # First, check if property with this URL already exists
    result = await db.execute(
        select(Property).where(Property.source_url == url)
    )
    property_obj = result.scalar_one_or_none()
    
    if property_obj:
        # Property already exists, return it
        return PropertyExtractResponse(property_id=property_obj.id)
    
    # Extract property data using LLM
    try:
        extracted_data = await extract_property_from_url(url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # Check if a property with the same address already exists
    result = await db.execute(
        select(Property).where(
            Property.address == extracted_data.address,
            Property.city == extracted_data.city,
            Property.state == extracted_data.state,
            Property.zip_code == extracted_data.zip_code,
        )
    )
    existing_property = result.scalar_one_or_none()
    
    if existing_property:
        # Update the existing property with the new source URL if different
        if existing_property.source_url != url:
            existing_property.source_url = url
            existing_property.source_type = source_type
            existing_property.price = existing_property.price or extracted_data.price
            existing_property.ai_fair_value = existing_property.ai_fair_value or extracted_data.ai_fair_value
            existing_property.days_on_market = existing_property.days_on_market or extracted_data.days_on_market
            existing_property.property_type = existing_property.property_type or extracted_data.property_type or "singlefamily"
            existing_property.mls_number = existing_property.mls_number or extracted_data.mls_number
            existing_property.listing_agent_name = existing_property.listing_agent_name or extracted_data.listing_agent_name
            existing_property.listing_agent_email = existing_property.listing_agent_email or extracted_data.listing_agent_email
            existing_property.listing_agent_phone = existing_property.listing_agent_phone or extracted_data.listing_agent_phone
            existing_property.offer_deadline = existing_property.offer_deadline or extracted_data.offer_deadline
            existing_property.has_hoa = existing_property.has_hoa if existing_property.has_hoa is not None else extracted_data.has_hoa
            existing_property.built_before_1978 = existing_property.built_before_1978 if existing_property.built_before_1978 is not None else extracted_data.built_before_1978
            
            # Merge extracted data
            current_data = existing_property.extracted_data or {}
            current_data.update({
                'bedrooms': extracted_data.bedrooms,
                'bathrooms': extracted_data.bathrooms,
                'square_feet': extracted_data.square_feet,
                'lot_size': extracted_data.lot_size,
                'year_built': extracted_data.year_built,
            })
            existing_property.extracted_data = current_data
            
            await db.commit()
        
        property_obj = existing_property
    else:
        # Create new property with extracted data
        property_obj = Property(
            source_url=url,
            source_type=source_type,
            address=extracted_data.address,
            city=extracted_data.city,
            state=extracted_data.state,
            zip_code=extracted_data.zip_code,
            price=extracted_data.price,
            ai_fair_value=extracted_data.ai_fair_value,
            days_on_market=extracted_data.days_on_market,
            property_type=extracted_data.property_type or "singlefamily",
            mls_number=extracted_data.mls_number,
            listing_agent_name=extracted_data.listing_agent_name,
            listing_agent_email=extracted_data.listing_agent_email,
            listing_agent_phone=extracted_data.listing_agent_phone,
            offer_deadline=extracted_data.offer_deadline,
            has_hoa=extracted_data.has_hoa,
            built_before_1978=extracted_data.built_before_1978,
            extracted_data={
                'bedrooms': extracted_data.bedrooms,
                'bathrooms': extracted_data.bathrooms,
                'square_feet': extracted_data.square_feet,
                'lot_size': extracted_data.lot_size,
                'year_built': extracted_data.year_built,
            },
        )
        db.add(property_obj)
        await db.commit()
        await db.refresh(property_obj)
    
    return PropertyExtractResponse(property_id=property_obj.id)


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get property by ID"""
    result = await db.execute(
        select(Property).where(Property.id == property_id)
    )
    property_obj = result.scalar_one_or_none()
    
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return property_obj
