import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi'
import { photosForColor, products } from '../data/products'
import { unitsLeft, useAvailability } from '../data/availability'
import ProductGallery from './ProductGallery'

function ProductCard({ product, addToCart }) {
  const navigate = useNavigate()
  const stock = useAvailability()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(
    product.colorPhotos ? product.colors[0] : (product.colors?.length === 1 ? product.colors[0] : '')
  )
  const [selectedLogo, setSelectedLogo] = useState('')
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const inStock = (color, size) => (unitsLeft(stock, product.id, color, size) || 0) > 0
  const colorHasStock = product.sizes.some((size) => inStock(selectedColor, size))
  const selectedInStock = Boolean(selectedSize) && inStock(selectedColor, selectedSize)

  useEffect(() => {
    if (!stock.ready || !selectedSize) return
    if ((unitsLeft(stock, product.id, selectedColor, selectedSize) || 0) <= 0) setSelectedSize('')
  }, [stock, selectedColor, selectedSize, product.id])

  const handleAdd = () => {
    if (!stock.ready) { setError('Checking availability. Please try again.'); return }
    if (!selectedSize) { setError('Please select a size'); return }
    if (!selectedColor) { setError('Please select a color'); return }
    if (!selectedInStock) { setError('This color and size is sold out.'); return }
    if (product.logos.length > 0 && !selectedLogo) { setError('Please select a logo placement'); return }
    setError('')

    if (product.isCustom) {
      navigate('/custom-order')
      return
    }

    const result = addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      logo: selectedLogo || null,
      emoji: product.emoji,
      image: photosForColor(product, selectedColor)[0],
    })
    if (result?.error) { setError(result.error); return }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
      {/* Product image area */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%)', height: '280px' }}>
        {product.badge && (
          <span className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-black px-3 py-1.5 rounded-full tracking-widest uppercase">
            {product.badge}
          </span>
        )}
        {product.comparePrice && (
          <span className="absolute top-4 right-4 z-10 rounded-full text-xs font-bold px-3 py-1.5 tracking-wide" style={{ background: 'linear-gradient(135deg, #CC3731, #E2574C)', color: '#FFFFFF' }}>
            Save ${(product.comparePrice - product.price).toFixed(0)}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {photosForColor(product, selectedColor).length ? (
            <ProductGallery images={photosForColor(product, selectedColor)} alt={`${product.name} ${selectedColor || ''}`} compact />
          ) : (
            <span className="text-9xl group-hover:scale-110 transition-transform duration-500">
              {product.emoji}
            </span>
          )}
        </div>
        {/* Color preview dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {product.colors.slice(0, 5).map(c => (
            <div
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`w-4 h-4 rounded-full border-2 cursor-pointer transition-transform hover:scale-125 ${selectedColor === c ? 'border-red-500 scale-125' : 'border-transparent'}`}
              style={{ backgroundColor: colorToHex(c) }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Product info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-black text-lg leading-tight">{product.name}</h3>
            <p className="text-gray-400 text-sm mt-0.5 italic">{product.tagline}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="font-black text-xl" style={{ color: '#CC3731' }}>${product.price}</p>
            {product.comparePrice && (
              <p className="text-gray-400 text-sm line-through">${product.comparePrice}</p>
            )}
          </div>
        </div>

        {/* Size selector */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-600">Size</p>
            <Link to={`/shop#${product.id}-sizes`} className="text-xs underline text-gray-400 hover:text-black">Size Guide</Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map(size => {
              const ok = inStock(selectedColor, size)
              return (
                <button
                  key={size}
                  type="button"
                  disabled={!stock.ready || !ok}
                  onClick={() => { setSelectedSize(size); setError('') }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    !ok
                      ? 'border-gray-100 text-gray-300 line-through cursor-not-allowed'
                      : selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 text-gray-600 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
          {stock.ready && !colorHasStock && <p className="text-red-600 text-xs mt-1.5">Sold out</p>}
        </div>

        {/* Color selector */}
        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-1.5">
            Color {selectedColor && <span className="text-red-600 font-medium normal-case">— {selectedColor}</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map(color => {
              const ok = product.sizes.some((size) => inStock(color, size))
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => { setSelectedColor(color); setError('') }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedColor === color ? 'border-red-500 scale-110' : 'border-transparent'
                  } ${ok ? '' : 'opacity-40'}`}
                  style={{ backgroundColor: colorToHex(color) }}
                  title={ok ? color : `${color} — sold out`}
                />
              )
            })}
          </div>
        </div>

        {/* Logo selector */}
        {product.logos.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-1.5">Logo Placement</p>
            <div className="flex flex-wrap gap-1.5">
              {product.logos.map(logo => (
                <button
                  key={logo}
                  onClick={() => { setSelectedLogo(logo); setError('') }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    selectedLogo === logo
                      ? 'bg-black text-white border-black'
                      : 'border-gray-200 text-gray-600 hover:border-black'
                  }`}
                >
                  {logo}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && <p className="text-red-500 text-xs mb-3 font-medium">⚠️ {error}</p>}

        {/* Add to cart / Custom CTA */}
        <div className="mt-auto pt-2">
          {product.isCustom ? (
            <Link
              to="/custom-order"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
            >
              Start Designing <FiArrowRight size={14} />
            </Link>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!stock.ready || (stock.ready && (!colorHasStock || (selectedSize && !selectedInStock)))}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-300 disabled:opacity-50 ${
                added
                  ? 'bg-green-500 text-white'
                  : 'btn-gold'
              }`}
            >
              {!stock.ready ? 'Checking availability...' : (!colorHasStock || (selectedSize && !selectedInStock)) ? 'Sold out' : added ? '✓ Added to Cart!' : (
                <><FiShoppingBag size={14} /> Add to Cart</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function colorToHex(color) {
  const map = {
    'Black': '#0A0A0A',
    'White': '#F5F5F0',
    'Navy': '#1B2B5E',
    'Olive Green': '#6B7C4A',
    'Forest Green': '#2D5A27',
    'Brown': '#8B5E3C',
    'Tan': '#D4A47C',
    'Mustard': '#C4A06A',
    'Camel': '#C4A06A',
    'Heather': '#D8D8D8',
    'Ash Grey': '#D8D8D8',
    'Grey': '#A3A3A3',
    'Slate': '#6E6E6E',
    'Olive Military': '#5F6840',
    'Olive': '#6B7344',
    'Espresso': '#6A5344',
    'Cream': '#F5E6D0',
    'Red': '#C0392B',
    'Royal Blue': '#2E4DB4',
    'Maroon': '#6D1A36',
    'Gray': '#9E9E9E',
    'Yellow': '#F5C842',
    'Orange': '#E67E22',
  }
  return map[color] || '#CCCCCC'
}

export default function FeaturedProducts({ addToCart }) {
  return (
    <section className="section-padding bg-gray-50" id="products">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3 block">Our Collection</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Wear What You Mean
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Each piece tells a story. Whether it's our signature Je Suis Là hoodie or a completely custom creation — quality and meaning are always stitched in.
          </p>
        </div>

        {/* Products grid */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-black"
          >
            View Full Collection <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
