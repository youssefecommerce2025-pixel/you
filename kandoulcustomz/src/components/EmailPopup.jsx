import { useState } from 'react'
import { FiX, FiMail } from 'react-icons/fi'

export default function EmailPopup({ onClose }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    if (window.fbq) fbq('track', 'Lead', { content_name: 'email_popup' })
    if (window.ttq) ttq.track('CompleteRegistration')
    setSubmitted(true)
    setTimeout(onClose, 2500)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header image area */}
        <div className="h-32 relative flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%)' }}>
          <div className="text-center">
            <span className="text-5xl">👑</span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 text-center">
          {!submitted ? (
            <>
              <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Get 15% Off Your First Order
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Join our VIP list and be the first to know about new drops, exclusive deals, and behind-the-scenes content.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-full text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
                >
                  Claim My 15% Off
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-4">No spam. Unsubscribe anytime.</p>
            </>
          ) : (
            <div className="py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-black mb-2">You're In!</h3>
              <p className="text-gray-500 text-sm">
                Check your email for your exclusive 15% discount code. Welcome to the Kandoul family!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
