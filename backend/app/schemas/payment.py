"""
Payment schemas
"""
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict
from app.models.payment import PaymentStatus, PaymentType


class PaymentBase(BaseModel):
    """Base payment schema"""
    amount: float
    currency: str = "usd"
    payment_type: PaymentType


class PaymentCreate(PaymentBase):
    """Payment creation schema"""
    user_id: str
    offer_id: Optional[str] = None
    stripe_checkout_session_id: Optional[str] = None


class PaymentResponse(PaymentBase):
    """Payment response schema"""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    user_id: str
    offer_id: Optional[str] = None
    stripe_payment_intent_id: Optional[str] = None
    stripe_checkout_session_id: Optional[str] = None
    status: PaymentStatus
    payment_metadata: Optional[dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    paid_at: Optional[datetime] = None


class CreateCheckoutRequest(BaseModel):
    """Request schema for creating checkout session"""
    offer_id: str
    payment_type: str
    requires_review: bool = False


class CreateCheckoutResponse(BaseModel):
    """Response schema for checkout session creation"""
    url: str


class VerifyPaymentResponse(BaseModel):
    """Response schema for payment verification"""
    payment_id: str
    offer_id: Optional[str] = None
    status: PaymentStatus
