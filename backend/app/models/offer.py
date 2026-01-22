"""
Offer model
"""
from datetime import datetime
from enum import Enum
from typing import List, TYPE_CHECKING, Any
from sqlalchemy import String, DateTime, Float, Boolean, JSON, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from cuid2 import cuid_wrapper
from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.property import Property
    from app.models.payment import Payment

cuid_generator = cuid_wrapper()


class OfferStatus(str, Enum):
    """Offer status enum"""
    DRAFT = "DRAFT"
    PENDING_REVIEW = "PENDING_REVIEW"
    GENERATED = "GENERATED"
    DOWNLOADED = "DOWNLOADED"
    COMPLETED = "COMPLETED"


class AgentReviewStatus(str, Enum):
    """Agent review status enum"""
    PENDING = "PENDING"
    REQUESTED = "REQUESTED"
    IN_REVIEW = "IN_REVIEW"
    APPROVED = "APPROVED"
    NEEDS_REVISION = "NEEDS_REVISION"
    COMPLETED = "COMPLETED"


class Offer(Base):
    """Offer model for storing real estate offers"""
    
    __tablename__ = "offers"
    
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
    property_id: Mapped[str] = mapped_column(
        String(25),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False
    )
    
    # User inputs
    financing_type: Mapped[str] = mapped_column(String(50), nullable=False)
    offer_price: Mapped[float] = mapped_column(Float, nullable=False)
    contingencies: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    timeline_preferences: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    concessions: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    additional_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Offer letter generation
    status: Mapped[OfferStatus] = mapped_column(
        SQLEnum(OfferStatus),
        default=OfferStatus.DRAFT,
        nullable=False,
        index=True
    )
    offer_letter_preview: Mapped[str | None] = mapped_column(Text, nullable=True)
    offer_letter_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    requires_agent_review: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    agent_review_status: Mapped[AgentReviewStatus] = mapped_column(
        SQLEnum(AgentReviewStatus),
        default=AgentReviewStatus.PENDING,
        nullable=False
    )
    agent_review_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    
    # Email notification
    notification_sent: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notification_sent_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    
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
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="offers")
    property: Mapped["Property"] = relationship("Property", back_populates="offers")
    payments: Mapped[List["Payment"]] = relationship(
        "Payment",
        back_populates="offer"
    )
