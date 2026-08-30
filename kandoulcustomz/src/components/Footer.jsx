import { Link } from 'react-router-dom'
import Logo from './Logo'
import { FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: '#0A0A0A' }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Logo size="sm" />
            <p className="text-white/40 text-sm mt-4 leading-relaxed max-w-xs">
              Premium hoodies & statement pieces. Made with purpose, delivered with love. Across the USA.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors">
                <FiInstagram size={18} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.78a8.18 8.18 0 004.78 1.54V6.87a4.85 4.85 0 01-1.02-.18z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors">
                <FiYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                { to: '/shop', label: 'All Products' },
                { to: '/shop#jsl-hoodie', label: 'Je Suis Là Hoodie' },
                { to: '/shop#custom-hoodie', label: 'Custom Hoodie' },
                { to: '/custom-order', label: 'Custom Orders' },
                { to: '/custom-order', label: 'Corporate Orders' },
                { to: '/custom-order', label: 'Gift Packages' },
              ].map(link => (
                <li key={link.to + link.label}>
                  <Link to={link.to} className="text-white/40 hover:text-yellow-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { to: '/about', label: 'Our Story' },
                { to: '/payment-methods', label: 'Payment Methods' },
                { to: '/faq', label: 'FAQ' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/faq#shipping', label: 'Delivery & Shipping' },
                { to: '/faq#returns', label: 'Returns & Guarantee' },
                { to: '/faq#sizing', label: 'Size Guide' },
              ].map(link => (
                <li key={link.to + link.label}>
                  <Link to={link.to} className="text-white/40 hover:text-yellow-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-3 text-white/40 text-sm">
              <li>📧 <a href="mailto:hello@julofficial.com" className="hover:text-yellow-400 transition-colors">hello@julofficial.com</a></li>
              <li>📱 <a href="tel:+1-555-000-0000" className="hover:text-yellow-400 transition-colors">+1 (555) 000-0000</a></li>
              <li>🕐 Mon-Fri: 9am – 6pm EST</li>
              <li className="pt-2">
                <Link
                  to="/custom-order"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', color: '#0A0A0A' }}
                >
                  Start Custom Order
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <Link to="/payment-methods" className="text-white/40 hover:text-yellow-400 text-xs font-medium px-3 py-1 border border-white/10 rounded-full transition-colors">
              🔒 Stripe Verified
            </Link>
            <Link to="/payment-methods" className="text-white/40 hover:text-yellow-400 text-xs font-medium px-3 py-1 border border-white/10 rounded-full transition-colors">
              💳 Visa / Mastercard / Amex
            </Link>
            <Link to="/payment-methods" className="text-white/40 hover:text-yellow-400 text-xs font-medium px-3 py-1 border border-white/10 rounded-full transition-colors">
              🅿️ PayPal Protected
            </Link>
            <Link to="/payment-methods" className="text-white/40 hover:text-yellow-400 text-xs font-medium px-3 py-1 border border-white/10 rounded-full transition-colors">
              🍎 Apple Pay & Google Pay
            </Link>
          </div>
          <p className="text-white/20 text-xs text-center">
            © {year} JUL. All rights reserved.
          </p>
        </div>
      </div>

      {/* Legal links */}
      <div className="border-t border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map(l => (
            <a key={l} href="#" className="text-white/20 hover:text-white/40 text-xs transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
