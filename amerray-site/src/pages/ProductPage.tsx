import { AnimatePresence, motion } from 'framer-motion'
import { Banknote, Check, ChevronDown, Clock, Gift, Heart, Leaf, Minus, Moon, Plus, Share2, Snowflake, Sun, Sunset, Truck, Wind } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DeliveryEstimator } from '../components/Footer'
import { ProductCard } from '../components/ProductCard'
import { Img, Meter, Reveal, SectionHeading, Stars, WhatsAppIcon } from '../components/ui'
import { SINGLE_PRICE, displayName, formatPrice, shopifyImage, similarProducts, useCatalog, type Product, type Season } from '../lib/catalog'
import { useI18n, type TKey } from '../lib/i18n'
import { useStore } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { productMessage, waLink } from '../lib/whatsapp'

const SEASON_ICON: Record<Season, typeof Sun> = { printemps: Leaf, ete: Sun, automne: Wind, hiver: Snowflake }

function Gallery({ p }: { p: Product }) {
  const [active, setActive] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)
  const name = displayName(p)
  const onScroll = () => {
    const el = scroller.current
    if (el) setActive(Math.round(Math.abs(el.scrollLeft) / el.clientWidth))
  }
  return (
    <div className="lg:sticky lg:top-28">
      <div ref={scroller} onScroll={onScroll} className="no-scrollbar -mx-5 flex snap-x snap-mandatory overflow-x-auto sm:mx-0 lg:hidden">
        {p.images.map((src, i) => (
          <Img key={src} src={src} alt={`${name} ${i + 1}`} eager={i === 0} width={960} sizes="100vw" className="aspect-square w-full shrink-0 snap-center bg-mist sm:rounded-[28px]" />
        ))}
      </div>
      {p.images.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5 lg:hidden">
          {p.images.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-ink' : 'w-1.5 bg-ink/20'}`} />
          ))}
        </div>
      )}
      <div className="hidden gap-4 lg:grid lg:grid-cols-[84px_1fr]">
        <div className="flex flex-col gap-3">
          {p.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-2xl ring-2 transition ${i === active ? 'ring-ink' : 'ring-transparent opacity-70 hover:opacity-100'}`}
            >
              <Img src={src} alt="" width={200} sizes="84px" className="aspect-square bg-mist" />
            </button>
          ))}
        </div>
        <div className="group relative overflow-hidden rounded-[32px] bg-mist">
          <AnimatePresence mode="wait">
            <motion.img
              key={p.images[active]}
              src={shopifyImage(p.images[active], 1400)}
              alt={name}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-ink/10">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-5 text-start" aria-expanded={open}>
        <span className="text-[15px] font-semibold">{title}</span>
        <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pb-6 text-[14.5px] leading-relaxed text-ink/65">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Pyramid({ p }: { p: Product }) {
  const { t } = useI18n()
  if (!p.notes) return null
  const tiers: { key: TKey; notes: string[]; width: string }[] = [
    { key: 'product.top', notes: p.notes.top, width: 'w-[62%]' },
    { key: 'product.heart', notes: p.notes.heart, width: 'w-[81%]' },
    { key: 'product.base', notes: p.notes.base, width: 'w-full' },
  ]
  return (
    <section className="bg-ink py-20 text-white lg:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="eyebrow text-gold">{t('product.pyramid')}</p>
          <h2 className="font-display mt-4 text-5xl leading-tight">{displayName(p)}</h2>
          {p.accords.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-[13px] text-white/50">{t('product.accords')}</p>
              <div className="flex flex-wrap gap-2">
                {p.accords.map((a, i) => (
                  <span
                    key={a}
                    className="rounded-full px-4 py-2 text-[13px] font-medium text-ink"
                    style={{ background: `color-mix(in oklab, #e7d3a0 ${100 - i * 12}%, #3a3a40)`, color: i > 3 ? '#fff' : undefined }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-3">
          {tiers.map((tier, i) =>
            tier.notes.length ? (
              <Reveal key={tier.key} delay={i * 0.12} className={`${tier.width} rounded-[22px] border border-white/10 bg-white/[0.04] p-5 text-center`}>
                <p className="eyebrow text-gold-soft">{t(tier.key)}</p>
                <p className="font-display mt-2 text-xl leading-snug text-white/90 sm:text-2xl">{tier.notes.join(' · ')}</p>
              </Reveal>
            ) : null,
          )}
        </div>
      </div>
    </section>
  )
}

