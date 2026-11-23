import { motion } from 'framer-motion'
import { ClipboardList, Hammer, Palette, Rocket } from 'lucide-react'
import { useLang } from '../lib/i18n'

const ICONS = [ClipboardList, Palette, Hammer, Rocket]

export function Method() {
  const { t } = useLang()
  return (
    <section className="bg-mist py-24 sm:py-28">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t.method.eyebrow}</span>
          <h2 className="font-display mt-5 text-4xl leading-tight font-semibold sm:text-5xl">{t.method.title}</h2>
        </div>
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.method.steps.map((s, i) => {
            const Icon = ICONS[i]
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative rounded-[1.8rem] bg-white p-7 shadow-[0_20px_50px_-35px_rgba(46,16,101,0.45)]"
              >
                <span className="font-display absolute top-5 text-5xl font-semibold text-lilac ltr:right-6 rtl:left-6">0{i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet text-white">
                  <Icon size={22} />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
