import { motion } from 'framer-motion'
import { ArrowDown, Sparkles, Wand2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BrandPreview } from '../components/BrandPreview'
import type { Design } from '../lib/design'
import { useLang } from '../lib/i18n'

const DEMOS: Omit<Design, 'brand'>[] = [
  { universe: 'parfum', palette: 'amethyste', font: 'elegante', features: ['cod', 'pack', 'story'] },
  { universe: 'soin', palette: 'botanique', font: 'moderne', features: ['cod', 'story', 'avis'] },
  { universe: 'parfum', palette: 'noir-or', font: 'editoriale', features: ['cod', 'quiz', 'bilingue', 'pack'] },
  { universe: 'cosmetique', palette: 'rose', font: 'elegante', features: ['cod', 'avis', 'pack'] },
]

function useTypewriter(words: string[], hold = 2600) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    const word = words[index % words.length]
    if (text.length < word.length) {
      const id = setTimeout(() => setText(word.slice(0, text.length + 1)), 85)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => {
      setText('')
      setIndex((i) => i + 1)
    }, hold)
    return () => clearTimeout(id)
  }, [text, index, words, hold])

  return { text, index: index % words.length }
}

export function Hero() {
  const { t } = useLang()
  const { text, index } = useTypewriter(t.hero.demoBrands)
  const design: Design = { brand: text || ' ', ...DEMOS[index % DEMOS.length] }

  return (
    <section id="top" className="grain relative overflow-hidden bg-gradient-to-b from-mist via-pearl to-pearl pt-28 pb-20 sm:pt-32">
      <div className="zellige absolute inset-0 opacity-70" />
      <div className="absolute -top-40 h-[520px] w-[520px] rounded-full bg-lavender/40 blur-3xl ltr:-right-40 rtl:-left-40" />
      <div className="absolute top-80 h-[380px] w-[380px] rounded-full bg-violet/10 blur-3xl ltr:-left-40 rtl:-right-40" />

      <div className="container-luxe relative grid items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
            <Sparkles size={14} /> {t.hero.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-6 text-[2.7rem] leading-[1.05] font-semibold text-ink sm:text-6xl lg:text-[4.4rem]"
          >
            {t.hero.titleA}
            <br />
            {t.hero.titleB}
            <span className="text-gradient italic">{t.hero.titleHighlight}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a href="#atelier" className="btn-primary">
              <Wand2 size={17} /> {t.hero.ctaPrimary}
            </a>
            <a href="#diagnostic" className="btn-ghost">
              {t.hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-violet/15 pt-6"
          >
            {t.hero.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl font-semibold text-violet-deep sm:text-3xl">{s.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-ink-soft sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative"
        >
          <div className="animate-float">
            <BrandPreview design={design} />
          </div>
          <div className="absolute top-16 hidden items-center gap-2 rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-violet-deep shadow-xl backdrop-blur sm:flex ltr:-left-2 rtl:-right-2 lg:ltr:-left-10 lg:rtl:-right-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-bright opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet" />
            </span>
            {t.hero.building}
          </div>
          <div className="absolute bottom-24 hidden rounded-2xl bg-violet-deep px-4 py-3 text-white shadow-xl sm:block ltr:-right-2 rtl:-left-2 lg:ltr:-right-6 lg:rtl:-left-6">
            <p className="text-[11px] tracking-widest text-lavender uppercase">{t.atelier.live}</p>
            <p className="font-display text-xl font-semibold" dir="auto">
              {text || '…'}
              <span className="animate-blink">|</span>
            </p>
          </div>
        </motion.div>
      </div>

      <a
        href="#histoire"
        className="relative mx-auto mt-16 flex w-fit flex-col items-center gap-2 text-xs font-semibold tracking-widest text-violet/70 uppercase"
      >
        {t.hero.scroll}
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  )
}
