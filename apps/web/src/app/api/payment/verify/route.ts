import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@real-estate/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
  }

  try {
    const payment = await prisma.payment.findFirst({
      where: {
        stripeCheckoutSessionId: sessionId,
      },
      include: {
        offer: true,
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    return NextResponse.json({
      paymentId: payment.id,
      offerId: payment.offerId,
      status: payment.status,
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}

