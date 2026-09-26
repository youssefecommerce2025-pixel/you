import { Link } from 'react-router-dom'

const occasions = [
  { icon: '🎂', label: 'Birthdays' },
  { icon: '🎓', label: 'Graduations' },
  { icon: '💼', label: 'Corporate Gifts' },
  { icon: '💍', label: 'Weddings' },
  { icon: '🏀', label: 'Team Uniforms' },
  { icon: '🎉', label: 'Celebrations' },
  { icon: '❤️', label: "Valentine's Day" },
  { icon: '🎄', label: 'Holidays' },
]

export default function GiftSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-4 block">Perfect For Every Occasion</span>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Gift That
              <span className="block italic" style={{ color: '#C9A84C' }}>Actually Wows Them.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Stop giving generic gifts. Give something that shows you actually thought about it — a personalized piece they'll wear, remember, and cherish for years.
            </p>

            {/* Occasions grid */}
            <div className="grid grid-cols-4 gap-3 mb-10">
              {occasions.map((occ, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-yellow-50 transition-colors cursor-default">
                  <span className="text-2xl">{occ.icon}</span>
                  <span className="text-xs font-medium text-gray-600 text-center leading-tight">{occ.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/custom-order"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
              >
                🎁 Create a Gift
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-black"
              >
                Need Bulk? Talk to Us
              </Link>
            </div>
          </div>

          {/* Gift box visual */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '🧥', title: 'Signature Hoodie', sub: 'Their vibe. Their story.', color: '#f8f8f8' },
              { emoji: '🖤', title: 'Custom Hoodie', sub: 'Premium & cozy.', color: '#0A0A0A', dark: true },
              { emoji: '🎁', title: 'Gift Bundle', sub: 'Hoodie + wrapping + message', color: '#f5f0e8' },
              { emoji: '👑', title: 'Je Suis Là', sub: 'Statement piece.', color: '#1a1a1a', dark: true },
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
