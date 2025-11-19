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
      },
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error fetching offer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offer' },
      { status: 500 }
    )
  }
}