function PackNudge({ p }: { p: Product }) {
  const { t } = useI18n()
  const { totals } = useStore()
  const done = totals.eligibleCount > 0 && totals.toNextFree === 0
  return (
    <Link to={`/pack?with=${p.handle}`} className="group mt-6 flex items-center gap-4 rounded-2xl border border-gold/40 bg-gold/10 p-4 transition hover:bg-gold/20">
      <div className="flex shrink-0 -space-x-2 rtl:space-x-reverse">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`grid size-9 place-items-center rounded-full border-2 border-stone text-[11px] font-bold ${i === 0 ? 'overflow-hidden bg-mist' : i === 3 ? 'bg-gold text-ink' : 'bg-white text-ink/40'}`}>
            {i === 0 ? <Img src={p.images[0]} alt="" width={80} sizes="36px" className="size-full" /> : i === 3 ? <Gift size={14} /> : '+'}
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink">
          {done ? t('product.packHintDone') : totals.eligibleCount ? t('product.packHintN', { n: totals.toNextFree }) : t('product.packHint')}
        </p>
        <p className="text-[12.5px] text-ink/55">4 × 50 ml · 299 DH</p>
      </div>
      <span className="text-[13px] font-semibold text-gold-deep underline-offset-4 group-hover:underline">{t('nav.builder')}</span>
    </Link>
  )
}

