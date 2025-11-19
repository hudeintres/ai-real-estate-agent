import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@real-estate/db'
import { sendOfferNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const {
      propertyId,
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

    // Create the offer
    const offer = await prisma.offer.create({
      data: {
        userId: user.id,
        propertyId,
        financingType,
        offerPrice,
        contingencies: contingencies as any,
        timelinePreferences: timelinePreferences as any,
        concessions: concessions as any,
        additionalNotes,
        status: 'PENDING_REVIEW',
        offerLetterPreview: null, // Will be generated manually for now
      },
      include: {
        property: true,
      },
    })

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


