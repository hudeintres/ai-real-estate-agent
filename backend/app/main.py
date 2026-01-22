"""
AI Real Estate Agent - FastAPI Backend

Main application entry point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.database import init_db, close_db
from app.api import api_router

# Create offers directory at import time to ensure it exists before mounting
os.makedirs(settings.OFFERS_DIR, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    print("Starting up...")
    await init_db()
    
    # Ensure offers directory exists
    os.makedirs(settings.OFFERS_DIR, exist_ok=True)
    
    yield
    
    # Shutdown
    print("Shutting down...")
    await close_db()


# Create FastAPI application
app = FastAPI(
    title="AI Real Estate Agent API",
    description="API for automating real estate offer letter generation",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        settings.APP_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for offer PDFs (directory is created above)
app.mount("/offers", StaticFiles(directory=settings.OFFERS_DIR), name="offers")

# Include API routes
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Real Estate Agent API",
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
