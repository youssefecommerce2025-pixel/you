const badges = [
  { icon: '🚀', title: 'Fast US Shipping', sub: '2-3 business days standard' },
  { icon: '✅', title: '100% Satisfaction', sub: 'Love it or we fix it' },
  { icon: '🌿', title: 'Organic Cotton', sub: 'GOTS-certified & ethical' },
  { icon: '🔒', title: 'Secure Checkout', sub: 'SSL encrypted payments' },
  { icon: '🎁', title: 'Gift Wrapping', sub: 'Add a personal message' },
  { icon: '↩️', title: 'Easy Returns', sub: '30-day hassle-free returns' },
]

export default function TrustBadges() {
  return (
    <section className="bg-white border-b border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 group">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                {badge.icon}
              </span>
              <div>
                <p className="font-bold text-xs uppercase tracking-wide text-gray-900">{badge.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{badge.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
