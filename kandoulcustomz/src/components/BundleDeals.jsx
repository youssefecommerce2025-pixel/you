import { useState } from 'react'
import { FiCheck, FiShield, FiPercent } from 'react-icons/fi'

export default function BundleDeals({ addToCart }) {
  const [selectedBundle, setSelectedBundle] = useState('duo')
  const [added, setAdded] = useState(false)

  const bundles = [
    {
      id: 'duo',
      name: 'The Statement Duo (2 Hoodies)',
      popular: true,
      originalPrice: 110,
      bundlePrice: 96,
      savings: 14,
      items: [
        "2x 'Je Suis Là' Organic Cotton Hoodies ($110 value)",
        'Mix any two colors from the collection',
        'FREE Priority Tracked US Shipping ($7.99 value)',
        'FREE Gift Message Card Included',
      ],
      emoji: '🖤🖤',
    },
    {
      id: 'trio',
      name: 'The Crew Capsule (3 Hoodies)',
      popular: false,
      originalPrice: 165,
      bundlePrice: 141,
      savings: 24,
      items: [
        "3x 'Je Suis Là' Organic Cotton Hoodies ($165 value)",
        'Mix any three colors from the collection',
        'FREE Tracked US Shipping + VIP Packaging',
        'Best value — save $24 instantly',
      ],
      emoji: '🖤🖤🖤',
    },
  ]

  const currentBundle = bundles.find(b => b.id === selectedBundle)

  const handleAddBundle = () => {
    addToCart({
      id: `bundle-${currentBundle.id}`,
      name: currentBundle.name,
      price: currentBundle.bundlePrice,
      size: 'L (Standard)',
      color: 'Black',
      logo: 'Large Logo',
      emoji: '🎁',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <section className="section-padding bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-black uppercase tracking-widest mb-4">
            <FiPercent /> Best Value Bundles • Limited US Stock
          </div>
          <h2 className="text-3xl sm:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bundle & Save Up to $24
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-base">
            Stack our signature Je Suis Là hoodies, mix colors, and unlock instant savings plus free US tracked shipping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {bundles.map(b => (
            <div
              key={b.id}
              onClick={() => setSelectedBundle(b.id)}
              className={`rounded-3xl p-6 sm:p-8 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedBundle === b.id
                  ? 'border-yellow-400 bg-white/10 shadow-2xl scale-[1.02]'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              {b.popular && (
                <span className="absolute -top-3 right-6 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                  Most Popular Pack
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{b.emoji}</span>
                  <div className="text-right">
                    <span className="text-xs text-white/40 line-through mr-2">${b.originalPrice}</span>
                    <span className="text-2xl font-black text-yellow-400">${b.bundlePrice}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{b.name}</h3>
                <span className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-2.5 py-0.5 rounded-full mb-4">
                  You Save ${b.savings} Instantly
                </span>

                <ul className="space-y-2 mb-6">
                  {b.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                      <FiCheck className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/50">3 to 7 Days Delivery</span>
                <span className="text-xs font-bold text-yellow-400">
                  {selectedBundle === b.id ? '✓ Selected' : 'Click to Select'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-md mx-auto">
          <button
            onClick={handleAddBundle}
            className={`w-full py-4 rounded-full font-bold tracking-widest uppercase text-sm transition-all shadow-xl ${
              added ? 'bg-green-500 text-white' : 'btn-gold'
            }`}
          >
            {added ? '✓ Bundle Added to Cart!' : `Add Selected Bundle — $${currentBundle.bundlePrice}`}
          </button>
          <p className="text-[11px] text-white/40 mt-3 flex items-center justify-center gap-2">
            <FiShield className="text-yellow-400" /> 100% Cotton • Free Tracked US Delivery • 30-Day Money-Back
          </p>
        </div>
      </div>
    </section>
  )
}
