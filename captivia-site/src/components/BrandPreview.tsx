import { AnimatePresence, motion } from 'framer-motion'
import { Gift, Menu, ShoppingBag, Sparkles, Star, Truck } from 'lucide-react'
import { FONTS, PALETTES, UNIVERSE_IMAGES, type Design } from '../lib/design'
import { useLang } from '../lib/i18n'

const block = {
  initial: { opacity: 0, y: 18, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.97 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
}

export function BrandPreview({ design, scrollable = false }: { design: Design; scrollable?: boolean }) {
  const { t, lang } = useLang()
  const p = PALETTES[design.palette]
  const font = FONTS[design.font]
  const u = t.preview.universes[design.universe]
  const img = UNIVERSE_IMAGES[design.universe]
  const brand = design.brand.trim() || t.preview.defaultBrand
  const has = (f: Design['features'][number]) => design.features.includes(f)

  return (
    <div className="relative mx-auto w-[290px] sm:w-[310px]">
      <div className="absolute -inset-10 -z-10 rounded-full bg-violet/25 blur-3xl" />
      <div className="rounded-[2.9rem] bg-night p-[10px] shadow-[0_40px_90px_-30px_rgba(46,16,101,0.65)] ring-1 ring-white/10">
        <div
          className="relative h-[600px] overflow-hidden rounded-[2.3rem] transition-colors duration-700"
          style={{ background: p.bg, color: p.ink }}
        >
          <div className="absolute top-2 left-1/2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-night" />
          <div className={`h-full ${scrollable ? 'no-scrollbar overflow-y-auto' : 'overflow-hidden'} pb-24`}>
            <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-semibold opacity-70" dir="ltr">
              <span>9:41</span>
              <span>5G ▮▮▮</span>
            </div>

            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <Menu size={18} />
              <motion.span
                key={brand + design.font}
                initial={{ opacity: 0, letterSpacing: '0.4em' }}
                animate={{ opacity: 1, letterSpacing: design.font === 'moderne' ? '0.08em' : '0.14em' }}
                transition={{ duration: 0.6 }}
                className="max-w-[175px] truncate text-center font-semibold uppercase"
                style={{ fontFamily: font, fontSize: brand.length > 14 ? 13 : brand.length > 10 ? 15 : 19 }}
              >
                {brand}
              </motion.span>
              <div className="flex items-center gap-1.5">
                <AnimatePresence>
                  {has('bilingue') && (
                    <motion.span
                      {...block}
                      className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                      style={{ background: p.soft }}
                      dir="ltr"
                    >
                      FR | ع
                    </motion.span>
                  )}
                </AnimatePresence>
                <ShoppingBag size={18} />
              </div>
            </div>

            <div className="flex gap-3 overflow-hidden px-4 pb-3 text-[10px] font-medium" style={{ color: p.muted }}>
              {t.preview.menu.map((m) => (
                <span key={m} className="whitespace-nowrap">
                  {m}
                </span>
              ))}
            </div>

            <div className="relative mx-3 h-[190px] overflow-hidden rounded-2xl">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={img.hero}
                  src={img.hero}
                  alt=""
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-[9px] font-semibold tracking-[0.2em] uppercase opacity-80">{u.tagline}</p>
                <p className="mt-1 text-[22px] leading-tight font-semibold" style={{ fontFamily: font }}>
                  {u.heroTitle}
                </p>
                <span
                  className="mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-semibold transition-colors duration-700"
                  style={{ background: p.accent, color: p.accentInk }}
                >
                  {t.preview.discover}
                </span>
              </div>
            </div>

            <AnimatePresence>
              {has('pack') && (
                <motion.div
                  {...block}
                  className="mx-3 mt-3 flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors duration-700"
                  style={{ background: p.accent, color: p.accentInk }}
                >
                  <Gift size={18} />
                  <div className="flex-1">
                    <p className="text-[11px] font-bold">{t.preview.pack}</p>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/30">
                      <motion.div
                        className="h-full rounded-full bg-white"
                        initial={{ width: '10%' }}
                        animate={{ width: '66%' }}
                        transition={{ duration: 1.4, delay: 0.3 }}
                      />
                    </div>
                    <p className="mt-1 text-[9px] opacity-85">{t.preview.packSub}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-3 grid grid-cols-2 gap-2.5 px-3">
              {u.items.map((item, i) => (
                <motion.div
                  key={design.universe + i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                  className="overflow-hidden rounded-xl transition-colors duration-700"
                  style={{ background: p.surface }}
                >
                  <div className="relative aspect-square">
                    <img src={img.products[i]} alt="" className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span
                        className="absolute top-2 rounded-full px-2 py-0.5 text-[8px] font-bold ltr:left-2 rtl:right-2"
                        style={{ background: p.accent, color: p.accentInk }}
                      >
                        {t.preview.newIn}
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="truncate text-[12px] font-semibold" style={{ fontFamily: font }}>
                      {item.name}
                    </p>
                    <p className="text-[11px] font-bold" style={{ color: p.accent }}>
                      {item.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {has('story') && (
                <motion.div {...block} className="mx-3 mt-3 rounded-xl p-3" style={{ background: p.surface }}>
                  <p className="text-[12px] font-semibold" style={{ fontFamily: font }}>
                    {u.storyTitle}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {u.storyRows.map(([k, v], i) => (
                      <div key={k} className="flex items-center gap-2 text-[10px]">
                        <span className="w-14 shrink-0 font-semibold" style={{ color: p.muted }}>
                          {k}
                        </span>
                        <div className="relative h-5 flex-1 overflow-hidden rounded-md" style={{ background: p.soft }}>
                          <motion.div
                            className="absolute inset-y-0 rounded-md ltr:left-0 rtl:right-0"
                            style={{ background: p.accent, opacity: 0.22 + i * 0.18 }}
                            initial={{ width: 0 }}
                            animate={{ width: `${55 + i * 20}%` }}
                            transition={{ duration: 0.9, delay: 0.2 + i * 0.15 }}
                          />
                          <span className="relative px-2 leading-5">{v}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {has('avis') && (
                <motion.div {...block} className="mx-3 mt-3 rounded-xl p-3" style={{ background: p.surface }}>
                  <div className="flex items-center gap-1" style={{ color: p.accent }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                    <span className="text-[10px] font-semibold ltr:ml-1 rtl:mr-1" style={{ color: p.ink }}>
                      {t.preview.reviews}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[10px] italic" style={{ color: p.muted }}>
                    {t.preview.reviewQuote}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {has('quiz') && (
                <motion.div
                  {...block}
                  className="mx-3 mt-3 flex items-center gap-2.5 rounded-xl border-2 border-dashed p-3"
                  style={{ borderColor: p.accent }}
                >
                  <Sparkles size={18} style={{ color: p.accent }} />
                  <p className="text-[11px] font-semibold">{u.quiz}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {has('cod') && (
              <motion.div
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                exit={{ y: 80 }}
                transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                className="absolute inset-x-0 bottom-0 z-20 px-3 pt-6 pb-4"
                style={{ background: `linear-gradient(to top, ${p.bg} 65%, transparent)` }}
              >
                <div
                  className="flex items-center justify-center gap-2 rounded-full py-3 text-[12px] font-bold shadow-lg transition-colors duration-700"
                  style={{ background: p.accent, color: p.accentInk }}
                >
                  <Truck size={15} />
                  {t.preview.cod}
                </div>
                <p className="mt-1.5 text-center text-[9px]" style={{ color: p.muted }}>
                  {t.preview.codSub}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <span className="sr-only">{lang === 'ar' ? 'معاينة الموقع' : 'Aperçu du site'}</span>
    </div>
  )
}
