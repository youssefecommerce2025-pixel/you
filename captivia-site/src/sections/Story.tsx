import { motion, useScroll, useTransform } from 'framer-motion'
import { CheckCheck, PenLine } from 'lucide-react'
import { useRef } from 'react'
import { useLang } from '../lib/i18n'

const IMAGES = ['/img/perfume-hero.webp', '/img/story-nuit.webp', '/img/atelier.webp', '/img/story-cliente.webp']

function ChatOverlay() {
  const { t } = useLang()
  return (
    <div className="absolute bottom-5 w-[min(78%,300px)] rounded-3xl bg-white/95 p-4 shadow-2xl backdrop-blur ltr:left-5 rtl:right-5">
      <p className="mb-3 text-[11px] font-semibold tracking-wide text-ink-soft">{t.story.chat.header}</p>
      <div className="space-y-2">
        {t.story.chat.messages.map((m, i) => (
          <motion.div
            key={m}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.25 + i * 0.45, type: 'spring', damping: 16 }}
            className="w-fit max-w-[90%] rounded-2xl bg-lilac px-3 py-2 text-[13px] text-ink ltr:rounded-bl-md rtl:rounded-br-md"
            dir="auto"
          >
            {m}
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2.8 }}
        className="mt-3 flex items-center gap-1 text-[11px] font-medium text-rose-500"
      >
        <CheckCheck size={14} /> {t.story.chat.seen}
      </motion.p>
    </div>
  )
}

export function Story() {
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 60%'] })
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="histoire" className="relative bg-pearl py-24 sm:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{t.story.eyebrow}</span>
          <h2 className="font-display mt-5 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">{t.story.title}</h2>
        </div>

        <div ref={ref} className="relative mt-20">
          <div className="absolute top-0 bottom-0 hidden w-px bg-violet/15 lg:block ltr:left-1/2 rtl:right-1/2">
            <motion.div style={{ height: fill }} className="w-px bg-gradient-to-b from-violet-bright to-violet-deep" />
          </div>

          <div className="space-y-24 lg:space-y-36">
            {t.story.chapters.map((c, i) => {
              const flip = i % 2 === 1
              return (
                <div key={c.kicker} className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-24">
                  <span className="absolute top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 rounded-full border-4 border-pearl bg-violet shadow-[0_0_0_6px_rgba(109,40,217,0.15)] lg:block ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2" />
                  <motion.div
                    initial={{ opacity: 0, x: flip ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-40px_rgba(46,16,101,0.6)] ${flip ? 'lg:order-2' : ''}`}
                  >
                    <img src={IMAGES[i]} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    {i === 1 && <ChatOverlay />}
                    <span className="font-display absolute top-5 text-7xl font-semibold text-white/85 drop-shadow-lg ltr:right-6 rtl:left-6">
                      0{i + 1}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                    className={flip ? 'lg:order-1' : ''}
                  >
                    <span className="eyebrow">{c.kicker}</span>
                    <h3 className="font-display mt-4 text-3xl leading-tight font-semibold text-ink sm:text-4xl">{c.title}</h3>
                    <p className="mt-5 text-lg leading-relaxed text-ink-soft">{c.body}</p>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9 }}
          className="grain relative mt-28 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-deep via-plum to-night px-8 py-16 text-center text-white sm:px-16"
        >
          <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-bright/40 blur-3xl" />
          <span className="relative text-xs font-semibold tracking-[0.3em] text-lavender uppercase">{t.story.outroTitle}</span>
          <p className="font-display relative mx-auto mt-5 max-w-3xl text-3xl leading-snug font-medium sm:text-5xl">
            <span className="text-shine">{t.story.outro}</span>
          </p>
          <a href="#atelier" className="btn-light relative mt-10">
            <PenLine size={17} /> {t.story.cta}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
