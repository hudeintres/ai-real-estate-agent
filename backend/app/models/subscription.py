"""
Subscription model
"""
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from cuid2 import cuid_wrapper
from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User

cuid_generator = cuid_wrapper()


class SubscriptionStatus(str, Enum):
    """Subscription status enum"""
    ACTIVE = "ACTIVE"
    CANCELED = "CANCELED"
    PAST_DUE = "PAST_DUE"
    UNPAID = "UNPAID"


class Subscription(Base):
    """Subscription model for storing user subscriptions"""
    
    __tablename__ = "subscriptions"
    
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
    stripe_customer_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    stripe_subscription_id: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
        index=True
    )
    status: Mapped[SubscriptionStatus] = mapped_column(
        SQLEnum(SubscriptionStatus),
        default=SubscriptionStatus.ACTIVE,
        nullable=False
    )
    current_period_end: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
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
    user: Mapped["User"] = relationship("User", back_populates="subscriptions")
