import { useState } from 'react'
import { FiUpload, FiCheck, FiArrowRight } from 'react-icons/fi'

const productTypes = ['T-Shirt', 'Hoodie', 'Tank Top', 'Long Sleeve', 'Polo', 'Jacket', 'Other']
const printMethods = ['Screen Print', 'Embroidery', 'DTG (Direct to Garment)', 'Heat Transfer', "I'm not sure — recommend me"]
const quantities = ['1-4 pieces', '5-11 pieces', '12-24 pieces', '25-49 pieces', '50-99 pieces', '100+ pieces']
const budgets = ['Under $200', '$200-$500', '$500-$1,000', '$1,000-$2,500', '$2,500+', 'Flexible']

const features = [
  { icon: '🎨', title: 'Any Design', desc: 'Upload your logo, artwork, or let us design from scratch.' },
  { icon: '👔', title: 'Any Garment', desc: 'T-shirts, hoodies, polos, jackets, and more.' },
  { icon: '#️⃣', title: 'Any Quantity', desc: 'No minimum. Order 1 or 10,000.' },
  { icon: '⚡', title: 'Fast Turnaround', desc: 'Standard 5-7 days. Rush orders available.' },
  { icon: '💎', title: 'Premium Quality', desc: 'We only use materials we\'d wear ourselves.' },
  { icon: '✅', title: '100% Guaranteed', desc: 'Love it or we redo it. Period.' },
]

export default function CustomOrder() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    productType: '',
    printMethod: '',
    quantity: '',
    budget: '',
    colors: '',
    description: '',
    deadline: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    occasion: '',
    giftMessage: false,
    giftWrap: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (window.fbq) fbq('track', 'Lead', { content_name: 'custom_order' })
    if (window.ttq) ttq.track('SubmitForm')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            We Got Your Request!
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            Thank you, <strong>{form.name}</strong>! Our team will review your custom order and get back to you at <strong>{form.email}</strong> within <strong>24 hours</strong> with a quote and mockup.
          </p>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8 text-left">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Product:</span><span className="font-medium">{form.productType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Quantity:</span><span className="font-medium">{form.quantity}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Budget:</span><span className="font-medium">{form.budget}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Deadline:</span><span className="font-medium">{form.deadline || 'Flexible'}</span></div>
            </div>
          </div>
          <a href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold">
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-40 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-3 block">Get a Free Quote</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Design Your Custom Order
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Tell us your vision and we'll bring it to life. Free mockup included with every quote.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
              <span className="text-2xl mb-2 block">{f.icon}</span>
              <p className="font-bold text-sm mb-1">{f.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Progress */}
          <div className="flex border-b border-gray-100">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-colors ${
                step === s ? 'bg-black text-white' : step > s ? 'bg-yellow-400 text-black' : 'text-gray-400'
              }`}>
                {step > s ? '✓' : `Step ${s}`}
                <span className="hidden sm:inline"> — {['Order Details', 'Design Info', 'Your Info'][s-1]}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-12">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-black text-xl mb-6">What are you ordering?</h3>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">Product Type *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {productTypes.map(t => (
                        <button type="button" key={t}
                          onClick={() => update('productType', t)}
                          className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                            form.productType === t ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">Quantity *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {quantities.map(q => (
                      <button type="button" key={q}
                        onClick={() => update('quantity', q)}
                        className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                          form.quantity === q ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">Budget</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {budgets.map(b => (
                      <button type="button" key={b}
                        onClick={() => update('budget', b)}
                        className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                          form.budget === b ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={e => update('deadline', e.target.value)}
                    className="w-full sm:w-64 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* Gift options */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <p className="font-bold text-sm mb-4">🎁 Gift Options</p>
                  <div className="space-y-3">
                    {[
                      ['giftWrap', 'Add premium gift wrapping (+$5)'],
                      ['giftMessage', 'Include a personalized message card (free)'],
                    ].map(([field, label]) => (
                      <label key={field} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form[field]}
                          onChange={e => update(field, e.target.checked)}
                          className="w-4 h-4 accent-yellow-400"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { if (!form.productType || !form.quantity) { alert('Please select a product type and quantity'); return } setStep(2) }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
                >
                  Next: Design Info <FiArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-black text-xl mb-6">Tell us about your design</h3>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">Preferred Print Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {printMethods.map(m => (
                        <button type="button" key={m}
                          onClick={() => update('printMethod', m)}
                          className={`py-3 px-4 rounded-xl text-sm font-medium border-2 text-left transition-all ${
                            form.printMethod === m ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">Colors Needed</label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={e => update('colors', e.target.value)}
                    placeholder="e.g. Black shirt, white logo, gold accents"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">Describe Your Design / Vision *</label>
                  <textarea
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    placeholder="Tell us everything! What's the occasion? What message do you want to communicate? Any specific text, images, or ideas?"
                    rows={5}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">Occasion / Purpose</label>
                  <input
                    type="text"
                    value={form.occasion}
                    onChange={e => update('occasion', e.target.value)}
                    placeholder="e.g. Company team shirts, birthday gift, graduation, sports team..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* Upload placeholder */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-yellow-400 transition-colors cursor-pointer group">
                  <FiUpload size={32} className="mx-auto text-gray-300 group-hover:text-yellow-400 mb-3 transition-colors" />
                  <p className="font-bold text-sm text-gray-700 mb-1">Upload Your Design or Logo</p>
                  <p className="text-xs text-gray-400">PNG, JPG, PDF, AI, SVG accepted · Max 10MB</p>
                  <p className="text-xs text-yellow-600 mt-2 font-medium">Or send files to hello@kandoulcustomz.com</p>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-black">
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (!form.description) { alert('Please describe your design'); return } setStep(3) }}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
                  >
                    Next: Your Info <FiArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-black text-xl mb-6">Almost there! Tell us who you are</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      ['name', 'Full Name *', 'John Smith', 'text', true],
                      ['email', 'Email Address *', 'john@example.com', 'email', true],
                      ['phone', 'Phone Number', '+1 (555) 000-0000', 'tel', false],
                      ['company', 'Company / Organization', 'Optional', 'text', false],
                    ].map(([field, label, placeholder, type, required]) => (
                      <div key={field}>
                        <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-1.5">{label}</label>
                        <input
                          type={type}
                          value={form[field]}
                          onChange={e => update(field, e.target.value)}
                          placeholder={placeholder}
                          required={required}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-4">Order Summary</p>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Product', form.productType],
                      ['Quantity', form.quantity],
                      ['Budget', form.budget],
                      ['Deadline', form.deadline || 'Flexible'],
                    ].map(([k, v]) => v && (
                      <div key={k} className="flex justify-between">
                        <span className="text-gray-500">{k}:</span>
                        <span className="font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
                  <p className="font-bold mb-1">What happens next?</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ We review your request within 24 hours</li>
                    <li>✓ You receive a free digital mockup and pricing quote</li>
                    <li>✓ You approve the design, we start production</li>
                    <li>✓ Your order ships in 5-7 business days</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-black">
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
                  >
                    Submit Order Request ✓
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  By submitting, you agree to our Terms of Service. No payment required now.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
