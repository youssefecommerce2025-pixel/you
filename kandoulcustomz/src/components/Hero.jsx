import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #CC3731 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, #CC3731 0%, transparent 50%)`
      }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(204, 55, 49, 0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(204, 55, 49, 0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Wear
              <span
                className="block italic"
                style={{
                  background: 'linear-gradient(135deg, #CC3731 0%, #E2574C 50%, #9E2420 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Your Story.
              </span>
            </h1>

            <p className="text-white/60 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Premium men's hoodies and crewnecks, crafted with soul.
              Heavyweight organic cotton, boxy fits, ready-to-wear — made for the bold.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
              <Link
                to="/shop"
                className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #CC3731, #E2574C)',
                  color: '#FFFFFF',
                }}
                onClick={() => { if (window.fbq) fbq('track', 'ViewContent') }}
              >
                Shop the Collection
                <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">450<span className="text-lg text-white/50">GSM</span></p>
                <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mt-1">Heavyweight</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">3-7</p>
                <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mt-1">US Delivery</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">USD</p>
                <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mt-1">Stripe Only</p>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative w-full h-[500px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/20 z-10" />
            <img
              src={`${import.meta.env.BASE_URL}products/hoodie-black-wear.jpg`}
              alt="Male model wearing Je Suis Là black hoodie"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-6 right-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
              <p className="text-white font-black text-sm uppercase tracking-wider mb-1">The Signature Black</p>
              <p className="text-white/70 text-xs">Model is 6'1" (185cm) wearing Size L</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
