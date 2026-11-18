import { motion } from 'framer-motion'
import { Check, Clock, Heart, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SINGLE_PRICE, displayName, formatPrice, type Product } from '../lib/catalog'
import { useI18n } from '../lib/i18n'
import { useStore } from '../lib/store'
import { Img, Stars } from './ui'

export function ProductCard({ p, index = 0, tone = 'light' }: { p: Product; index?: number; tone?: 'light' | 'dark' }) {
  const { t, lang } = useI18n()
  const { add, wishlist, toggleWish } = useStore()
  const [justAdded, setJustAdded] = useState(false)
  const wished = wishlist.includes(p.id)
  const name = displayName(p)
  const isPack = p.kind === 'pack'
  const packValue = isPack ? SINGLE_PRICE * 4 : undefined

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    add(p, 1, { silent: true })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: Math.min(index % 8, 7) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col"
    >
      <Link to={`/produit/${p.handle}`} className="relative block overflow-hidden rounded-[22px] bg-mist">
        <Img src={p.images[0]} alt={name} className="aspect-square transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-[1.04]" />
        {p.images[1] && (
          <Img
            src={p.images[1]}
            alt=""
            className="absolute inset-0 h-full opacity-0 transition-opacity duration-700 group-hover:opacity-100 max-md:hidden"
          />
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {p.bestRank !== undefined && p.bestRank < 40 && (
              <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-gold-soft uppercase backdrop-blur">
                {t('product.bestseller')}
              </span>
            )}
            {isPack && (
              <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold tracking-wider text-ink uppercase">
                {t('product.packBadge')}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              toggleWish(p.id)
            }}
            aria-label={wished ? t('product.wishlistRemove') : t('product.wishlistAdd')}
            className="grid size-9 place-items-center rounded-full bg-white/85 text-ink backdrop-blur transition hover:scale-110"
          >
            <Heart size={16} className={wished ? 'fill-[#d64545] text-[#d64545]' : ''} />
          </button>
        </div>
        {p.available && (
          <button
            type="button"
            onClick={quickAdd}
            className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full bg-white/95 py-3 text-[13px] font-semibold text-ink shadow-lg backdrop-blur transition-all duration-500 ease-[var(--ease-luxe)] hover:bg-ink hover:text-white md:translate-y-[130%] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 max-md:inset-x-auto max-md:end-3 max-md:size-10 max-md:rounded-full max-md:p-0"
            aria-label={t('product.quickAdd')}
          >
            {justAdded ? <Check size={16} /> : <Plus size={16} />}
            <span className="max-md:hidden">{justAdded ? t('product.added') : t('product.quickAdd')}</span>
          </button>
        )}
      </Link>

      <Link to={`/produit/${p.handle}`} className="mt-4 flex flex-1 flex-col px-1">
        {p.inspired && (
          <p className={`text-[11px] font-medium tracking-[0.14em] uppercase ${tone === 'dark' ? 'text-white/45' : 'text-ink/45'}`}>
            {t('product.inspiredBy')} · {p.brand && p.brand !== 'Collection Arabic' ? p.brand : t('nav.arabic')}
          </p>
        )}
        <h3 className={`font-display mt-1 text-[22px] leading-tight font-medium ${tone === 'dark' ? 'text-white' : 'text-ink'}`} dir="auto">
          {name}
        </h3>
        {p.kind === 'perfume' && (
          <div className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] ${tone === 'dark' ? 'text-white/55' : 'text-ink/55'}`}>
            {p.reviews.length > 0 && <Stars size={11} />}
            <span>{t(`family.${p.familyGroup}`)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {t('product.hours', { a: p.hours[0], b: p.hours[1] })}
            </span>
          </div>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className={`text-[17px] font-semibold ${tone === 'dark' ? 'text-gold-soft' : 'text-ink'}`}>{formatPrice(p.price, lang)}</span>
          {packValue && <span className="text-sm text-ink/40 line-through">{formatPrice(packValue, lang)}</span>}
          {p.kind === 'perfume' && (
            <span className={`ms-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${tone === 'dark' ? 'bg-white/10 text-white/70' : 'bg-gold/15 text-gold-deep'}`}>
              3+1
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="skeleton aspect-square rounded-[22px]" />
      <div className="skeleton mt-4 h-3 w-1/2 rounded-full" />
      <div className="skeleton mt-2 h-5 w-3/4 rounded-full" />
      <div className="skeleton mt-4 h-4 w-1/3 rounded-full" />
    </div>
  )
}
