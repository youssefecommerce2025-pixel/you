import { Link } from 'react-router-dom'

export default function BrandStory() {
  return (
    <section className="section-padding overflow-hidden" style={{ background: '#0A0A0A' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative max-w-sm mx-auto">
              {/* Main card */}
              <div className="rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', aspectRatio: '3/4' }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                  <span className="text-8xl">👑</span>
                  <div className="text-center">
                    <p className="text-white/40 text-xs uppercase tracking-[0.4em] mb-2">The Brand</p>
                    <p className="text-white font-black text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Je Suis Là
                    </p>
                    <p className="text-yellow-400 text-sm mt-2 italic font-medium">
                      "I Am Here."
                    </p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-white font-black text-2xl">500+</p>
                      <p className="text-white/40 text-xs uppercase tracking-wider">Pieces Made</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center">
                      <p className="text-yellow-400 font-black text-2xl">4.9★</p>
                      <p className="text-white/40 text-xs uppercase tracking-wider">Rated</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-xs text-gray-400 font-medium">Organic Cotton</p>
                <p className="text-black font-black">100% Ethical 🌿</p>
              </div>

              {/* Floating badge 2 */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl px-4 py-3 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}
              >
                <p className="text-xs text-black/60 font-medium">Made in the</p>
                <p className="text-black font-black">USA</p>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-4 block">Our Story</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              More Than a Brand.
              <span className="block italic" style={{ color: '#C9A84C' }}>A Statement.</span>
            </h2>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                <strong className="text-white">"Je Suis Là"</strong> — French for <em>"I Am Here."</em> Three words that carry a universe of meaning. We built Kandoul Customz on a simple belief: the clothes you wear should say something about who you are.
              </p>
              <p>
                We design for the dreamers, the grinders, the people who show up every day and refuse to be invisible. Our pieces are made from premium organic materials — because what touches your skin should be as intentional as the life you're living.
              </p>
              <p>
                Whether it's a custom tee for your team, a hoodie that marks a milestone, or a gift that makes someone feel truly seen — every piece from Kandoul Customz is crafted with purpose.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
              >
                Our Full Story
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm border-2 border-white/20 text-white hover:border-yellow-400/50 hover:text-yellow-400 transition-all"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
