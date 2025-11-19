import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@real-estate/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { offerId: string } }
) {
  try {
    const offer = await prisma.offer.findUnique({
      where: { id: params.offerId },
      include: {
        property: true,
        payments: {
          where: {
            status: 'COMPLETED',
            paymentType: {
              in: ['SINGLE_DOWNLOAD', 'SINGLE_DOWNLOAD_WITH_REVIEW'],
            },
          },
        },
      },
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    // Check if user has paid for download
    const hasPaidDownload = offer.payments.length > 0
    // TODO: Also check for active subscription

    if (!hasPaidDownload) {
      return NextResponse.json(
        { error: 'Payment required to download' },
        { status: 403 }
      )
    }

    // Check if offer letter is available
    if (!offer.offerLetterUrl && !offer.offerLetterPreview) {
      return NextResponse.json(
        { error: 'Offer letter not yet available' },
        { status: 404 }
      )
    }

    // If there's a URL to the actual document, redirect to it
    if (offer.offerLetterUrl) {
      return NextResponse.redirect(offer.offerLetterUrl)
    }

    // Otherwise, generate a simple PDF or return the preview as text
    // For now, we'll return the preview as plain text
    // In production, you'd generate an actual PDF
    const content = offer.offerLetterPreview || 'Offer letter not available'

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="offer-letter-${params.offerId}.txt"`,
      },
    })
  } catch (error) {
    console.error('Error downloading offer:', error)
    return NextResponse.json(
      { error: 'Failed to download offer' },
      { status: 500 }
    )
  }
}

