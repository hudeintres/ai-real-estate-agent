import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import path from 'path'

// Load .env file from the root of the monorepo
// When running from packages/db, go up two levels to reach root
config({ path: path.resolve(process.cwd(), '../../.env') })

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.payment.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.property.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.user.deleteMany()

  // Create Users
  console.log('👥 Creating users...')
  const user1 = await prisma.user.create({
    data: {
      email: 'sarah.martinez@example.com',
      name: 'Sarah Martinez',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'james.davis@example.com',
      name: 'James Davis',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'maria.kim@example.com',
      name: 'Maria Kim',
    },
  })

  const user4 = await prisma.user.create({
    data: {
      email: 'john.smith@example.com',
      name: 'John Smith',
    },
  })

  // Create Subscriptions
  console.log('💳 Creating subscriptions...')
  const subscription1 = await prisma.subscription.create({
    data: {
      userId: user2.id,
      stripeCustomerId: 'cus_mock_james',
      stripeSubscriptionId: 'sub_mock_james_monthly',
      status: 'ACTIVE',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  })

  const subscription2 = await prisma.subscription.create({
    data: {
      userId: user4.id,
      stripeCustomerId: 'cus_mock_john',
      stripeSubscriptionId: 'sub_mock_john_monthly',
      status: 'CANCELED',
      currentPeriodEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  })

  // Create Properties
  console.log('🏠 Creating properties...')
  const property1 = await prisma.property.create({
    data: {
      sourceUrl: 'https://www.zillow.com/homedetails/123-Main-St-Austin-TX-78701/12345678_zpid/',
      sourceType: 'zillow',
      mlsNumber: 'MLS-2024-001234',
      address: '123 Main Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      propertyType: 'singlefamily',
      price: 450000,
      aiFairValue: 435000, // Slightly below asking, considering 12 days on market
      daysOnMarket: 12,
      listingAgentName: 'Jennifer Realty',
      listingAgentEmail: 'jennifer@realty.com',
      listingAgentPhone: '(512) 555-0101',
      offerDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      hasHOA: true,
      builtBefore1978: false,
      extractedData: {
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1850,
        lotSize: 0.25,
        yearBuilt: 2015,
      },
    },
  })

  const property2 = await prisma.property.create({
    data: {
      sourceUrl: 'https://www.redfin.com/TX/Houston/456-Oak-Ave-77002/12345678',
      sourceType: 'redfin',
      mlsNumber: 'MLS-2024-002345',
      address: '456 Oak Avenue',
      city: 'Houston',
      state: 'TX',
      zipCode: '77002',
      propertyType: 'condo',
      price: 325000,
      aiFairValue: 310000, // Lower due to older build (1975) and smaller size
      daysOnMarket: 8,
      listingAgentName: 'Michael Broker',
      listingAgentEmail: 'michael@broker.com',
      listingAgentPhone: '(713) 555-0202',
      offerDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      hasHOA: false,
      builtBefore1978: true,
      extractedData: {
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 1200,
        lotSize: 0.15,
        yearBuilt: 1975,
      },
    },
  })

  const property3 = await prisma.property.create({
    data: {
      sourceUrl: 'https://www.zillow.com/homedetails/789-Pine-Rd-Dallas-TX-75201/87654321_zpid/',
      sourceType: 'zillow',
      mlsNumber: 'MLS-2024-003456',
      address: '789 Pine Road',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      propertyType: 'singlefamily',
      price: 550000,
      aiFairValue: 525000, // Lower due to 25 days on market suggesting overpricing
      daysOnMarket: 25,
      listingAgentName: 'Amanda Sales',
      listingAgentEmail: 'amanda@sales.com',
      listingAgentPhone: '(214) 555-0303',
      offerDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      hasHOA: true,
      builtBefore1978: false,
      extractedData: {
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2400,
        lotSize: 0.35,
        yearBuilt: 2020,
      },
    },
  })

  const property4 = await prisma.property.create({
    data: {
      sourceUrl: 'https://www.realtor.com/realestateandhomes-detail/321-Elm-St-San-Antonio-TX-78201_M12345-67890',
      sourceType: 'realtor',
      mlsNumber: 'MLS-2024-004567',
      address: '321 Elm Street',
      city: 'San Antonio',
      state: 'TX',
      zipCode: '78201',
      propertyType: 'singlefamily',
      price: 280000,
      aiFairValue: 275000, // Slightly below asking, but close since only 3 days on market
      daysOnMarket: 3,
      listingAgentName: 'Robert Agent',
      listingAgentEmail: 'robert@agent.com',
      listingAgentPhone: '(210) 555-0404',
      offerDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      hasHOA: false,
      builtBefore1978: false,
      extractedData: {
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1650,
        lotSize: 0.2,
        yearBuilt: 2018,
      },
    },
  })

  // Create Offers
  console.log('📝 Creating offers...')
  const offer1 = await prisma.offer.create({
    data: {
      userId: user1.id,
      propertyId: property1.id,
      financingType: 'conventional',
      offerPrice: 445000,
      contingencies: {
        inspection: true,
        appraisal: true,
        financing: true,
      },
      timelinePreferences: {
        closingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        responseDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      concessions: {
        sellerCredits: 5000,
        repairs: 'Up to $3000 for inspection findings',
      },
      additionalNotes: 'Love the property! Hoping for a quick response.',
      status: 'GENERATED',
      offerLetterPreview: 'Dear Seller, I am pleased to submit an offer of $445,000 for 123 Main Street...',
      offerLetterUrl: null,
      requiresAgentReview: true,
      agentReviewStatus: 'APPROVED',
      agentReviewNotes: 'Offer looks good. Competitive price with reasonable contingencies.',
      reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      notificationSent: true,
      notificationSentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  })

  const offer2 = await prisma.offer.create({
    data: {
      userId: user2.id,
      propertyId: property2.id,
      financingType: 'cash',
      offerPrice: 320000,
      contingencies: {
        inspection: true,
        appraisal: false,
        financing: false,
      },
      timelinePreferences: {
        closingDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        responseDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      concessions: null,
      additionalNotes: 'Cash offer, quick close preferred.',
      status: 'DOWNLOADED',
      offerLetterPreview: 'I am submitting a cash offer of $320,000 for 456 Oak Avenue...',
      offerLetterUrl: null,
      requiresAgentReview: false,
      agentReviewStatus: 'PENDING',
      notificationSent: true,
      notificationSentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  })

  const offer3 = await prisma.offer.create({
    data: {
      userId: user2.id,
      propertyId: property3.id,
      financingType: 'fha',
      offerPrice: 545000,
      contingencies: {
        inspection: true,
        appraisal: true,
        financing: true,
      },
      timelinePreferences: {
        closingDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        responseDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      concessions: {
        sellerCredits: 8000,
      },
      additionalNotes: 'First-time homebuyer, FHA loan.',
      status: 'PENDING_REVIEW',
      offerLetterPreview: null,
      requiresAgentReview: true,
      agentReviewStatus: 'IN_REVIEW',
      notificationSent: false,
    },
  })

  const offer4 = await prisma.offer.create({
    data: {
      userId: user3.id,
      propertyId: property4.id,
      financingType: 'conventional',
      offerPrice: 275000,
      contingencies: {
        inspection: true,
        appraisal: true,
        financing: true,
      },
      timelinePreferences: {
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        responseDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      concessions: null,
      additionalNotes: null,
      status: 'DRAFT',
      offerLetterPreview: null,
      requiresAgentReview: false,
      agentReviewStatus: 'PENDING',
      notificationSent: false,
    },
  })

  const offer5 = await prisma.offer.create({
    data: {
      userId: user1.id,
      propertyId: property2.id,
      financingType: 'va',
      offerPrice: 310000,
      contingencies: {
        inspection: true,
        appraisal: true,
        financing: true,
      },
      timelinePreferences: {
        closingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        responseDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      concessions: {
        sellerCredits: 3000,
      },
      additionalNotes: 'VA loan, veteran buyer.',
      status: 'COMPLETED',
      offerLetterPreview: 'I am pleased to submit a VA-backed offer of $310,000...',
      offerLetterUrl: null,
      requiresAgentReview: true,
      agentReviewStatus: 'COMPLETED',
      agentReviewNotes: 'Offer accepted by seller!',
      reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notificationSent: true,
      notificationSentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  })

  // Create Payments
  console.log('💵 Creating payments...')
  await prisma.payment.create({
    data: {
      userId: user1.id,
      offerId: offer1.id,
      stripePaymentIntentId: 'pi_mock_offer1',
      stripeCheckoutSessionId: 'cs_mock_offer1',
      amount: 3000, // $30.00 in cents
      currency: 'usd',
      status: 'COMPLETED',
      paymentType: 'SINGLE_DOWNLOAD_WITH_REVIEW',
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      metadata: {
        offerId: offer1.id,
        propertyAddress: property1.address,
      },
    },
  })

  await prisma.payment.create({
    data: {
      userId: user2.id,
      offerId: offer2.id,
      stripePaymentIntentId: 'pi_mock_offer2',
      stripeCheckoutSessionId: 'cs_mock_offer2',
      amount: 1000, // $10.00 in cents
      currency: 'usd',
      status: 'COMPLETED',
      paymentType: 'SINGLE_DOWNLOAD',
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      metadata: {
        offerId: offer2.id,
        propertyAddress: property2.address,
      },
    },
  })

  await prisma.payment.create({
    data: {
      userId: user2.id,
      offerId: offer3.id,
      stripePaymentIntentId: 'pi_mock_offer3',
      stripeCheckoutSessionId: 'cs_mock_offer3',
      amount: 1000, // $10.00 in cents (covered by subscription)
      currency: 'usd',
      status: 'COMPLETED',
      paymentType: 'SINGLE_DOWNLOAD',
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      metadata: {
        offerId: offer3.id,
        propertyAddress: property3.address,
        subscriptionDiscount: true,
      },
    },
  })

  await prisma.payment.create({
    data: {
      userId: user2.id,
      offerId: null, // Subscription payment
      stripePaymentIntentId: 'pi_mock_sub1',
      stripeCheckoutSessionId: 'cs_mock_sub1',
      amount: 2000, // $20.00 in cents
      currency: 'usd',
      status: 'COMPLETED',
      paymentType: 'MONTHLY_SUBSCRIPTION',
      paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      metadata: {
        subscriptionId: subscription1.id,
        billingPeriod: 'monthly',
      },
    },
  })

  await prisma.payment.create({
    data: {
      userId: user1.id,
      offerId: offer5.id,
      stripePaymentIntentId: 'pi_mock_offer5',
      stripeCheckoutSessionId: 'cs_mock_offer5',
      amount: 5000, // $50.00 in cents
      currency: 'usd',
      status: 'COMPLETED',
      paymentType: 'AGENT_REVIEW_ONLY',
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      metadata: {
        offerId: offer5.id,
        propertyAddress: property2.address,
        reviewType: 'premium',
      },
    },
  })

  await prisma.payment.create({
    data: {
      userId: user3.id,
      offerId: offer4.id,
      stripePaymentIntentId: 'pi_mock_offer4_pending',
      stripeCheckoutSessionId: 'cs_mock_offer4_pending',
      amount: 1000, // $10.00 in cents
      currency: 'usd',
      status: 'PENDING',
      paymentType: 'SINGLE_DOWNLOAD',
      metadata: {
        offerId: offer4.id,
        propertyAddress: property4.address,
      },
    },
  })

  console.log('✅ Database seed completed successfully!')
  console.log(`   Created ${await prisma.user.count()} users`)
  console.log(`   Created ${await prisma.subscription.count()} subscriptions`)
  console.log(`   Created ${await prisma.property.count()} properties`)
  console.log(`   Created ${await prisma.offer.count()} offers`)
  console.log(`   Created ${await prisma.payment.count()} payments`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

