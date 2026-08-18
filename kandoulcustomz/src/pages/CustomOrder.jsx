import { useState, useRef } from 'react'
import { FiUpload, FiArrowRight, FiX, FiFile, FiImage } from 'react-icons/fi'

const productTypes = ['T-Shirt', 'Hoodie', 'Tank Top', 'Long Sleeve', 'Polo', 'Jacket', 'Other']
const printMethods = ['Screen Print', 'Embroidery', 'DTG (Direct to Garment)', 'Heat Transfer', "I'm not sure — recommend me"]

const features = [
  { icon: '🎨', title: 'Any Design', desc: 'Upload your logo, artwork, or let us design from scratch.' },
  { icon: '👔', title: 'Any Garment', desc: 'T-shirts, hoodies, polos, jackets, and more.' },
  { icon: '#️⃣', title: 'Any Quantity', desc: 'No minimum. Order 1 or 10,000.' },
  { icon: '⚡', title: 'Fast Turnaround', desc: 'Delivered in 3-7 business days across the USA.' },
  { icon: '💎', title: 'Premium Quality', desc: "We only use materials we'd wear ourselves." },
  { icon: '✅', title: '100% Guaranteed', desc: 'Love it or we redo it. Period.' },
]

export default function CustomOrder() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    productType: '',
    printMethod: '',
    quantity: '',
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
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadPreview, setUploadPreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef(null)

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Enforce 10MB max
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Maximum size is 10MB.')
      return
    }

    setUploadedFile(file)

    // Generate preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => setUploadPreview(ev.target.result)
      reader.readAsDataURL(file)
    } else {
      setUploadPreview(null)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (window.fbq) window.fbq('track', 'Lead', { content_name: 'custom_order' })
    if (window.ttq) window.ttq.track('SubmitForm')
    setSubmitted(true)
  }

  // ─── SUCCESS STATE ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            We Got Your Request!
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            Thank you, <strong>{form.name}</strong>! Our team will review your custom order and get back to you at{' '}
            <strong>{form.email}</strong> within <strong>24 hours</strong> with a free mockup and quote.
          </p>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8 text-left">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Product:</span>
                <span className="font-medium">{form.productType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quantity:</span>
                <span className="font-medium">{form.quantity} piece{form.quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline:</span>
                <span className="font-medium">{form.deadline || 'Flexible'}</span>
              </div>
              {uploadedFile && (
                <div className="flex justify-between">
                  <span className="text-gray-500">File attached:</span>
                  <span className="font-medium text-yellow-700 truncate max-w-[160px]">{uploadedFile.name}</span>
                </div>
              )}
            </div>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  // ─── MAIN FORM ────────────────────────────────────────────────────────
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

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Step indicator */}
          <div className="flex border-b border-gray-100">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-colors ${
                  step === s ? 'bg-black text-white' : step > s ? 'bg-yellow-400 text-black' : 'text-gray-400'
                }`}
              >
                {step > s ? '✓' : `Step ${s}`}
                <span className="hidden sm:inline"> — {['Order Details', 'Design Info', 'Your Info'][s - 1]}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-12">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="space-y-8">
                <h3 className="font-black text-xl">What are you ordering?</h3>

                {/* Product type */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">Product Type *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {productTypes.map(t => (
                      <button
                        type="button"
                        key={t}
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

                {/* Quantity — free number input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">
                    Number of Pieces *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-48">
                      <input
                        type="number"
                        min="1"
                        max="100000"
                        value={form.quantity}
                        onChange={e => {
                          const val = e.target.value
                          if (val === '' || (Number(val) >= 1 && Number(val) <= 100000)) {
                            update('quantity', val)
                          }
                        }}
                        placeholder="e.g. 25"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-yellow-400 transition-colors pr-16"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                        pcs
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">No minimum — order as few as 1 piece.</p>
                  </div>
                  {/* Quick shortcuts */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[1, 5, 10, 25, 50, 100].map(n => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => update('quantity', String(n))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          form.quantity === String(n)
                            ? 'bg-black text-white border-black'
                            : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <span className="px-3 py-1.5 text-xs text-gray-400">or type any number above ↑</span>
                  </div>
                </div>

                {/* Deadline */}
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
                  onClick={() => {
                    if (!form.productType) { alert('Please select a product type'); return }
                    if (!form.quantity || Number(form.quantity) < 1) { alert('Please enter the number of pieces'); return }
                    setStep(2)
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
                >
                  Next: Design Info <FiArrowRight size={16} />
                </button>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="space-y-8">
                <h3 className="font-black text-xl">Tell us about your design</h3>

                {/* Print method */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">Preferred Print Method</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {printMethods.map(m => (
                      <button
                        type="button"
                        key={m}
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

                {/* Colors */}
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

                {/* Description */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">
                    Describe Your Design / Vision *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    placeholder="Tell us everything! What's the occasion? What message do you want to communicate? Any specific text, images, or ideas?"
                    rows={5}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 resize-none"
                  />
                </div>

                {/* Occasion */}
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

                {/* ── FILE UPLOAD (REAL) ── */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-2">
                    Upload Your Design or Logo
                  </label>

                  {/* Hidden real file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.ai,.svg,.eps,.psd"
                    onChange={handleFileChange}
                    className="hidden"
                    id="logo-upload"
                  />

                  {/* No file selected — show drop zone */}
                  {!uploadedFile && (
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/30 transition-all group"
                    >
                      <FiUpload
                        size={36}
                        className="text-gray-300 group-hover:text-yellow-500 mb-3 transition-colors"
                      />
                      <p className="font-bold text-sm text-gray-700 mb-1">
                        Click here to upload your file
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, PDF, SVG, AI, EPS, PSD — Max 10MB
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold tracking-wider uppercase group-hover:bg-yellow-500 group-hover:text-black transition-all">
                        <FiUpload size={12} /> Browse Files
                      </span>
                      <p className="text-xs text-yellow-600 mt-3 font-medium">
                        No file? Send it later to hello@kandoulcustomz.com
                      </p>
                    </label>
                  )}

                  {/* File selected — show preview */}
                  {uploadedFile && (
                    <div className="border-2 border-yellow-300 bg-yellow-50/40 rounded-2xl p-5 flex items-start gap-4">
                      {/* Thumbnail or icon */}
                      <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                        {uploadPreview ? (
                          <img
                            src={uploadPreview}
                            alt="preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <FiFile size={28} className="text-gray-400" />
                        )}
                      </div>

                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatFileSize(uploadedFile.size)} · {uploadedFile.type || 'Unknown format'}
                        </p>
                        <div className="flex gap-3 mt-3">
                          {/* Replace file */}
                          <label
                            htmlFor="logo-upload"
                            className="text-xs font-bold text-yellow-700 hover:text-yellow-900 cursor-pointer underline"
                          >
                            Replace file
                          </label>
                          {/* Remove file */}
                          <button
                            type="button"
                            onClick={removeFile}
                            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <FiX size={12} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Green check */}
                      <span className="text-emerald-500 text-xl flex-shrink-0 mt-0.5">✓</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-black"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.description) { alert('Please describe your design'); return }
                      setStep(3)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
                  >
                    Next: Your Info <FiArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-black text-xl">Almost there! Tell us who you are</h3>

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

                {/* Summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-4">Order Summary</p>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Product', form.productType],
                      ['Quantity', form.quantity ? `${form.quantity} piece${form.quantity > 1 ? 's' : ''}` : ''],
                      ['Deadline', form.deadline || 'Flexible'],
                      ['File', uploadedFile ? uploadedFile.name : 'None attached'],
                    ].map(([k, v]) => v && (
                      <div key={k} className="flex justify-between">
                        <span className="text-gray-500">{k}:</span>
                        <span className="font-medium truncate max-w-[200px] text-right">{v}</span>
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
                    <li>✓ Your order is delivered in 3-7 business days across the USA</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-black"
                  >
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
