'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface OfferData {
  id: string
  offerLetterPreview: string | null
  status: string
  property: {
    address: string
    price: number | null
  }
}

export default function OfferPreviewPage() {
  const router = useRouter()
  const params = useParams()
  const offerId = params.offerId as string

  const [offer, setOffer] = useState<OfferData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPricing, setShowPricing] = useState(false)

  useEffect(() => {
    fetch(`/api/offer/${offerId}`)
      .then((res) => res.json())
      .then((data) => setOffer(data))
      .catch(() => router.push('/'))
      .finally(() => setLoading(false))
  }, [offerId, router])

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">Loading...</div>
      </main>
    )
  }

  if (!offer) {
    return null
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Offer Letter Preview</h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Property: {offer.property.address}</h2>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          {offer.offerLetterPreview ? (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{offer.offerLetterPreview}</pre>
            </div>
          ) : (
            <p className="text-gray-500">Offer letter is being generated. Please check back soon.</p>
          )}
        </div>

        {!showPricing ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowPricing(true)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Download Offer Letter
            </button>
            <Link
              href="/"
              className="block text-center text-blue-600 hover:underline"
            >
              Start Over
            </Link>
          </div>
        ) : (
          <PricingOptions offerId={offerId} />
        )}
      </div>
    </main>
  )
}

function PricingOptions({ offerId }: { offerId: string }) {
  const [requiresReview, setRequiresReview] = useState(false)

  const handleCheckout = async (paymentType: string) => {
    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          paymentType,
          requiresReview,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      alert('Failed to create checkout session')
    }
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={requiresReview}
            onChange={(e) => setRequiresReview(e.target.checked)}
            className="mr-2"
          />
          Include licensed agent review (+$20)
        </label>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Single Download</h3>
          <p className="text-sm text-gray-600 mb-4">
            {requiresReview ? '$30' : '$10'} - Download your offer letter
            {requiresReview && ' with agent review'}
          </p>
          <button
            onClick={() =>
              handleCheckout(
                requiresReview ? 'SINGLE_DOWNLOAD_WITH_REVIEW' : 'SINGLE_DOWNLOAD'
              )
            }
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Purchase
          </button>
        </div>

        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Monthly Subscription</h3>
          <p className="text-sm text-gray-600 mb-4">
            $20/month - Unlimited access to AI agent for generating offer letters
          </p>
          <button
            onClick={() => handleCheckout('MONTHLY_SUBSCRIPTION')}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Subscribe
          </button>
        </div>

        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Agent Review Only</h3>
          <p className="text-sm text-gray-600 mb-4">$20 - Have a licensed agent review your offer letter</p>
          <button
            onClick={() => handleCheckout('AGENT_REVIEW_ONLY')}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Request Review
          </button>
        </div>

        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Full Representation</h3>
          <p className="text-sm text-gray-600 mb-4">
            Contact us for full representation with a licensed real estate agent and brokerage
          </p>
          <a
            href="mailto:support@example.com"
            className="block w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

