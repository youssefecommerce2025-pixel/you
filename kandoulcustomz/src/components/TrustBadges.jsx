const badges = [
  { icon: '📦', title: 'Tracked US Delivery', sub: '3 to 7 business days' },
  { icon: '✅', title: '100% Satisfaction', sub: 'Love it or we replace it' },
  { icon: '🌿', title: 'Organic Cotton', sub: 'GOTS-certified & ethical' },
  { icon: '🔒', title: 'Secure Checkout', sub: 'Stripe, PayPal, Wise, Payoneer' },
  { icon: '🎁', title: 'Gift Packaging', sub: 'Add custom notes & wrap' },
  { icon: '↩️', title: 'Easy Returns', sub: '30-day hassle-free guarantee' },
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
