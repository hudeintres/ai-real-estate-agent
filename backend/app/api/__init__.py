"""
API routes
"""
from fastapi import APIRouter
from app.api import property, offer, payment, webhooks

api_router = APIRouter()

# Include all API routes
api_router.include_router(property.router, prefix="/property", tags=["property"])
api_router.include_router(offer.router, prefix="/offer", tags=["offer"])
api_router.include_router(payment.router, prefix="/payment", tags=["payment"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
