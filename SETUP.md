# Setup Instructions

## Initial Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/real_estate_db?schema=public"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   NOTIFICATION_EMAIL="your-email@gmail.com"
   ```

3. **Set up database:**

   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Run migrations
   npm run db:migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. For local development, use Stripe CLI to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   This will give you a webhook secret to use in your `.env` file

## Important Notes

### Current Limitations

1. **User Authentication**: Currently uses a temporary user system. You need to implement proper authentication (see `apps/web/src/lib/auth.ts`)

2. **Property Extraction**: Currently placeholder. You need to implement actual extraction from Zillow/Redfin URLs (see `apps/web/src/lib/property-extractor.ts`)

3. **Email Sending**: Currently just logs emails. You need to integrate an email service (see `apps/web/src/lib/email.ts`)

4. **Offer Letter Generation**: Currently manual. After receiving email notification, you manually create the offer letter and upload it via Prisma Studio or an admin interface.

### Next Steps

1. Implement user authentication
2. Implement property extraction from URLs
3. Set up email service (Resend, SendGrid, etc.)
4. Create admin interface for uploading offer letters
5. Implement AI-powered offer letter generation
6. Add PDF generation for offer letters
