'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [offerId, setOfferId] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      // Verify payment and get offer ID
      fetch(`/api/payment/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.offerId) {
            setOfferId(data.offerId)
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">Processing payment...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-green-700">
            Your payment has been processed successfully.
          </p>
        </div>

        {offerId ? (
          <div className="space-y-4">
            <Link
              href={`/offer/${offerId}/download`}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center"
            >
              Download Offer Letter
            </Link>
            <Link
              href="/"
              className="block text-center text-blue-600 hover:underline"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <Link
            href="/"
            className="block text-center text-blue-600 hover:underline"
          >
            Return to Home
          </Link>
        )}
      </div>
    </main>
  )
}

