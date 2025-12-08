import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@real-estate/db'
import { sendOfferNotification } from '@/lib/email'
import { generateOfferLetterPDF } from '@/lib/pdf-generator'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const {
      address,
      city,
      state,
      zipCode,
      propertyType,
      financingType,
      offerPrice,
      contingencies,
      timelinePreferences,
      concessions,
      additionalNotes,
    } = await request.json()

    // TODO: Get user from session/auth
    // For now, we'll use a placeholder user ID
    // In production, implement proper authentication
    const userId = 'temp-user-id' // Replace with actual user from session

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({
      where: { email: 'temp@example.com' },
    })

    if (!user) {
      user = await prisma.user.create({
        data: { email: 'temp@example.com' },
      })
    }

    // Create the property if it doesn't exist
    let property = await prisma.property.findFirst({
      where: {
        address,
        city,
        state,
        zipCode,
        propertyType,
      },
    })
    if (!property) {
      property = await prisma.property.create({
        data: {
          address,
          city,
          state,
          zipCode,
          propertyType,
        },
      })
    }

    // Create the offer
    const offer = await prisma.offer.create({
      data: {
        userId: user.id,
        propertyId: property.id,
        financingType,
        offerPrice,
        contingencies: contingencies as any,
        timelinePreferences: timelinePreferences as any,
        concessions: concessions as any,
        additionalNotes,
        status: 'GENERATED',
        offerLetterPreview: null,
      },
      include: {
        property: true,
      },
    })

    // Generate PDF offer letter
    let offerLetterUrl: string | null = null
    try {
      // Prepare offer data for PDF generation
      const offerData = {
        propertyAddress: address,
        city: city,
        state: state,
        zipCode: zipCode,
        propertyType: propertyType,
        offerPrice: offerPrice,
        closingDate: (timelinePreferences as any)?.closingDate || '',
        financingType: financingType,
        buyerName: user.name || undefined,
        buyerEmail: user.email,
        sellerCredits: (concessions as any)?.sellerCredits 
          ? parseFloat((concessions as any).sellerCredits) 
          : undefined,
        additionalNotes: additionalNotes || undefined,
      }

      // Generate the PDF
      const pdfBytes = await generateOfferLetterPDF(offerData, propertyType)

      // Create public/offers directory if it doesn't exist
      const publicOffersDir = path.join(process.cwd(), 'public', 'offers')
      try {
        await fs.access(publicOffersDir)
      } catch {
        await fs.mkdir(publicOffersDir, { recursive: true })
      }

      // Save PDF to public directory
      const pdfFilename = `offer-${offer.id}.pdf`
      const pdfPath = path.join(publicOffersDir, pdfFilename)
      await fs.writeFile(pdfPath, pdfBytes)

      // Set the URL (accessible via /offers/filename.pdf)
      offerLetterUrl = `/offers/${pdfFilename}`

      // Update offer with PDF URL
      await prisma.offer.update({
        where: { id: offer.id },
        data: {
          offerLetterUrl,
          status: 'GENERATED',
        },
      })
    } catch (pdfError) {
      console.error('Error generating PDF offer letter:', pdfError)
      // Don't fail the request if PDF generation fails, but log the error
      // The offer is still created, just without the PDF
    }

    // Send email notification
    try {
      await sendOfferNotification({
        offerId: offer.id,
        propertyAddress: offer.property.address,
        offerPrice: offer.offerPrice,
        financingType: offer.financingType,
        buyerEmail: user.email,
      })
      await prisma.offer.update({
        where: { id: offer.id },
        data: {
          notificationSent: true,
          notificationSentAt: new Date(),
        },
      })
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ offerId: offer.id })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}


