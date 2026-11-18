import { AnimatePresence, motion } from 'framer-motion'
import { Banknote, Check, MapPin, Phone, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { WHATSAPP_DISPLAY } from '../lib/catalog'
import { useI18n, type TKey } from '../lib/i18n'
import { CITIES, estimateDelivery, formatDay } from '../lib/shipping'
import { useStore } from '../lib/store'
import { waLink } from '../lib/whatsapp'
import { NAV, UNIVERSE } from './Header'
import { InstagramIcon, Logo, TikTokIcon, WhatsAppIcon, YoutubeIcon } from './ui'

export function TrustRow({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { t } = useI18n()
  const items: { icon: typeof Truck; t: TKey; d: TKey }[] = [
    { icon: Banknote, t: 'trust.cod', d: 'trust.codSub' },
    { icon: Truck, t: 'trust.delivery', d: 'trust.deliverySub' },
    { icon: Sparkles, t: 'trust.quality', d: 'trust.qualitySub' },
    { icon: ShieldCheck, t: 'trust.support', d: 'trust.supportSub' },
  ]
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
      {items.map(({ icon: Icon, t: title, d }) => (
        <div key={title} className="flex items-start gap-3">
          <span className={`grid size-11 shrink-0 place-items-center rounded-full ${tone === 'dark' ? 'bg-white/5 text-gold' : 'bg-white text-gold-deep shadow-sm'}`}>
            <Icon size={20} strokeWidth={1.6} />
          </span>
          <div>
            <p className={`text-[14px] font-semibold ${tone === 'dark' ? 'text-white' : 'text-ink'}`}>{t(title)}</p>
            <p className={`text-[12.5px] ${tone === 'dark' ? 'text-white/50' : 'text-ink/55'}`}>{t(d)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function DeliveryEstimator({ compact = false }: { compact?: boolean }) {
  const { t, lang } = useI18n()
  const [city, setCity] = useState(() => localStorage.getItem('amerray.city') ?? '')
  const eta = city ? estimateDelivery(city) : null
  useEffect(() => {
    if (city) localStorage.setItem('amerray.city', city)
  }, [city])
  return (
    <div className={compact ? '' : 'card-surface p-6 sm:p-8'}>
      <label className="flex items-center gap-3">
        <MapPin size={18} className="shrink-0 text-gold-deep" />
        <span className="sr-only">{t('delivery.city')}</span>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-ink"
        >
          <option value="">{t('delivery.choose')}</option>
          {CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {lang === 'ar' ? c.ar : c.name}
            </option>
          ))}
        </select>
      </label>
      <AnimatePresence mode="wait">
        {eta && (
          <motion.p
            key={city}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 text-[13.5px] text-success"
          >
            <Truck size={16} className="shrink-0" />
            <span>
              {t('delivery.order', {
                when: eta.sameDay ? `${t('delivery.tomorrow')} (${formatDay(eta.from, lang)})` : t('delivery.range', { a: formatDay(eta.from, lang), b: formatDay(eta.to, lang) }),
              })}
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Footer() {
  const { t } = useI18n()
  const [subscribed, setSubscribed] = useState(false)
  return (
    <footer className="relative overflow-hidden bg-ink pb-24 text-white md:pb-0">
      <div className="container-x border-b border-white/10 py-14">
        <TrustRow tone="dark" />
      </div>
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo tone="light" className="w-40" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">{t('footer.tagline')}</p>
          <div className="mt-6 flex gap-2">
            {[
              { Icon: InstagramIcon, href: 'https://www.instagram.com/amerray.perfumes/', label: 'Instagram' },
              { Icon: TikTokIcon, href: 'https://www.tiktok.com/@amerray.perfume', label: 'TikTok' },
              { Icon: YoutubeIcon, href: 'https://www.youtube.com/@amerray.perfume', label: 'YouTube' },
              { Icon: WhatsAppIcon, href: waLink('Bonjour Amerray !'), label: 'WhatsApp' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-white/15 transition hover:border-gold hover:text-gold"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-5 text-gold">{t('footer.shop')}</p>
          <ul className="space-y-3 text-sm text-white/70">
            {[...NAV, ...UNIVERSE].map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="transition hover:text-white">
                  {t(n.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5 text-gold">{t('footer.help')}</p>
          <ul className="space-y-3 text-sm text-white/70">
            <li>
              <Link to="/quiz" className="hover:text-white">
                {t('nav.quiz')}
              </Link>
            </li>
            <li>
              <Link to="/pack" className="hover:text-white">
                {t('nav.builder')}
              </Link>
            </li>
            <li>
              <Link to="/#faq" className="hover:text-white">
                {t('footer.faq')}
              </Link>
            </li>
            <li>
              <Link to="/#livraison" className="hover:text-white">
                {t('footer.delivery')}
              </Link>
            </li>
            <li>
              <Link to="/#boutique" className="hover:text-white">
                {t('footer.store')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5 text-gold">{t('footer.contact')}</p>
          <a href={waLink('Bonjour Amerray !')} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <Phone size={15} /> <span dir="ltr">{WHATSAPP_DISPLAY}</span>
          </a>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/60">
            <MapPin size={15} /> Casablanca, Maroc
          </p>
          <p className="mt-6 mb-3 text-sm text-white/80">{t('footer.newsletter')}</p>
          {subscribed ? (
            <p className="flex items-center gap-2 text-sm text-gold-soft">
              <Check size={16} /> {t('footer.newsletterOk')}
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSubscribed(true)
              }}
              className="flex rounded-full border border-white/15 p-1 focus-within:border-gold"
            >
              <input
                required
                placeholder={t('footer.newsletterPlaceholder')}
                className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-white/35"
              />
              <button type="submit" className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-ink">
                {t('footer.newsletterCta')}
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="container-x flex flex-col gap-3 border-t border-white/10 py-6 text-[12px] text-white/40 md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} Amerray &amp; Co. {t('footer.rights')}
        </p>
        <p className="max-w-3xl">{t('footer.disclaimer')}</p>
      </div>
      <div className="pointer-events-none absolute -bottom-[3vw] start-1/2 w-[110vw] -translate-x-1/2 opacity-[0.04] rtl:translate-x-1/2">
        <Logo tone="light" className="w-full" />
      </div>
    </footer>
  )
}

export function WhatsAppFab() {
  const { t } = useI18n()
  const [hint, setHint] = useState(false)
  useEffect(() => {
    const a = setTimeout(() => setHint(true), 9000)
    const b = setTimeout(() => setHint(false), 17000)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [])
  return (
    <div className="fixed end-4 bottom-24 z-30 flex items-center gap-3 md:end-6 md:bottom-6">
      <AnimatePresence>
        {hint && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="rounded-full bg-white px-4 py-2 text-[13px] font-medium shadow-xl max-sm:hidden"
          >
            {t('common.whatsappHelp')}
          </motion.span>
        )}
      </AnimatePresence>
      <a
        href={waLink('Bonjour Amerray ! J’ai besoin d’un conseil pour choisir un parfum.')}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="relative grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition hover:scale-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-25" />
        <WhatsAppIcon className="relative size-7" />
      </a>
    </div>
  )
}

export function AddedToast() {
  const { t } = useI18n()
  const { lastAdded, cartOpen, setCartOpen, totals } = useStore()
  const [visible, setVisible] = useState(false)
  const shownAt = useRef(0)
  useEffect(() => {
    if (!lastAdded || lastAdded.at <= shownAt.current) return
    shownAt.current = lastAdded.at
    if (cartOpen) return
    setVisible(true)
    const id = setTimeout(() => setVisible(false), 2600)
    return () => clearTimeout(id)
  }, [lastAdded, cartOpen])
  return (
    <AnimatePresence>
      {visible && lastAdded && (
        <motion.button
          type="button"
          onClick={() => {
            setVisible(false)
            setCartOpen(true)
          }}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed start-1/2 bottom-24 z-[45] flex w-[min(92vw,420px)] -translate-x-1/2 items-center gap-3 rounded-2xl bg-ink p-3 ps-4 text-start text-white shadow-2xl md:bottom-8 rtl:translate-x-1/2"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold text-ink">
            <Check size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold" dir="auto">
              {lastAdded.title}
            </span>
            <span className="block text-[12px] text-white/60">
              {totals.toNextFree === 0 ? t('cart.progress.done', { n: totals.freeCount }) : t('cart.progress.n', { n: totals.toNextFree })}
            </span>
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold">{t('nav.cart')}</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
