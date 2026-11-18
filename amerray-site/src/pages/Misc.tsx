import { motion } from 'framer-motion'
import { Banknote, Check, Heart, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { WhatsAppIcon } from '../components/ui'
import { formatPrice, useCatalog, type Product } from '../lib/catalog'
import { useI18n } from '../lib/i18n'
import { estimateDelivery, formatDay } from '../lib/shipping'
import { useStore } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { orderMessage, waLink } from '../lib/whatsapp'

export function Wishlist() {
  const { t } = useI18n()
  const catalog = useCatalog()
  const { wishlist } = useStore()
  useDocumentTitle(t('wishlist.title'))
  const items = catalog ? wishlist.map((id) => catalog.products.find((p) => p.id === id)).filter((p): p is Product => !!p) : []
  return (
    <div className="container-x py-14 pb-28">
      <h1 className="font-display text-5xl sm:text-6xl">{t('wishlist.title')}</h1>
      {items.length === 0 ? (
        <div className="card-surface mt-10 flex flex-col items-center gap-5 p-12 text-center">
          <Heart size={32} className="text-ink/30" />
          <p className="max-w-sm text-ink/60">{t('wishlist.empty')}</p>
          <Link to="/collection/best-sellers" className="btn-ink">
            {t('cart.emptyCta')}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

export function OrderSuccess() {
  const { id } = useParams()
  const { t, lang } = useI18n()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)
  useDocumentTitle(t('checkout.title'))
  if (!order)
    return (
      <div className="container-x py-32 text-center">
        <p className="font-display text-4xl">{t('success.notFound')}</p>
        <Link to="/" className="btn-ink mt-8">
          {t('success.back')}
        </Link>
      </div>
    )
  const eta = estimateDelivery(order.customer.city)
  return (
    <div className="container-x flex flex-col items-center py-16 pb-28 text-center">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="grid size-20 place-items-center rounded-full bg-gold text-ink shadow-[0_20px_50px_-15px_rgba(201,162,77,0.9)]"
      >
        <Check size={36} strokeWidth={2.4} />
      </motion.span>
      <h1 className="font-display mt-8 text-5xl sm:text-6xl">{t('success.title', { name: order.customer.name.split(' ')[0] })}</h1>
      <p className="mt-4 max-w-lg text-lg text-ink/60">{t('success.text', { id: order.id })}</p>

      <div className="card-surface mt-10 grid w-full max-w-2xl gap-px overflow-hidden text-start sm:grid-cols-2">
        <div className="flex items-start gap-4 p-6">
          <Truck size={22} className="mt-0.5 shrink-0 text-gold-deep" />
          <div>
            <p className="text-[13px] text-ink/50">{t('success.eta')}</p>
            <p className="font-semibold">{eta ? (eta.sameDay ? formatDay(eta.from, lang) : `${formatDay(eta.from, lang)} – ${formatDay(eta.to, lang)}`) : order.customer.city}</p>
            <p className="text-[13px] text-ink/50">{order.customer.city}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-6 sm:border-s sm:border-ink/5">
          <Banknote size={22} className="mt-0.5 shrink-0 text-gold-deep" />
          <div>
            <p className="text-[13px] text-ink/50">{t('success.pay')}</p>
            <p className="font-display text-3xl">{formatPrice(order.totals.total, lang)}</p>
          </div>
        </div>
        <div className="border-t border-ink/5 p-6 sm:col-span-2">
          {order.lines.map((l) => (
            <div key={l.key} className="flex justify-between gap-3 py-1 text-sm">
              <span dir="auto">
                {l.qty} × {l.inspired ?? l.title}
              </span>
              <span className="text-ink/60">{formatPrice(l.unitPrice * l.qty, lang)}</span>
            </div>
          ))}
          {order.totals.discount > 0 && (
            <div className="flex justify-between py-1 text-sm font-medium text-success">
              <span>{t('cart.packDiscount')}</span>
              <span>−{formatPrice(order.totals.discount, lang)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={waLink(orderMessage(order))} target="_blank" rel="noreferrer" className="btn-whatsapp">
          <WhatsAppIcon className="size-5" /> {t('success.whatsapp')}
        </a>
        <Link to="/" className="btn-ghost">
          {t('success.back')}
        </Link>
      </div>
    </div>
  )
}

export function NotFound() {
  const { t } = useI18n()
  useDocumentTitle(t('common.notFound'))
  return (
    <div className="container-x flex flex-col items-center gap-6 py-32 text-center">
      <p className="font-display text-[120px] leading-none text-gold">404</p>
      <p className="font-display text-4xl">{t('common.notFound')}</p>
      <Link to="/" className="btn-ink">
        {t('common.backHome')}
      </Link>
    </div>
  )
}
