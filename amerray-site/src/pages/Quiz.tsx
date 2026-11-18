import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Candy, Flame, Flower2, Gift, Mars, Moon, PartyPopper, RotateCcw, Snowflake, Sparkles, Sun, Trees, Users, Venus, Waves, Wind, Zap, CalendarDays, Feather, type LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { useCatalog, type Product } from '../lib/catalog'
import { useI18n, type TKey } from '../lib/i18n'
import { useStore } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type StepId = 'gender' | 'moment' | 'season' | 'family' | 'strength'
type Answers = Partial<Record<StepId, string>>

const STEPS: { id: StepId; q: TKey; options: { value: string; label: TKey; icon: LucideIcon }[] }[] = [
  {
    id: 'gender',
    q: 'quiz.q.gender',
    options: [
      { value: 'homme', label: 'quiz.a.homme', icon: Mars },
      { value: 'femme', label: 'quiz.a.femme', icon: Venus },
      { value: 'unisexe', label: 'quiz.a.unisexe', icon: Users },
    ],
  },
  {
    id: 'moment',
    q: 'quiz.q.moment',
    options: [
      { value: 'jour', label: 'quiz.a.jour', icon: Sun },
      { value: 'soir', label: 'quiz.a.soir', icon: Moon },
      { value: 'occasion', label: 'quiz.a.occasion', icon: PartyPopper },
    ],
  },
  {
    id: 'season',
    q: 'quiz.q.season',
    options: [
      { value: 'ete', label: 'quiz.a.ete', icon: Sun },
      { value: 'hiver', label: 'quiz.a.hiver', icon: Snowflake },
      { value: 'all', label: 'quiz.a.all', icon: CalendarDays },
    ],
  },
  {
    id: 'family',
    q: 'quiz.q.family',
    options: [
      { value: 'frais', label: 'family.frais', icon: Waves },
      { value: 'floral', label: 'family.floral', icon: Flower2 },
      { value: 'oriental', label: 'family.oriental', icon: Flame },
      { value: 'boise', label: 'family.boise', icon: Trees },
      { value: 'gourmand', label: 'family.gourmand', icon: Candy },
    ],
  },
  {
    id: 'strength',
    q: 'quiz.q.strength',
    options: [
      { value: 'soft', label: 'quiz.a.soft', icon: Feather },
      { value: 'mid', label: 'quiz.a.mid', icon: Wind },
      { value: 'strong', label: 'quiz.a.strong', icon: Zap },
    ],
  },
]

const MAX = 110

function score(p: Product, a: Answers) {
  let s = 0
  if (a.gender === 'unisexe') s += p.gender === 'unisexe' ? 30 : 15
  else if (a.gender) {
    if (p.gender === a.gender) s += 30
    else if (p.gender === 'unisexe') s += 20
    else return -1
  }
  if (a.moment && p.moments.includes(a.moment as never)) s += 20
  if (a.season === 'ete' && p.seasons.some((x) => x === 'ete' || x === 'printemps')) s += 20
  if (a.season === 'hiver' && p.seasons.some((x) => x === 'hiver' || x === 'automne')) s += 20
  if (a.season === 'all') s += p.seasons.length >= 3 ? 20 : 10
  if (a.family && p.familyGroup === a.family) s += 25
  if (a.strength === 'soft') s += p.strength <= 2 ? 15 : p.strength === 3 ? 10 : 0
  if (a.strength === 'mid') s += p.strength === 3 ? 15 : p.strength === 4 ? 10 : 4
  if (a.strength === 'strong') s += p.strength >= 4 ? 15 : p.strength === 3 ? 6 : 0
  return s
}

export function Quiz() {
  const { t } = useI18n()
  const catalog = useCatalog()
  const { add, setCartOpen } = useStore()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  useDocumentTitle(t('quiz.title'))
  const done = step >= STEPS.length

  const results = useMemo(() => {
    if (!catalog || !done) return []
    return catalog.products
      .filter((p) => p.kind === 'perfume' && p.available)
      .map((p) => ({ p, s: score(p, answers) + (p.bestRank !== undefined ? 10 - Math.min(p.bestRank, 100) / 10 : 0) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
  }, [catalog, answers, done])

  const choose = (id: StepId, value: string) => {
    setAnswers((a) => ({ ...a, [id]: value }))
    setTimeout(() => setStep((s) => s + 1), 220)
  }

  const addTop4 = () => {
    for (const { p } of results.slice(0, 4)) add(p, 1, { silent: true })
    setCartOpen(true)
  }

  const current = STEPS[step]

  return (
    <div className="min-h-[80vh] pb-24">
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-royal to-navy text-white">
        <div className="grain pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay" />
        <div className="container-x relative py-12 lg:py-16">
          <p className="eyebrow flex items-center gap-2 text-gold-soft">
            <Sparkles size={14} /> {t('quiz.eyebrow')}
          </p>
          <h1 className="font-display mt-3 text-5xl leading-none sm:text-6xl">{done ? t('quiz.results') : t('quiz.title')}</h1>
          {!done && (
            <div className="mt-8 max-w-xl">
              <div className="mb-2 flex justify-between text-[12px] text-white/60">
                <span>{t('quiz.step', { a: step + 1, b: STEPS.length })}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/15">
                <motion.div className="h-full bg-gold" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </div>
          )}
          {done && <p className="mt-4 text-lg text-white/70">{t('quiz.resultsText')}</p>}
        </div>
      </section>

      <div className="container-x mt-12">
        <AnimatePresence mode="wait">
          {!done && current ? (
            <motion.div key={current.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-3xl">
              <h2 className="font-display text-center text-4xl sm:text-5xl">{t(current.q)}</h2>
              <div className={`mt-10 grid gap-3 ${current.options.length > 3 ? 'sm:grid-cols-3 lg:grid-cols-5' : 'sm:grid-cols-3'}`}>
                {current.options.map(({ value, label, icon: Icon }) => {
                  const on = answers[current.id] === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => choose(current.id, value)}
                      className={`card-surface flex items-center gap-4 p-5 text-start transition hover:-translate-y-1 sm:flex-col sm:items-start sm:p-6 ${on ? 'ring-2 ring-gold' : ''}`}
                    >
                      <span className={`grid size-12 shrink-0 place-items-center rounded-full ${on ? 'bg-gold text-ink' : 'bg-stone text-gold-deep'}`}>
                        <Icon size={22} strokeWidth={1.6} />
                      </span>
                      <span className="text-[15px] leading-snug font-semibold">{t(label)}</span>
                    </button>
                  )
                })}
              </div>
              {step > 0 && (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="mx-auto mt-10 flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
                  <ArrowLeft size={16} className="rtl:rotate-180" /> {t('quiz.back')}
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-10 flex flex-wrap gap-3">
                <button type="button" onClick={addTop4} className="btn-gold" disabled={results.length < 4}>
                  <Gift size={17} /> {t('quiz.packTop')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnswers({})
                    setStep(0)
                  }}
                  className="btn-ghost"
                >
                  <RotateCcw size={16} /> {t('quiz.restart')}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {results.map(({ p, s }, i) => (
                  <div key={p.id} className="relative">
                    <ProductCard p={p} index={i} />
                    <span className="absolute start-3 top-12 z-10 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-ink shadow">
                      {t('quiz.match', { n: Math.min(99, Math.round((s / (MAX + 10)) * 100) + 8) })}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
