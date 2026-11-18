import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { shopifyImage, srcSet } from '../lib/catalog'
import { useI18n, type TKey } from '../lib/i18n'

export const CAMPAIGNS: { handle: string; image: string; position: string; tag: TKey; title: TKey }[] = [
  {
    handle: 'pack-femme',
    image: 'https://cdn.shopify.com/s/files/1/0697/9020/4139/files/slide-pack-parfum-femme-amerray.webp',
    position: 'center 40%',
    tag: 'slide.packFemme.tag',
    title: 'slide.packFemme.title',
  },
  {
    handle: 'pack-homme',
    image: 'https://cdn.shopify.com/s/files/1/0697/9020/4139/files/Parfum_Maroc_Amerray_inspiration1.webp',
    position: 'center 40%',
    tag: 'slide.packHomme.tag',
    title: 'slide.packHomme.title',
  },
  {
    handle: 'bakhour-oud',
    image: 'https://cdn.shopify.com/s/files/1/0697/9020/4139/files/Bakhour_Oud_Maroc_Amerray.webp',
    position: '70% 55%',
    tag: 'slide.bakhour.tag',
    title: 'slide.bakhour.title',
  },
  {
    handle: 'musc',
    image: 'https://cdn.shopify.com/s/files/1/0697/9020/4139/files/Musc_Musk_Tahara_Amerray.webp',
    position: '60% 30%',
    tag: 'slide.musc.tag',
    title: 'slide.musc.title',
  },
  {
    handle: 'kids',
    image: 'https://cdn.shopify.com/s/files/1/0697/9020/4139/files/Parfum_Enfant_Amerray_Kids.webp',
    position: '70% 45%',
    tag: 'slide.kids.tag',
    title: 'slide.kids.title',
  },
  {
    handle: 'maison-voiture',
    image: 'https://cdn.shopify.com/s/files/1/0697/9020/4139/files/Spray_Maison_Voiture_Amerray.webp',
    position: 'center 45%',
    tag: 'slide.maison.tag',
    title: 'slide.maison.title',
  },
  {
    handle: 'body-hair',
    image: 'https://cdn.shopify.com/s/files/1/0697/9020/4139/files/Body_Spray_Hair_Mist_Amerray.webp',
    position: '65% 60%',
    tag: 'slide.body.tag',
    title: 'slide.body.title',
  },
  {
    handle: 'bougies',
    image: 'https://cdn.shopify.com/s/files/1/0697/9020/4139/files/Bougie_Parfumee_Amerray.webp',
    position: '60% 50%',
    tag: 'slide.candle.tag',
    title: 'slide.candle.title',
  },
]

const INTERVAL = 5000

export function CampaignSlider() {
  const { t, lang } = useI18n()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState(false)
  const startX = useRef(0)
  const moved = useRef(0)
  const n = CAMPAIGNS.length

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) setPaused(true)
  }, [])

  useEffect(() => {
    if (paused || hover) return
    const id = window.setInterval(() => {
      setDir(1)
      setIndex((i) => (i + 1) % n)
    }, INTERVAL)
    return () => window.clearInterval(id)
  }, [paused, hover, n])

  const go = (next: number, direction: number) => {
    setDir(direction)
    setIndex((next + n) % n)
  }

  const slide = CAMPAIGNS[index]

  return (
    <section
      dir="ltr"
      className="relative overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label={t('home.univers.title')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={(e) => {
        startX.current = e.clientX
        moved.current = 0
      }}
      onPointerUp={(e) => {
        if ((e.target as HTMLElement).closest('button')) return
        const dx = e.clientX - startX.current
        moved.current = dx
        if (dx > 48) go(index - 1, -1)
        else if (dx < -48) go(index + 1, 1)
      }}
    >
      <div className="relative h-[42vh] min-h-[280px] max-h-[520px] sm:min-h-[340px]">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={slide.handle}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%' }),
              center: { x: 0 },
              exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%' }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Link
              to={`/collection/${slide.handle}`}
              className="block h-full"
              aria-label={t(`col.${slide.handle}.t` as TKey)}
              onClick={(e) => {
                if (Math.abs(moved.current) > 48) e.preventDefault()
              }}
            >
              <img
                src={shopifyImage(slide.image, 1600)}
                srcSet={srcSet(slide.image, [640, 960, 1280, 1600, 1920])}
                sizes="100vw"
                alt=""
                width={1600}
                height={900}
                draggable={false}
                className="h-full w-full object-cover"
                style={{ objectPosition: slide.position }}
              />
              <span className={`pointer-events-none absolute inset-0 ${lang === 'ar' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-ink/55 via-ink/10 to-transparent`} />
              <span
                className={`pointer-events-none absolute bottom-9 flex max-w-[min(78%,22rem)] flex-col gap-2 text-white sm:bottom-11 ${lang === 'ar' ? 'right-4 items-end text-right sm:right-20' : 'left-4 sm:left-20'}`}
              >
                <span className="w-fit bg-white px-2.5 py-1 text-[11px] font-bold tracking-[0.16em] text-ink uppercase">{t(slide.tag)}</span>
                <span className="font-display text-[clamp(1.7rem,3.4vw,3rem)] leading-[0.95]">{t(slide.title)}</span>
                <span className="mt-1 w-fit border-2 border-white px-6 py-2 text-[12px] font-bold tracking-[0.14em] uppercase">{t('slide.cta')}</span>
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(index - 1, -1)}
          className="absolute start-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/45 text-white backdrop-blur transition hover:bg-ink/70 sm:grid"
          aria-label={t('slider.prev')}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1, 1)}
          className="absolute end-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/45 text-white backdrop-blur transition hover:bg-ink/70 sm:grid"
          aria-label={t('slider.next')}
        >
          <ChevronRight size={22} />
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="absolute end-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-ink/45 text-white backdrop-blur transition hover:bg-ink/70 sm:end-5 sm:top-4"
          aria-pressed={paused}
          aria-label={paused ? t('slider.play') : t('slider.pause')}
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}
        </button>

        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
          {CAMPAIGNS.map((c, i) => (
            <button
              key={c.handle}
              type="button"
              aria-label={t('slider.goto', { n: i + 1 })}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-7 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
