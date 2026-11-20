import { AnimatePresence, motion } from 'framer-motion'
import { Languages, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLang } from '../lib/i18n'
import { Logo } from './Logo'

export function Header() {
  const { t, lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#histoire', label: t.nav.story },
    { href: '#atelier', label: t.nav.atelier },
    { href: '#comparatif', label: t.nav.compare },
    { href: '#offres', label: t.nav.offers },
    { href: '#faq', label: t.nav.faq },
  ]
  const toggleLang = () => setLang(lang === 'fr' ? 'ar' : 'fr')

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/85 shadow-[0_8px_30px_-18px_rgba(46,16,101,0.35)] backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="container-luxe flex min-h-18 items-center justify-between gap-3 py-2.5">
        <a href="#top" aria-label="Captivia">
          <Logo />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink-soft transition hover:text-violet">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 rounded-full border border-violet/20 bg-white/70 px-3.5 py-2 text-sm font-semibold text-violet-deep transition hover:border-violet"
          >
            <Languages size={16} />
            <span className={lang === 'fr' ? 'font-arabic' : ''}>{t.nav.switchTo}</span>
          </button>
          <a href="#diagnostic" className="btn-primary hidden !py-2.5 sm:inline-flex">
            {t.nav.cta}
          </a>
          <button
            className="rounded-full p-2 text-violet-deep lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t.nav.menu}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-violet/10 bg-white lg:hidden"
          >
            <div className="container-luxe flex flex-col gap-1 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-lilac"
                >
                  {l.label}
                </a>
              ))}
              <a href="#diagnostic" onClick={() => setOpen(false)} className="btn-primary mt-2">
                {t.nav.cta}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
