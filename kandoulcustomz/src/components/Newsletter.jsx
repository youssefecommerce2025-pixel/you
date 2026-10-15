import { useState } from 'react'
import { FiMail, FiArrowRight } from 'react-icons/fi'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    if (window.fbq) fbq('track', 'Lead', { content_name: 'newsletter' })
    if (window.ttq) ttq.track('CompleteRegistration')
    setSubmitted(true)
  }

  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #9E7B2E 100%)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-black/50 mb-4 block">VIP Access</span>
        <h2 className="text-3xl sm:text-4xl font-black text-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Get 15% Off Your First Order
        </h2>
        <p className="text-black/70 text-lg mb-8">
          Join 2,000+ members who get early access to drops, exclusive deals, and behind-the-scenes content. No spam, ever.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={18} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-11 pr-4 py-4 rounded-full bg-black/10 border-2 border-black/10 focus:border-black/30 focus:outline-none text-black placeholder-black/40 font-medium"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-black text-white font-bold tracking-widest uppercase text-xs hover:bg-black/80 transition-colors"
            >
              Claim 15% Off <FiArrowRight size={14} />
            </button>
          </form>
        ) : (
          <div className="bg-black/10 rounded-2xl px-8 py-6">
            <p className="text-3xl mb-2">🎉</p>
            <p className="font-black text-black text-xl">Welcome to the Family!</p>
            <p className="text-black/70 mt-2">Check your inbox for your exclusive discount code.</p>
          </div>
        )}

        <p className="text-black/40 text-xs mt-4">
          Unsubscribe anytime · We never share your email · Privacy is sacred 🔒
        </p>
      </div>
    </section>
  )
}
