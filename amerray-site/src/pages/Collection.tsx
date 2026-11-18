import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { COLLECTIONS, normalize, searchProducts, useCatalog, type Product } from '../lib/catalog'
import { useI18n, type TKey } from '../lib/i18n'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const PAGE = 24

type FilterKey = 'gender' | 'family' | 'season' | 'moment' | 'strength'

const FILTERS: { key: FilterKey; label: TKey; options: { value: string; label: TKey }[] }[] = [
  {
    key: 'gender',
    label: 'collection.gender',
    options: [
      { value: 'homme', label: 'gender.homme' },
      { value: 'femme', label: 'gender.femme' },
      { value: 'unisexe', label: 'gender.unisexe' },
    ],
  },
  {
    key: 'family',
    label: 'collection.family',
    options: [
      { value: 'frais', label: 'family.frais' },
      { value: 'floral', label: 'family.floral' },
      { value: 'oriental', label: 'family.oriental' },
      { value: 'boise', label: 'family.boise' },
      { value: 'gourmand', label: 'family.gourmand' },
    ],
  },
  {
    key: 'season',
    label: 'collection.season',
    options: [
      { value: 'printemps', label: 'season.printemps' },
      { value: 'ete', label: 'season.ete' },
      { value: 'automne', label: 'season.automne' },
      { value: 'hiver', label: 'season.hiver' },
    ],
  },
  {
    key: 'moment',
    label: 'collection.moment',
    options: [
      { value: 'jour', label: 'moment.jour' },
      { value: 'soir', label: 'moment.soir' },
      { value: 'occasion', label: 'moment.occasion' },
    ],
  },
  {
    key: 'strength',
    label: 'collection.strength',
    options: [
      { value: 'soft', label: 'collection.strength.soft' },
      { value: 'mid', label: 'collection.strength.mid' },
      { value: 'strong', label: 'collection.strength.strong' },
    ],
  },
]

const SORTS: { value: string; label: TKey }[] = [
  { value: 'best', label: 'collection.sort.best' },
  { value: 'new', label: 'collection.sort.new' },
  { value: 'price-asc', label: 'collection.sort.priceAsc' },
  { value: 'price-desc', label: 'collection.sort.priceDesc' },
  { value: 'az', label: 'collection.sort.az' },
]

function matches(p: Product, key: FilterKey, values: string[]) {
  if (!values.length) return true
  switch (key) {
    case 'gender':
      return values.includes(p.gender)
    case 'family':
      return values.includes(p.familyGroup)
    case 'season':
      return p.seasons.some((s) => values.includes(s))
    case 'moment':
      return p.moments.some((m) => values.includes(m))
    case 'strength':
      return values.some((v) => (v === 'soft' ? p.strength <= 2 : v === 'mid' ? p.strength === 3 : p.strength >= 4))
  }
}

