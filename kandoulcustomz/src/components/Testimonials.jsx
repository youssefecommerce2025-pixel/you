import { FiStar } from 'react-icons/fi'

const reviews = [
  {
    name: 'Marcus T.',
    location: 'Atlanta, GA',
    rating: 5,
    text: "Best hoodie I've ever owned. The quality is insane — thick, soft, and the embroidery is so clean. Got so many compliments the first day I wore it. Ordered 3 more colors.",
    product: 'Je Suis Là Hoodie — Black',
    avatar: 'MT',
    verified: true,
  },
  {
    name: 'Jasmine R.',
    location: 'Houston, TX',
    rating: 5,
    text: "Ordered the olive green and I'm absolutely obsessed. The fit is perfect, true to size. The 'Je Suis Là' message hits different once you understand what it means.",
    product: 'Je Suis Là Hoodie — Olive Green',
    avatar: 'JR',
    verified: true,
  },
  {
    name: 'Carlos M.',
    location: 'Miami, FL',
    rating: 5,
    text: "Ordered 25 custom hoodies for our company event. The quality was unbelievable for the price. Everyone asked where we got them. Will definitely be ordering again.",
    product: 'Custom Hoodies × 25',
    avatar: 'CM',
    verified: true,
  },
  {
    name: 'Aaliyah K.',
    location: 'New York, NY',
    rating: 5,
    text: "Got a custom hoodie with my sister's favorite quote for her birthday. She cried when she saw it. The print quality is sharp and it washes perfectly. 10/10 experience.",
    product: 'Custom Hoodie — Personal Gift',
    avatar: 'AK',
    verified: true,
  },
  {
    name: 'DeShawn M.',
    location: 'Chicago, IL',
    rating: 5,
    text: "Statement piece fr. The hoodie quality speaks for itself — heavyweight, clean stitching, perfect fit. The Je Suis Là meaning is powerful once you feel the energy.",
    product: 'Je Suis Là Hoodie — Brown',
    avatar: 'DM',
    verified: true,
  },
  {
    name: 'Brianna L.',
    location: 'Los Angeles, CA',
    rating: 5,
    text: "This black hoodie is my everyday go-to now. Super soft, holds its shape after washing, and the embroidery hasn't faded at all. Message is everything right now.",
    product: 'Je Suis Là Hoodie — Black',
    avatar: 'BL',
    verified: true,
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <FiStar key={s} size={14}
          className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="section-padding bg-gray-50" id="reviews">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-3 block">Real Reviews</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Community Speaks
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <FiStar key={s} size={20} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-black text-2xl">4.9</span>
            <span className="text-gray-400">(500+ reviews)</span>
          </div>
          <p className="text-gray-500 max-w-lg mx-auto">
            Real customers, real stories. Here's what the JUL family is saying.
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 text-white"
                  style={{ background: 'linear-gradient(135deg, #0A0A0A, #333)' }}
                >
                  {review.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{review.name}</p>
                    {review.verified && (
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs">{review.location}</p>
                </div>
              </div>

              <StarRating rating={review.rating} />
              <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4">"{review.text}"</p>

              <p className="text-xs font-medium text-gray-400 border-t border-gray-50 pt-3">
                Purchased: <span className="text-gray-600">{review.product}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
