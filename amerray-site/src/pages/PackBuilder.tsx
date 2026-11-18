import { AnimatePresence, motion } from 'framer-motion'
import { Check, Gift, Plus, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Img } from '../components/ui'
import { displayName, formatPrice, searchProducts, useCatalog, type Gender, type Product } from '../lib/catalog'
import { useI18n, type TKey } from '../lib/i18n'
import { useStore } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const SLOTS = 4

function Slot({ p, index, onRemove }: { p?: Product; index: number; onRemove: () => void }) {
  const { t } = useI18n()
  const free = index === SLOTS - 1
  return (
    <div className="relative">
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-dashed transition ${
          p ? 'border-transparent' : free ? 'border-gold/70 bg-gold/10' : 'border-white/20 bg-white/5'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {p ? (
            <motion.div key={p.id} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} className="absolute inset-0">
              <Img src={p.images[0]} alt={displayName(p)} width={320} sizes="120px" className="h-full" />
              <button type="button" onClick={onRemove} className="absolute end-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-white/90 text-ink" aria-label={t('cart.remove')}>
                <X size={12} />
              </button>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 grid place-items-center text-white/40">
              {free ? <Gift size={22} className="text-gold" /> : <Plus size={22} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className={`mt-2 truncate text-center text-[11px] ${free ? 'font-semibold text-gold' : 'text-white/50'}`}>
        {p ? displayName(p) : free ? t('builder.slotFree') : t('builder.slot', { n: index + 1 })}
      </p>
    </div>
  )
}

export function PackBuilder() {
  const { t, lang } = useI18n()
  const catalog = useCatalog()
  const { add, setCartOpen } = useStore()
  const [params] = useSearchParams()
  const [picked, setPicked] = useState<Product[]>([])
  const [q, setQ] = useState('')
  const [gender, setGender] = useState<'all' | Gender>('all')
  const [limit, setLimit] = useState(36)
  useDocumentTitle(t('builder.title'), t('builder.text'))

  useEffect(() => {
    const w = params.get('with')
    if (!catalog || !w) return
    const p = catalog.products.find((x) => x.handle === w && x.kind === 'perfume')
    if (p) setPicked((cur) => (cur.some((c) => c.id === p.id) ? cur : [p, ...cur].slice(0, SLOTS)))
  }, [catalog, params])

  const pool = useMemo(() => {
    if (!catalog) return []
    const perfumes = catalog.products.filter((p) => p.kind === 'perfume' && p.available && (gender === 'all' || p.gender === gender))
    return q ? searchProducts(perfumes, q, 200) : perfumes
  }, [catalog, q, gender])

  const toggle = (p: Product) =>
    setPicked((cur) => (cur.some((c) => c.id === p.id) ? cur.filter((c) => c.id !== p.id) : cur.length >= SLOTS ? cur : [...cur, p]))

  const sorted = [...picked].sort((a, b) => b.price - a.price)
  const full = picked.length === SLOTS
  const gross = picked.reduce((s, p) => s + p.price, 0)
  const total = full ? gross - sorted[SLOTS - 1].price : gross
  const slots = Array.from({ length: SLOTS }, (_, i) => picked[i])

  const addPack = () => {
    for (const p of picked) add(p, 1, { silent: true })
    setPicked([])
    setCartOpen(true)
  }

  const tabs: { id: 'all' | Gender; key: TKey }[] = [
    { id: 'all', key: 'home.tab.all' },
    { id: 'homme', key: 'gender.homme' },
    { id: 'femme', key: 'gender.femme' },
    { id: 'unisexe', key: 'gender.unisexe' },
  ]

  const Box = (
    <div className="rounded-[28px] bg-ink p-5 text-white sm:p-6">
      <div className="grid grid-cols-4 gap-2.5">
        {slots.map((p, i) => (
          <Slot key={i} p={p} index={i} onRemove={() => p && toggle(p)} />
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-[12px] text-white/50">{t('builder.total')}</p>
          <p className="font-display text-4xl text-gold-soft">{formatPrice(total, lang)}</p>
        </div>
        {full && <p className="pb-1 text-[13px] text-white/45 line-through">{formatPrice(gross, lang)}</p>}
      </div>
      <button type="button" onClick={addPack} disabled={!full} className="btn-gold mt-4 w-full py-4">
        {full ? (
          <>
            <Gift size={17} /> {t('builder.add')}
          </>
        ) : (
          t('builder.remaining', { n: SLOTS - picked.length })
        )}
      </button>
      {picked.length > 0 && (
        <button type="button" onClick={() => setPicked([])} className="mt-3 w-full text-center text-[12px] text-white/50 underline underline-offset-4">
          {t('builder.clear')}
        </button>
      )}
    </div>
  )

  return (
    <div className="pb-44 lg:pb-24">
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute -top-40 end-0 size-[500px] rounded-full bg-gold/20 blur-[140px]" />
        <div className="container-x relative py-14 lg:py-20">
          <p className="eyebrow text-gold">{t('builder.eyebrow')}</p>
          <h1 className="font-display mt-4 text-5xl leading-none sm:text-7xl">{t('builder.title')}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/60">{t('builder.text')}</p>
        </div>
      </section>

      <div className="container-x mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-3 focus-within:border-ink">
              <Search size={16} className="text-ink/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search.short')} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
            </label>
            <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1">
              {tabs.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setGender(x.id)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap transition ${gender === x.id ? 'bg-ink text-white' : 'text-ink/60'}`}
                >
                  {t(x.key)}
                </button>
              ))}
            </div>
          </div>
          {!catalog ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-5">
                {pool.slice(0, limit).map((p) => {
                  const on = picked.some((c) => c.id === p.id)
                  const disabled = !on && full
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggle(p)}
                      disabled={disabled}
                      className={`group relative overflow-hidden rounded-2xl bg-white text-start transition ${on ? 'ring-2 ring-gold' : ''} ${disabled ? 'opacity-40' : 'hover:-translate-y-0.5'}`}
                    >
                      <Img src={p.images[0]} alt={displayName(p)} width={320} sizes="(min-width:1024px) 15vw, 30vw" className="aspect-square bg-mist" />
                      <span className={`absolute end-2 top-2 grid size-7 place-items-center rounded-full transition ${on ? 'bg-gold text-ink' : 'bg-white/90 text-ink'}`}>
                        {on ? <Check size={14} /> : <Plus size={14} />}
                      </span>
                      <span className="block p-2.5">
                        <span className="block truncate text-[13px] font-semibold" dir="auto">
                          {displayName(p)}
                        </span>
                        <span className="block truncate text-[11px] text-ink/45">{p.brand}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              {limit < pool.length && (
                <div className="mt-10 flex justify-center">
                  <button type="button" onClick={() => setLimit((l) => l + 36)} className="btn-ghost">
                    {t('collection.more')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-28">{Box}</div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-[64px] z-30 border-t border-white/10 bg-ink p-3 text-white md:bottom-0 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {slots.map((p, i) => (
              <span key={i} className={`size-11 overflow-hidden rounded-xl border border-dashed ${p ? 'border-transparent' : i === 3 ? 'border-gold/60 bg-gold/10' : 'border-white/25'}`}>
                {p ? <Img src={p.images[0]} alt="" width={120} sizes="44px" className="size-full" /> : i === 3 ? <Gift size={14} className="m-auto mt-3.5 text-gold" /> : null}
              </span>
            ))}
          </div>
          <button type="button" onClick={addPack} disabled={!full} className="btn-gold ms-auto flex-1 px-3 py-3 text-[13px]">
            {full ? `${formatPrice(total, lang)} · ${t('nav.cart')}` : t('builder.remaining', { n: SLOTS - picked.length })}
          </button>
        </div>
      </div>
    </div>
  )
}
