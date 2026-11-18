import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CartDrawer } from './components/CartDrawer'
import { AddedToast, Footer, WhatsAppFab } from './components/Footer'
import { Header, MobileTabBar } from './components/Header'
import { SearchOverlay } from './components/SearchOverlay'
import { loadCatalog } from './lib/catalog'
import { I18nProvider } from './lib/i18n'
import { StoreProvider } from './lib/store'
import { Collection } from './pages/Collection'
import { Home } from './pages/Home'
import { NotFound, OrderSuccess, Wishlist } from './pages/Misc'
import { PackBuilder } from './pages/PackBuilder'
import { ProductPage } from './pages/ProductPage'
import { Quiz } from './pages/Quiz'

loadCatalog()

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function Shell() {
  const [search, setSearch] = useState<{ open: boolean; q: string }>({ open: false, q: '' })
  const openSearch = useCallback((q = '') => setSearch({ open: true, q }), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSearch])

  return (
    <>
      <ScrollToTop />
      <Header onSearch={() => openSearch()} />
      <main className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<Home onSearch={openSearch} />} />
          <Route path="/collection/:handle" element={<Collection />} />
          <Route path="/collections/:handle" element={<Collection />} />
          <Route path="/produit/:handle" element={<ProductPage />} />
          <Route path="/products/:handle" element={<ProductPage />} />
          <Route path="/pack" element={<PackBuilder />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/favoris" element={<Wishlist />} />
          <Route path="/merci/:id" element={<OrderSuccess />} />
          <Route path="/collection" element={<Navigate to="/collection/tous" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileTabBar onSearch={() => openSearch()} />
      <WhatsAppFab />
      <AddedToast />
      <CartDrawer />
      <SearchOverlay open={search.open} initial={search.q} onClose={() => setSearch({ open: false, q: '' })} />
    </>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <StoreProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </StoreProvider>
    </I18nProvider>
  )
}
