# AI Real Estate Buyer's Agent

A monorepo for an AI-powered real estate buyer's agent platform that helps users generate offer letters and handle property purchase paperwork.

## Structure

- `apps/web` - Next.js frontend application
- `packages/db` - Prisma database schema and client

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or your preferred Prisma-supported database)
- Stripe account (for payments)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/real_estate_db?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NOTIFICATION_EMAIL="your-email@gmail.com"
```

3. Set up the database:

```bash
npm run db:generate
npm run db:migrate
```

4. Start the development server:

```bash
npm run dev
```

5. Set up Stripe webhook (for production):
   - Go to your Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - Your app URL (e.g., http://localhost:3000)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `NOTIFICATION_EMAIL` - Email address to receive offer notifications

## Features

### Current Implementation

- ✅ Property link input (Zillow, Redfin, etc.)
- ✅ Offer questionnaire form
- ✅ Email notifications for manual processing
- ✅ Offer letter preview
- ✅ Stripe payment integration
- ✅ Subscription and one-time payment options
- ✅ Download protection (paid downloads only)

### TODO / Future Enhancements

- [ ] Implement actual property extraction from URLs (currently placeholder)
- [ ] Implement AI-powered offer letter generation (currently manual)
- [ ] Add user authentication
- [ ] Add PDF generation for offer letters
- [ ] Implement agent review workflow
- [ ] Add email service integration (Resend, SendGrid, etc.)
- [ ] Add subscription management UI
- [ ] Add admin dashboard for managing offers

## User Flow

1. **Property Input**: User pastes a property URL from Zillow, Redfin, etc.
2. **Property Extraction**: System extracts property details (currently placeholder - sends email for manual processing)
3. **Offer Details**: User fills out offer questionnaire (financing, price, contingencies, etc.)
4. **Email Notification**: System sends email notification to admin
5. **Manual Processing**: Admin manually creates offer letter and uploads
6. **Preview**: User sees preview of offer letter
7. **Payment**: User selects pricing plan and pays via Stripe
8. **Download**: User downloads the completed offer letter

## Pricing Plans

- **Preview**: Free preview of offer letter (no download)
- **Single Download**: $10 (without agent review)
- **Single Download + Review**: $30 (with agent review)
- **Monthly Subscription**: $20/month (unlimited AI agent access)
- **Agent Review Only**: $20 per review
- **Full Representation**: Contact for pricing (full service with licensed agent)

## Development

### Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

### Project Structure

```
apps/web/
  src/
    app/              # Next.js app router pages
      api/           # API routes
      property/      # Property input page
      offer/         # Offer creation and preview
      payment/       # Payment success page
    lib/             # Utility functions
packages/db/
  prisma/            # Prisma schema
  src/               # Database client exports
```

## License

Private - All rights reserved
