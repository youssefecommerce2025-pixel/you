import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Gift, Lock, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { displayName, formatPrice, useCatalog } from '../lib/catalog'
import { useI18n } from '../lib/i18n'
import { CITIES, estimateDelivery, formatDay } from '../lib/shipping'
import { useStore, type Order } from '../lib/store'
import { cartMessage, orderMessage, waLink } from '../lib/whatsapp'
import { Img, WhatsAppIcon } from './ui'

function PackMeter() {
  const { t } = useI18n()
  const { totals } = useStore()
  const inGroup = totals.eligibleCount % 4
  const filled = totals.eligibleCount > 0 && inGroup === 0 ? 4 : inGroup
  const message =
    totals.eligibleCount === 0
      ? t('cart.progress.start')
      : totals.toNextFree === 0
        ? t('cart.progress.done', { n: totals.freeCount })
        : totals.freeCount > 0
          ? t('cart.progress.next', { n: totals.toNextFree })
          : t('cart.progress.n', { n: totals.toNextFree })
  return (
    <div className="rounded-2xl bg-ink p-4 text-white">
      <div className="flex items-center gap-2 text-[13px] font-medium">
        <Gift size={16} className="text-gold" />
        <span>{message}</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="relative h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={`absolute inset-y-0 start-0 rounded-full ${i === 3 ? 'bg-gold-soft' : 'bg-gold'}`}
              initial={false}
              animate={{ width: i < filled ? '100%' : '0%' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-4 text-center text-[10px] tracking-wide text-white/40 uppercase">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span className="text-gold-soft">{t('cart.free')}</span>
      </div>
    </div>
  )
}

function Upsell() {
  const { t, lang } = useI18n()
  const catalog = useCatalog()
  const { lines, add, totals } = useStore()
  const picks = useMemo(() => {
    if (!catalog) return []
    const inCart = new Set(lines.map((l) => l.productId))
    return catalog.products.filter((p) => p.kind === 'perfume' && p.bestRank !== undefined && !inCart.has(p.id)).slice(0, 10)
  }, [catalog, lines])
  if (!picks.length || totals.eligibleCount === 0) return null
  return (
    <div className="mt-6">
      <p className="eyebrow mb-3 text-ink/50">{t('cart.upsell')}</p>
      <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
        {picks.map((p) => (
          <div key={p.id} className="w-[132px] shrink-0">
            <div className="relative">
              <Img src={p.images[0]} alt={displayName(p)} width={240} sizes="132px" className="aspect-square rounded-2xl bg-mist" />
              <button
                type="button"
                onClick={() => add(p, 1, { silent: true })}
                className="absolute end-2 bottom-2 grid size-8 place-items-center rounded-full bg-white text-ink shadow-md transition hover:bg-ink hover:text-white"
                aria-label={t('product.quickAdd')}
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="mt-2 line-clamp-1 text-[13px] font-medium" dir="auto">
              {displayName(p)}
            </p>
            <p className="text-[12px] text-ink/50">{formatPrice(p.price, lang)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const PHONE_RE = /^(?:\+?212|0)\s?[5-7](?:[\s.-]?\d){8}$/

function Checkout({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n()
  const { lines, totals, saveOrder, clear, setCartOpen } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', note: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const eta = form.city ? estimateDelivery(form.city) : null

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (form.name.trim().length < 2) er.name = t('checkout.errors.name')
    if (!PHONE_RE.test(form.phone.trim())) er.phone = t('checkout.errors.phone')
    if (!form.city) er.city = t('checkout.errors.city')
    if (form.address.trim().length < 4) er.address = t('checkout.errors.address')
    setErrors(er)
    if (Object.keys(er).length) return
    setSubmitting(true)
    const order: Order = {
      id: `AM${Date.now().toString(36).slice(-6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer: { name: form.name.trim(), phone: form.phone.trim(), city: form.city, address: form.address.trim(), note: form.note.trim() || undefined },
      lines,
      totals: { subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total },
    }
    const webhook = import.meta.env.VITE_ORDER_WEBHOOK as string | undefined
    if (webhook) fetch(webhook, { method: 'POST', mode: 'no-cors', body: JSON.stringify(order) }).catch(() => {})
    window.open(waLink(orderMessage(order)), '_blank', 'noopener')
    saveOrder(order)
    clear()
    setCartOpen(false)
    navigate(`/merci/${order.id}`)
  }

  const field = 'w-full rounded-2xl border bg-white px-4 py-3.5 outline-none transition focus:border-ink'
  const label = 'mb-1.5 block text-[13px] font-medium text-ink/70'
  const err = (k: string) => errors[k] && <p className="mt-1 text-[12px] text-[#c0392b]">{errors[k]}</p>

  return (
    <form onSubmit={submit} className="flex h-full flex-col" noValidate>
      <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
        <button type="button" onClick={onBack} className="-ms-2 rounded-full p-2 hover:bg-ink/5" aria-label={t('quiz.back')}>
          <ArrowLeft size={20} className="rtl:rotate-180" />
        </button>
        <div>
          <h2 className="font-display text-2xl">{t('checkout.title')}</h2>
          <p className="text-[12px] text-ink/50">{t('checkout.subtitle')}</p>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <div>
          <label className={label} htmlFor="co-name">
            {t('checkout.name')}
          </label>
          <input id="co-name" autoComplete="name" value={form.name} onChange={set('name')} className={`${field} ${errors.name ? 'border-[#c0392b]' : 'border-ink/10'}`} />
          {err('name')}
        </div>
        <div>
          <label className={label} htmlFor="co-phone">
            {t('checkout.phone')}
          </label>
          <input
            id="co-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            dir="ltr"
            value={form.phone}
            onChange={set('phone')}
            className={`${field} ${errors.phone ? 'border-[#c0392b]' : 'border-ink/10'} rtl:text-right`}
          />
          {err('phone') || <p className="mt-1 text-[12px] text-ink/45">{t('checkout.phoneHint')}</p>}
        </div>
        <div>
          <label className={label} htmlFor="co-city">
            {t('checkout.city')}
          </label>
          <select id="co-city" value={form.city} onChange={set('city')} className={`${field} appearance-none ${errors.city ? 'border-[#c0392b]' : 'border-ink/10'}`}>
            <option value="">{t('delivery.choose')}</option>
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {lang === 'ar' ? c.ar : c.name}
              </option>
            ))}
          </select>
          {err('city')}
          {eta && (
            <p className="mt-2 flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-[13px] text-success">
              <Truck size={15} />
              {t('delivery.order', {
                when: eta.sameDay ? t('delivery.tomorrow') : t('delivery.range', { a: formatDay(eta.from, lang), b: formatDay(eta.to, lang) }),
              })}
            </p>
          )}
        </div>
        <div>
          <label className={label} htmlFor="co-address">
            {t('checkout.address')}
          </label>
          <textarea
            id="co-address"
            rows={2}
            autoComplete="street-address"
            placeholder={t('checkout.addressHint')}
            value={form.address}
            onChange={set('address')}
            className={`${field} resize-none ${errors.address ? 'border-[#c0392b]' : 'border-ink/10'}`}
          />
          {err('address')}
        </div>
        <div>
          <label className={label} htmlFor="co-note">
            {t('checkout.note')}
          </label>
          <input id="co-note" value={form.note} onChange={set('note')} className={`${field} border-ink/10`} />
        </div>

        <div className="rounded-2xl bg-stone p-4 text-sm">
          <p className="eyebrow mb-3 text-ink/50">{t('checkout.summary')}</p>
          {lines.map((l) => (
            <div key={l.key} className="flex justify-between gap-3 py-1">
              <span className="truncate" dir="auto">
                {l.qty} × {l.inspired ?? l.title}
              </span>
              <span className="shrink-0 text-ink/60">{formatPrice(l.unitPrice * l.qty, lang)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-ink/10 bg-white px-5 pt-4 pb-5">
        <Totals />
        <button type="submit" disabled={submitting} className="btn-ink mt-4 w-full py-4 text-[15px]">
          <Lock size={16} /> {t('checkout.submit', { v: formatPrice(totals.total, lang) })}
        </button>
        <p className="mt-2 text-center text-[11px] text-ink/45">{t('checkout.secure')}</p>
      </div>
    </form>
  )
}

function Totals() {
  const { t, lang } = useI18n()
  const { totals } = useStore()
  return (
    <div className="space-y-1.5 text-[14px]">
      <div className="flex justify-between text-ink/60">
        <span>{t('cart.subtotal')}</span>
        <span>{formatPrice(totals.subtotal, lang)}</span>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between font-medium text-success">
          <span className="flex items-center gap-1.5">
            <Gift size={14} /> {t('cart.packDiscount')}
          </span>
          <span>−{formatPrice(totals.discount, lang)}</span>
        </div>
      )}
      <div className="flex justify-between text-ink/60">
        <span>{t('cart.shipping')}</span>
        <span>{formatPrice(totals.shipping, lang)}</span>
      </div>
      <div className="flex justify-between pt-2 text-[16px] font-semibold">
        <span>{t('cart.total')}</span>
        <span>{formatPrice(totals.total, lang)}</span>
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { t, lang } = useI18n()
  const { cartOpen, setCartOpen, lines, totals, setQty, remove, checkoutOpen, setCheckoutOpen } = useStore()
  const offscreen = lang === 'ar' ? '-100%' : '100%'

  useEffect(() => {
    if (!cartOpen) setCheckoutOpen(false)
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen, setCartOpen, setCheckoutOpen])

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[55] bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal
            aria-label={t('cart.title')}
            className="fixed inset-y-0 end-0 z-[56] flex w-full max-w-[440px] flex-col bg-white shadow-2xl"
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            {checkoutOpen && lines.length > 0 ? (
              <Checkout onBack={() => setCheckoutOpen(false)} />
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                  <h2 className="font-display text-2xl">
                    {t('cart.title')} <span className="text-ink/40">({lines.reduce((s, l) => s + l.qty, 0)})</span>
                  </h2>
                  <button type="button" onClick={() => setCartOpen(false)} className="rounded-full p-2 hover:bg-ink/5" aria-label={t('common.close')}>
                    <X size={20} />
                  </button>
                </div>

                {lines.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
                    <span className="grid size-20 place-items-center rounded-full bg-stone">
                      <ShoppingBag size={30} className="text-ink/40" />
                    </span>
                    <p className="text-ink/60">{t('cart.empty')}</p>
                    <Link to="/collection/best-sellers" onClick={() => setCartOpen(false)} className="btn-ink">
                      {t('cart.emptyCta')}
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto px-5 py-5">
                      <PackMeter />
                      <ul className="mt-5 divide-y divide-ink/5">
                        <AnimatePresence initial={false}>
                          {lines.map((l) => {
                            const free = totals.freeUnits.get(l.key) ?? 0
                            return (
                              <motion.li
                                key={l.key}
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex gap-4 py-4"
                              >
                                <Link to={`/produit/${l.handle}`} onClick={() => setCartOpen(false)} className="shrink-0">
                                  <Img src={l.image} alt="" width={200} sizes="88px" className="size-[88px] rounded-2xl bg-mist" />
                                </Link>
                                <div className="flex min-w-0 flex-1 flex-col">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      {l.brand && <p className="text-[11px] tracking-wider text-ink/45 uppercase">{l.brand}</p>}
                                      <p className="font-display text-lg leading-tight" dir="auto">
                                        {l.inspired ?? l.title}
                                      </p>
                                    </div>
                                    <button type="button" onClick={() => remove(l.key)} className="p-1 text-ink/35 hover:text-ink" aria-label={t('cart.remove')}>
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                  <div className="mt-auto flex items-center justify-between pt-2">
                                    <div className="flex items-center rounded-full border border-ink/10">
                                      <button type="button" onClick={() => setQty(l.key, l.qty - 1)} className="p-2" aria-label="-">
                                        <Minus size={14} />
                                      </button>
                                      <span className="w-6 text-center text-sm font-semibold">{l.qty}</span>
                                      <button type="button" onClick={() => setQty(l.key, l.qty + 1)} className="p-2" aria-label="+">
                                        <Plus size={14} />
                                      </button>
                                    </div>
                                    <div className="text-end">
                                      {free > 0 && (
                                        <span className="me-2 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                                          {free > 1 ? `${free}× ` : ''}
                                          {t('cart.free')}
                                        </span>
                                      )}
                                      <span className="text-sm font-semibold">{formatPrice(l.unitPrice * (l.qty - free), lang)}</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.li>
                            )
                          })}
                        </AnimatePresence>
                      </ul>
                      <Upsell />
                    </div>
                    <div className="border-t border-ink/10 bg-white px-5 pt-4 pb-5">
                      <Totals />
                      {totals.discount > 0 && (
                        <p className="mt-2 rounded-xl bg-gold/15 px-3 py-2 text-center text-[13px] font-medium text-gold-deep">
                          {t('cart.saved', { v: formatPrice(totals.discount, lang) })}
                        </p>
                      )}
                      <button type="button" onClick={() => setCheckoutOpen(true)} className="btn-ink mt-4 w-full py-4 text-[15px]">
                        {t('cart.checkout')}
                      </button>
                      <a
                        href={waLink(cartMessage(lines, totals.total))}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-whatsapp mt-2 w-full py-3.5"
                      >
                        <WhatsAppIcon className="size-4" /> {t('cart.whatsapp')}
                      </a>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
