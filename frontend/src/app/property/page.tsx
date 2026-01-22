'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PropertyPage() {
  const [propertyUrl, setPropertyUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/property/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: propertyUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to extract property information')
      }

      const data = await response.json()
      router.push(`/offer/create?propertyId=${data.propertyId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Step 1: Property Information</h1>
        <p className="text-gray-600 mb-8">
          Paste a link from Zillow, Redfin, or another real estate site to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="propertyUrl" className="block text-sm font-medium mb-2">
              Property URL
            </label>
            <input
              id="propertyUrl"
              type="url"
              value={propertyUrl}
              onChange={(e) => setPropertyUrl(e.target.value)}
              placeholder="https://www.zillow.com/..."
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Extracting Property Info...' : 'Continue'}
          </button>
        </form>
      </div>
    </main>
  )
}

