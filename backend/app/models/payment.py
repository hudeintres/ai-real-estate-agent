"""
Payment model
"""
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Any
from sqlalchemy import String, DateTime, Float, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from cuid2 import cuid_wrapper
from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.offer import Offer

cuid_generator = cuid_wrapper()


class PaymentStatus(str, Enum):
    """Payment status enum"""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class PaymentType(str, Enum):
    """Payment type enum"""
    SINGLE_DOWNLOAD = "SINGLE_DOWNLOAD"
    SINGLE_DOWNLOAD_WITH_REVIEW = "SINGLE_DOWNLOAD_WITH_REVIEW"
    AGENT_REVIEW_ONLY = "AGENT_REVIEW_ONLY"
    MONTHLY_SUBSCRIPTION = "MONTHLY_SUBSCRIPTION"
    FULL_REPRESENTATION = "FULL_REPRESENTATION"


class Payment(Base):
    """Payment model for storing payment information"""
    
    __tablename__ = "payments"
    
    id: Mapped[str] = mapped_column(
        String(25),
        primary_key=True,
        default=cuid_generator
    )
    user_id: Mapped[str] = mapped_column(
        String(25),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    offer_id: Mapped[str | None] = mapped_column(
        String(25),
        ForeignKey("offers.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    stripe_payment_intent_id: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
        index=True
    )
    stripe_checkout_session_id: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
        index=True
    )
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="usd", nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(
        SQLEnum(PaymentStatus),
        default=PaymentStatus.PENDING,
        nullable=False
    )
    payment_type: Mapped[PaymentType] = mapped_column(
        SQLEnum(PaymentType),
        nullable=False
    )
    
    # Additional metadata
    payment_metadata: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
    paid_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="payments")
    offer: Mapped["Offer"] = relationship("Offer", back_populates="payments")
