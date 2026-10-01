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
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
                  <div className="text-center w-full">
                    <p className="text-white/40 text-xs uppercase tracking-[0.4em] mb-4">The Brand</p>
                    <img
                      src={`${import.meta.env.BASE_URL}jesuisla-logo.png`}
                      alt="Je suis là"
                      className="w-full max-w-[280px] mx-auto object-contain"
                    />
                    <p className="text-yellow-400 text-sm mt-4 italic font-medium">
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
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-4 block">Our Philosophy</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Je suis là means
              <span className="block italic" style={{ color: '#C9A84C' }}>"I am here."</span>
            </h2>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                In a world built to pull your attention everywhere else, those words bring you back to yourself. Be present. Move with intention. Choose quality over excess.
              </p>
              <p>
                <strong className="text-white">Je suis là</strong> is more than a clothing label. It is a daily practice of presence, in timeless essentials made for comfort, longevity, and calm.
              </p>
              <p>
                Every piece is 100% organic cotton, from Midweight French Terry to Heavyweight Brushed Fleece and Heavyweight French Terry. No synthetic blends. Just natural fabrics for your everyday ritual.
              </p>
              <p>
                A reminder to slow down, reconnect, and take care of yourself. The most important place to be is right here.
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
