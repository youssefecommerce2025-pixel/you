import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiLock, FiShield } from 'react-icons/fi'
import { productAsset } from '../data/products'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME',
  'MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
  'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

const inputClass = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition-colors bg-white'

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function Checkout({ cart, total }) {
  const location = useLocation()
  const [giftBox, setGiftBox] = useState(Boolean(location.state?.giftBox))
  const [rush, setRush] = useState(Boolean(location.state?.rush))
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const shipping = total >= 75 ? 0 : 7.99
  const finalTotal = total + shipping + (giftBox ? 4.99 : 0) + (rush ? 3.99 : 0)
  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return 'Enter your first and last name.'
    if (!form.address.trim()) return 'Enter your street address.'
    if (!form.city.trim()) return 'Enter your city.'
    if (!form.state) return 'Select your state.'
    if (!/^\d{5}(-\d{4})?$/.test(form.postalCode.trim())) return 'Enter a valid US ZIP code.'
    const digits = form.phone.replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 15) return 'Enter a valid phone number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email address.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }
    setError('')

    const endpoint = import.meta.env.VITE_CHECKOUT_ENDPOINT
    if (!endpoint) {
      setError('Stripe is not connected yet. Your Stripe secret key must be added on the checkout server first.')
      return
    }

    setSubmitting(true)
    const base = import.meta.env.BASE_URL || '/'
    const origin = window.location.origin

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            qty: item.qty,
            size: item.size,
            color: item.color,
            logo: item.logo,
          })),
          giftBox,
          rush,
          customer: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state,
            postalCode: form.postalCode.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
          },
          successUrl: `${origin}${base}thank-you?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}${base}checkout`,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Could not start Stripe checkout')
      }
      window.location.assign(data.url)
    } catch (err) {
      setSubmitting(false)
      setError(err.message || 'Could not start Stripe checkout')
    }
  }

  if (!cart.length) {
    return (
      <div className="pt-52 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h1 className="text-3xl font-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Choose a size, color, and logo, then come back here to enter your delivery details.</p>
          <Link to="/shop" className="btn-gold inline-flex px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase">Shop Collection</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-52 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-3 block">Delivery details</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Where should we send it?
          </h1>
          <p className="text-gray-500 max-w-xl">
            Enter your name, address, ZIP code, phone, and email. Payment opens only after this step.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name *">
                <input className={inputClass} value={form.firstName} onChange={set('firstName')} autoComplete="given-name" placeholder="Alex" required />
              </Field>
              <Field label="Last name *">
                <input className={inputClass} value={form.lastName} onChange={set('lastName')} autoComplete="family-name" placeholder="Johnson" required />
              </Field>
            </div>
            <Field label="Street address *">
              <input className={inputClass} value={form.address} onChange={set('address')} autoComplete="address-line1" placeholder="123 Main Street" required />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="City *">
                <input className={inputClass} value={form.city} onChange={set('city')} autoComplete="address-level2" placeholder="Atlanta" required />
              </Field>
              <Field label="State *">
                <select className={inputClass} value={form.state} onChange={set('state')} autoComplete="address-level1" required>
                  <option value="">Select</option>
                  {US_STATES.map((code) => <option key={code} value={code}>{code}</option>)}
                </select>
              </Field>
              <Field label="ZIP code *">
                <input className={inputClass} value={form.postalCode} onChange={set('postalCode')} autoComplete="postal-code" inputMode="numeric" placeholder="30301" required />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone *">
                <input className={inputClass} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="(404) 555-0199" required />
              </Field>
              <Field label="Email *">
                <input className={inputClass} type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="alex@email.com" required />
              </Field>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full font-black tracking-widest uppercase text-xs btn-gold flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
            >
              <FiLock size={14} />
              {submitting ? 'Opening secure payment...' : `Continue to payment — $${finalTotal.toFixed(2)}`}
            </button>
            <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
              <FiShield className="text-emerald-500" /> Card details are entered on Stripe, not on this page.
            </p>
          </div>

          <aside className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-black text-lg">Your order</h2>
            <div className="divide-y divide-gray-100">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 py-3">
                  <div className="w-14 h-14 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {item.image ? <img src={productAsset(item.image)} alt="" className="w-full h-full object-cover" /> : <span>{item.emoji || '👕'}</span>}
                  </div>
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="font-bold truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{[item.size, item.color, item.logo].filter(Boolean).join(' · ')} · Qty {item.qty}</p>
                  </div>
                  <span className="text-sm font-bold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={giftBox} onChange={(e) => setGiftBox(e.target.checked)} className="mt-1 accent-yellow-600" />
              <span><span className="font-bold">Premium Gift Box & Bow</span> <span className="text-yellow-700">+$4.99</span></span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} className="mt-1 accent-yellow-600" />
              <span><span className="font-bold">Priority Rush Production</span> <span className="text-yellow-700">+$3.99</span></span>
            </label>
            <div className="space-y-1 text-sm border-t border-gray-100 pt-3">
              <div className="flex justify-between text-gray-500"><span>Items</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500">
                <span>US shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-black text-base pt-2">
                <span>Total</span>
                <span style={{ color: '#C9A84C' }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/shop" className="block text-center text-xs text-gray-400 hover:text-black">Back to shop</Link>
          </aside>
        </form>
      </div>
    </div>
  )
}
