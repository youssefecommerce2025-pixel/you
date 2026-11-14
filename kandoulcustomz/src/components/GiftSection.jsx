import { Link } from 'react-router-dom'

const occasions = [
  { icon: '🧥', label: 'Everyday Essentials' },
  { icon: '🏋️', label: 'Gym & Training' },
  { icon: '✈️', label: 'Travel Comfort' },
  { icon: '☕', label: 'Coffee Runs' },
]

export default function GiftSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 mb-4 block">The Ultimate Essential</span>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Built for
              <span className="block italic" style={{ color: '#CC3731' }}>The Modern Man.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Forget the flimsy hoodies you replace every season. We engineer heavyweight, structured fits that sit perfectly on the shoulders. 
              Designed for daily rotation, lasting comfort, and unapologetic style.
            </p>

            {/* Occasions grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {occasions.map((occ, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors cursor-default">
                  <span className="text-2xl">{occ.icon}</span>
                  <span className="text-xs font-bold text-gray-800 text-center leading-tight uppercase tracking-wide">{occ.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
              >
                Shop Essentials
              </Link>
            </div>
          </div>

          {/* Gift box visual */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '🧥', title: 'Boxy Fit', sub: 'Room in the chest', color: '#f8f8f8' },
              { emoji: '🧵', title: 'Heavyweight', sub: 'Organic cotton', color: '#0A0A0A', dark: true },
              { emoji: '💪', title: 'Structured', sub: 'Holds its shape', color: '#f5f0e8' },
              { emoji: '🇺🇸', title: 'US Finished', sub: 'Hand-inspected', color: '#1a1a1a', dark: true },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 flex flex-col items-center justify-center text-center aspect-square hover:scale-105 transition-transform duration-300 cursor-default"
                style={{ background: item.color }}
              >
                <span className="text-4xl mb-3">{item.emoji}</span>
                <p className={`font-black text-sm ${item.dark ? 'text-white' : 'text-black'}`}>{item.title}</p>
                <p className={`text-xs mt-1 ${item.dark ? 'text-white/50' : 'text-gray-400'}`}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
