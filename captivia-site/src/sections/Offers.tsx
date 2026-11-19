import { motion } from 'framer-motion'
import { ArrowRight, Check, Clock, Crown, Rocket, ShieldCheck, Sparkles } from 'lucide-react'
import { OFFER_IDS, type OfferId } from '../lib/diagnostic'
import { useLang } from '../lib/i18n'
import { useStudio } from '../lib/studio'

const ICONS: Record<OfferId, typeof Rocket> = { essentiel: Rocket, experience: Sparkles, prestige: Crown }

export function Offers() {
  const { t } = useLang()
  const { interestedOffer, setInterestedOffer } = useStudio()
  const o = t.offers

  return (
    <section id="offres" className="relative bg-pearl py-24 sm:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{o.eyebrow}</span>
          <h2 className="font-display mt-5 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">{o.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{o.subtitle}</p>
        </div>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {OFFER_IDS.map((id, i) => {
            const item = o.items[id]
            const Icon = ICONS[id]
            const featured = id === 'experience'
            const highlighted = interestedOffer === id
            return (
              <motion.article
                key={id}
                id={`offre-${id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className={`relative flex flex-col rounded-[2rem] p-7 sm:p-8 ${
                  featured
                    ? 'bg-gradient-to-b from-violet-deep to-plum text-white shadow-[0_40px_90px_-40px_rgba(76,29,149,0.9)] lg:-my-4'
                    : 'border border-violet/10 bg-white shadow-[0_20px_60px_-40px_rgba(46,16,101,0.45)]'
                } ${highlighted ? 'ring-4 ring-violet-bright' : ''}`}
              >
                {featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1.5 text-xs font-bold whitespace-nowrap text-night shadow-lg">
                    {o.popular}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${featured ? 'bg-white/15' : 'bg-lilac text-violet'}`}>
                    <Icon size={20} />
                  </span>
                  <span className={`text-xs font-semibold tracking-[0.2em] uppercase ${featured ? 'text-lavender' : 'text-violet'}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-3xl font-semibold">{item.name}</h3>

                <div className="mt-5 flex items-end gap-2">
                  <span className="font-display text-6xl leading-none font-semibold">{item.price}</span>
                  <span className={`pb-1.5 text-lg font-semibold ${featured ? 'text-lavender' : 'text-violet'}`}>{o.currency}</span>
                </div>
                <p className={`mt-2 text-sm ${featured ? 'text-white/65' : 'text-ink-soft'}`}>
                  {o.oneTime} · {o.market}{t.colon}<span className="line-through">{item.market}</span>
                </p>

                <div className={`mt-6 space-y-3 rounded-2xl p-4 text-sm ${featured ? 'bg-white/10' : 'bg-mist'}`}>
                  <p>
                    <b className="font-semibold">{o.idealFor}{t.colon}</b>
                    <span className={featured ? 'text-white/80' : 'text-ink-soft'}>{item.idealFor}</span>
                  </p>
                  <p>
                    <b className="font-semibold">{o.need}{t.colon}</b>
                    <span className={featured ? 'text-white/80' : 'text-ink-soft'}>{item.need}</span>
                  </p>
                </div>

                <p className="mt-6 text-sm font-semibold">{o.included}</p>
                <ul className="mt-3 flex-1 space-y-2.5">
                  {item.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm leading-snug">
                      <Check size={17} className={`mt-0.5 shrink-0 ${featured ? 'text-lavender' : 'text-violet'}`} />
                      <span className={featured ? 'text-white/85' : 'text-ink-soft'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <p className={`mt-6 flex items-center gap-2 text-sm font-semibold ${featured ? 'text-lavender' : 'text-violet'}`}>
                  <Clock size={16} /> {item.delay}
                </p>
                <a
                  href="#diagnostic"
                  onClick={() => setInterestedOffer(id)}
                  className={`mt-6 w-full ${featured ? 'btn-light' : 'btn-primary'}`}
                >
                  {o.cta} <ArrowRight size={16} className="rtl:rotate-180" />
                </a>
              </motion.article>
            )
          })}
        </div>

        <div className="mt-14 rounded-[2rem] border border-violet/10 bg-mist p-7 sm:p-9">
          <p className="flex items-center gap-2 font-semibold text-violet-deep">
            <ShieldCheck size={20} /> {o.guaranteesTitle}
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {o.guarantees.map((g) => (
              <li key={g} className="flex gap-2 text-sm text-ink-soft">
                <Check size={16} className="mt-0.5 shrink-0 text-violet" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
