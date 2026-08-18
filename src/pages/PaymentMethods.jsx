import { Link } from 'react-router-dom'
import { FiShield, FiLock, FiCheckCircle, FiCreditCard, FiGlobe, FiHelpCircle, FiArrowRight } from 'react-icons/fi'
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaPaypal, FaApplePay, FaGooglePay } from 'react-icons/fa'
import { SiStripe, SiWise } from 'react-icons/si'

const paymentGateways = [
  {
    name: 'Stripe',
    badge: 'Primary Credit / Debit Gateway',
    tagline: 'Global Industry Gold Standard for Secure Transactions',
    description: 'We process all major credit and debit cards through Stripe with 256-bit bank-grade SSL encryption. Your financial information never touches our servers.',
    supportedCards: ['Visa', 'Mastercard', 'American Express', 'Discover', 'JCB', 'Diners Club'],
    features: ['Instant 1-click checkout', '3D Secure 2.0 fraud protection', 'Zero hidden transaction fees'],
    color: '#635BFF',
    textColor: 'text-white'
  },
  {
    name: 'PayPal',
    badge: 'Buyer Protection Enabled',
    tagline: 'Fast, Safe & Worldwide Trusted Wallet',
    description: 'Pay instantly with your PayPal balance, linked bank account, or PayPal Credit. Enjoy full PayPal Buyer Protection on every single purchase.',
    supportedCards: ['PayPal Balance', 'Pay in 4 (Interest-Free)', 'Linked Bank Accounts'],
    features: ['PayPal 180-Day Buyer Protection', 'No need to re-enter card numbers', 'Supports multi-currency conversion'],
    color: '#003087',
    textColor: 'text-white'
  },
  {
    name: 'Wise (TransferWise)',
    badge: 'Low-Fee International & Bank Transfers',
    tagline: 'Direct Mid-Market Rate Transfers for Bulk & Custom Invoices',
    description: 'Ideal for custom corporate bulk orders, wholesale accounts, and international customers. Pay directly with local US banking details (ACH wire) at zero markup.',
    supportedCards: ['USD Wire / ACH', 'EUR / GBP / CAD Direct Transfer', 'Multi-Currency Account'],
    features: ['Lowest exchange fee guarantee', 'Instant proof of payment', 'Perfect for B2B & wholesale orders >$500'],
    color: '#9FE870',
    textColor: 'text-gray-950'
  },
  {
    name: 'Payoneer',
    badge: 'Global Commercial & Direct Billing',
    tagline: 'Seamless Cross-Border Business Payments',
    description: 'We accept direct Payoneer account-to-account balance transfers and custom invoices for business partnerships, influencers, and custom drops.',
    supportedCards: ['Payoneer Balance Transfer', 'Global Bank Transfer Network', 'Virtual US Bank Receiving Account'],
    features: ['Zero transfer fees between Payoneer accounts', 'Commercial invoice generation', 'Direct B2B payment confirmation'],
    color: '#FF4800',
    textColor: 'text-white'
  },
  {
    name: 'Apple Pay & Google Pay',
    badge: 'Mobile 1-Touch Express',
    tagline: 'Biometric TouchID / FaceID Instant Checkout',
    description: 'Speed through checkout on Safari or Chrome with a single tap using Apple Pay or Google Wallet on iOS and Android devices.',
    supportedCards: ['Apple Cash', 'All Stored Mobile Cards', 'Google Wallet'],
    features: ['Face ID / Touch ID authentication', 'Fastest mobile checkout experience', 'Dynamic CVV tokenization'],
    color: '#111111',
    textColor: 'text-white'
  }
]

export default function PaymentMethods() {
  return (
    <div className="pt-36 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold uppercase tracking-widest mb-4">
            <FiLock className="text-yellow-600" /> 100% Encrypted & PCI-DSS Level 1 Certified
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-950 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Accepted Payment Methods
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            At Kandoul Customz, your security and convenience are our top priorities. We support the most trusted, fraud-protected payment gateways worldwide.
          </p>
        </div>

        {/* Major Brand Logos Banner */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center mb-6">
            Supported Card Networks & Digital Wallets
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-3xl sm:text-4xl text-gray-700">
            <span title="Visa" className="hover:text-blue-600 transition-colors"><FaCcVisa /></span>
            <span title="Mastercard" className="hover:text-red-500 transition-colors"><FaCcMastercard /></span>
            <span title="American Express" className="hover:text-blue-500 transition-colors"><FaCcAmex /></span>
            <span title="Discover" className="hover:text-orange-500 transition-colors"><FaCcDiscover /></span>
            <span title="PayPal" className="hover:text-blue-700 transition-colors"><FaPaypal /></span>
            <span title="Apple Pay" className="hover:text-black transition-colors"><FaApplePay /></span>
            <span title="Google Pay" className="hover:text-green-600 transition-colors"><FaGooglePay /></span>
            <span title="Stripe" className="text-2xl font-bold flex items-center gap-1 text-indigo-600"><SiStripe size={32} /></span>
            <span title="Wise" className="text-2xl font-bold flex items-center gap-1 text-emerald-600"><SiWise size={32} /></span>
          </div>
        </div>

        {/* Detailed Gateway Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {paymentGateways.map((gw, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider" style={{ backgroundColor: gw.color, color: gw.textColor.includes('white') ? '#FFFFFF' : '#0A0A0A' }}>
                    {gw.name}
                  </div>
                  <span className="text-xs font-semibold text-gray-400">{gw.badge}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{gw.tagline}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{gw.description}</p>
                
                <div className="space-y-2 mb-6">
                  {gw.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                      <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-50 pt-4">
                <p className="text-xs text-gray-400 font-medium mb-2">Accepted via {gw.name}:</p>
                <div className="flex flex-wrap gap-1.5">
                  {gw.supportedCards.map((c, i) => (
                    <span key={i} className="text-[11px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom B2B / Wise / Payoneer Instructions for Bulk Custom Orders */}
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-16 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-yellow-400 mb-2 block">
              Direct Invoice & B2B Orders
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ordering in Bulk or Prefer Direct Bank / Wise / Payoneer Invoicing?
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
              For custom design runs exceeding $300, team uniforms, corporate gifts, or international wire transfers, we generate an official commercial invoice with direct payment links for Stripe, Wise, or Payoneer upon design approval.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/custom-order"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-xs btn-gold"
              >
                Request Custom Order Invoice <FiArrowRight size={14} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-xs border border-white/20 hover:border-yellow-400 text-white transition-all"
              >
                Inquire via Email / WhatsApp
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Security Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-950 mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Payment & Security FAQ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiLock className="text-yellow-600" /> Is it safe to enter my card details?
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Yes, 100%. All card transactions are tokenized and processed via Stripe’s PCI-DSS Level 1 compliant infrastructure. We never store or see your raw credit card numbers.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiCreditCard className="text-yellow-600" /> When is my card charged?
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your payment is authorized and charged immediately upon placing your order so our production artisans can start hand-crafting your items without delay.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiGlobe className="text-yellow-600" /> Can I pay in foreign currencies?
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                All prices on the storefront are shown in US Dollars ($ USD). However, Stripe, PayPal, Wise, and Payoneer will automatically convert your local currency at real-time bank exchange rates.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiHelpCircle className="text-yellow-600" /> What if I need a refund?
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Approved refunds are processed back to your original payment method (Stripe, PayPal, Wise) within 3 to 5 business days, in accordance with our 30-day satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
