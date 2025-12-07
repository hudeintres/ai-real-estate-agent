import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@real-estate/db'
import { extractPropertyFromUrl, getSourceType } from '@/lib/property-extractor'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Determine source type
    const sourceType = getSourceType(url)

    // First, check if property with this URL already exists
    let property = await prisma.property.findUnique({
      where: { sourceUrl: url },
    })

    if (property) {
      // Property already exists, return it
      return NextResponse.json({ propertyId: property.id })
    }

    // Extract property data using LLM
    let extractedData
    try {
      extractedData = await extractPropertyFromUrl(url)
    } catch (error) {
      console.error('Error extracting property data:', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to extract property information' },
        { status: 500 }
      )
    }

    // Check if a property with the same address already exists
    // This handles cases where the same property is listed on different sites
    const existingProperty = await prisma.property.findFirst({
      where: {
        address: extractedData.address,
        city: extractedData.city,
        state: extractedData.state,
        zipCode: extractedData.zipCode,
      },
    })

    if (existingProperty) {
      // Update the existing property with the new source URL if different
      if (existingProperty.sourceUrl !== url) {
        property = await prisma.property.update({
          where: { id: existingProperty.id },
          data: {
            sourceUrl: url,
            sourceType,
            // Update other fields if they're missing in the existing record
            price: existingProperty.price || extractedData.price,
            aiFairValue: existingProperty.aiFairValue || extractedData.aiFairValue,
            daysOnMarket: existingProperty.daysOnMarket || extractedData.daysOnMarket,
            propertyType: existingProperty.propertyType || extractedData.propertyType || null,
            mlsNumber: existingProperty.mlsNumber || extractedData.mlsNumber,
            listingAgentName: existingProperty.listingAgentName || extractedData.listingAgentName,
            listingAgentEmail: existingProperty.listingAgentEmail || extractedData.listingAgentEmail,
            listingAgentPhone: existingProperty.listingAgentPhone || extractedData.listingAgentPhone,
            offerDeadline: existingProperty.offerDeadline || extractedData.offerDeadline,
            hasHOA: existingProperty.hasHOA ?? extractedData.hasHOA,
            builtBefore1978: existingProperty.builtBefore1978 ?? extractedData.builtBefore1978,
            extractedData: {
              ...(existingProperty.extractedData as object || {}),
              ...(extractedData as object),
            },
          },
        })
      } else {
        property = existingProperty
      }
    } else {
      // Create new property with extracted data
      property = await prisma.property.create({
        data: {
          sourceUrl: url,
          sourceType,
          address: extractedData.address,
          city: extractedData.city,
          state: extractedData.state,
          zipCode: extractedData.zipCode,
          price: extractedData.price,
          aiFairValue: extractedData.aiFairValue,
          daysOnMarket: extractedData.daysOnMarket,
          propertyType: extractedData.propertyType || null,
          mlsNumber: extractedData.mlsNumber,
          listingAgentName: extractedData.listingAgentName,
          listingAgentEmail: extractedData.listingAgentEmail,
          listingAgentPhone: extractedData.listingAgentPhone,
          offerDeadline: extractedData.offerDeadline,
          hasHOA: extractedData.hasHOA,
          builtBefore1978: extractedData.builtBefore1978,
          extractedData: extractedData as any, // Store additional fields in JSON
        },
      })
    }

    return NextResponse.json({ propertyId: property.id })
  } catch (error) {
    console.error('Error extracting property:', error)
    return NextResponse.json(
      { error: 'Failed to extract property information' },
      { status: 500 }
    )
  }
}

