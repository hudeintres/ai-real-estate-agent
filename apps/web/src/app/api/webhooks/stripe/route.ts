import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@real-estate/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Update payment status
        if (session.metadata?.offerId) {
          const payment = await prisma.payment.findFirst({
            where: {
              stripeCheckoutSessionId: session.id,
            },
          })

          if (payment) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: {
                status: 'COMPLETED',
                paidAt: new Date(),
                stripePaymentIntentId: session.payment_intent as string,
              },
            })

            // If it's a download payment, mark offer as downloaded
            if (
              payment.paymentType === 'SINGLE_DOWNLOAD' ||
              payment.paymentType === 'SINGLE_DOWNLOAD_WITH_REVIEW'
            ) {
              await prisma.offer.update({
                where: { id: payment.offerId! },
                data: {
                  status: 'DOWNLOADED',
                },
              })
            }

            // If agent review is requested
            if (
              payment.paymentType === 'SINGLE_DOWNLOAD_WITH_REVIEW' ||
              payment.paymentType === 'AGENT_REVIEW_ONLY'
            ) {
              await prisma.offer.update({
                where: { id: payment.offerId! },
                data: {
                  requiresAgentReview: true,
                  agentReviewStatus: 'REQUESTED',
                },
              })
            }
          }
        }

        // Handle subscription creation
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          // Find user by email or customer ID
          const customerId = session.customer as string
          const customer = await stripe.customers.retrieve(customerId)

          if (!customer.deleted && 'email' in customer && customer.email) {
            let user = await prisma.user.findUnique({
              where: { email: customer.email },
            })

            if (user) {
              await prisma.subscription.upsert({
                where: { stripeSubscriptionId: subscription.id },
                update: {
                  status: 'ACTIVE',
                  currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                },
                create: {
                  userId: user.id,
                  stripeCustomerId: customerId,
                  stripeSubscriptionId: subscription.id,
                  status: 'ACTIVE',
                  currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                },
              })
            }
          }
        }

        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status:
              subscription.status === 'active'
                ? 'ACTIVE'
                : subscription.status === 'canceled'
                ? 'CANCELED'
                : subscription.status === 'past_due'
                ? 'PAST_DUE'
                : 'UNPAID',
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

