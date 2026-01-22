# AI Real Estate Agent - Frontend

Next.js frontend for the AI Real Estate Agent platform.

## Prerequisites

- Node.js 18+
- npm
- FastAPI backend running (see `../backend/README.md`)

## Installation

```bash
npm install
```

## Configuration

Copy the example environment file and update with your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development

Make sure the FastAPI backend is running first:

```bash
cd ../backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Then start the frontend:

```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## API Proxy

All `/api/*` requests are proxied to the FastAPI backend (`NEXT_PUBLIC_API_URL`).

## Pages

- `/` - Home page with offer creation form
- `/property` - Property URL input
- `/offer/create` - Create offer form
- `/offer/[id]/preview` - Preview offer letter
- `/offer/[id]/download` - Download offer letter
- `/payment/success` - Payment success page
