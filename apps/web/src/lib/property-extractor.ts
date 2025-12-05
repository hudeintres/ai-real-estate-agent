/**
 * Property extraction utilities using LLM to extract structured data from real estate URLs
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

export interface ExtractedPropertyData {
  address: string
  city: string
  state: string
  zipCode: string
  price: number | null
  aiFairValue: number | null // AI-generated fair market value for making reasonable offers
  daysOnMarket: number | null
  mlsNumber: string | null
  listingAgentName: string | null
  listingAgentEmail: string | null
  listingAgentPhone: string | null
  offerDeadline: Date | null
  hasHOA: boolean | null
  builtBefore1978: boolean | null
  bedrooms?: number | null
  bathrooms?: number | null
  squareFeet?: number | null
  lotSize?: number | null
  yearBuilt?: number | null
  propertyType?: string | null
}

/**
 * Fetches the HTML content from a URL with realistic browser headers
 */
async function fetchWebpageContent(url: string): Promise<string> {
  try {
    // Parse URL to get domain for referer
    const urlObj = new URL(url)
    const origin = urlObj.origin

    const response = await fetch(url, {
      method: 'GET',
      headers: {
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
      },
      // Add redirect handling
      redirect: 'follow',
    })
    
    if (!response.ok) {
      // If we get a 403, provide more helpful error message
      if (response.status === 403) {
        throw new Error(
          `Access forbidden (403). The website may be blocking automated requests. ` +
          `This is common with real estate sites. Consider using a proxy service or browser automation tool.`
        )
      }
      throw new Error(`Failed to fetch webpage: ${response.status} ${response.statusText}`)
    }
    
    return await response.text()
  } catch (error) {
    console.error('Error fetching webpage:', error)
    throw new Error(`Failed to fetch webpage content: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extracts property data from a URL using LLM
 * Uses Gemini's built-in URL fetching capability to bypass 403 errors
 */
export async function extractPropertyFromUrl(
  url: string
): Promise<ExtractedPropertyData> {
  // Check if Google AI API key is configured
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_AI_API_KEY or GEMINI_API_KEY environment variable is not set')
  }

  const genAI = new GoogleGenerativeAI(apiKey)

  // Try to fetch webpage content directly with improved headers
  let textContent: string | null = null
  let fetchError: Error | null = null

  try {
    const htmlContent = await fetchWebpageContent(url)
    // Extract text content from HTML (basic extraction - remove script/style tags and get text)
    textContent = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50000) // Limit to avoid token limits
  } catch (error) {
    // Store error but continue - we'll try to work with just the URL
    fetchError = error instanceof Error ? error : new Error('Unknown fetch error')
    console.warn('Direct fetch failed, will attempt extraction with URL only:', fetchError.message)
  }

  // Create a prompt for the LLM
  const prompt = textContent
    ? `You are a real estate data extraction expert. Extract property information from web pages and return structured JSON data. Always return valid JSON only.

Extract property information from the following real estate listing page content. 
Return a JSON object with the following structure. Use null for any fields you cannot find.

URL: ${url}

Page content:
${textContent}

Extract and return a JSON object with these exact fields:
{
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
}

IMPORTANT: For "aiFairValue", analyze the property details (price, location, size, condition, market trends, comparable properties) and generate a reasonable fair market value that would be appropriate for making an offer. This should be a realistic valuation based on the property's characteristics, not just the listing price. Consider factors like:
- Property condition and age
- Square footage and lot size
- Location and neighborhood
- Market conditions and days on market
- Comparable property values
- Any issues or features that affect value

Return ONLY valid JSON, no other text.`
    : `You are a real estate data extraction expert. I need you to extract property information from a real estate listing URL.

IMPORTANT: Please visit this URL and extract the property information: ${url}

If you cannot access the URL directly, please inform me in your response. Otherwise, extract and return a JSON object with these exact fields:
{
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
}

IMPORTANT: For "aiFairValue", analyze the property details (price, location, size, condition, market trends, comparable properties) and generate a reasonable fair market value that would be appropriate for making an offer. This should be a realistic valuation based on the property's characteristics, not just the listing price. Consider factors like:
- Property condition and age
- Square footage and lot size
- Location and neighborhood
- Market conditions and days on market
- Comparable property values
- Any issues or features that affect value

Return ONLY valid JSON, no other text. If you cannot access the URL, return a JSON object with all fields set to null and include an "error" field explaining the issue.`

  try {
    // Use Gemini 2.5 Pro model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro', // Using 2.5 Pro for better accuracy and performance
      generationConfig: {
        temperature: 0.1, // Low temperature for consistent extraction
        responseMimeType: 'application/json',
      },
    })

    const generationResult = await model.generateContent(prompt)

    const responseText = generationResult.response.text()
    
    if (!responseText) {
      throw new Error('No response from LLM')
    }

    // Parse the JSON response
    const extractedData = JSON.parse(responseText) as Partial<ExtractedPropertyData & { error?: string }>

    // Check if LLM reported an error (e.g., couldn't access URL)
    if (extractedData.error) {
      throw new Error(
        `LLM could not access the property URL. ${extractedData.error}. ` +
        `This often happens when websites block automated requests. ` +
        `If direct fetch also failed, consider using a browser automation tool or proxy service.`
      )
    }

    // Convert and validate the data
    const propertyData: ExtractedPropertyData = {
      address: extractedData.address || 'Address not found',
      city: extractedData.city || 'City not found',
      state: extractedData.state || 'State not found',
      zipCode: extractedData.zipCode || 'Zip not found',
      price: typeof extractedData.price === 'number' ? extractedData.price : null,
      aiFairValue: typeof extractedData.aiFairValue === 'number' ? extractedData.aiFairValue : null,
      daysOnMarket: typeof extractedData.daysOnMarket === 'number' ? extractedData.daysOnMarket : null,
      mlsNumber: extractedData.mlsNumber || null,
      listingAgentName: extractedData.listingAgentName || null,
      listingAgentEmail: extractedData.listingAgentEmail || null,
      listingAgentPhone: extractedData.listingAgentPhone || null,
      offerDeadline: extractedData.offerDeadline ? new Date(extractedData.offerDeadline) : null,
      hasHOA: typeof extractedData.hasHOA === 'boolean' ? extractedData.hasHOA : null,
      builtBefore1978: typeof extractedData.builtBefore1978 === 'boolean' ? extractedData.builtBefore1978 : null,
      bedrooms: typeof extractedData.bedrooms === 'number' ? extractedData.bedrooms : null,
      bathrooms: typeof extractedData.bathrooms === 'number' ? extractedData.bathrooms : null,
      squareFeet: typeof extractedData.squareFeet === 'number' ? extractedData.squareFeet : null,
      lotSize: typeof extractedData.lotSize === 'number' ? extractedData.lotSize : null,
      yearBuilt: typeof extractedData.yearBuilt === 'number' ? extractedData.yearBuilt : null,
      propertyType: extractedData.propertyType || null,
    }

    // If we couldn't fetch the page and got minimal data, warn about it
    if (fetchError && (!propertyData.address || propertyData.address === 'Address not found')) {
      throw new Error(
        `Could not fetch property page (${fetchError.message}). ` +
        `The website may be blocking automated requests. ` +
        `Consider using a browser automation tool (like Puppeteer) or a proxy service for production use.`
      )
    }

    return propertyData
  } catch (error) {
    console.error('Error extracting property with LLM:', error)
    // If it's already a well-formed error, re-throw it
    if (error instanceof Error && (error.message.includes('Could not fetch') || error.message.includes('LLM could not access'))) {
      throw error
    }
    throw new Error(`Failed to extract property data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function getSourceType(url: string): string {
  if (url.includes('zillow.com')) return 'zillow'
  if (url.includes('redfin.com')) return 'redfin'
  if (url.includes('realtor.com')) return 'realtor'
  return 'unknown'
}

