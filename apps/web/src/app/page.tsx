import Link from 'next/link'

export default function Home() {
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
                "The agent review option gave me peace of mind. For just $20, a licensed agent reviewed my offer 
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
              Pay only for what you need. No hidden fees, no long-term commitments.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Single Download */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Single Download</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$10</span>
                <span className="text-gray-600"> one-time</span>
              </div>
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Download offer letter</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>AI-generated content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>No subscription</span>
                </li>
              </ul>
              <Link
                href="/property"
                className="block w-full bg-gray-600 text-white text-center px-4 py-3 rounded-lg hover:bg-gray-700 transition"
              >
                Get Started
              </Link>
            </div>

            {/* Single Download + Review */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-500 relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Download + Review</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$30</span>
                <span className="text-gray-600"> one-time</span>
              </div>
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Everything in Single Download</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Licensed agent review</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Professional feedback</span>
                </li>
              </ul>
              <Link
                href="/property"
                className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>

            {/* Monthly Subscription */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Monthly Subscription</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$20</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Unlimited offer letters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>AI agent access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Cancel anytime</span>
                </li>
              </ul>
              <Link
                href="/property"
                className="block w-full bg-green-600 text-white text-center px-4 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Subscribe
              </Link>
            </div>

            {/* Agent Review Only */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Agent Review</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$20</span>
                <span className="text-gray-600"> per review</span>
              </div>
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Licensed agent review</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Professional feedback</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>One-time fee</span>
                </li>
              </ul>
              <Link
                href="/property"
                className="block w-full bg-purple-600 text-white text-center px-4 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Request Review
              </Link>
            </div>
          </div>

          {/* Full Representation CTA */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-3">Need Full Representation?</h3>
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
