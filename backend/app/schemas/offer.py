"""
Offer schemas
"""
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict, Field
from app.models.offer import OfferStatus, AgentReviewStatus
from app.schemas.property import PropertyResponse


def to_camel(string: str) -> str:
    """Convert snake_case to camelCase"""
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class CamelCaseModel(BaseModel):
    """Base model that accepts camelCase input"""
    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel,
    )


class ContingenciesSchema(BaseModel):
    """Schema for contingencies"""
    inspection: bool = False
    appraisal: bool = False
    financing: bool = False


class TimelinePreferencesSchema(BaseModel):
    """Schema for timeline preferences"""
    closing_date: Optional[str] = Field(None, alias="closingDate")
    move_in_date: Optional[str] = Field(None, alias="moveInDate")
    flexibility: Optional[str] = None


class ConcessionsSchema(BaseModel):
    """Schema for concessions"""
    seller_credits: Optional[str] = Field(None, alias="sellerCredits")
    repairs: Optional[str] = None
    other: Optional[str] = None


class OfferBase(CamelCaseModel):
    """Base offer schema - accepts camelCase from frontend"""
    address: str
    city: str
    state: str
    zip_code: str = Field(..., alias="zipCode")
    property_type: str = Field("singlefamily", alias="propertyType")
    financing_type: str = Field(..., alias="financingType")
    offer_price: float = Field(..., alias="offerPrice")
    contingencies: dict[str, Any]
    timeline_preferences: Optional[dict[str, Any]] = Field(None, alias="timelinePreferences")
    concessions: Optional[dict[str, Any]] = None
    additional_notes: Optional[str] = Field(None, alias="additionalNotes")


class OfferCreate(OfferBase):
    """Offer creation schema"""
    pass


class OfferResponse(CamelCaseModel):
    """Offer response schema"""
    id: str
    user_id: str = Field(..., serialization_alias="userId")
    property_id: str = Field(..., serialization_alias="propertyId")
    financing_type: str = Field(..., serialization_alias="financingType")
    offer_price: float = Field(..., serialization_alias="offerPrice")
    contingencies: dict[str, Any]
    timeline_preferences: Optional[dict[str, Any]] = Field(None, serialization_alias="timelinePreferences")
    concessions: Optional[dict[str, Any]] = None
    additional_notes: Optional[str] = Field(None, serialization_alias="additionalNotes")
    status: OfferStatus
    offer_letter_preview: Optional[str] = Field(None, serialization_alias="offerLetterPreview")
    offer_letter_url: Optional[str] = Field(None, serialization_alias="offerLetterUrl")
    requires_agent_review: bool = Field(..., serialization_alias="requiresAgentReview")
    agent_review_status: AgentReviewStatus = Field(..., serialization_alias="agentReviewStatus")
    agent_review_notes: Optional[str] = Field(None, serialization_alias="agentReviewNotes")
    reviewed_at: Optional[datetime] = Field(None, serialization_alias="reviewedAt")
    notification_sent: bool = Field(..., serialization_alias="notificationSent")
    notification_sent_at: Optional[datetime] = Field(None, serialization_alias="notificationSentAt")
    created_at: datetime = Field(..., serialization_alias="createdAt")
    updated_at: datetime = Field(..., serialization_alias="updatedAt")


class OfferWithProperty(OfferResponse):
    """Offer response with property details"""
    property: PropertyResponse


class OfferCreateResponse(BaseModel):
    """Response for offer creation"""
    offer_id: str = Field(..., serialization_alias="offerId")
    
    model_config = ConfigDict(populate_by_name=True)
