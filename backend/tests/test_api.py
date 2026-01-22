"""
API endpoint tests
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    """Test the root endpoint"""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "AI Real Estate Agent API"
    assert "version" in data


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    """Test the health check endpoint"""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_create_offer(client: AsyncClient):
    """Test creating an offer"""
    # Use camelCase to match frontend format
    offer_data = {
        "address": "123 Test Street",
        "city": "Austin",
        "state": "TX",
        "zipCode": "78701",
        "propertyType": "singlefamily",
        "financingType": "conventional",
        "offerPrice": 500000.0,
        "contingencies": {
            "inspection": True,
            "appraisal": True,
            "financing": True
        },
        "timelinePreferences": {
            "closingDate": "2024-03-01"
        },
        "concessions": {
            "sellerCredits": "5000"
        },
        "additionalNotes": "Test offer"
    }
    
    response = await client.post("/api/offer/create", json=offer_data)
    assert response.status_code == 200
    data = response.json()
    assert "offerId" in data


@pytest.mark.asyncio
async def test_get_property_not_found(client: AsyncClient):
    """Test getting a non-existent property"""
    response = await client.get("/api/property/nonexistent-id")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_offer_not_found(client: AsyncClient):
    """Test getting a non-existent offer"""
    response = await client.get("/api/offer/nonexistent-id")
    assert response.status_code == 404
