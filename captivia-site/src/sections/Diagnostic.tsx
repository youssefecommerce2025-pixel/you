import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CornerDownLeft, Lock, MessageCircle, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent, type ReactElement } from 'react'
import { whatsappLink } from '../lib/config'
import type { Universe } from '../lib/design'
import {
  QUESTIONS,
  isValidEmail,
  isValidPhone,
  recommend,
  submitLead,
  type Answers,
  type Contact,
  type Recommendation,
} from '../lib/diagnostic'
import { useLang } from '../lib/i18n'
import { useStudio } from '../lib/studio'

const COMMENT_STEP = QUESTIONS.length
const CONTACT_STEP = QUESTIONS.length + 1
const RESULT_STEP = QUESTIONS.length + 2
const TOTAL = QUESTIONS.length + 2
const LETTERS = 'ABCDEFGH'

const slide = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 70 : -70, filter: 'blur(6px)' }),
  center: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -70 : 70, filter: 'blur(6px)' }),
}

type ContactErrors = Partial<Record<keyof Contact, string>>

export function Diagnostic() {
  const { t, lang } = useLang()
  const d = t.diagnostic
  const { design, setDesign, interestedOffer, setInterestedOffer } = useStudio()

  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [answers, setAnswers] = useState<Answers>({})
  const [comment, setComment] = useState('')
  const [contact, setContact] = useState<Contact>({ firstName: '', lastName: '', brand: '', phone: '', email: '' })
  const [brandTouched, setBrandTouched] = useState(false)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<Recommendation | null>(null)
  const lock = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const visible = useRef(false)

  useEffect(() => {
    if (!brandTouched) setContact((c) => ({ ...c, brand: design.brand }))
  }, [design.brand, brandTouched])

  const update = (key: keyof Contact, value: string) => {
    setContact((c) => ({ ...c, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const go = (to: number) => {
    setDir(to > step ? 1 : -1)
    setStep(to)
  }

  const choose = (qIndex: number, value: string) => {
    const q = QUESTIONS[qIndex]
    if (q.multi) {
      setAnswers((a) => {
        const cur = a[q.id] ?? []
        return { ...a, [q.id]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] }
      })
      return
    }
    if (lock.current) return
    lock.current = true
    setAnswers((a) => ({ ...a, [q.id]: [value] }))
    if (q.id === 'univers' && value !== 'multi') setDesign((prev) => ({ ...prev, universe: value as Universe }))
    setTimeout(() => {
      lock.current = false
      go(qIndex + 1)
    }, 380)
  }

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible.current || step >= QUESTIONS.length) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return
      const q = QUESTIONS[step]
      const idx = LETTERS.indexOf(e.key.toUpperCase())
      if (idx >= 0 && idx < q.options.length) {
        e.preventDefault()
        choose(step, q.options[idx])
      } else if (e.key === 'Enter' && q.multi && (answers[q.id]?.length ?? 0) > 0) {
        go(step + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: ContactErrors = {}
    for (const k of ['firstName', 'lastName', 'brand', 'phone', 'email'] as const) {
      if (!contact[k].trim()) errs[k] = d.contact.errors.required
    }
    if (!errs.phone && !isValidPhone(contact.phone)) errs.phone = d.contact.errors.phone
    if (!errs.email && !isValidEmail(contact.email)) errs.email = d.contact.errors.email
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return

    const rec = recommend(answers)
    setSending(true)
    go(RESULT_STEP)
    await Promise.all([
      submitLead({ answers, comment, contact, recommendation: rec, design, lang, createdAt: new Date().toISOString() }),
      new Promise((r) => setTimeout(r, 1700)),
    ])
    setResult(rec)
    setSending(false)
  }

  const restart = () => {
    setAnswers({})
    setComment('')
    setResult(null)
    setErrors({})
    go(0)
  }

  const progress = Math.min(step, TOTAL) / TOTAL
  const prevQ = step > 0 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null
  const prevAnswer = prevQ ? (answers[prevQ.id] ?? []).map((v) => d.questions[prevQ.id].options[v]).join(' · ') : ''

  return (
    <section id="diagnostic" className="relative overflow-hidden bg-gradient-to-b from-pearl to-mist py-24 sm:py-32">
      <div className="absolute top-20 h-[460px] w-[460px] rounded-full bg-lavender/30 blur-3xl ltr:-left-40 rtl:-right-40" />
      <div className="container-luxe relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:pt-8">
          <span className="eyebrow">{d.eyebrow}</span>
          <h2 className="font-display mt-5 text-4xl leading-tight font-semibold sm:text-5xl">{d.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{d.subtitle}</p>
          {interestedOffer && step < RESULT_STEP && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-violet/20 bg-white p-4 text-sm text-ink-soft">
              <Sparkles size={18} className="mt-0.5 shrink-0 text-violet" />
              <span>{d.interested(t.offers.items[interestedOffer].name)}</span>
            </div>
          )}
          <div className="mt-8 hidden overflow-hidden rounded-[2rem] lg:block">
            <img src="/img/atelier.webp" alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>

        <div
          ref={rootRef}
          className="relative flex min-h-[620px] flex-col overflow-hidden rounded-[2.2rem] border border-violet/10 bg-white p-6 shadow-[0_40px_100px_-50px_rgba(46,16,101,0.6)] sm:p-10"
        >
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-ink-soft">
            <span>
              {step < QUESTIONS.length
                ? `${d.question} ${step + 1} ${d.of} ${QUESTIONS.length}`
                : step === RESULT_STEP
                  ? d.result.eyebrow
                  : d.duration}
            </span>
            {step > 0 && step < RESULT_STEP && (
              <button onClick={() => go(step - 1)} className="inline-flex items-center gap-1 text-violet hover:text-violet-deep">
                <ArrowLeft size={14} className="rtl:rotate-180" /> {d.back}
              </button>
            )}
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-lilac">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-deep to-violet-bright"
              animate={{ width: `${(step === RESULT_STEP ? 1 : progress) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="relative mt-8 flex flex-1 flex-col">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={step}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-1 flex-col"
              >
                {step < QUESTIONS.length && (
                  <QuestionStep
                    index={step}
                    answers={answers}
                    prevAnswer={prevAnswer}
                    onChoose={(v) => choose(step, v)}
                    onNext={() => go(step + 1)}
                  />
                )}

                {step === COMMENT_STEP && (
                  <div className="flex flex-1 flex-col">
                    <span className="w-fit rounded-full bg-lilac px-3 py-1 text-xs font-semibold text-violet">{d.comment.badge}</span>
                    <h3 className="font-display mt-4 text-3xl font-semibold sm:text-4xl">{d.comment.title}</h3>
                    <p className="mt-3 text-ink-soft">{d.comment.help}</p>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={d.comment.placeholder}
                      rows={5}
                      maxLength={1200}
                      dir="auto"
                      className="mt-6 w-full resize-none rounded-2xl border border-violet/20 bg-mist p-5 text-base outline-none transition focus:border-violet focus:bg-white"
                    />
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <button onClick={() => go(CONTACT_STEP)} className="btn-primary">
                        {d.next} <ArrowRight size={16} className="rtl:rotate-180" />
                      </button>
                      {!comment.trim() && (
                        <button onClick={() => go(CONTACT_STEP)} className="btn-ghost">
                          {d.skip}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {step === CONTACT_STEP && (
                  <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
                    <h3 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">{d.contact.title}</h3>
                    <p className="mt-3 text-ink-soft">{d.contact.help}</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Field label={d.contact.firstName} error={errors.firstName}>
                        <input
                          autoComplete="given-name"
                          value={contact.firstName}
                          onChange={(e) => update('firstName', e.target.value)}
                        />
                      </Field>
                      <Field label={d.contact.lastName} error={errors.lastName}>
                        <input
                          autoComplete="family-name"
                          value={contact.lastName}
                          onChange={(e) => update('lastName', e.target.value)}
                        />
                      </Field>
                      <Field label={d.contact.brand} error={errors.brand} wide>
                        <input
                          autoComplete="organization"
                          value={contact.brand}
                          onChange={(e) => {
                            setBrandTouched(true)
                            update('brand', e.target.value)
                          }}
                        />
                      </Field>
                      <Field label={d.contact.phone} error={errors.phone}>
                        <input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          dir="ltr"
                          placeholder={d.contact.phonePlaceholder}
                          value={contact.phone}
                          onChange={(e) => update('phone', e.target.value)}
                        />
                      </Field>
                      <Field label={d.contact.email} error={errors.email}>
                        <input
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          dir="ltr"
                          placeholder={d.contact.emailPlaceholder}
                          value={contact.email}
                          onChange={(e) => update('email', e.target.value)}
                        />
                      </Field>
                    </div>
                    <p className="mt-5 flex items-start gap-2 text-xs text-ink-soft">
                      <Lock size={14} className="mt-0.5 shrink-0" /> {d.contact.privacy}
                    </p>
                    <div className="mt-auto pt-6">
                      <button type="submit" className="btn-primary w-full sm:w-auto">
                        <Sparkles size={16} /> {d.contact.submit}
                      </button>
                    </div>
                  </form>
                )}

                {step === RESULT_STEP && (
                  <ResultStep
                    sending={sending}
                    result={result}
                    firstName={contact.firstName}
                    brand={contact.brand}
                    onRestart={restart}
                    onSeeOffer={(id) => setInterestedOffer(id)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function QuestionStep({
  index,
  answers,
  prevAnswer,
  onChoose,
  onNext,
}: {
  index: number
  answers: Answers
  prevAnswer: string
  onChoose: (v: string) => void
  onNext: () => void
}) {
  const { t } = useLang()
  const d = t.diagnostic
  const q = QUESTIONS[index]
  const qc = d.questions[q.id]
  const selected = answers[q.id] ?? []

  return (
    <div className="flex flex-1 flex-col">
      {prevAnswer && (
        <p className="mb-4 flex items-center gap-2 truncate text-sm text-ink-soft/60">
          <Check size={14} className="shrink-0 text-violet" /> {prevAnswer}
        </p>
      )}
      <h3 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">{qc.title}</h3>
      {q.multi && <p className="mt-2 text-sm font-medium text-violet">{d.multiHint}</p>}
      <div className={`mt-7 grid gap-3 ${q.options.length > 4 ? 'sm:grid-cols-2' : ''}`}>
        {q.options.map((opt, i) => {
          const on = selected.includes(opt)
          return (
            <motion.button
              key={opt}
              type="button"
              onClick={() => onChoose(opt)}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}
              aria-pressed={on}
              className={`group flex items-center gap-4 rounded-2xl border-2 px-4 py-3.5 text-start text-[15px] font-medium transition ${
                on ? 'border-violet bg-lilac text-violet-deep' : 'border-violet/10 bg-white text-ink hover:border-violet/40 hover:bg-mist'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition ${
                  on ? 'border-violet bg-violet text-white' : 'border-violet/25 text-violet group-hover:border-violet'
                }`}
                dir="ltr"
              >
                {on ? <Check size={15} /> : LETTERS[i]}
              </span>
              {qc.options[opt]}
            </motion.button>
          )
        })}
      </div>
      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        <p className="hidden items-center gap-1.5 text-xs text-ink-soft/70 sm:flex">
          <CornerDownLeft size={13} /> {d.keyHint}
        </p>
        {q.multi && (
          <button onClick={onNext} disabled={selected.length === 0} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
            {d.next} <ArrowRight size={16} className="rtl:rotate-180" />
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, error, wide, children }: { label: string; error?: string; wide?: boolean; children: ReactElement }) {
  return (
    <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 flex items-center justify-between text-sm font-semibold text-ink">
        {label}
        {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
      </span>
      <span
        className={`block rounded-2xl border bg-mist transition focus-within:border-violet focus-within:bg-white [&>input]:w-full [&>input]:bg-transparent [&>input]:px-4 [&>input]:py-3.5 [&>input]:text-base [&>input]:outline-none ${
          error ? 'border-rose-400' : 'border-violet/20'
        }`}
      >
        {children}
      </span>
    </label>
  )
}

function ResultStep({
  sending,
  result,
  firstName,
  brand,
  onRestart,
  onSeeOffer,
}: {
  sending: boolean
  result: Recommendation | null
  firstName: string
  brand: string
  onRestart: () => void
  onSeeOffer: (id: Recommendation['offer']) => void
}) {
  const { t } = useLang()
  const d = t.diagnostic

  if (sending || !result) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative h-20 w-20">
          <span className="absolute inset-0 animate-ping rounded-full bg-violet/20" />
          <span className="absolute inset-2 animate-spin rounded-full border-4 border-lilac border-t-violet" />
        </div>
        <p className="font-display mt-8 text-2xl font-semibold">{d.sending}</p>
      </div>
    )
  }

  const offer = t.offers.items[result.offer]
  const alt = t.offers.items[result.alternative]
  const reasons = [...new Set(result.reasons.map((k) => d.reasons[k]).filter(Boolean))].slice(0, 4)
  const circumference = 2 * Math.PI * 34

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-ink-soft">
        {d.result.hello} {firstName} ✨
      </p>
      <h3 className="font-display mt-1 text-2xl font-semibold sm:text-3xl">{d.result.title}</h3>

      <div className="mt-6 flex items-center gap-5 rounded-3xl bg-gradient-to-br from-violet-deep to-plum p-5 text-white sm:p-6">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
            <motion.circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#c4b5fd"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - result.match / 100) }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold" dir="ltr">
            {result.match}%
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-lavender uppercase">{offer.tag}</p>
          <p className="font-display text-3xl font-semibold">{offer.name}</p>
          <p className="mt-1 text-sm text-white/75">
            {offer.price} {t.offers.currency} · {result.match}% {d.result.match}
          </p>
        </div>
      </div>

      {reasons.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold">{d.result.why}</p>
          <ul className="mt-3 space-y-2">
            {reasons.map((r, i) => (
              <motion.li
                key={r}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.12 }}
                className="flex gap-2.5 text-sm text-ink-soft"
              >
                <Check size={16} className="mt-0.5 shrink-0 text-violet" /> {r}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-5 text-sm text-ink-soft">
        {d.result.alternative}{' '}
        <a href={`#offre-${result.alternative}`} onClick={() => onSeeOffer(result.alternative)} className="font-semibold text-violet underline underline-offset-4">
          {alt.name}
        </a>
      </p>

      <div className="mt-auto flex flex-wrap gap-3 pt-7">
        <a
          href={whatsappLink(d.whatsapp(firstName, brand, offer.name))}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          <MessageCircle size={17} /> {d.result.whatsappCta}
        </a>
        <a href={`#offre-${result.offer}`} onClick={() => onSeeOffer(result.offer)} className="btn-ghost">
          {d.result.seeOffer}
        </a>
        <button onClick={onRestart} className="inline-flex items-center gap-1.5 px-2 text-sm font-semibold text-ink-soft hover:text-violet">
          <RotateCcw size={14} /> {d.result.again}
        </button>
      </div>
      <p className="mt-4 text-xs text-ink-soft">{d.result.next}</p>
    </div>
  )
}
