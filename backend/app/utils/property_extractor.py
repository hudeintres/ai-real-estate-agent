"""
Property extraction utilities using LLM to extract structured data from real estate URLs
"""
import json
from datetime import datetime
from typing import Optional
from dataclasses import dataclass
import httpx
from app.config import settings


@dataclass
class ExtractedPropertyData:
    """Data class for extracted property information"""
    address: str
    city: str
    state: str
    zip_code: str
    price: Optional[float] = None
    ai_fair_value: Optional[float] = None
    days_on_market: Optional[int] = None
    mls_number: Optional[str] = None
    listing_agent_name: Optional[str] = None
    listing_agent_email: Optional[str] = None
    listing_agent_phone: Optional[str] = None
    offer_deadline: Optional[datetime] = None
    has_hoa: Optional[bool] = None
    built_before_1978: Optional[bool] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[int] = None
    lot_size: Optional[float] = None
    year_built: Optional[int] = None
    property_type: Optional[str] = None


async def fetch_webpage_content(url: str) -> str:
    """
    Fetches the HTML content from a URL with realistic browser headers
    """
    from urllib.parse import urlparse
    
    parsed_url = urlparse(url)
    origin = f"{parsed_url.scheme}://{parsed_url.netloc}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'Referer': origin,
    }
    
    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.get(url, headers=headers, timeout=30.0)
        
        if response.status_code == 403:
            raise Exception(
                f"Access forbidden (403). The website may be blocking automated requests. "
                f"This is common with real estate sites. Consider using a proxy service or browser automation tool."
            )
        
        response.raise_for_status()
        return response.text


