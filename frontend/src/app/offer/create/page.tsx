'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface PropertyData {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number | null
  aiFairValue: number | null
  daysOnMarket: number | null
  mlsNumber: string | null
}

export default function CreateOfferPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('propertyId')

  // const [property, setProperty] = useState<PropertyData | null>(null)
  // const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [address, setAddress] = useState('') // street address
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [financingType, setFinancingType] = useState('conventional')
  const [offerPrice, setOfferPrice] = useState('')
  const [contingencies, setContingencies] = useState({
    inspection: true,
    appraisal: true,
    financing: true,
  })
  const [timelinePreferences, setTimelinePreferences] = useState({
    closingDate: '',
    possessionDate: '',
  })
  const [concessions, setConcessions] = useState({
    sellerCredits: '',
    repairs: '',
  })
  const [additionalNotes, setAdditionalNotes] = useState('')

  // useEffect(() => {
  //   if (!propertyId) {
  //     router.push('/property')
  //     return
  //   }

  //   fetch(`/api/property/${propertyId}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setProperty(data)
  //       // Set default offer price to AI fair value if available, otherwise use listing price
  //       if (data.aiFairValue) {
  //         setOfferPrice(data.aiFairValue.toString())
  //       } else if (data.price) {
  //         setOfferPrice(data.price.toString())
  //       }
  //     })
  //     .catch(() => router.push('/property'))
  //     .finally(() => setLoading(false))
  // }, [propertyId, router])

  // Helper function to get date string in YYYY-MM-DD format
  const getDateString = (daysFromToday: number): string => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromToday)
    return date.toISOString().split('T')[0]
  }

  // Helper function to format date for display
  const formatDateDisplay = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Suggested closing dates
  const suggestedDates = [
    { days: 30, label: '30 days' },
    { days: 45, label: '45 days' },
    { days: 60, label: '60 days' },
  ]

  const handleSuggestedDateClick = (days: number) => {
    const dateString = getDateString(days)
    setTimelinePreferences({ ...timelinePreferences, closingDate: dateString })
  }

  // Validate required fields
  const isFormValid = 
    address.trim() !== '' &&
    city.trim() !== '' &&
    state.trim() !== '' &&
    zipCode.trim() !== '' &&
    financingType.trim() !== '' &&
    offerPrice.trim() !== '' &&
    !isNaN(parseFloat(offerPrice)) &&
    parseFloat(offerPrice) > 0 &&
    timelinePreferences.closingDate.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/offer/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          city,
          state,
          zipCode,
          financingType,
          offerPrice: parseFloat(offerPrice),
          contingencies,
          timelinePreferences,
          concessions,
          additionalNotes,
        }),
      })

      if (!response.ok) throw new Error('Failed to create offer')

      const data = await response.json()
      router.push(`/offer/${data.offerId}/preview`)
    } catch (err) {
      alert('Failed to create offer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // if (loading) {
  //   return (
  //     <main className="min-h-screen p-8">
  //       <div className="max-w-2xl mx-auto">Loading...</div>
  //     </main>
  //   )
  // }

  // if (!property) {
  //   return null
  // }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Step 1: Offer Details</h1>

        {/* <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2 text-black">Property Information</h2>
          <p className="text-sm text-gray-600">{property.address}, {property.city}, {property.state} {property.zipCode}</p>
          {property.price && <p className="text-sm text-gray-600">List Price: ${property.price.toLocaleString()}</p>}
          {property.aiFairValue && (
            <p className="text-sm font-medium text-blue-600">
              AI Fair Value: ${property.aiFairValue.toLocaleString()}
            </p>
          )}
          {property.mlsNumber && <p className="text-sm text-gray-600">MLS #: {property.mlsNumber}</p>}
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">Select a state</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                pattern="[0-9]{5}(-[0-9]{4})?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
          </div>
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              id="propertyType"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="singlefamily">Single Family</option>
              <option value="multifamily">Multifamily</option>
              <option value="condominium">Condominium</option>
              <option value="townhouse">Townhouse</option>
              <option value="cooperative">Cooperative</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="financingType" className="block text-sm font-medium mb-2">
              Financing Type <span className="text-red-500">*</span>
            </label>
            <select
              id="financingType"
              value={financingType}
              onChange={(e) => setFinancingType(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="cash">Cash</option>
              <option value="conventional">Conventional</option>
              <option value="fha">FHA</option>
              <option value="va">VA</option>
              <option value="usda">USDA</option>
            </select>
          </div>

          <div>
            <label htmlFor="offerPrice" className="block text-sm font-medium mb-2">
              Offer Price ($) <span className="text-red-500">*</span>
            </label>
            <div className="mb-2 space-y-1">
              {/* {property.price && (
                <p className="text-sm text-gray-600">
                  Listing Price: <span className="font-medium">${property.price.toLocaleString()}</span>
                </p>
              )}
              {property.aiFairValue && (
                <p className="text-sm text-blue-600">
                  AI Fair Value: <span className="font-medium">${property.aiFairValue.toLocaleString()}</span>
                  <span className="ml-2 text-xs text-gray-500">(Recommended starting point)</span>
                </p>
              )} */}
            </div>
            <input
              id="offerPrice"
              type="number"
              step="0.01"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              // placeholder={property.aiFairValue ? property.aiFairValue.toString() : property.price?.toString() || ''}
            />
            {/* {property.price && property.aiFairValue && offerPrice && (
              <p className="mt-1 text-xs text-gray-500">
                Difference from listing: {((parseFloat(offerPrice) - property.price) / property.price * 100).toFixed(1)}%
                {property.aiFairValue < property.price && (
                  <span className="ml-2 text-green-600">
                    (AI suggests {((property.aiFairValue - property.price) / property.price * 100).toFixed(1)}% below listing)
                  </span>
                )}
              </p>
            )} */}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contingencies</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={contingencies.inspection}
                  onChange={(e) =>
                    setContingencies({ ...contingencies, inspection: e.target.checked })
                  }
                  className="mr-2"
                />
                Inspection
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={contingencies.appraisal}
                  onChange={(e) =>
                    setContingencies({ ...contingencies, appraisal: e.target.checked })
                  }
                  className="mr-2"
                />
                Appraisal
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={contingencies.financing}
                  onChange={(e) =>
                    setContingencies({ ...contingencies, financing: e.target.checked })
                  }
                  className="mr-2"
                />
                Financing
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="closingDate" className="block text-sm font-medium mb-2">
              Preferred Closing Date <span className="text-red-500">*</span>
            </label>
            <div className="mb-2 flex gap-2 flex-wrap">
              {suggestedDates.map((suggestion) => {
                const dateString = getDateString(suggestion.days)
                const isSelected = timelinePreferences.closingDate === dateString
                return (
                  <button
                    key={suggestion.days}
                    type="button"
                    onClick={() => handleSuggestedDateClick(suggestion.days)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {suggestion.label} ({formatDateDisplay(dateString)})
                  </button>
                )
              })}
            </div>
            <input
              id="closingDate"
              type="date"
              value={timelinePreferences.closingDate}
              onChange={(e) =>
                setTimelinePreferences({ ...timelinePreferences, closingDate: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label htmlFor="sellerCredits" className="block text-sm font-medium mb-2">
              Seller Credits / Concessions ($)
            </label>
            <input
              id="sellerCredits"
              type="number"
              step="0.01"
              value={concessions.sellerCredits}
              onChange={(e) =>
                setConcessions({ ...concessions, sellerCredits: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium mb-2">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating Offer...' : 'Generate Offer Letter'}
          </button>
        </form>
      </div>
    </main>
  )
}

