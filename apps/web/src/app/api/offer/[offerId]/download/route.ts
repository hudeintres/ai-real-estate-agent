import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@real-estate/db'
import fs from 'fs/promises'
import path from 'path'

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

    // If there's a URL to the actual PDF document, serve it
    if (offer.offerLetterUrl) {
      // If it's a local path (starts with /offers/), read the file
      if (offer.offerLetterUrl.startsWith('/offers/')) {
        const pdfPath = path.join(process.cwd(), 'public', offer.offerLetterUrl)
        try {
          const pdfBuffer = await fs.readFile(pdfPath)
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="offer-letter-${params.offerId}.pdf"`,
            },
          })
        } catch (fileError) {
          console.error('Error reading PDF file:', fileError)
          return NextResponse.json(
            { error: 'PDF file not found' },
            { status: 404 }
          )
        }
      } else {
        // External URL, redirect to it
        return NextResponse.redirect(offer.offerLetterUrl)
      }
    }

    // Otherwise, return the preview as text (fallback)
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

