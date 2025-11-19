import Link from 'next/link'
import { FaqSection } from '@/components/FaqSection'

export default function Home() {
  const faqItems = [
    {
      id: 'represent',
      question: 'Do you represent me as an agent?',
      answer:
        'No. When you download offer letters from us, you are choosing to represent yourself as the buyer. We generate professional documents and provide guidance, but you remain the acting agent for your transaction. If you want formal representation through an agent-client relationship, please contact us so we can connect you with a licensed agent and brokerage for full-service support.',
    },
    {
      id: 'self-represent',
      question: 'Can I self-represent?',
      answer:
        'Absolutely. Self-representation is becoming more common as buyers gain access to listing data, market insights, and AI assistants like ours. With the right tools, confident buyers can negotiate directly, save on commissions, and maintain control of the process. We built this product specifically to empower modern buyers who want to self-represent with professional-grade paperwork and guidance.',
    },
    {
      id: 'commission',
      question: "If the seller offers a buyer's agent commission, can I receive it?",
      answer:
        "Only licensed agents can receive buyer's agent commissions. If you wish to receive a portion of the buyer's agent commision and save on up to 2% of the purchase price, please contact us for direct representation. \n\nIf you are self-representing, you can potentially capture the buyer's agent commission through negotiation on other aspects, such as a lower purchase price or other seller concessions. If the seller is offering a buyer's agent commission, our AI tools can generate an offer letter that keeps more money in your pocket.",
    },
    {
      id: 'first-time',
      question: "It's my first time buying a home—can I still do this?",
      answer:
        'Definitely. We guide you through every step. With flexible pricing, you only pay for the level of support you need: from AI-generated offer letters to optional licensed agent reviews, all the way up to full representation if you decide you want an agent by your side. Start with the self-service experience, and if you ever feel uncertain, upgrade to the tier that gives you direct agent help—or contact us for full representation.',
    },
    {
      id: 'nar-lawsuit',
      question: "I thought sellers pay the buyer's agent commission. Why should I pay?",
      answer:
        'The industry is changing fast. After the recent NAR settlement, many listings no longer offer traditional buyer-agent commissions, and most brokerages now charge buyers directly for representation. Instead of paying thousands in brokerage fees or hidden “representation” charges, our à-la-carte model lets you pay only for the support you need. Even our most comprehensive packages cost a fraction of what traditional buyer representation now demands.',
    },
  ]

  const pricingTiers = [
    {
      key: 'single',
      name: 'Single Download',
      price: '$10 one-time',
      emphasis: false,
      cta: 'Choose Single Download',
      buttonColor: 'bg-gray-700 hover:bg-gray-800',
    },
    {
      key: 'review',
      name: 'Download + Review',
      price: '$30 one-time',
      emphasis: true,
      cta: 'Choose Download + Review',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      key: 'premium',
      name: 'Premium Agent Support',
      price: '$50 one-time',
      emphasis: false,
      cta: 'Choose Premium Support',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
    },
  ]

  const planColumnWidth = `${(74 / pricingTiers.length).toFixed(2)}%`

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">AI Real Estate Agent</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition">FAQ</a>
            </div>
            <Link
              href="/property"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your AI-Powered Real Estate
              <span className="text-blue-600"> Buyer's Agent</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Found your dream home on Zillow or Redfin? We handle the paperwork. 
              Get professional offer letters and expert guidance without the traditional agent fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/property"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
              >
                Start Your Offer
              </Link>
              <a
                href="#pricing"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl border-2 border-blue-600"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features / How It Works */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, fast, and affordable. Get your offer letter ready in minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Paste Property Link</h3>
              <p className="text-gray-600">
                Simply paste the Zillow, Redfin, or other listing URL. Our AI extracts all property details automatically.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Answer a Few Questions</h3>
              <p className="text-gray-600">
                Tell us your offer price, financing type, contingencies, and preferences. It takes just a few minutes.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Get Your Offer Letter</h3>
              <p className="text-gray-600">
                Preview your professionally generated offer letter. Download when ready, with optional agent review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Us</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We're revolutionizing the real estate buying process for savvy buyers who know what they want. 
                If you've already found your dream home on Zillow, Redfin, or other platforms, you don't need 
                a traditional agent to help you find properties—you need help with the paperwork.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our platform is designed for buyers who:
              </p>
              <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2 ml-4">
                <li>Have already identified the property they want to purchase</li>
                <li>Understand the market and don't need help finding homes</li>
                <li>Want professional offer letters and paperwork assistance</li>
                <li>Prefer to pay only for what they need, when they need it</li>
              </ul>
              <p className="text-lg text-gray-700 leading-relaxed">
                We offer flexible pricing that fits your needs—from one-time downloads to monthly subscriptions 
                for frequent buyers, plus optional licensed agent reviews. No long-term commitments, no hidden fees, 
                just professional service when you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">
              Real experiences from real buyers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I found my perfect home on Zillow but didn't want to pay a full agent commission just for paperwork. 
                This service was exactly what I needed. Got my offer letter in hours and closed the deal!"
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-600">First-time Buyer</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "As a real estate investor, I make multiple offers. The monthly subscription is a game-changer. 
                I can generate professional offer letters instantly without paying per transaction."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">James D.</p>
                  <p className="text-sm text-gray-600">Real Estate Investor</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The agent review option gave me peace of mind. For just $30, a licensed agent reviewed my offer 
                before I submitted it. Best of both worlds—affordable and professional."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">MK</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Maria K.</p>
                  <p className="text-sm text-gray-600">Home Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">
              Pay only for what you need. Every tier includes AI offer letters and a chatbot to answer process questions.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate table-fixed" style={{ borderSpacing: 0 }}>
                <colgroup>
                  <col style={{ width: '26%' }} />
                  {pricingTiers.map((tier) => (
                    <col key={`col-${tier.key}`} style={{ width: planColumnWidth }} />
                  ))}
                </colgroup>
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Features</th>
                    {pricingTiers.map((tier) => (
                      <th
                        key={tier.key}
                        className={`py-4 px-6 text-center text-sm font-semibold uppercase tracking-wider ${
                          tier.emphasis ? 'bg-blue-600' : ''
                        }`}
                      >
                        <div className="text-lg font-bold">{tier.name}</div>
                        <div className="text-sm font-normal opacity-90">{tier.price}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                      {
                        label: 'Offer letter download',
                        values: [true, true, true],
                      },
                      {
                        label: 'Licensed agent review',
                        values: [false, true, true],
                      },
                      {
                        label: 'AI-generated content + filing guidance',
                        values: [true, true, true],
                      },
                      {
                        label: 'Chatbot support (process questions)',
                        values: [true, true, true],
                      },
                      {
                        label: 'Full agent consultation',
                        values: [false, false, true],
                      },
                      {
                        label: 'On-demand agent Q&A for property',
                        values: [false, false, true],
                      },
                      {
                        label: 'Best for',
                        values: [
                          'DIY buyers who need paperwork fast',
                          'First-time buyers needing peace of mind',
                          'Buyers wanting comprehensive guidance without full representation',
                        ],
                        isText: true,
                      },
                  ].map((row) => (
                    <tr key={row.label} className="border-t border-gray-200">
                      <td className="py-5 px-6 text-gray-900 font-medium text-base bg-gray-50">{row.label}</td>
                      {row.values.map((value, idx) => (
                        <td key={`${row.label}-${idx}`} className="py-5 px-6 text-center text-gray-800">
                          {row.isText ? (
                            <span className="text-sm text-gray-600">{value as string}</span>
                          ) : value ? (
                            <span className="text-2xl" role="img" aria-label="included">
                              ✅
                            </span>
                          ) : (
                            <span className="text-2xl text-gray-300" role="img" aria-label="not included">
                              —
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t border-gray-200">
                    <td className="py-6 px-6 bg-gray-50" />
                    {pricingTiers.map((tier) => (
                      <td key={`cta-${tier.key}`} className="py-6 px-6 text-center">
                        <Link
                          href="/property"
                          className={`${tier.buttonColor} text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition`}
                        >
                          {tier.cta}
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscription row */}
          <div className="mt-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-500 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
                Best Value for Investors
              </div>
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">$20 / month</h3>
                  <p className="text-gray-600 mb-4">Unlimited AI offer letters + chatbot access</p>
                  <Link
                    href="/property"
                    className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Subscribe
                  </Link>
                </div>
                <div className="md:col-span-2">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Included</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>✔️ Unlimited AI-generated offer letters</li>
                        <li>✔️ Chatbot + AI concierge for process questions</li>
                        <li>✔️ Priority support and roadmap access</li>
                      </ul>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Discounted add-ons</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>+ $15 per property for licensed agent review</li>
                        <li>+ $35 per property for agent walkthrough & on-demand Q&A</li>
                        <li>Ideal for investors making multiple offers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Representation CTA */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Need Full Representation?</h3>
              <p className="text-gray-700 mb-6">
                For complete real estate services including offer letter writing, paperwork handling, 
                and ongoing consulting with a licensed agent and brokerage, contact us for custom pricing.
              </p>
              <a
                href="mailto:support@example.com"
                className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know before you self-represent.</p>
          </div>

          <FaqSection items={faqItems} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AI Real Estate Agent</h3>
              <p className="text-gray-400">
                Professional real estate paperwork assistance for modern buyers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><Link href="/property" className="hover:text-white transition">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
                <li><a href="mailto:support@example.com" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AI Real Estate Agent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
