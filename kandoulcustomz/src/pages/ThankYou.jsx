import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiCheckCircle, FiPackage, FiTruck, FiClock, FiMessageCircle, FiArrowRight, FiShield, FiShoppingBag } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function ThankYou() {
  const [searchParams] = useSearchParams()
  const [orderNumber, setOrderNumber] = useState('')
  const [orderTotal, setOrderTotal] = useState('$55.00')

  useEffect(() => {
    // Generate or grab dynamic order reference
    const ref = searchParams.get('ref') || `KC-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderNumber(ref)
    const amount = searchParams.get('total')
    if (amount) setOrderTotal(`$${parseFloat(amount).toFixed(2)}`)

    // Track purchase event for Meta & TikTok Pixels
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: amount ? parseFloat(amount) : 55.0,
        currency: 'USD',
        content_name: 'JUL Order'
      })
    }
    if (window.ttq) {
      window.ttq.track('CompletePayment', {
        value: amount ? parseFloat(amount) : 55.0,
        currency: 'USD',
        content_id: ref
      })
    }
  }, [searchParams])

  // WhatsApp support phone number (international format)
  const whatsappNumber = "+15550192834" // Replace with real WhatsApp Business number
  const whatsappMessage = encodeURIComponent(`Hello JUL Team! I just placed order #${orderNumber} and wanted to check my order status / ask a question.`)
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`

  return (
    <div className="pt-52 pb-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center mb-8 relative overflow-hidden">
          
          {/* Top Gold Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />

          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-500 rounded-full mb-6 ring-8 ring-green-50/50">
            <FiCheckCircle size={44} className="stroke-[2.5]" />
          </div>

          <span className="text-xs font-extrabold uppercase tracking-widest text-yellow-600 mb-2 block">
            Payment Confirmed • Receipt # {orderNumber}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Thank You for Your Order!
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            Your payment has been successfully accepted and secured. We are now hand-preparing your custom pieces with the utmost care.
          </p>

          {/* Key Delivery Promise Box */}
          <div className="bg-amber-50/70 border-2 border-amber-200/80 rounded-2xl p-6 mb-8 text-left max-w-2xl mx-auto shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center flex-shrink-0 text-xl font-bold shadow-md">
                📦
              </div>
              <div>
                <h3 className="font-extrabold text-amber-950 text-base sm:text-lg mb-1 flex items-center gap-2">
                  Estimated Delivery: 3 to 7 Business Days
                </h3>
                <p className="text-amber-900/80 text-sm leading-relaxed">
                  Depending on your exact US delivery address and state location, your package will arrive safely at your doorstep within <strong>3 to 7 business days</strong>. A live USPS/FedEx tracking link will be emailed as soon as your package ships.
                </p>
              </div>
            </div>
          </div>

          {/* WHATSAPP CUSTOMER CARE DIRECT CTA */}
          <div className="bg-emerald-900 text-white rounded-2xl p-6 max-w-2xl mx-auto shadow-lg mb-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <FaWhatsapp size={22} className="text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Instant VIP Support</span>
                </div>
                <h4 className="text-lg font-black text-white">Have a Question About Your Order?</h4>
                <p className="text-emerald-100/80 text-xs sm:text-sm">Connect with our dedicated US customer support team directly on WhatsApp for real-time order updates.</p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs uppercase tracking-wider rounded-full transition-all shadow-md hover:scale-105 flex-shrink-0"
              >
                <FaWhatsapp size={18} />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Next Steps Timeline */}
          <div className="border-t border-gray-100 pt-8 max-w-2xl mx-auto">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">
              What Happens Next?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-yellow-600 font-black text-sm mb-1">01. Order Review</div>
                <p className="text-xs text-gray-600">Confirmation email sent to your inbox with your detailed item summary.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-yellow-600 font-black text-sm mb-1">02. Custom Crafting</div>
                <p className="text-xs text-gray-600">Our artisans print or embroider your pieces on 100% premium cotton.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-yellow-600 font-black text-sm mb-1">03. Fast US Dispatch</div>
                <p className="text-xs text-gray-600">Shipped with tracked express service. Delivery in 3-7 business days.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-xs btn-gold"
            >
              <FiShoppingBag size={16} />
              Continue Shopping
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-xs btn-black"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Security & Guarantee Note */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 text-center">
          <span className="flex items-center gap-1.5">
            <FiShield className="text-green-600" /> 100% Satisfaction Guarantee
          </span>
          <span className="flex items-center gap-1.5">
            <FiTruck className="text-yellow-600" /> Tracked US Shipping
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock className="text-blue-600" /> 30-Day Hassle-Free Returns
          </span>
        </div>

      </div>
    </div>
  )
}
