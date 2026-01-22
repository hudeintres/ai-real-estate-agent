"""
User schemas
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema"""
    pass


class UserResponse(UserBase):
    """User response schema"""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    created_at: datetime
    updated_at: datetime
