import { useState } from 'react'
import { FiMail, FiPhone, FiClock, FiInstagram, FiSend } from 'react-icons/fi'

const reasons = ['General Question', 'Custom Order Inquiry', 'Order Issue / Support', 'Returns & Exchanges', 'Bulk / Corporate Orders', 'Media & Press', 'Other']

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (window.fbq) fbq('track', 'Lead', { content_name: 'contact_form' })
    if (window.ttq) ttq.track('Contact')
    setSubmitted(true)
  }

  return (
    <div className="pt-40 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-3 block">Get In Touch</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            We're Here For You
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Questions, custom ideas, or just want to say hi — we respond to every message within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              {
                icon: <FiMail size={22} />,
                title: 'Email Us',
                sub: 'For all inquiries',
                detail: 'hello@kandoulcustomz.com',
                href: 'mailto:hello@kandoulcustomz.com',
              },
              {
                icon: <FiPhone size={22} />,
                title: 'Call or Text',
                sub: 'Talk to a human',
                detail: '+1 (555) 000-0000',
                href: 'tel:+15550000000',
              },
              {
                icon: <FiClock size={22} />,
                title: 'Business Hours',
                sub: 'When we\'re available',
                detail: 'Mon–Fri: 9am – 6pm EST',
                href: null,
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 flex gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-yellow-400"
                  style={{ background: '#0A0A0A' }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs mb-1">{item.sub}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-medium hover:text-yellow-600 transition-colors">
                      {item.detail}
                    </a>
                  ) : (
                    <p className="text-sm font-medium">{item.detail}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social & WhatsApp */}
            <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-6 text-white shadow-md">
              <p className="font-extrabold text-sm mb-2 text-emerald-400 uppercase tracking-wider">Fastest Response</p>
              <h4 className="font-bold text-base text-white mb-2">WhatsApp Direct Support</h4>
              <p className="text-xs text-emerald-100/70 mb-4">Chat with our team directly on WhatsApp for real-time order inquiries and custom mockups.</p>
              <a
                href="https://wa.me/15550192834?text=Hello%20Kandoul%20Customz%20Team!%20I%20have%20a%20question."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Social */}
            <div className="bg-black rounded-2xl p-6 text-white">
              <p className="font-bold text-sm mb-4">Follow the Journey</p>
              <div className="space-y-3">
                {[
                  { icon: <FiInstagram />, label: '@kandoulcustomz', sub: 'Instagram', href: 'https://instagram.com' },
                  {
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.78a8.18 8.18 0 004.78 1.54V6.87a4.85 4.85 0 01-1.02-.18z"/></svg>,
                    label: '@kandoulcustomz', sub: 'TikTok', href: 'https://tiktok.com'
                  },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/60 hover:text-yellow-400 transition-colors"
                  >
                    <span className="text-yellow-400">{s.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="text-xs text-white/30">{s.sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Response time badge */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <div>
                <p className="font-bold text-sm text-green-800">Typically replies in &lt; 4 hours</p>
                <p className="text-xs text-green-600">During business hours</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="text-6xl mb-6">✉️</div>
                <h2 className="text-2xl font-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Message Sent!</h2>
                <p className="text-gray-500 max-w-sm">
                  Thank you, <strong>{form.name}</strong>! We've received your message and will get back to you at <strong>{form.email}</strong> within 24 hours.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10">
                <h2 className="text-xl font-black mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => update('name', e.target.value)}
                        placeholder="John Smith"
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => update('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-1.5">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-1.5">Reason for Contact *</label>
                    <div className="flex flex-wrap gap-2">
                      {reasons.map(r => (
                        <button
                          type="button"
                          key={r}
                          onClick={() => update('reason', r)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                            form.reason === r ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-1.5">Your Message *</label>
                    <textarea
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      placeholder="Tell us everything! The more details you share, the better we can help you."
                      rows={5}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
                  >
                    <FiSend size={16} />
                    Send Message
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
