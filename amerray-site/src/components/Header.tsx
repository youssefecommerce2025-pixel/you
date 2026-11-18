import { AnimatePresence, motion } from 'framer-motion'
import { Gift, Heart, Home, Menu, Search, ShoppingBag, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { WHATSAPP_DISPLAY } from '../lib/catalog'
import { useI18n, type TKey } from '../lib/i18n'
import { useStore } from '../lib/store'
import { waLink } from '../lib/whatsapp'
import { Logo, WhatsAppIcon } from './ui'

export const NAV: { to: string; key: TKey }[] = [
  { to: '/collection/homme', key: 'nav.men' },
  { to: '/collection/femme', key: 'nav.women' },
  { to: '/collection/unisexe', key: 'nav.unisex' },
  { to: '/collection/arabic', key: 'nav.arabic' },
  { to: '/collection/niche', key: 'nav.niche' },
  { to: '/collection/packs', key: 'nav.packs' },
  { to: '/collection/musc-bakhour', key: 'nav.musc' },
]

export const UNIVERSE: { to: string; key: TKey }[] = [
  { to: '/collection/pack-homme', key: 'nav.packHomme' },
  { to: '/collection/pack-femme', key: 'nav.packFemme' },
  { to: '/collection/bakhour-oud', key: 'nav.bakhour' },
  { to: '/collection/musc', key: 'nav.muscTahara' },
  { to: '/collection/kids', key: 'nav.kids' },
  { to: '/collection/maison-voiture', key: 'nav.maison' },
  { to: '/collection/body-hair', key: 'nav.body' },
  { to: '/collection/bougies', key: 'nav.candle' },
]

const MORE_NAV: { to: string; key: TKey }[] = [
  { to: '/collection/best-sellers', key: 'nav.best' },
  { to: '/collection/tous', key: 'nav.all' },
  ...UNIVERSE,
]

function AnnouncementBar() {
  const { t } = useI18n()
  const items: TKey[] = ['announce.1', 'announce.2', 'announce.3', 'announce.4']
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((k) => (
        <span key={k} className="flex items-center gap-8 px-8">
          <span>{t(k)}</span>
          <span className="size-1 rounded-full bg-gold" />
        </span>
      ))}
    </div>
  )
  return (
    <div className="relative overflow-hidden bg-ink py-2.5 text-[12px] font-medium tracking-wide text-white/85" dir="ltr">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  )
}

export function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n()
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
      className={`rounded-full border border-current/20 px-3 py-1.5 text-[12px] font-semibold transition hover:border-current/60 ${className}`}
      style={{ fontFamily: lang === 'fr' ? 'Tajawal' : 'Inter Variable' }}
    >
      {t('common.language')}
    </button>
  )
}

