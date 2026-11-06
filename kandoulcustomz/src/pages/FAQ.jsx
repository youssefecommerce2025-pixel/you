import { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const faqGroups = [
  {
    category: 'Shipping & Delivery',
    icon: '📦',
    id: 'shipping',
    faqs: [
      {
        q: 'How long does US delivery take?',
        a: "Depending on your state and address location in the USA, your order will be delivered within 3 to 7 business days via tracked USPS or FedEx service."
      },
      {
        q: 'Do you offer free shipping?',
        a: "Yes! All US orders of $75 or more automatically qualify for FREE tracked shipping."
      },
      {
        q: 'Do you ship internationally?',
        a: "Currently, our primary focus is fast, premium fulfillment across the United States. For special international requests, email hello@julofficial.com."
      },
      {
        q: 'How do I track my order?',
        a: "Once your order is dispatched, you receive an automated shipping confirmation email with an active tracking link."
      },
    ]
  },
  {
    category: 'Returns & Exchanges',
    icon: '↩️',
    id: 'returns',
    faqs: [
      {
        q: 'What is your return policy?',
        a: "We offer 30-day hassle-free returns on standard (non-custom) items. Items must be unworn, unwashed, and in original condition. Contact hello@julofficial.com to initiate a return."
      },
      {
        q: 'Can I exchange for a different size?',
        a: "Yes! Size exchanges are free within 30 days of delivery. Just email us with your order number and the size you need. We'll send the new size as soon as we receive the original back."
      },
      {
        q: 'My order arrived damaged. What do I do?',
        a: "We're so sorry! Take a photo and email it to hello@julofficial.com within 48 hours of delivery. We'll send a replacement immediately at no cost to you."
      },
    ]
  },
  {
    category: 'Sizing',
    icon: '📏',
    id: 'sizing',
    faqs: [
      {
        q: 'How do your sizes run?',
        a: "Our hoodies are true to size with a slightly relaxed fit — great for layering. If you're between sizes, we recommend sizing up."
      },
      {
        q: 'Where can I find the size chart?',
        a: "Each product page has a detailed size chart with measurements in inches. Click 'Size Guide' next to the size selector on any product page."
      },
      {
        q: 'Do you offer plus sizes?',
        a: "Yes! Our apparel is available in XS through 2XL."
      },
    ]
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200 ${open ? 'shadow-sm' : ''}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-sm pr-4">{q}</span>
        <span className="flex-shrink-0 text-yellow-500">
          {open ? <FiMinus size={18} /> : <FiPlus size={18} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(null)

  return (
    <div className="pt-52 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-3 block">Help Center</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Everything you need to know. Can't find your answer?{' '}
            <Link to="/contact" className="underline text-yellow-600 hover:text-yellow-700">Contact us</Link> — we reply within 24 hours.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
              activeCategory === null ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
            }`}
          >
            All
          </button>
          {faqGroups.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveCategory(g.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                activeCategory === g.id ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
              }`}
            >
              {g.icon} {g.category}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-10">
          {faqGroups
            .filter(g => !activeCategory || g.id === activeCategory)
            .map(group => (
              <div key={group.id} id={group.id}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{group.icon}</span>
                  <h2 className="text-xl font-black">{group.category}</h2>
                </div>
                <div className="space-y-3">
                  {group.faqs.map((faq, i) => (
                    <FAQItem key={i} {...faq} />
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Still need help */}
        <div className="mt-16 bg-black rounded-3xl p-10 text-center text-white">
          <p className="text-3xl mb-3">💬</p>
          <h2 className="text-2xl font-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Still Have Questions?
          </h2>
          <p className="text-white/60 mb-6">Our team responds to every message within 24 hours, usually much faster.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold">
              Contact Us
            </Link>
            <a href="mailto:hello@julofficial.com"
              className="px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm border-2 border-white/20 hover:border-yellow-400/50 hover:text-yellow-400 transition-all text-sm"
            >
              hello@julofficial.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
