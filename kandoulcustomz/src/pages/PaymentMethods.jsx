import { FiLock, FiCheckCircle, FiCreditCard, FiGlobe, FiHelpCircle } from 'react-icons/fi'
import { SiStripe } from 'react-icons/si'

const features = [
  'Checkout opens on Stripe',
  'Card details stay on Stripe',
  'US dollars only',
]

export default function PaymentMethods() {
  return (
    <div className="pt-52 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-widest mb-4">
            <FiLock className="text-red-600" /> 100% Encrypted & PCI-DSS Level 1 Certified
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-950 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Payment by Stripe
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Sales are for the United States only. The only accepted payment method is Stripe, in US dollars.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white" style={{ backgroundColor: '#635BFF' }}>
              <SiStripe size={16} /> Stripe
            </div>
            <span className="text-xs font-semibold text-gray-400">Only payment method</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Secure checkout in US dollars</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            After you enter your delivery details, payment opens on Stripe. Your card information never touches our servers.
          </p>
          <div className="space-y-2">
            {features.map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-xs text-gray-700">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-950 mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Payment & Security FAQ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiLock className="text-red-600" /> Is it safe to pay?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Yes. Payment runs on Stripe’s PCI-DSS Level 1 infrastructure. We never store or see your card number.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiCreditCard className="text-red-600" /> When is my card charged?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Stripe charges the card when you complete checkout.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiGlobe className="text-red-600" /> Which currency do you accept?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Payment is accepted in US dollars only, and only through Stripe. Sales are authorized in the United States only.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiHelpCircle className="text-red-600" /> Can I return a product?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Returns are not possible. In a case of force majeure, email customer service at contact@jesuisla.us.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
