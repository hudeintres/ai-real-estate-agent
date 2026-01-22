"""
Property schemas
"""
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict, Field


def to_camel(string: str) -> str:
    """Convert snake_case to camelCase"""
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class CamelCaseModel(BaseModel):
    """Base model that outputs camelCase"""
    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel,
        from_attributes=True,
    )


class ExtractedPropertyData(BaseModel):
    """Schema for property data extracted from LLM"""
    address: str
    city: str
    state: str
    zip_code: str
    price: Optional[float] = None
    ai_fair_value: Optional[float] = None
    days_on_market: Optional[int] = None
    mls_number: Optional[str] = None
    listing_agent_name: Optional[str] = None
    listing_agent_email: Optional[str] = None
    listing_agent_phone: Optional[str] = None
    offer_deadline: Optional[datetime] = None
    has_hoa: Optional[bool] = None
    built_before_1978: Optional[bool] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[int] = None
    lot_size: Optional[float] = None
    year_built: Optional[int] = None
    property_type: Optional[str] = None


class PropertyBase(CamelCaseModel):
    """Base property schema"""
    address: str
    city: str
    state: str
    zip_code: str = Field(..., serialization_alias="zipCode")
    property_type: str = Field(..., serialization_alias="propertyType")
    source_url: Optional[str] = Field(None, serialization_alias="sourceUrl")
    source_type: Optional[str] = Field(None, serialization_alias="sourceType")
    mls_number: Optional[str] = Field(None, serialization_alias="mlsNumber")
    price: Optional[float] = None
    ai_fair_value: Optional[float] = Field(None, serialization_alias="aiFairValue")
    days_on_market: Optional[int] = Field(None, serialization_alias="daysOnMarket")
    listing_agent_name: Optional[str] = Field(None, serialization_alias="listingAgentName")
    listing_agent_email: Optional[str] = Field(None, serialization_alias="listingAgentEmail")
    listing_agent_phone: Optional[str] = Field(None, serialization_alias="listingAgentPhone")
    offer_deadline: Optional[datetime] = Field(None, serialization_alias="offerDeadline")
    has_hoa: Optional[bool] = Field(None, serialization_alias="hasHOA")
    built_before_1978: Optional[bool] = Field(None, serialization_alias="builtBefore1978")
    extracted_data: Optional[dict[str, Any]] = Field(None, serialization_alias="extractedData")


class PropertyCreate(PropertyBase):
    """Property creation schema"""
    pass


class PropertyResponse(PropertyBase):
    """Property response schema"""
    id: str
    created_at: datetime = Field(..., serialization_alias="createdAt")
    updated_at: datetime = Field(..., serialization_alias="updatedAt")


class PropertyExtractRequest(BaseModel):
    """Request schema for property extraction"""
    url: str


class PropertyExtractResponse(BaseModel):
    """Response schema for property extraction"""
    property_id: str = Field(..., serialization_alias="propertyId")
    
    model_config = ConfigDict(populate_by_name=True)
