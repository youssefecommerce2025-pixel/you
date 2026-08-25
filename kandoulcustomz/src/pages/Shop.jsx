import { useState } from 'react'
import { products } from '../data/products'
import { FiStar, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <FiStar key={s} size={12}
          className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

function colorToHex(color) {
  const map = {
    'Black': '#0A0A0A', 'White': '#F5F5F0', 'Navy': '#1B2B5E',
    'Olive Green': '#6B7C4A', 'Forest Green': '#2D5A27', 'Brown': '#8B5E3C',
    'Tan': '#D4A47C', 'Cream': '#F5E6D0', 'Red': '#C0392B',
    'Royal Blue': '#2E4DB4', 'Maroon': '#6D1A36', 'Gray': '#9E9E9E',
    'Yellow': '#F5C842', 'Orange': '#E67E22',
  }
  return map[color] || '#CCCCCC'
}

function SizeChart({ chart }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{ background: '#0A0A0A' }}>
            {chart.headers.map(h => (
              <th key={h} className="text-white font-bold px-4 py-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-gray-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProductDetail({ product, addToCart }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedLogo, setSelectedLogo] = useState('')
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  const handleAdd = () => {
    if (!selectedSize) { setError('Please select a size'); return }
    if (!selectedColor) { setError('Please select a color'); return }
    if (product.logos.length > 0 && !selectedLogo) { setError('Please select a logo placement'); return }
    setError('')
    if (product.isCustom) { window.location.href = '/custom-order'; return }
    addToCart({ id: product.id, name: product.name, price: product.price, size: selectedSize, color: selectedColor, logo: selectedLogo || null, emoji: product.emoji })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100" id={product.id}>
      <div className="grid md:grid-cols-2 gap-0">
        {/* Visual */}
        <div className="relative flex items-center justify-center p-12" style={{ background: 'linear-gradient(135deg, #f8f8f8, #f0f0f0)', minHeight: '400px' }}>
          {product.badge && (
            <span className="absolute top-6 left-6 bg-black text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
              {product.badge}
            </span>
          )}
          <span className="text-[120px] hover:scale-105 transition-transform duration-500">{product.emoji}</span>
          {selectedColor && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <div className="bg-white rounded-full px-4 py-2 shadow-sm flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colorToHex(selectedColor) }} />
                <span className="text-xs font-medium text-gray-600">{selectedColor}</span>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-8 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-1">{product.badge}</p>
            <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h2>
            <p className="text-gray-400 italic text-sm mb-3">{product.tagline}</p>
            <div className="flex items-center gap-3">
              <StarRating rating={5} />
              <span className="text-sm text-gray-400">({product.reviews.length} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6 py-4 border-y border-gray-100">
            <span className="text-3xl font-black" style={{ color: '#C9A84C' }}>${product.price}</span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">${product.comparePrice}</span>
            )}
            {product.comparePrice && (
              <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                Save {Math.round((product.comparePrice - product.price) / product.comparePrice * 100)}%
              </span>
            )}
          </div>

          {/* Sizes */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-700">Size</p>
              <button className="text-xs underline text-gray-400" onClick={() => setActiveTab('sizes')}>Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => { setSelectedSize(s); setError('') }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                    selectedSize === s ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
              Color {selectedColor && <span className="text-yellow-600 font-medium normal-case">— {selectedColor}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(c => (
                <button
                  key={c}
                  onClick={() => { setSelectedColor(c); setError('') }}
                  title={c}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedColor === c ? 'border-yellow-400 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: colorToHex(c) }}
                />
              ))}
            </div>
          </div>

          {/* Logo */}
          {product.logos.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Logo Placement</p>
              <div className="flex flex-wrap gap-2">
                {product.logos.map(l => (
                  <button
                    key={l}
                    onClick={() => { setSelectedLogo(l); setError('') }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                      selectedLogo === l ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-xs mb-3">⚠️ {error}</p>}

          {/* Add to cart */}
          <div className="flex gap-3 mt-2">
            {product.isCustom ? (
              <Link to="/custom-order" className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold">
                Start Designing <FiArrowRight size={14} />
              </Link>
            ) : (
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold tracking-widest uppercase text-sm transition-all ${
                  added ? 'bg-green-500 text-white' : 'btn-gold'
                }`}
              >
                {added ? '✓ Added to Cart!' : <><FiShoppingBag size={16} />Add to Cart</>}
              </button>
            )}
          </div>

          {/* Trust micro badges */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100 text-center">
            {[['📦', 'Tracked Delivery', '3-7 business days'], ['↩️', 'Easy Return', '30-day guarantee'], ['🔒', 'Secure Checkout', 'Stripe & PayPal']].map(([icon, title, sub]) => (
              <div key={title}>
                <p className="text-lg">{icon}</p>
                <p className="text-xs font-bold text-gray-700">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-100">
        <div className="flex border-b border-gray-100">
          {[['details', 'Product Details'], ['sizes', 'Size Chart'], ['reviews', `Reviews (${product.reviews.length})`], ['care', 'Care & Shipping']].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-yellow-400 text-black'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-8">
          {activeTab === 'details' && (
            <div>
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-yellow-500 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'sizes' && (
            <div>
              <p className="text-gray-500 text-sm mb-4">Measure yourself and compare to the chart below. When in doubt, size up.</p>
              <SizeChart chart={product.sizeChart} />
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {product.reviews.map((r, i) => (
                <div key={i} className="pb-6 border-b border-gray-50 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">
                        {r.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{r.name}</p>
                        <p className="text-gray-400 text-xs">{r.city}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs">{r.date}</span>
                  </div>
                  <StarRating rating={r.rating} />
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">"{r.text}"</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'care' && (
            <div className="space-y-4">
              <div><p className="font-bold text-sm mb-1">Care Instructions</p><p className="text-gray-500 text-sm">{product.care}</p></div>
              <div><p className="font-bold text-sm mb-1">US Delivery Time</p><p className="text-gray-500 text-sm">Delivered to your door in 3 to 7 business days via USPS/FedEx tracked service. Free shipping applies on all US orders over $75.</p></div>
              <div><p className="font-bold text-sm mb-1">Accepted Payment Methods</p><p className="text-gray-500 text-sm">Stripe (Visa, Mastercard, Amex, Discover), PayPal, Wise, Payoneer, and Apple Pay.</p></div>
              <div><p className="font-bold text-sm mb-1">Returns & Satisfaction</p><p className="text-gray-500 text-sm">Not completely thrilled? We accept returns within 30 days of delivery. Items must be unworn and unwashed. Contact us at hello@julofficial.com or via WhatsApp.</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Shop({ addToCart }) {
  return (
    <div className="pt-52 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-3 block">The Collection</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop JUL
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Every piece is crafted with intention. Premium materials. Bold designs. Your story — worn.
          </p>
        </div>

        {/* Products */}
        <div className="space-y-8">
          {products.map(product => (
            <ProductDetail key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  )
}
