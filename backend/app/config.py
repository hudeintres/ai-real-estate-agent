"""
Application configuration settings
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

# Get the backend directory (parent of app/)
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Default database path in the backend directory
DEFAULT_DB_PATH = os.path.join(BACKEND_DIR, "real_estate.db")


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
    
    # Database - use absolute path by default
    DATABASE_URL: str = f"sqlite+aiosqlite:///{DEFAULT_DB_PATH}"
    
    # Application
    APP_URL: str = "http://localhost:8000"
    DEBUG: bool = True
    
    # Google AI API key for property extraction
    GOOGLE_AI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    # Stripe
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    
    # Email notifications
    NOTIFICATION_EMAIL: Optional[str] = None
    
    # Templates directory
    TEMPLATES_DIR: str = os.path.join(BACKEND_DIR, "templates")
    
    # Offers directory for generated PDFs
    OFFERS_DIR: str = os.path.join(BACKEND_DIR, "offers")
    
    @property
    def ai_api_key(self) -> Optional[str]:
        """Get the Google AI API key from either environment variable"""
        return self.GOOGLE_AI_API_KEY or self.GEMINI_API_KEY


settings = Settings()
