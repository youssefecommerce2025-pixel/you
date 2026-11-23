import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useLang } from '../lib/i18n'

export function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-pearl py-24 sm:py-28">
      <div className="container-luxe grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="eyebrow">{t.faq.eyebrow}</span>
          <h2 className="font-display mt-5 text-4xl leading-tight font-semibold sm:text-5xl">{t.faq.title}</h2>
        </div>
        <div className="divide-y divide-violet/10 rounded-[2rem] border border-violet/10 bg-white px-6 sm:px-8">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-start text-base font-semibold text-ink sm:text-lg"
                >
                  {item.q}
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                      isOpen ? 'rotate-45 bg-violet text-white' : 'bg-lilac text-violet'
                    }`}
                  >
                    <Plus size={18} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 leading-relaxed text-ink-soft">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
