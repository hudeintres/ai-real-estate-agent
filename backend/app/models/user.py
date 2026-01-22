"""
User model
"""
from datetime import datetime
from typing import List, TYPE_CHECKING
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from cuid2 import cuid_wrapper
from app.database import Base

if TYPE_CHECKING:
    from app.models.subscription import Subscription
    from app.models.offer import Offer
    from app.models.payment import Payment

cuid_generator = cuid_wrapper()


class User(Base):
    """User model for storing user information"""
    
    __tablename__ = "users"
    
    id: Mapped[str] = mapped_column(
        String(25),
        primary_key=True,
        default=cuid_generator
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
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
    subscriptions: Mapped[List["Subscription"]] = relationship(
        "Subscription",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    offers: Mapped[List["Offer"]] = relationship(
        "Offer",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    payments: Mapped[List["Payment"]] = relationship(
        "Payment",
        back_populates="user",
        cascade="all, delete-orphan"
    )
