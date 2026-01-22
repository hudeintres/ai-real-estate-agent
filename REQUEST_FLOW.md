# Request Flow: Property Extraction

This document explains how a request flows from the frontend to the backend when extracting property information.

## Complete Request Flow

### 1. **Frontend: User Submits Form**

**File:** `apps/web/src/app/property/page.tsx`

- User enters a property URL (e.g., Zillow, Redfin link) in the form
- On form submit, `handleSubmit` is called
- Creates a POST request to `/api/property/extract`

```typescript
const response = await fetch("/api/property/extract", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: propertyUrl }),
});
```

### 2. **Next.js Routing**

- Next.js App Router automatically routes `/api/property/extract` to:
- **File:** `apps/web/src/app/api/property/extract/route.ts`
- The `POST` function in this file handles the request

### 3. **API Route Handler**

**File:** `apps/web/src/app/api/property/extract/route.ts`

**Step-by-step execution:**

a. **Parse Request Body**
`typescript
      const { url } = await request.json()
      `

b. **Check for Existing Property by URL**
`typescript
      let property = await prisma.property.findUnique({
        where: { sourceUrl: url },
      })
      ` - If found → Return existing property ID (skip extraction) - If not found → Continue to extraction

c. **Extract Property Data Using LLM**
`typescript
      extractedData = await extractPropertyFromUrl(url)
      ` - Calls the property extractor function (see step 4)

d. **Check for Existing Property by Address**
`typescript
      const existingProperty = await prisma.property.findFirst({
        where: {
          address: extractedData.address,
          city: extractedData.city,
          state: extractedData.state,
          zipCode: extractedData.zipCode,
        },
      })
      ` - Prevents duplicates when same property is listed on different sites - If found → Update existing record with new source URL - If not found → Create new property record

e. **Return Response**
`typescript
      return NextResponse.json({ propertyId: property.id })
      `

### 4. **Property Extractor (LLM Extraction)**

**File:** `apps/web/src/lib/property-extractor.ts`

**Function:** `extractPropertyFromUrl(url: string)`

**Process:**

a. **Initialize Google AI Client**
`typescript
      const genAI = new GoogleGenerativeAI(apiKey)
      ` - Requires `GOOGLE_AI_API_KEY` or `GEMINI_API_KEY` env variable

b. **Fetch Webpage Content**
`typescript
      htmlContent = await fetchWebpageContent(url)
      ` - Makes HTTP request to the property URL - Extracts HTML content

c. **Clean HTML Content** - Removes `<script>` and `<style>` tags - Strips HTML tags, leaving only text - Limits to 50,000 characters to avoid token limits

d. **Send to Google Gemini LLM**
`typescript
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      })
      const generationResult = await model.generateContent(prompt)
      ` - Creates a detailed prompt with the webpage content - Requests structured JSON response - Uses Gemini 1.5 Flash model for cost efficiency

e. **Parse and Validate Response** - Parses JSON response from LLM - Validates and normalizes data types - Returns `ExtractedPropertyData` object

### 5. **Database Operations**

**Package:** `packages/db`

- Uses Prisma Client to interact with PostgreSQL
- Requires `DATABASE_URL` environment variable
- Operations:
  - `findUnique()` - Find by unique field (sourceUrl)
  - `findFirst()` - Find by multiple fields (address, city, state, zip)
  - `create()` - Create new property record
  - `update()` - Update existing property record

### 6. **Response Back to Frontend**

- API route returns `{ propertyId: string }`
- Frontend receives the response
- Redirects user to offer creation page:
  ```typescript
  router.push(`/offer/create?propertyId=${data.propertyId}`);
  ```

## Environment Variables Required

### Root `.env` file (or `apps/web/.env.local`):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/real_estate_db?schema=public"

# Google AI
GOOGLE_AI_API_KEY="your_google_ai_api_key"
# OR
GEMINI_API_KEY="your_google_ai_api_key"

# Other variables...
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
# etc.
```

## Error Handling

- **Missing URL**: Returns 400 Bad Request
- **LLM Extraction Failure**: Returns 500 with error message
- **Database Connection Error**: Returns 500 (Prisma error)
- **Missing Environment Variables**: Throws error during initialization

## Key Points

1. **Caching Strategy**: Checks URL first, then address - avoids duplicate LLM calls
2. **LLM Integration**: Uses Google Gemini to extract structured data from HTML
3. **Database Deduplication**: Prevents duplicate properties across different listing sites
4. **Server-Side Only**: All API routes run on the server (not exposed to client)
5. **Environment Variables**: Must be available at runtime for Prisma and Google AI
