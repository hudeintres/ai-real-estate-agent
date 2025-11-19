import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@real-estate/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const PRICING = {
  SINGLE_DOWNLOAD: 1000, // $10.00 in cents
  SINGLE_DOWNLOAD_WITH_REVIEW: 3000, // $30.00 in cents
  AGENT_REVIEW_ONLY: 2000, // $20.00 in cents
  MONTHLY_SUBSCRIPTION: 2000, // $20.00 in cents
}

export async function POST(request: NextRequest) {
  try {
    const { offerId, paymentType, requiresReview } = await request.json()

    if (!offerId || !paymentType) {
      return NextResponse.json(
        { error: 'offerId and paymentType are required' },
        { status: 400 }
      )
    }

    // Get the offer
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { user: true, property: true },
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    // Determine final payment type and amount
    let finalPaymentType = paymentType
    if (paymentType === 'SINGLE_DOWNLOAD' && requiresReview) {
      finalPaymentType = 'SINGLE_DOWNLOAD_WITH_REVIEW'
    }

    const amount = PRICING[finalPaymentType as keyof typeof PRICING]
    if (!amount) {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    let customerId = null
    if (offer.user.email) {
      const customers = await stripe.customers.list({
        email: offer.user.email,
        limit: 1,
      })

      if (customers.data.length > 0) {
        customerId = customers.data[0].id
      } else {
        const customer = await stripe.customers.create({
          email: offer.user.email,
          name: offer.user.name || undefined,
        })
        customerId = customer.id
      }
    }

    // Handle subscription differently
    if (finalPaymentType === 'MONTHLY_SUBSCRIPTION') {
      const session = await stripe.checkout.sessions.create({
        customer: customerId || undefined,
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Monthly Subscription - AI Real Estate Agent',
                description: 'Unlimited access to AI agent for generating offer letters',
              },
              recurring: {
                interval: 'month',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/offer/${offerId}/preview`,
        metadata: {
          offerId,
          paymentType: finalPaymentType,
        },
      })

      return NextResponse.json({ url: session.url })
    }

    // Create one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId || undefined,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name:
                finalPaymentType === 'SINGLE_DOWNLOAD'
                  ? 'Single Download - Offer Letter'
                  : finalPaymentType === 'SINGLE_DOWNLOAD_WITH_REVIEW'
                  ? 'Single Download + Agent Review - Offer Letter'
                  : 'Agent Review - Offer Letter',
              description: `Property: ${offer.property.address}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/offer/${offerId}/preview`,
      metadata: {
        offerId,
        paymentType: finalPaymentType,
      },
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: offer.userId,
        offerId: offer.id,
        stripeCheckoutSessionId: session.id,
        amount,
        status: 'PENDING',
        paymentType: finalPaymentType as any,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