function FilterPanel({
  params,
  toggle,
  available,
}: {
  params: URLSearchParams
  toggle: (k: FilterKey, v: string) => void
  available: FilterKey[]
}) {
  const { t } = useI18n()
  return (
    <div className="space-y-8">
      {FILTERS.filter((f) => available.includes(f.key)).map((f) => {
        const selected = params.getAll(f.key)
        return (
          <div key={f.key}>
            <p className="eyebrow mb-3 text-ink/50">{t(f.label)}</p>
            <div className="flex flex-wrap gap-2">
              {f.options.map((o) => {
                const on = selected.includes(o.value)
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => toggle(f.key, o.value)}
                    className={`chip ${on ? 'border-ink bg-ink text-white' : 'border-ink/10 bg-white hover:border-ink/40'}`}
                    aria-pressed={on}
                  >
                    {t(o.label)}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Collection() {
  const { handle = 'tous' } = useParams()
  const { t } = useI18n()
  const catalog = useCatalog()
  const [params, setParams] = useSearchParams()
  const [pager, setPager] = useState({ key: '', n: PAGE })
  const [drawer, setDrawer] = useState(false)
  const def = COLLECTIONS.find((c) => c.handle === handle) ?? COLLECTIONS[0]
  const titleKey = `col.${def.handle}.t` as TKey
  const descKey = `col.${def.handle}.d` as TKey
  useDocumentTitle(t(titleKey), t(descKey))

  const q = params.get('q') ?? ''
  const sort = params.get('sort') ?? 'best'
  const isPerfumeCollection = !['packs', 'musc-bakhour', 'maison-corps', 'kids'].includes(def.handle)
  const available: FilterKey[] = isPerfumeCollection
    ? ['homme', 'femme', 'unisexe'].includes(def.handle)
      ? ['family', 'season', 'moment', 'strength']
      : ['gender', 'family', 'season', 'moment', 'strength']
    : []

  const base = useMemo(() => (catalog ? catalog.products.filter(def.match) : []), [catalog, def])

  const filtered = useMemo(() => {
    let list = q ? searchProducts(base, q, 500) : base
    for (const f of FILTERS) list = list.filter((p) => matches(p, f.key, params.getAll(f.key)))
    const sorted = [...list]
    if (!q || sort !== 'best') {
      sorted.sort((a, b) => {
        switch (sort) {
          case 'new':
            return b.createdAt.localeCompare(a.createdAt)
          case 'price-asc':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'az':
            return normalize(a.inspired ?? a.title).localeCompare(normalize(b.inspired ?? b.title))
          default:
            return (a.bestRank ?? 9999) - (b.bestRank ?? 9999)
        }
      })
    }
    return sorted
  }, [base, q, sort, params])

  const pagerKey = `${handle}?${params.toString()}`
  const shown = pager.key === pagerKey ? pager.n : PAGE
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
  }, [drawer])

  const toggle = (k: FilterKey, v: string) => {
    const next = new URLSearchParams(params)
    const cur = next.getAll(k)
    next.delete(k)
    for (const x of cur.includes(v) ? cur.filter((c) => c !== v) : [...cur, v]) next.append(k, x)
    setParams(next, { replace: true })
  }
  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }
  const reset = () => setParams(q ? { q } : {}, { replace: true })
  const activeCount = FILTERS.reduce((n, f) => n + params.getAll(f.key).length, 0)
  const activeChips = FILTERS.flatMap((f) => params.getAll(f.key).map((v) => ({ k: f.key, v, label: f.options.find((o) => o.value === v)?.label })))

  return (
    <div className="pb-24">
      <section className="border-b border-ink/5 bg-white">
        <div className="container-x py-12 lg:py-16">
          <nav className="mb-5 text-[12px] text-ink/45">
            <Link to="/" className="hover:text-ink">
              {t('nav.home')}
            </Link>{' '}
            / <span className="text-ink/70">{t(titleKey)}</span>
          </nav>
          <motion.h1 key={handle} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl leading-none sm:text-7xl">
            {t(titleKey)}
          </motion.h1>
          <p className="mt-4 max-w-2xl text-[16px] text-ink/60">{t(descKey)}</p>
          <div className="no-scrollbar mt-8 -mb-px flex gap-2 overflow-x-auto">
            {COLLECTIONS.filter((c) => !['tous', 'maison-corps', 'kids'].includes(c.handle)).map((c) => (
              <Link
                key={c.handle}
                to={`/collection/${c.handle}`}
                className={`chip ${c.handle === def.handle ? 'border-ink bg-ink text-white' : 'border-ink/10 hover:border-ink/40'}`}
              >
                {t(`col.${c.handle}.t` as TKey)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-x pt-8">
        <div className="sticky top-[68px] z-20 -mx-5 mb-8 flex items-center gap-2 bg-stone/90 px-5 py-3 backdrop-blur-xl sm:mx-0 sm:px-0 lg:top-[76px]">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 focus-within:border-ink lg:max-w-md">
            <Search size={16} className="shrink-0 text-ink/40" />
            <input
              value={q}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder={t('collection.searchIn')}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            {q && (
              <button type="button" onClick={() => setParam('q', '')} aria-label={t('common.close')}>
                <X size={14} />
              </button>
            )}
          </label>
          {available.length > 0 && (
            <button type="button" onClick={() => setDrawer(true)} className="chip relative border-ink/10 bg-white py-2.5 lg:hidden">
              <SlidersHorizontal size={15} /> {t('collection.filters')}
              {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-gold text-[11px] font-bold">{activeCount}</span>}
            </button>
          )}
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value === 'best' ? '' : e.target.value)}
            className="ms-auto cursor-pointer rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm outline-none max-sm:w-[44px] max-sm:appearance-none max-sm:px-0 max-sm:text-transparent"
            aria-label={t('collection.sort')}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value} className="text-ink">
                {t(s.label)}
              </option>
            ))}
          </select>
        </div>

        <div className={`grid gap-10 ${available.length ? 'lg:grid-cols-[250px_1fr]' : ''}`}>
          {available.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-44">
                <FilterPanel params={params} toggle={toggle} available={available} />
                {activeCount > 0 && (
                  <button type="button" onClick={reset} className="mt-8 text-sm font-medium underline underline-offset-4">
                    {t('collection.reset')}
                  </button>
                )}
              </div>
            </aside>
          )}
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <p className="me-2 text-sm text-ink/50">{catalog ? t('collection.count', { n: filtered.length }) : t('common.loading')}</p>
              {activeChips.map((c) => (
                <button key={`${c.k}-${c.v}`} type="button" onClick={() => toggle(c.k, c.v)} className="chip border-ink/15 bg-white text-[12px]">
                  {c.label && t(c.label)} <X size={12} />
                </button>
              ))}
            </div>
            {!catalog ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="card-surface flex flex-col items-center gap-4 p-12 text-center">
                <p className="text-ink/60">{t('collection.empty')}</p>
                <button type="button" onClick={reset} className="btn-ink">
                  {t('collection.reset')}
                </button>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 ${available.length ? 'xl:grid-cols-4' : 'lg:grid-cols-4'}`}>
                  {filtered.slice(0, shown).map((p, i) => (
                    <ProductCard key={p.id} p={p} index={i} />
                  ))}
                </div>
                {shown < filtered.length && (
                  <div className="mt-14 flex flex-col items-center gap-3">
                    <p className="text-[13px] text-ink/50">{t('collection.showing', { a: shown, b: filtered.length })}</p>
                    <div className="h-1 w-48 overflow-hidden rounded-full bg-ink/10">
                      <div className="h-full bg-ink" style={{ width: `${(shown / filtered.length) * 100}%` }} />
                    </div>
                    <button type="button" onClick={() => setPager({ key: pagerKey, n: shown + PAGE })} className="btn-ink mt-2">
                      {t('collection.more')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-[28px] bg-stone"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            >
              <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-ink/20" />
              <div className="flex items-center justify-between px-5 py-4">
                <p className="font-display text-2xl">{t('collection.filters')}</p>
                <button type="button" onClick={reset} className="text-sm font-medium underline underline-offset-4">
                  {t('collection.reset')}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-6">
                <FilterPanel params={params} toggle={toggle} available={available} />
              </div>
              <div className="border-t border-ink/10 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <button type="button" onClick={() => setDrawer(false)} className="btn-ink w-full py-4">
                  {t('collection.apply', { n: filtered.length })}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
