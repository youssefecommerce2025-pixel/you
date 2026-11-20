import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { BrandPreview } from '../components/BrandPreview'
import {
  FEATURE_IDS,
  FONT_IDS,
  FONTS,
  PALETTE_IDS,
  PALETTES,
  UNIVERSE_IMAGES,
  UNIVERSES,
  type FeatureId,
} from '../lib/design'
import { useLang } from '../lib/i18n'
import { useStudio } from '../lib/studio'

function Step({ n, label, children }: { n: number; label: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: n * 0.06 }}
      className="rounded-3xl border border-violet/10 bg-white p-5 shadow-[0_20px_50px_-35px_rgba(46,16,101,0.45)] sm:p-6"
    >
      <p className="mb-4 flex items-center gap-3 text-sm font-semibold text-ink">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet text-xs text-white">{n}</span>
        {label}
      </p>
      {children}
    </motion.div>
  )
}

export function Atelier() {
  const { t } = useLang()
  const { design, setDesign, confirmAtelier } = useStudio()
  const a = t.atelier

  const toggleFeature = (f: FeatureId) =>
    setDesign((d) => ({
      ...d,
      features: d.features.includes(f) ? d.features.filter((x) => x !== f) : [...d.features, f],
    }))

  return (
    <section id="atelier" className="relative overflow-hidden bg-gradient-to-b from-pearl via-mist to-pearl py-24 sm:py-32">
      <div className="zellige absolute inset-0 opacity-60" />
      <div className="container-luxe relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{a.eyebrow}</span>
          <h2 className="font-display mt-5 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">{a.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{a.subtitle}</p>
        </div>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <Step n={1} label={a.brandLabel}>
              <input
                value={design.brand}
                maxLength={22}
                onChange={(e) => setDesign((d) => ({ ...d, brand: e.target.value }))}
                placeholder={a.brandPlaceholder}
                className="w-full rounded-2xl border border-violet/20 bg-mist px-5 py-4 text-lg font-medium text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-violet focus:bg-white"
                dir="auto"
              />
            </Step>

            <Step n={2} label={a.universeLabel}>
              <div className="grid grid-cols-3 gap-3">
                {UNIVERSES.map((u) => {
                  const active = design.universe === u
                  return (
                      <button
                      key={u}
                      onClick={() => {
                        confirmAtelier()
                        setDesign((d) => ({ ...d, universe: u }))
                      }}
                      className={`group relative overflow-hidden rounded-2xl border-2 text-start transition ${
                        active ? 'border-violet shadow-lg' : 'border-transparent hover:border-violet/30'
                      }`}
                    >
                      <img src={UNIVERSE_IMAGES[u].products[0]} alt="" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
                      <span className={`block px-3 py-2.5 text-xs font-semibold sm:text-sm ${active ? 'bg-violet text-white' : 'bg-mist text-ink'}`}>
                        {a.universes[u]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Step>

            <Step n={3} label={a.paletteLabel}>
              <div className="flex flex-wrap gap-3">
                {PALETTE_IDS.map((id) => {
                  const p = PALETTES[id]
                  const active = design.palette === id
                  return (
                    <button
                      key={id}
                      onClick={() => setDesign((d) => ({ ...d, palette: id }))}
                      className={`flex items-center gap-2.5 rounded-full border-2 py-1.5 ps-1.5 pe-4 text-sm font-medium transition ${
                        active ? 'border-violet bg-lilac' : 'border-violet/10 bg-white hover:border-violet/30'
                      }`}
                    >
                      <span className="relative flex h-8 w-8 overflow-hidden rounded-full ring-1 ring-black/10">
                        <span className="h-full w-1/2" style={{ background: p.bg }} />
                        <span className="h-full w-1/2" style={{ background: p.accent }} />
                      </span>
                      {a.palettes[id]}
                    </button>
                  )
                })}
              </div>
            </Step>

            <Step n={4} label={a.fontLabel}>
              <div className="grid grid-cols-3 gap-3">
                {FONT_IDS.map((f) => {
                  const active = design.font === f
                  return (
                    <button
                      key={f}
                      onClick={() => setDesign((d) => ({ ...d, font: f }))}
                      className={`rounded-2xl border-2 px-3 py-4 text-center transition ${
                        active ? 'border-violet bg-lilac' : 'border-violet/10 bg-white hover:border-violet/30'
                      }`}
                    >
                      <span className="block text-3xl text-violet-deep" style={{ fontFamily: FONTS[f] }} dir="ltr">
                        Aa
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-ink-soft">{a.fonts[f]}</span>
                    </button>
                  )
                })}
              </div>
            </Step>

            <Step n={5} label={a.featuresLabel}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {FEATURE_IDS.map((f) => {
                  const on = design.features.includes(f)
                  return (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      aria-pressed={on}
                      className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-start text-sm font-medium transition ${
                        on ? 'border-violet bg-lilac text-violet-deep' : 'border-violet/10 bg-white text-ink hover:border-violet/30'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition ${
                          on ? 'bg-violet text-white' : 'border border-violet/30'
                        }`}
                      >
                        {on && <Check size={14} />}
                      </span>
                      {a.features[f]}
                    </button>
                  )
                })}
              </div>
            </Step>
          </div>

          <div className="lg:sticky lg:top-24">
            <p className="mb-5 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-violet uppercase">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet" /> {a.live}
            </p>
            <BrandPreview design={design} scrollable />
            <a href="#diagnostic" onClick={confirmAtelier} className="btn-primary mt-8 w-full">
              {a.cta} <ArrowRight size={17} className="rtl:rotate-180" />
            </a>
            <p className="mt-3 text-center text-xs text-ink-soft">{a.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
