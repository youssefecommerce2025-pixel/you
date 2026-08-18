import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBar from './components/AnnouncementBar'
import CartDrawer from './components/CartDrawer'
import EmailPopup from './components/EmailPopup'
import Home from './pages/Home'
import Shop from './pages/Shop'
import CustomOrder from './pages/CustomOrder'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import PaymentMethods from './pages/PaymentMethods'
import ThankYou from './pages/ThankYou'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('kc_cart')
    if (saved) setCart(JSON.parse(saved))
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('kc_popup_dismissed')
      if (!dismissed) setShowPopup(true)
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('kc_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(
        i => i.id === product.id && i.size === product.size && i.color === product.color && i.logo === product.logo
      )
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.size === product.size && i.color === product.color && i.logo === product.logo
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setCartOpen(true)
    if (window.fbq) fbq('track', 'AddToCart', { content_name: product.name, value: product.price, currency: 'USD' })
    if (window.ttq) ttq.track('AddToCart', { content_name: product.name, value: product.price, currency: 'USD' })
  }

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const updateQty = (index, qty) => {
    if (qty < 1) { removeFromCart(index); return }
    setCart(prev => prev.map((item, i) => i === index ? { ...item, qty } : item))
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <BrowserRouter>
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
      {showPopup && (
        <EmailPopup onClose={() => {
          setShowPopup(false)
          localStorage.setItem('kc_popup_dismissed', '1')
        }} />
      )}
      <main>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