export function Header({ onSearch }: { onSearch: () => void }) {
  const { t, lang } = useI18n()
  const offscreen = lang === 'ar' ? '100%' : '-100%'
  const { totals, lines, setCartOpen, wishlist } = useStore()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const overHero = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          overHero ? 'bg-ink text-white' : 'border-b border-ink/5 bg-stone/80 text-ink backdrop-blur-xl backdrop-saturate-150'
        }`}
      >
        <div className="container-x flex h-[68px] items-center gap-4 lg:h-[76px]">
          <button type="button" onClick={() => setMenuOpen(true)} className="-ms-2 p-2 lg:hidden" aria-label={t('nav.menu')}>
            <Menu size={22} />
          </button>
          <Link to="/" className="shrink-0 max-lg:absolute max-lg:start-1/2 max-lg:-translate-x-1/2 rtl:max-lg:translate-x-1/2" aria-label="Amerray & Co.">
            <Logo tone={overHero ? 'light' : 'dark'} className="w-[104px] lg:w-[118px]" />
          </Link>
          <nav className="mx-auto hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                    isActive ? (overHero ? 'text-gold-soft' : 'text-gold-deep') : 'opacity-75 hover:opacity-100'
                  }`
                }
              >
                {t(n.key)}
                {n.key === 'nav.packs' && <span className="absolute -top-0.5 end-0.5 size-1.5 rounded-full bg-gold" />}
              </NavLink>
            ))}
          </nav>
          <div className="ms-auto flex items-center gap-1 lg:ms-0">
            <LangToggle className="me-1 max-sm:hidden" />
            <button type="button" onClick={onSearch} className="rounded-full p-2.5 transition hover:bg-current/10" aria-label={t('nav.search')}>
              <Search size={20} />
            </button>
            <Link to="/favoris" className="relative rounded-full p-2.5 transition hover:bg-current/10 max-sm:hidden" aria-label={t('nav.wishlist')}>
              <Heart size={20} />
              {wishlist.length > 0 && <span className="absolute top-1.5 end-1.5 size-2 rounded-full bg-[#d64545]" />}
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-2.5 transition hover:bg-current/10"
              aria-label={t('nav.cart')}
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-0.5 end-0.5 grid min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] leading-[18px] font-bold text-ink"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
        {totals.eligibleCount > 0 && pathname !== '/pack' && (
          <PackProgressStrip />
        )}
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 start-0 z-50 flex w-[88%] max-w-sm flex-col bg-ink text-white"
              initial={{ x: offscreen }}
              animate={{ x: 0 }}
              exit={{ x: offscreen }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            >
              <div className="flex items-center justify-between p-5">
                <Logo tone="light" className="w-24" />
                <button type="button" onClick={() => setMenuOpen(false)} className="p-2" aria-label={t('common.close')}>
                  <X size={22} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 px-5">
                <Link to="/quiz" className="flex flex-col gap-2 rounded-2xl bg-white/5 p-4 text-sm font-medium">
                  <Sparkles size={18} className="text-gold" /> {t('nav.quiz')}
                </Link>
                <Link to="/pack" className="flex flex-col gap-2 rounded-2xl bg-gold p-4 text-sm font-semibold text-ink">
                  <Gift size={18} /> {t('nav.builder')}
                </Link>
              </div>
              <nav className="mt-4 flex-1 overflow-y-auto px-5">
                {[...NAV, ...MORE_NAV].map((n, i) => (
                  <motion.div key={n.to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.03 }}>
                    <NavLink
                      to={n.to}
                      className={({ isActive }) =>
                        `font-display block border-b border-white/10 py-3.5 text-[26px] ${isActive ? 'text-gold-soft' : 'text-white'}`
                      }
                    >
                      {t(n.key)}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="flex items-center justify-between gap-3 border-t border-white/10 p-5">
                <a href={waLink('Bonjour Amerray !')} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-white/80">
                  <WhatsAppIcon className="size-5 text-[#25d366]" /> {WHATSAPP_DISPLAY}
                </a>
                <LangToggle />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function PackProgressStrip() {
  const { t } = useI18n()
  const { totals, setCartOpen } = useStore()
  const inGroup = totals.eligibleCount % 4
  const pct = inGroup === 0 ? 100 : (inGroup / 4) * 100
  const message =
    totals.toNextFree === 0
      ? t('cart.progress.done', { n: totals.freeCount })
      : totals.freeCount > 0
        ? t('cart.progress.next', { n: totals.toNextFree })
        : t('cart.progress.n', { n: totals.toNextFree })
  return (
    <button type="button" onClick={() => setCartOpen(true)} className="block w-full bg-gold/95 text-ink">
      <div className="container-x flex items-center gap-3 py-1.5 text-[12px] font-semibold">
        <Gift size={14} className="shrink-0" />
        <span className="truncate">{message}</span>
        <span className="ms-auto hidden h-1.5 w-40 overflow-hidden rounded-full bg-ink/15 sm:block">
          <span className="block h-full rounded-full bg-ink transition-all duration-700" style={{ width: `${pct}%` }} />
        </span>
      </div>
    </button>
  )
}

export function MobileTabBar({ onSearch }: { onSearch: () => void }) {
  const { t } = useI18n()
  const { lines, setCartOpen } = useStore()
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const item = 'flex flex-1 flex-col items-center gap-1 py-2 text-[10.5px] font-medium'
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="flex">
        <NavLink to="/" end className={({ isActive }) => `${item} ${isActive ? 'text-ink' : 'text-ink/50'}`}>
          <Home size={20} /> {t('nav.home')}
        </NavLink>
        <button type="button" onClick={onSearch} className={`${item} text-ink/50`}>
          <Search size={20} /> {t('nav.search')}
        </button>
        <NavLink to="/pack" className={({ isActive }) => `${item} ${isActive ? 'text-ink' : 'text-ink/50'}`}>
          <span className="-mt-5 grid size-12 place-items-center rounded-full bg-gold text-ink shadow-[0_8px_24px_-6px_rgba(201,162,77,0.8)]">
            <Gift size={20} />
          </span>
          3+1
        </NavLink>
        <NavLink to="/quiz" className={({ isActive }) => `${item} ${isActive ? 'text-ink' : 'text-ink/50'}`}>
          <Sparkles size={20} /> Quiz
        </NavLink>
        <button type="button" onClick={() => setCartOpen(true)} className={`${item} relative text-ink/50`}>
          <ShoppingBag size={20} />
          {count > 0 && (
            <span className="absolute top-1 start-1/2 ms-1.5 grid min-w-[16px] place-items-center rounded-full bg-gold px-1 text-[9px] leading-4 font-bold text-ink">
              {count}
            </span>
          )}
          {t('nav.cart')}
        </button>
      </div>
    </nav>
  )
}