export function ProductPage() {
  const { handle } = useParams()
  const { t, lang } = useI18n()
  const catalog = useCatalog()
  const { add, wishlist, toggleWish, pushRecent, recent } = useStore()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)

  const p = catalog?.products.find((x) => x.handle === handle)
  const name = p ? displayName(p) : ''
  useDocumentTitle(p ? (p.inspired ? `${name} — Parfum inspiré ${p.brand ?? ''}` : p.title) : undefined, p?.description)

  useEffect(() => {
    if (p) {
      pushRecent(p.id)
      setQty(1)
      window.scrollTo({ top: 0 })
    }
  }, [p, pushRecent])

  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setStickyVisible(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [p])

  const similar = useMemo(() => (catalog && p ? similarProducts(catalog.products, p, 8) : []), [catalog, p])
  const recentProducts = useMemo(
    () => (catalog && p ? recent.filter((id) => id !== p.id).map((id) => catalog.products.find((x) => x.id === id)).filter((x): x is Product => !!x).slice(0, 4) : []),
    [catalog, p, recent],
  )

  if (!catalog) return <div className="container-x skeleton my-10 h-[70vh] rounded-[32px]" />
  if (!p)
    return (
      <div className="container-x flex flex-col items-center gap-6 py-32 text-center">
        <p className="font-display text-4xl">{t('product.notFound')}</p>
        <Link to="/collection/tous" className="btn-ink">
          {t('product.back')}
        </Link>
      </div>
    )

  const wished = wishlist.includes(p.id)
  const isPerfume = p.kind === 'perfume'
  const onAdd = () => {
    add(p, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }
  const share = async () => {
    const url = window.location.href
    if (navigator.share) await navigator.share({ title: name, url }).catch(() => {})
    else await navigator.clipboard?.writeText(url)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    image: p.images,
    description: p.description,
    brand: { '@type': 'Brand', name: 'Amerray & Co.' },
    sku: String(p.variants[0]?.id),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MAD',
      price: p.price,
      availability: p.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://amerray.com/products/${p.handle}`,
    },
    ...(p.reviews.length
      ? {
          aggregateRating: { '@type': 'AggregateRating', ratingValue: 5, reviewCount: p.reviews.length },
          review: p.reviews.map((r) => ({ '@type': 'Review', author: { '@type': 'Person', name: r.author }, reviewBody: r.text, reviewRating: { '@type': 'Rating', ratingValue: 5 } })),
        }
      : {}),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x pt-6 pb-16 lg:pt-10 lg:pb-24">
        <nav className="mb-6 truncate text-[12px] text-ink/45">
          <Link to="/" className="hover:text-ink">
            {t('nav.home')}
          </Link>{' '}
          /{' '}
          <Link to={`/collection/${p.kind === 'pack' ? 'packs' : p.kind === 'perfume' ? p.gender : 'musc-bakhour'}`} className="hover:text-ink">
            {p.kind === 'pack' ? t('nav.packs') : t(`gender.${p.gender}`)}
          </Link>{' '}
          / <span className="text-ink/70">{name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Gallery key={p.id} p={p} />

          <div>
            <div className="flex flex-wrap gap-2">
              {p.bestRank !== undefined && <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold tracking-wider text-gold-soft uppercase">{t('product.bestseller')}</span>}
              {isPerfume && <span className="rounded-full border border-ink/15 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase">{t(`gender.${p.gender}`)}</span>}
              {p.kind === 'pack' && <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-semibold tracking-wider uppercase">{t('product.packBadge')}</span>}
            </div>
            {p.inspired && (
              <p className="eyebrow mt-5 text-gold-deep">
                {t('product.inspiredBy')} · {p.brand}
              </p>
            )}
            <div className="mt-2 flex items-start justify-between gap-4">
              <h1 className="font-display text-[44px] leading-[1] font-medium sm:text-6xl" dir="auto">
                {name}
              </h1>
              <div className="flex shrink-0 gap-1 pt-2">
                <button type="button" onClick={() => toggleWish(p.id)} className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white transition hover:border-ink" aria-label={wished ? t('product.wishlistRemove') : t('product.wishlistAdd')}>
                  <Heart size={18} className={wished ? 'fill-[#d64545] text-[#d64545]' : ''} />
                </button>
                <button type="button" onClick={share} className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white transition hover:border-ink" aria-label={t('product.share')}>
                  <Share2 size={17} />
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/60">
              {p.reviews.length > 0 && (
                <a href="#avis" className="flex items-center gap-2 hover:text-ink">
                  <Stars size={14} /> {t('product.reviewsCount', { n: p.reviews.length })}
                </a>
              )}
              {isPerfume && <span>{t('product.edp')}</span>}
              {p.family && <span>· {p.family}</span>}
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold">{formatPrice(p.price, lang)}</span>
              {p.kind === 'pack' && (
                <>
                  <span className="text-lg text-ink/40 line-through">{formatPrice(SINGLE_PRICE * 4, lang)}</span>
                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-[12px] font-semibold text-success">
                    {t('product.save', { v: formatPrice(SINGLE_PRICE * 4 - p.price, lang) })}
                  </span>
                </>
              )}
            </div>
            {p.description && (
              <p className="mt-5 text-[15.5px] leading-relaxed text-ink/70" dir="auto">
                {p.description}
              </p>
            )}

            {isPerfume && (
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4">
                  <p className="flex items-center gap-2 text-[12px] text-ink/50">
                    <Clock size={14} /> {t('product.lasting')}
                  </p>
                  <p className="mt-1 font-semibold">{t('product.hours', { a: p.hours[0], b: p.hours[1] })}</p>
                  <Meter value={Math.round(p.hours[1] / 2.4)} className="mt-3" />
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="flex items-center gap-2 text-[12px] text-ink/50">
                    <Wind size={14} /> {t('product.sillage')}
                  </p>
                  <p className="mt-1 font-semibold">{t(`product.strength.${p.strength}` as TKey)}</p>
                  <Meter value={p.strength} className="mt-3" />
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-[12px] text-ink/50">{t('product.seasons')}</p>
                  <div className="mt-2 flex gap-1.5">
                    {(['printemps', 'ete', 'automne', 'hiver'] as Season[]).map((s) => {
                      const Icon = SEASON_ICON[s]
                      const on = p.seasons.includes(s)
                      return (
                        <span key={s} title={t(`season.${s}`)} className={`grid size-9 place-items-center rounded-full ${on ? 'bg-gold/20 text-gold-deep' : 'bg-stone text-ink/20'}`}>
                          <Icon size={16} />
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-[12px] text-ink/50">{t('product.moments')}</p>
                  <div className="mt-2 flex gap-1.5">
                    {(
                      [
                        ['jour', Sun],
                        ['soir', Moon],
                        ['occasion', Sunset],
                      ] as const
                    ).map(([m, Icon]) => (
                      <span key={m} title={t(`moment.${m}`)} className={`grid size-9 place-items-center rounded-full ${p.moments.includes(m) ? 'bg-gold/20 text-gold-deep' : 'bg-stone text-ink/20'}`}>
                        <Icon size={16} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {p.packContents && (
              <div className="mt-6 rounded-2xl bg-white p-4">
                <p className="text-[12px] text-ink/50">{t('product.packContains')}</p>
                <p className="mt-1 font-medium">{p.packContents.join(' · ')}</p>
              </div>
            )}

            {isPerfume && <PackNudge p={p} />}

            <div ref={ctaRef} className="mt-6 flex gap-3">
              <div className="flex items-center rounded-full border border-ink/15 bg-white">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-4" aria-label="-">
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-semibold" aria-label={t('product.qty')}>
                  {qty}
                </span>
                <button type="button" onClick={() => setQty((q) => q + 1)} className="p-4" aria-label="+">
                  <Plus size={16} />
                </button>
              </div>
              <button type="button" onClick={onAdd} disabled={!p.available} className="btn-ink flex-1 py-4 text-[15px]">
                {!p.available ? t('product.soldOut') : added ? <><Check size={18} /> {t('product.added')}</> : t('product.add')}
              </button>
            </div>
            <a href={waLink(productMessage(p.title))} target="_blank" rel="noreferrer" className="btn-whatsapp mt-3 w-full py-4">
              <WhatsAppIcon className="size-5" /> {t('product.orderWhatsapp')}
            </a>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11.5px] text-ink/60">
              <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3">
                <Banknote size={18} className="text-gold-deep" /> {t('trust.cod')}
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3">
                <Truck size={18} className="text-gold-deep" /> {t('trust.delivery')}
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3">
                <Gift size={18} className="text-gold-deep" /> 3 + 1
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4">
              <p className="mb-3 text-[12px] font-medium text-ink/50">{t('delivery.eta')}</p>
              <DeliveryEstimator compact />
            </div>

            <div className="mt-6">
              <Accordion title={t('product.delivery')}>{t('product.deliveryText')}</Accordion>
              <Accordion title={t('product.details')}>
                <p>{p.description}</p>
                {p.year && (
                  <p className="mt-2">
                    {t('product.year')} : {p.year}
                  </p>
                )}
                <p className="mt-3 text-[12.5px] text-ink/45">{t('product.disclaimer')}</p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <Pyramid p={p} />

      {p.reviews.length > 0 && (
        <section id="avis" className="container-x scroll-mt-28 py-20">
          <SectionHeading eyebrow={t('product.reviews')} title={<span className="flex items-center gap-4">5,0 <Stars size={22} /></span>} />
          <div className="grid gap-4 md:grid-cols-2">
            {p.reviews.map((r, i) => (
              <Reveal key={i} delay={i * 0.06} className="card-surface p-6">
                <Stars size={13} />
                <p className="mt-3 text-[15px] leading-relaxed text-ink/75">« {r.text} »</p>
                <p className="mt-4 text-sm font-semibold">{r.author}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="bg-white py-20">
          <div className="container-x">
            <SectionHeading eyebrow={isPerfume ? t('product.completePack') : undefined} title={t('product.similar')} />
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {similar.map((s, i) => (
                <ProductCard key={s.id} p={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {recentProducts.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading title={t('product.recent')} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {recentProducts.map((s, i) => (
              <ProductCard key={s.id} p={s} index={i} />
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed inset-x-0 bottom-[64px] z-30 border-t border-ink/10 bg-white/95 backdrop-blur-xl md:bottom-0"
          >
            <div className="container-x flex items-center gap-3 py-3">
              <Img src={p.images[0]} alt="" width={120} sizes="48px" className="size-12 shrink-0 rounded-xl bg-mist max-sm:hidden" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg leading-tight">{name}</p>
                <p className="text-sm font-semibold">{formatPrice(p.price, lang)}</p>
              </div>
              <button type="button" onClick={onAdd} disabled={!p.available} className="btn-ink px-5 sm:px-8">
                {added ? <Check size={18} /> : <Plus size={18} />} {t('product.add')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
