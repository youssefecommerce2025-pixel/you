import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { TRACKED_IDS, unitsLeft, useAvailability, variantKey } from './data/availability'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBar from './components/AnnouncementBar'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import PaymentMethods from './pages/PaymentMethods'
import ThankYou from './pages/ThankYou'
import Checkout from './pages/Checkout'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const stock = useAvailability()
  const cartRef = useRef(cart)
  cartRef.current = cart

  useEffect(() => {
    const saved = localStorage.getItem('kc_cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('kc_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    const prev = cartRef.current
    if (TRACKED_IDS.has(product.id)) {
      const left = unitsLeft(stock, product.id, product.color, product.size)
      if (left === null) return { error: 'Checking availability. Please try again.' }
      const key = variantKey(product.id, product.color, product.size)
      const used = prev
        .filter((item) => variantKey(item.id, item.color, item.size) === key)
        .reduce((sum, item) => sum + item.qty, 0)
      if (used + 1 > left) {
        return { error: left <= 0 ? 'This color and size is sold out.' : 'That quantity is no longer available.' }
      }
    }
    const existing = prev.find(
      (item) => item.id === product.id && item.size === product.size && item.color === product.color && item.logo === product.logo
    )
    const next = existing
      ? prev.map((item) => (
        item.id === product.id && item.size === product.size && item.color === product.color && item.logo === product.logo
          ? { ...item, qty: item.qty + 1 }
          : item
      ))
      : [...prev, { ...product, qty: 1 }]
    cartRef.current = next
    setCart(next)
    setCartOpen(true)
    if (window.fbq) fbq('track', 'AddToCart', { content_name: product.name, value: product.price, currency: 'USD' })
    if (window.ttq) ttq.track('AddToCart', { content_name: product.name, value: product.price, currency: 'USD' })
    return { ok: true }
  }

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const updateQty = (index, qty) => {
    const prev = cartRef.current
    if (qty < 1) {
      cartRef.current = prev.filter((_, i) => i !== index)
      setCart(cartRef.current)
      return
    }
    const item = prev[index]
    if (!item) return
    if (TRACKED_IDS.has(item.id) && stock.ready) {
      const key = variantKey(item.id, item.color, item.size)
      const left = unitsLeft(stock, item.id, item.color, item.size) ?? 0
      const others = prev.reduce((sum, entry, i) => (
        i !== index && variantKey(entry.id, entry.color, entry.size) === key ? sum + entry.qty : sum
      ), 0)
      if (others + qty > left) return
    }
    cartRef.current = prev.map((entry, i) => i === index ? { ...entry, qty } : entry)
    setCart(cartRef.current)
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'
  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
        total={cartTotal}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} />} />
          <Route path="/custom-order" element={<Navigate to="/shop" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/checkout" element={<Checkout cart={cart} total={cartTotal} />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
