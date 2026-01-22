'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function DownloadOfferPage() {
  const params = useParams()
  const offerId = params.offerId as string
  const [loading, setLoading] = useState(true)
  const [offer, setOffer] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/offer/${offerId}/download`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to download offer')
        }
        return res.blob()
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `offer-letter-${offerId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [offerId])

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">Preparing download...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
            <h1 className="text-xl font-bold text-red-800 mb-2">Error</h1>
            <p className="text-red-700">{error}</p>
          </div>
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
          <h1 className="text-xl font-bold text-green-800 mb-2">
            Download Started
          </h1>
          <p className="text-green-700">
            Your offer letter should start downloading automatically.
          </p>
        </div>
        <Link
          href="/"
          className="text-blue-600 hover:underline"
        >
          Return to Home
        </Link>
      </div>
    </main>
  )
}