async def extract_property_from_url(url: str) -> ExtractedPropertyData:
    """
    Extracts property data from a URL using LLM
    Uses Gemini's capability to analyze webpage content
    """
    import re
    
    api_key = settings.ai_api_key
    if not api_key:
        raise Exception("GOOGLE_AI_API_KEY or GEMINI_API_KEY environment variable is not set")
    
    # Try to import Google AI
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
    except ImportError:
        raise Exception("google-generativeai package is not installed")
    
    # Try to fetch webpage content directly
    text_content: Optional[str] = None
    fetch_error: Optional[Exception] = None
    
    try:
        html_content = await fetch_webpage_content(url)
        # Clean HTML content - remove script/style tags and get text
        text_content = re.sub(r'<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>', '', html_content, flags=re.IGNORECASE)
        text_content = re.sub(r'<style\b[^<]*(?:(?!</style>)<[^<]*)*</style>', '', text_content, flags=re.IGNORECASE)
        text_content = re.sub(r'<[^>]+>', ' ', text_content)
        text_content = re.sub(r'\s+', ' ', text_content)
        text_content = text_content.strip()[:50000]  # Limit to avoid token limits
    except Exception as e:
        fetch_error = e
        print(f"Warning: Direct fetch failed, will attempt extraction with URL only: {e}")
    
    # Create prompt for the LLM
    if text_content:
        prompt = f"""You are a real estate data extraction expert. Extract property information from web pages and return structured JSON data. Always return valid JSON only.

Extract property information from the following real estate listing page content. 
Return a JSON object with the following structure. Use null for any fields you cannot find.

URL: {url}

Page content:
{text_content}

Extract and return a JSON object with these exact fields:
{{
  "address": "full street address",
  "city": "city name",
  "state": "state abbreviation (2 letters)",
  "zipCode": "zip code",
  "price": number or null,
  "aiFairValue": number or null,
  "daysOnMarket": number or null,
  "mlsNumber": "MLS number string or null",
  "listingAgentName": "agent name or null",
  "listingAgentEmail": "agent email or null",
  "listingAgentPhone": "agent phone or null",
  "offerDeadline": "ISO date string or null",
  "hasHOA": boolean or null,
  "builtBefore1978": boolean or null,
  "bedrooms": number or null,
  "bathrooms": number or null,
  "squareFeet": number or null,
  "lotSize": number or null,
  "yearBuilt": number or null,
  "propertyType": "property type string or null"
}}

IMPORTANT: For "aiFairValue", analyze the property details (price, location, size, condition, market trends, comparable properties) and generate a reasonable fair market value that would be appropriate for making an offer.

Return ONLY valid JSON, no other text."""
    else:
        prompt = f"""You are a real estate data extraction expert. I need you to extract property information from a real estate listing URL.

IMPORTANT: Please visit this URL and extract the property information: {url}

If you cannot access the URL directly, please inform me in your response. Otherwise, extract and return a JSON object with these exact fields:
{{
  "address": "full street address",
  "city": "city name",
  "state": "state abbreviation (2 letters)",
  "zipCode": "zip code",
  "price": number or null,
  "aiFairValue": number or null,
  "daysOnMarket": number or null,
  "mlsNumber": "MLS number string or null",
  "listingAgentName": "agent name or null",
  "listingAgentEmail": "agent email or null",
  "listingAgentPhone": "agent phone or null",
  "offerDeadline": "ISO date string or null",
  "hasHOA": boolean or null,
  "builtBefore1978": boolean or null,
  "bedrooms": number or null,
  "bathrooms": number or null,
  "squareFeet": number or null,
  "lotSize": number or null,
  "yearBuilt": number or null,
  "propertyType": "property type string or null"
}}

Return ONLY valid JSON, no other text. If you cannot access the URL, return a JSON object with all fields set to null and include an "error" field explaining the issue."""
    
    try:
        # Use Gemini model
        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            generation_config={
                'temperature': 0.1,
                'response_mime_type': 'application/json',
            }
        )
        
        response = model.generate_content(prompt)
        response_text = response.text
        
        if not response_text:
            raise Exception("No response from LLM")
        
        # Parse the JSON response
        extracted_data = json.loads(response_text)
        
        # Check if LLM reported an error
        if extracted_data.get('error'):
            raise Exception(
                f"LLM could not access the property URL. {extracted_data['error']}. "
                f"This often happens when websites block automated requests."
            )
        
        # Convert and validate the data
        offer_deadline = None
        if extracted_data.get('offerDeadline'):
            try:
                offer_deadline = datetime.fromisoformat(extracted_data['offerDeadline'].replace('Z', '+00:00'))
            except (ValueError, AttributeError):
                pass
        
        property_data = ExtractedPropertyData(
            address=extracted_data.get('address') or 'Address not found',
            city=extracted_data.get('city') or 'City not found',
            state=extracted_data.get('state') or 'State not found',
            zip_code=extracted_data.get('zipCode') or 'Zip not found',
            price=extracted_data.get('price') if isinstance(extracted_data.get('price'), (int, float)) else None,
            ai_fair_value=extracted_data.get('aiFairValue') if isinstance(extracted_data.get('aiFairValue'), (int, float)) else None,
            days_on_market=extracted_data.get('daysOnMarket') if isinstance(extracted_data.get('daysOnMarket'), int) else None,
            mls_number=extracted_data.get('mlsNumber'),
            listing_agent_name=extracted_data.get('listingAgentName'),
            listing_agent_email=extracted_data.get('listingAgentEmail'),
            listing_agent_phone=extracted_data.get('listingAgentPhone'),
            offer_deadline=offer_deadline,
            has_hoa=extracted_data.get('hasHOA') if isinstance(extracted_data.get('hasHOA'), bool) else None,
            built_before_1978=extracted_data.get('builtBefore1978') if isinstance(extracted_data.get('builtBefore1978'), bool) else None,
            bedrooms=extracted_data.get('bedrooms') if isinstance(extracted_data.get('bedrooms'), int) else None,
            bathrooms=extracted_data.get('bathrooms') if isinstance(extracted_data.get('bathrooms'), (int, float)) else None,
            square_feet=extracted_data.get('squareFeet') if isinstance(extracted_data.get('squareFeet'), int) else None,
            lot_size=extracted_data.get('lotSize') if isinstance(extracted_data.get('lotSize'), (int, float)) else None,
            year_built=extracted_data.get('yearBuilt') if isinstance(extracted_data.get('yearBuilt'), int) else None,
            property_type=extracted_data.get('propertyType'),
        )
        
        # If we couldn't fetch the page and got minimal data, warn about it
        if fetch_error and (not property_data.address or property_data.address == 'Address not found'):
            raise Exception(
                f"Could not fetch property page ({fetch_error}). "
                f"The website may be blocking automated requests. "
                f"Consider using a browser automation tool (like Playwright) or a proxy service for production use."
            )
        
        return property_data
        
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse LLM response as JSON: {e}")
    except Exception as e:
        if 'Could not fetch' in str(e) or 'LLM could not access' in str(e):
            raise
        raise Exception(f"Failed to extract property data: {e}")


def get_source_type(url: str) -> str:
    """Determine the source type from the URL"""
    if 'zillow.com' in url:
        return 'zillow'
    if 'redfin.com' in url:
        return 'redfin'
    if 'realtor.com' in url:
        return 'realtor'
    return 'unknown'
