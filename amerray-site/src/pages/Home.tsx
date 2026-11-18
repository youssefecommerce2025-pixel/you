import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Candy, Flame, Flower2, Gift, MapPin, Plus, Search, Sparkles, Trees, Waves } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CAMPAIGNS, CampaignSlider } from '../components/CampaignSlider'
import { POPULAR } from '../components/SearchOverlay'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { DeliveryEstimator, TrustRow } from '../components/Footer'
import { Img, Reveal, SectionHeading, Stars } from '../components/ui'
import { COLLECTIONS, displayName, formatPrice, useCatalog, type FamilyGroup, type Gender, type Product } from '../lib/catalog'
import { useI18n, type TKey } from '../lib/i18n'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { waLink } from '../lib/whatsapp'

function useTypewriter(words: string[], speed = 80, pause = 1600) {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = words[i % words.length]
    const done = !deleting && text === word
    const empty = deleting && text === ''
    const id = setTimeout(
      () => {
        if (done) setDeleting(true)
        else if (empty) {
          setDeleting(false)
          setI((x) => x + 1)
        } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
      },
      done ? pause : deleting ? speed / 2 : speed,
    )
    return () => clearTimeout(id)
  }, [text, deleting, i, words, speed, pause])
  return text
}

function Hero({ onSearch, products }: { onSearch: (q?: string) => void; products: Product[] }) {
  const { t, lang } = useI18n()
  const typed = useTypewriter(POPULAR)
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -160])
  const hero = products.filter((p) => p.kind === 'perfume' && p.images[0]).slice(0, 3)
  const featured = hero[0]

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink text-white">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      <div className="pointer-events-none absolute -top-40 start-[-10%] size-[700px] rounded-full bg-gold/20 blur-[140px]" />
      <div className="pointer-events-none absolute end-[-10%] bottom-[-30%] size-[600px] rounded-full bg-royal/25 blur-[140px]" />

      <div className="container-x relative grid items-center gap-12 pt-10 pb-16 lg:min-h-[calc(100vh-110px)] lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:py-16">
        <div className="min-w-0">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="eyebrow flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-gold" /> {t('hero.eyebrow')}
          </motion.p>
          <h1 className="font-display mt-6 text-[clamp(3rem,7.4vw,6.6rem)] leading-[0.95] font-medium tracking-[-0.02em]">
            <motion.span className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
              {t('hero.title.1')}
            </motion.span>
            <motion.span
              className="text-gradient-gold block italic rtl:not-italic"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {t('hero.title.2')}
            </motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/65 sm:text-lg">
            {t('hero.subtitle')}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-8 max-w-xl">
            <p className="mb-2.5 text-[13px] font-medium text-white/50">{t('hero.searchLabel')}</p>
            <button
              type="button"
              onClick={() => onSearch()}
              className="group flex w-full items-center gap-3 rounded-full bg-white py-2 ps-5 pe-2 text-start text-ink shadow-[0_20px_60px_-20px_rgba(201,162,77,0.6)] transition hover:shadow-[0_20px_60px_-10px_rgba(201,162,77,0.8)]"
            >
              <Search size={20} className="shrink-0 text-ink/40" />
              <span className="flex-1 truncate text-[16px] text-ink/80" dir="ltr">
                {typed}
                <span className="ms-0.5 inline-block h-5 w-px translate-y-1 animate-pulse bg-ink" />
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white transition group-hover:bg-gold group-hover:text-ink">
                <ArrowRight size={18} className="rtl:rotate-180" />
              </span>
            </button>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {POPULAR.slice(0, 5).map((s) => (
                <button key={s} type="button" onClick={() => onSearch(s)} className="chip border-white/15 text-white/70 hover:border-gold hover:text-gold-soft">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.8 }} className="mt-8 flex flex-wrap gap-3">
            <Link to="/pack" className="btn-gold">
              <Gift size={17} /> {t('hero.ctaPack')}
            </Link>
            <Link to="/quiz" className="btn-ghost text-white">
              <Sparkles size={17} /> {t('hero.ctaQuiz')}
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 grid max-w-xl grid-cols-4 gap-4 border-t border-white/10 pt-6"
          >
            {(
              [
                ['10 000+', 'hero.stat.clients'],
                ['100+', 'hero.stat.cities'],
                ['6–12', 'hero.stat.hours'],
                ['100 %', 'hero.stat.cod'],
              ] as [string, TKey][]
            ).map(([v, k]) => (
              <div key={k}>
                <dt className="font-display text-2xl text-gold-soft sm:text-3xl" dir="ltr">
                  {v}
                </dt>
                <dd className="mt-1 text-[11px] leading-tight text-white/50 sm:text-[12px]">{t(k)}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px] max-lg:max-w-[440px]">
          {hero[1] && (
            <motion.div style={{ y: y2 }} className="absolute start-0 top-[8%] w-[46%]">
              <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <Link to={`/produit/${hero[1].handle}`} className="block overflow-hidden rounded-t-full rounded-b-[28px] ring-1 ring-white/10">
                  <Img src={hero[1].images[0]} alt={displayName(hero[1])} eager width={480} sizes="25vw" className="aspect-[3/4.4]" />
                </Link>
              </motion.div>
            </motion.div>
          )}
          {featured && (
            <motion.div style={{ y: y1 }} className="absolute end-0 top-0 w-[58%]">
              <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                <Link to={`/produit/${featured.handle}`} className="block overflow-hidden rounded-t-full rounded-b-[32px] ring-1 ring-gold/30">
                  <Img src={featured.images[0]} alt={displayName(featured)} eager width={720} sizes="35vw" className="aspect-[3/4.3]" />
                </Link>
              </motion.div>
            </motion.div>
          )}
          {hero[2] && (
            <motion.div style={{ y: y1 }} className="absolute start-[22%] bottom-0 w-[40%]">
              <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <Link to={`/produit/${hero[2].handle}`} className="block overflow-hidden rounded-[28px] ring-1 ring-white/10">
                  <Img src={hero[2].images[0]} alt={displayName(hero[2])} eager width={480} sizes="22vw" className="aspect-square" />
                </Link>
              </motion.div>
            </motion.div>
          )}
          {featured && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="animate-float absolute end-[-4%] bottom-[16%] w-[230px] rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
            >
              <Stars size={12} />
              <p className="font-display mt-1.5 text-lg leading-tight" dir="auto">
                {displayName(featured)}
              </p>
              <p className="mt-0.5 text-[12px] text-white/55">
                {t('product.inspiredBy')} · {featured.brand}
              </p>
              <p className="mt-2 text-sm font-semibold text-gold-soft">{formatPrice(featured.price, lang)}</p>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, rotate: -40 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.9, duration: 1.2 }}
            className="absolute start-[-3%] bottom-[30%] grid size-28 place-items-center"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin_18s_linear_infinite] text-gold-soft">
              <defs>
                <path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="9.5" letterSpacing="2.4" fill="currentColor">
                <textPath href="#circle">3 ACHETÉS · 1 OFFERT · 3 ACHETÉS · 1 OFFERT ·</textPath>
              </text>
            </svg>
            <span className="grid size-14 place-items-center rounded-full bg-gold text-[15px] font-bold text-ink">3+1</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const CATEGORY_TILES: { handle: string; key: TKey; span: string }[] = [
  { handle: 'homme', key: 'nav.men', span: 'lg:col-span-2 lg:row-span-2' },
  { handle: 'femme', key: 'nav.women', span: 'lg:col-span-2 lg:row-span-2' },
  { handle: 'arabic', key: 'nav.arabic', span: 'lg:col-span-2' },
  { handle: 'niche', key: 'nav.niche', span: '' },
  { handle: 'unisexe', key: 'nav.unisex', span: '' },
  { handle: 'packs', key: 'nav.packs', span: 'col-span-2 lg:col-span-6' },
]

function Univers({ products }: { products: Product[] }) {
  const { t } = useI18n()
  return (
    <section id="univers" className="container-x py-16 lg:py-20">
      <SectionHeading eyebrow={t('home.univers.eyebrow')} title={t('home.univers.title')} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
        {CAMPAIGNS.map((c, i) => {
          const def = COLLECTIONS.find((d) => d.handle === c.handle)!
          const count = products.filter(def.match).length
          return (
            <Reveal key={c.handle} delay={i * 0.04}>
              <Link to={`/collection/${c.handle}`} className="group block overflow-hidden rounded-[22px] bg-white">
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-2">
                  <Img
                    src={c.image}
                    alt={t(`col.${c.handle}.t` as TKey)}
                    width={720}
                    sizes="(min-width:768px) 25vw, 50vw"
                    className="absolute inset-0 h-full transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{t(`col.${c.handle}.t` as TKey)}</p>
                    <p className="text-[12px] text-ink/45">{t('collection.count', { n: count })}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-ink/35 transition group-hover:text-gold-deep rtl:rotate-180" />
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function Categories({ products }: { products: Product[] }) {
  const { t } = useI18n()
  const tiles = useMemo(
    () =>
      CATEGORY_TILES.map((c) => {
        const def = COLLECTIONS.find((d) => d.handle === c.handle)!
        const items = products.filter(def.match)
        const pick = c.handle === 'femme' ? items[2] : c.handle === 'unisexe' ? items[3] : items[0]
        return { ...c, image: pick?.images[0], count: items.length }
      }),
    [products],
  )
  return (
    <section className="container-x py-20 lg:py-28">
      <SectionHeading eyebrow={t('home.categories.eyebrow')} title={t('home.categories.title')} />
      <div className="grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] lg:grid-cols-6 lg:gap-4">
        {tiles.map((c, i) => (
          <Reveal key={c.handle} delay={i * 0.05} className={`${c.span} ${i < 2 ? 'max-lg:col-span-1 max-lg:row-span-2' : ''}`}>
            <Link to={`/collection/${c.handle}`} className="group relative block h-full overflow-hidden rounded-[24px] bg-ink-2">
              <Img src={c.image} alt={t(c.key)} width={900} sizes="(min-width:1024px) 33vw, 50vw" className="absolute inset-0 h-full transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                <div>
                  <p className="font-display text-[26px] leading-none sm:text-3xl">{t(c.key)}</p>
                  <p className="mt-1.5 text-[12px] text-white/60">{t('collection.count', { n: c.count })}</p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-gold group-hover:text-ink">
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function BestSellers({ products }: { products: Product[] }) {
  const { t } = useI18n()
  const [tab, setTab] = useState<'all' | Gender>('all')
  const list = useMemo(
    () => products.filter((p) => p.kind === 'perfume' && p.bestRank !== undefined && (tab === 'all' || p.gender === tab)).slice(0, 8),
    [products, tab],
  )
  const tabs: { id: 'all' | Gender; key: TKey }[] = [
    { id: 'all', key: 'home.tab.all' },
    { id: 'homme', key: 'gender.homme' },
    { id: 'femme', key: 'gender.femme' },
    { id: 'unisexe', key: 'gender.unisexe' },
  ]
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow={t('home.best.eyebrow')}
          title={t('home.best.title')}
          action={
            <div className="flex items-center gap-2">
              <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-stone p-1">
                {tabs.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setTab(x.id)}
                    className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition ${tab === x.id ? 'text-white' : 'text-ink/60 hover:text-ink'}`}
                  >
                    {tab === x.id && <motion.span layoutId="best-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', damping: 30, stiffness: 400 }} />}
                    <span className="relative">{t(x.key)}</span>
                  </button>
                ))}
              </div>
            </div>
          }
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:px-0 lg:grid-cols-4"
          >
            {list.map((p, i) => (
              <div key={p.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
                <ProductCard p={p} index={i} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="mt-12 flex justify-center">
          <Link to="/collection/best-sellers" className="btn-ghost">
            {t('home.best.all')} <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function PackOffer({ products }: { products: Product[] }) {
  const { t } = useI18n()
  const pack = products.find((p) => p.kind === 'pack' && /pack n°2 v2/i.test(p.title)) ?? products.find((p) => p.kind === 'pack')
  return (
    <section className="container-x py-20 lg:py-28">
      <div className="relative overflow-hidden rounded-[36px] bg-ink text-white">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay" />
        <div className="pointer-events-none absolute -end-20 -top-20 size-[420px] rounded-full bg-gold/25 blur-[120px]" />
        <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <Reveal>
            <p className="eyebrow text-gold">{t('home.offer.eyebrow')}</p>
            <h2 className="font-display mt-4 text-5xl leading-[1] font-medium sm:text-6xl lg:text-7xl">{t('home.offer.title')}</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">{t('home.offer.text')}</p>
            <div className="mt-8 flex items-end gap-4">
              <span className="font-display text-6xl text-gold-soft">299</span>
              <span className="pb-2 text-white/50">
                DH · <span className="line-through">399,96 DH</span>
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/pack" className="btn-gold">
                <Gift size={17} /> {t('home.offer.cta')}
              </Link>
              <Link to="/collection/packs" className="btn-ghost text-white">
                {t('home.offer.ready')}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="relative">
            {pack && (
              <Link to={`/produit/${pack.handle}`} className="block overflow-hidden rounded-[28px] ring-1 ring-gold/30">
                <Img src={pack.images[0]} alt={pack.title} width={960} sizes="(min-width:1024px) 40vw, 90vw" className="aspect-square" />
              </Link>
            )}
            <div className="absolute -start-4 -bottom-5 flex gap-2 rounded-2xl bg-white p-3 text-ink shadow-2xl">
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className={`grid size-12 place-items-center rounded-xl text-sm font-bold ${n === 4 ? 'bg-gold text-ink' : 'bg-stone text-ink/70'}`}
                >
                  {n === 4 ? <Gift size={18} /> : n}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const { t } = useI18n()
  const steps: [TKey, TKey][] = [
    ['home.how.1.t', 'home.how.1.d'],
    ['home.how.2.t', 'home.how.2.d'],
    ['home.how.3.t', 'home.how.3.d'],
    ['home.how.4.t', 'home.how.4.d'],
  ]
  return (
    <section className="container-x pb-20 lg:pb-28">
      <SectionHeading eyebrow={t('home.how.eyebrow')} title={t('home.how.title')} align="center" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([title, d], i) => (
          <Reveal key={title} delay={i * 0.08} className="card-surface relative p-7">
            <span className="font-display text-6xl text-gold/40">0{i + 1}</span>
            <p className="font-display mt-4 text-3xl">{t(title)}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink/60">{t(d)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function QuizTeaser() {
  const { t } = useI18n()
  return (
    <section className="container-x pb-20 lg:pb-28">
      <Reveal className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-navy via-royal to-navy p-8 text-white sm:p-14">
        <div className="grain pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay" />
        <Sparkles className="absolute end-10 top-10 size-40 text-white/5" strokeWidth={0.8} />
        <div className="relative max-w-2xl">
          <p className="eyebrow text-gold-soft">{t('home.quiz.eyebrow')}</p>
          <h2 className="font-display mt-4 text-4xl leading-tight sm:text-6xl">{t('home.quiz.title')}</h2>
          <p className="mt-4 max-w-lg text-lg text-white/70">{t('home.quiz.text')}</p>
          <Link to="/quiz" className="btn mt-8 bg-white text-ink hover:bg-gold-soft">
            <Sparkles size={17} /> {t('home.quiz.cta')}
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

const FAMILIES: { id: FamilyGroup; icon: typeof Waves; tint: string }[] = [
  { id: 'frais', icon: Waves, tint: 'from-[#dfeaf3] to-[#c5d8e8]' },
  { id: 'floral', icon: Flower2, tint: 'from-[#f6e6e8] to-[#ecd0d5]' },
  { id: 'oriental', icon: Flame, tint: 'from-[#f3e2cc] to-[#e5c79f]' },
  { id: 'boise', icon: Trees, tint: 'from-[#e6e0d6] to-[#cfc3ae]' },
  { id: 'gourmand', icon: Candy, tint: 'from-[#f2e6d8] to-[#e2cbaf]' },
]

function Families({ products }: { products: Product[] }) {
  const { t } = useI18n()
  return (
    <section className="container-x pb-20 lg:pb-28">
      <SectionHeading eyebrow={t('home.families.eyebrow')} title={t('home.families.title')} />
      <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-5 lg:gap-4">
        {FAMILIES.map(({ id, icon: Icon, tint }, i) => {
          const count = products.filter((p) => p.kind === 'perfume' && p.familyGroup === id).length
          return (
            <Reveal key={id} delay={i * 0.06} className="w-[62%] shrink-0 snap-start sm:w-auto">
              <Link to={`/collection/tous?family=${id}`} className={`group flex h-full min-h-[220px] flex-col rounded-[24px] bg-gradient-to-br ${tint} p-6 transition hover:-translate-y-1`}>
                <Icon size={30} strokeWidth={1.3} className="text-ink/70" />
                <p className="font-display mt-auto text-[28px] leading-tight">{t(`family.${id}`)}</p>
                <p className="mt-1 text-[13px] text-ink/55">{t(`family.${id}.d` as TKey)}</p>
                <p className="mt-4 flex items-center gap-2 text-[13px] font-semibold">
                  {t('collection.count', { n: count })} <ArrowRight size={14} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </p>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function Tradition({ products }: { products: Product[] }) {
  const { t } = useI18n()
  const items = products.filter((p) => p.kind === 'musc' || p.kind === 'bakhour').slice(0, 4)
  return (
    <section className="container-x py-20 lg:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow text-gold-deep">{t('home.tradition.eyebrow')}</p>
          <h2 className="font-display mt-4 text-5xl leading-[1.02] sm:text-6xl">{t('home.tradition.title')}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/60">{t('home.tradition.text')}</p>
          <Link to="/collection/musc-bakhour" className="btn-ink mt-8">
            {t('home.tradition.cta')} <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className={i % 2 ? 'translate-y-8' : ''}>
              <Link to={`/produit/${p.handle}`} className="group block">
                <Img src={p.images[0]} alt={p.title} width={600} sizes="(min-width:1024px) 25vw, 45vw" className="aspect-[4/5] rounded-[24px] bg-mist" />
                <p className="mt-3 line-clamp-1 text-sm font-medium" dir="auto">
                  {p.title.split('|')[0]}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function DeliverySection() {
  const { t } = useI18n()
  const zones: [string, string][] = [
    ['24 h', 'Casablanca · Rabat · Salé · Mohammedia · Témara'],
    ['24 – 48 h', 'Marrakech · Fès · Tanger · Meknès · Agadir · Oujda'],
    ['48 – 72 h', 'El Jadida · Beni Mellal · Khouribga · Safi · Nador'],
    ['3 – 5 j', 'Sud · Atlas · Laâyoune · Dakhla · zones rurales'],
  ]
  return (
    <section id="livraison" className="scroll-mt-28 bg-white py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading eyebrow={t('home.delivery.eyebrow')} title={t('home.delivery.title')} />
          <Reveal>
            <DeliveryEstimator />
          </Reveal>
        </div>
        <div className="flex flex-col justify-end">
          {zones.map(([time, cities], i) => (
            <Reveal key={time} delay={i * 0.06} className="flex items-baseline gap-6 border-b border-ink/10 py-5">
              <span className="font-display w-28 shrink-0 text-3xl text-gold-deep" dir="ltr">
                {time}
              </span>
              <span className="text-[15px] text-ink/65">{cities}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function StoreSection() {
  const { t } = useI18n()
  return (
    <section id="boutique" className="container-x scroll-mt-28 py-20 lg:py-28">
      <div className="grid overflow-hidden rounded-[36px] bg-ink text-white lg:grid-cols-2">
        <div className="p-8 sm:p-14">
          <p className="eyebrow text-gold">{t('home.store.eyebrow')}</p>
          <h2 className="font-display mt-4 text-5xl leading-tight">{t('home.store.title')}</h2>
          <p className="mt-4 max-w-md text-lg text-white/60">{t('home.store.text')}</p>
          <a href="https://maps.app.goo.gl/u3we468h19cwHCj96" target="_blank" rel="noreferrer" className="btn-gold mt-8">
            <MapPin size={17} /> {t('home.store.cta')}
          </a>
        </div>
        <iframe
          title="Amerray Perfume Casablanca"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3340.4898586378276!2d-7.515617888723629!3d33.600591773219065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cb6a1f4eb03d%3A0x8955de66e98d451c!2sAmerray%20Perfume!5e1!3m2!1sen!2sma!4v1762968504200!5m2!1sen!2sma"
          className="h-[340px] w-full grayscale-[0.6] lg:h-full lg:min-h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}

const FAQ_GROUPS: { cat: TKey; items: { n: number; note?: TKey }[] }[] = [
  { cat: 'faq.cat.quality', items: [{ n: 1 }, { n: 2 }, { n: 3 }] },
  { cat: 'faq.cat.price', items: [{ n: 4, note: 'faq.4.note' }, { n: 5 }, { n: 6 }] },
  { cat: 'faq.cat.delivery', items: [{ n: 7 }, { n: 8 }, { n: 9 }] },
  { cat: 'faq.cat.service', items: [{ n: 10 }, { n: 11 }, { n: 12 }] },
]

export function Faq() {
  const { t } = useI18n()
  const [open, setOpen] = useState<number | null>(null)
  const toggle = (n: number) => setOpen((cur) => (cur === n ? null : n))
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map(({ n }) => ({
      '@type': 'Question',
      name: t(`faq.${n}.q` as TKey),
      acceptedAnswer: { '@type': 'Answer', text: t(`faq.${n}.a` as TKey).replaceAll('\n', ' ') },
    })),
  }
  return (
    <section id="faq" className="scroll-mt-28 bg-[#f4f6f8] py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl">{t('home.faq.title')}</h2>
          <p className="mt-4 text-[15px] text-ink/55">{t('home.faq.subtitle')}</p>
        </div>
        <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FAQ_GROUPS.map((group) => (
            <article key={group.cat} className="rounded-[22px] border border-ink/8 bg-white p-5 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.45)]">
              <p className="mb-3 inline-block rounded-md bg-mist px-2.5 py-1 text-[13px] font-semibold text-ink/70">{t(group.cat)}</p>
              <div className="divide-y divide-ink/8">
                {group.items.map(({ n, note }) => {
                  const isOpen = open === n
                  return (
                    <div key={n}>
                      <button
                        type="button"
                        onClick={() => toggle(n)}
                        className="flex w-full items-center justify-between gap-4 py-3.5 text-start text-[15px] font-medium"
                        aria-expanded={isOpen}
                      >
                        <span>{t(`faq.${n}.q` as TKey)}</span>
                        <Plus size={18} className={`shrink-0 text-ink/50 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2 pb-4 text-[14.5px] leading-relaxed text-ink/70">
                              {t(`faq.${n}.a` as TKey)
                                .split('\n')
                                .map((line) => (
                                  <p key={line}>{line}</p>
                                ))}
                              {note && <p className="rounded-xl bg-gold/15 px-3 py-2 text-ink/80">{t(note)}</p>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Disclaimer() {
  const { t } = useI18n()
  return (
    <section id="disclaimer" className="scroll-mt-28 border-t border-ink/8 bg-white">
      <div className="container-x py-14 lg:py-16">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4 text-ink/45">{t('home.legal.title')}</p>
          <p className="text-[14.5px] leading-relaxed text-ink/65">
            {t('home.legal.body')}{' '}
            <a
              href={waLink('Bonjour Amerray, j’ai une question.')}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-ink underline decoration-gold underline-offset-4 hover:text-gold-deep"
            >
              {t('home.legal.contact')}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

export function Home({ onSearch }: { onSearch: (q?: string) => void }) {
  const catalog = useCatalog()
  const { hash } = useLocation()
  useDocumentTitle()
  useEffect(() => {
    if (hash && catalog) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [hash, catalog])

  if (!catalog)
    return (
      <div className="container-x grid grid-cols-2 gap-5 py-20 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  const products = catalog.products
  return (
    <>
      <Hero onSearch={onSearch} products={products} />
      <CampaignSlider />
      <Univers products={products} />
      <div className="border-b border-ink/5 bg-white py-8">
        <div className="container-x">
          <TrustRow />
        </div>
      </div>
      <Categories products={products} />
      <BestSellers products={products} />
      <PackOffer products={products} />
      <HowItWorks />
      <QuizTeaser />
      <Families products={products} />
      <Tradition products={products} />
      <DeliverySection />
      <StoreSection />
      <Faq />
      <Disclaimer />
    </>
  )
}
