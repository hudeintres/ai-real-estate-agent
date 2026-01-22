# AI Real Estate Buyer's Agent

An AI-powered real estate buyer's agent platform that helps users generate offer letters and handle property purchase paperwork.

## Structure

```
ai-real-estate-agent/
├── frontend/          # Next.js frontend application
├── backend/           # FastAPI backend with SQLite (Python)
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ (for frontend)
- Stripe account (for payments)
- Google AI API key (for property extraction)

### Installation

1. **Set up the backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=sqlite+aiosqlite:///./real_estate.db
APP_URL=http://localhost:8000
DEBUG=true
GOOGLE_AI_API_KEY=your_google_ai_api_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NOTIFICATION_EMAIL=your-email@example.com
```

3. **Start the backend server:**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

4. **Set up the frontend:**

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

5. **API Documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Property

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/property/extract` | Extract property data from URL |
| GET | `/api/property/{id}` | Get property by ID |

### Offer

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/offer/create` | Create a new offer |
| GET | `/api/offer/{id}` | Get offer by ID |
| GET | `/api/offer/{id}/download` | Download offer letter PDF |

### Payment

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-checkout` | Create Stripe checkout session |
| GET | `/api/payment/verify` | Verify payment status |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/stripe` | Handle Stripe webhooks |

## Environment Variables

### FastAPI Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite connection string | Yes |
| `APP_URL` | Backend URL | Yes |
| `DEBUG` | Enable debug mode | No |
| `GOOGLE_AI_API_KEY` | Google AI API key for property extraction | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `NOTIFICATION_EMAIL` | Email for notifications | No |

## Features

### Current Implementation

- ✅ Property link input (Zillow, Redfin, etc.)
- ✅ LLM-powered property extraction using Google Gemini
- ✅ Offer questionnaire form
- ✅ PDF offer letter generation
- ✅ Email notifications
- ✅ Stripe payment integration
- ✅ Subscription and one-time payment options
- ✅ Download protection (paid downloads only)
- ✅ SQLite database for lightweight persistence

### TODO / Future Enhancements

- [ ] Add user authentication (JWT/OAuth)
- [ ] Implement agent review workflow
- [ ] Add email service integration (Resend, SendGrid, etc.)
- [ ] Add subscription management UI
- [ ] Add admin dashboard for managing offers
- [ ] Add support for more states/contract templates

## User Flow

1. **Property Input**: User pastes a property URL from Zillow, Redfin, etc.
2. **Property Extraction**: System extracts property details using Google Gemini AI
3. **Offer Details**: User fills out offer questionnaire (financing, price, contingencies, etc.)
4. **PDF Generation**: System generates offer letter PDF from template
5. **Email Notification**: System sends email notification to admin
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

### Development Commands

**Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000  # Start dev server
pytest                                      # Run tests
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev      # Start dev server on port 3000
npm run build    # Build for production
npm run lint     # Run linter
```

**Both (from root):**
```bash
npm run dev           # Start both frontend and backend
npm run dev:frontend  # Start only frontend
npm run dev:backend   # Start only backend
```

### Project Structure

```
ai-real-estate-agent/
├── backend/                  # FastAPI backend (Python)
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── utils/           # Utility functions
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Database setup
│   │   └── main.py          # Application entry
│   ├── templates/           # PDF templates
│   ├── offers/              # Generated PDFs
│   └── requirements.txt
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   └── components/      # React components
│   └── public/
└── README.md
```

## License

Private - All rights reserved
