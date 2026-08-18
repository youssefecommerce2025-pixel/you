import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar } from 'react-icons/fi'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #C9A84C 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, #C9A84C 0%, transparent 50%)`
      }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(201, 168, 76, 0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(201, 168, 76, 0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">

        {/* Pre-headline badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <FiStar key={s} size={12} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-white/60 text-xs font-medium">500+ Happy Customers Across the USA</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Wear
          <span
            className="block italic"
            style={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #9E7B2E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Your Story.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Premium custom apparel & personalized gifts, crafted with soul.
          From one-of-a-kind hoodies to fully custom tees — made for the bold.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            to="/shop"
            className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
              color: '#0A0A0A',
            }}
            onClick={() => { if (window.fbq) fbq('track', 'ViewContent') }}
          >
            Shop the Collection
            <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/custom-order"
            className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm border-2 border-white/20 text-white hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-300"
          >
            Design Your Own
            <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Social proof strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 border-t border-white/10 pt-10">
          <div className="text-center">
            <p className="text-3xl font-black text-white">500+</p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Orders Fulfilled</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-black" style={{ color: '#C9A84C' }}>4.9★</p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Average Rating</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-black text-white">48h</p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Standard Shipping</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-black text-white">100%</p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Satisfaction Guaranteed</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  )
}
