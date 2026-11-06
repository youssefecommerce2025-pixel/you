import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar } from 'react-icons/fi'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#0A0A0A' }}>
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
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-32 text-center">

        {/* Pre-headline badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <FiStar key={s} size={12} className="fill-red-500 text-red-500" />
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
              background: 'linear-gradient(135deg, #CC3731 0%, #E2574C 50%, #9E2420 100%)',
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
          Premium hoodies & statement pieces, crafted with soul.
          From one-of-a-kind Je Suis Là hoodies to fully custom drops — made for the bold.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
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

        {/* Social proof strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 border-t border-white/10 pt-10">
          <div className="text-center">
            <p className="text-3xl font-black text-white">500+</p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Orders Fulfilled</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-black" style={{ color: '#CC3731' }}>🇺🇸</p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">USA Made</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-black text-white">3-7 Days</p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">US Delivery Time</p>
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
