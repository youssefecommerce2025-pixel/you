import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { LogoMark } from '../components/Logo'
import { useLang } from '../lib/i18n'

export function Compare() {
  const { t } = useLang()
  const c = t.compare
  const [colA, colB, colC] = c.columns

  return (
    <section id="comparatif" className="grain relative overflow-hidden bg-night py-24 text-white sm:py-32">
      <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet/30 blur-[120px]" />
      <div className="container-luxe relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow !text-lavender">{c.eyebrow}</span>
          <h2 className="font-display mt-5 text-4xl leading-tight font-semibold sm:text-5xl">{c.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">{c.subtitle}</p>
        </div>

        <div className="mt-16 hidden overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur md:block">
          <div className="grid grid-cols-[1.1fr_1fr_1fr_1.15fr] border-b border-white/10 text-sm font-semibold">
            <div className="p-5" />
            <div className="p-5 text-white/60">{colA}</div>
            <div className="p-5 text-white/60">{colB}</div>
            <div className="flex items-center gap-2 bg-violet/25 p-5 text-white">
              <LogoMark light className="h-6 w-6" /> {colC}
            </div>
          </div>
          {c.rows.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="grid grid-cols-[1.1fr_1fr_1fr_1.15fr] border-b border-white/5 text-sm last:border-0"
            >
              <div className="p-5 font-semibold text-white">{r.label}</div>
              <div className="flex gap-2 p-5 text-white/55">
                <X size={16} className="mt-0.5 shrink-0 text-rose-400/80" />
                {r.a}
              </div>
              <div className="flex gap-2 p-5 text-white/55">
                <X size={16} className="mt-0.5 shrink-0 text-rose-400/80" />
                {r.b}
              </div>
              <div className="flex gap-2 bg-violet/15 p-5 font-medium text-white">
                <Check size={16} className="mt-0.5 shrink-0 text-lavender" />
                {r.c}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 space-y-4 md:hidden">
          {c.rows.map((r) => (
            <div key={r.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="font-semibold">{r.label}</p>
              <div className="mt-3 space-y-2 text-sm text-white/55">
                <p className="flex gap-2">
                  <X size={15} className="mt-0.5 shrink-0 text-rose-400/80" />
                  <span>
                    <b className="font-semibold text-white/70">{colA}{t.colon}</b>
                    {r.a}
                  </span>
                </p>
                <p className="flex gap-2">
                  <X size={15} className="mt-0.5 shrink-0 text-rose-400/80" />
                  <span>
                    <b className="font-semibold text-white/70">{colB}{t.colon}</b>
                    {r.b}
                  </span>
                </p>
              </div>
              <p className="mt-3 flex gap-2 rounded-2xl bg-violet/25 p-3 text-sm font-medium">
                <Check size={15} className="mt-0.5 shrink-0 text-lavender" />
                {r.c}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/40">{c.source}</p>
      </div>
    </section>
  )
}
