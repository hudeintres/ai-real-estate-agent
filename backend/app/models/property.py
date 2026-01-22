"""
Property model
"""
from datetime import datetime
from typing import List, TYPE_CHECKING, Any
from sqlalchemy import String, DateTime, Float, Integer, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from cuid2 import cuid_wrapper
from app.database import Base

if TYPE_CHECKING:
    from app.models.offer import Offer

cuid_generator = cuid_wrapper()


class Property(Base):
    """Property model for storing real estate property information"""
    
    __tablename__ = "properties"
    
    id: Mapped[str] = mapped_column(
        String(25),
        primary_key=True,
        default=cuid_generator
    )
    source_url: Mapped[str | None] = mapped_column(
        String(2048),
        unique=True,
        nullable=True,
        index=True
    )
    source_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    mls_number: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    city: Mapped[str] = mapped_column(String(255), nullable=False)
    state: Mapped[str] = mapped_column(String(50), nullable=False)
    zip_code: Mapped[str] = mapped_column(String(20), nullable=False)
    price: Mapped[float | None] = mapped_column(Float, nullable=True)
    ai_fair_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    days_on_market: Mapped[int | None] = mapped_column(Integer, nullable=True)
    property_type: Mapped[str] = mapped_column(String(100), nullable=False)
    listing_agent_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    listing_agent_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    listing_agent_phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    offer_deadline: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    has_hoa: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    built_before_1978: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    extracted_data: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
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
    offers: Mapped[List["Offer"]] = relationship(
        "Offer",
        back_populates="property",
        cascade="all, delete-orphan"
    )
