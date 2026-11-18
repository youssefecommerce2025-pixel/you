import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Search, TrendingUp, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { displayName, formatPrice, searchProducts, useCatalog } from '../lib/catalog'
import { useI18n } from '../lib/i18n'
import { productMessage, waLink } from '../lib/whatsapp'
import { Img, WhatsAppIcon } from './ui'

export const POPULAR = ['Sauvage', 'Baccarat Rouge 540', 'Khamrah', 'Stronger With You', 'Yara', 'La Vie Est Belle', 'Tobacco Vanille', 'Eros']

export function SearchOverlay({ open, onClose, initial = '' }: { open: boolean; onClose: () => void; initial?: string }) {
  const { t, lang } = useI18n()
  const catalog = useCatalog()
  const navigate = useNavigate()
  const [q, setQ] = useState(initial)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setQ(initial)
    setActive(0)
    const id = setTimeout(() => inputRef.current?.focus(), 60)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(id)
      document.body.style.overflow = ''
    }
  }, [open, initial])

  const results = useMemo(() => (catalog ? searchProducts(catalog.products, q, 8) : []), [catalog, q])

  const go = (handle: string) => {
    onClose()
    navigate(`/produit/${handle}`)
  }
  const seeAll = () => {
    onClose()
    navigate(`/collection/tous?q=${encodeURIComponent(q)}`)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    }
    if (e.key === 'Enter' && results[active]) go(results[active].handle)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/60 backdrop-blur-md sm:p-6 sm:pt-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onKeyDown={onKey}
        >
          <motion.div
            role="dialog"
            aria-modal
            className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[78vh] sm:rounded-[28px] sm:shadow-2xl"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
              <Search size={20} className="shrink-0 text-ink/40" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setActive(0)
                }}
                placeholder={t('search.short')}
                className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-ink/35"
                aria-label={t('nav.search')}
              />
              <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-ink/5" aria-label={t('common.close')}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {!q && (
                <div className="p-3">
                  <p className="eyebrow mb-4 flex items-center gap-2 text-ink/45">
                    <TrendingUp size={14} /> {t('search.popular')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map((s) => (
                      <button key={s} type="button" onClick={() => setQ(s)} className="chip border-ink/10 hover:border-ink hover:bg-ink hover:text-white">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {q && results.length === 0 && catalog && (
                <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
                  <p className="text-ink/60">{t('search.noResult', { q })}</p>
                  <a href={waLink(productMessage(q))} target="_blank" rel="noreferrer" className="btn-whatsapp">
                    <WhatsAppIcon className="size-4" /> {t('search.askWhatsapp')}
                  </a>
                </div>
              )}

              {results.length > 0 && (
                <ul className="flex flex-col">
                  {results.map((p, i) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(p.handle)}
                        className={`flex w-full items-center gap-4 rounded-2xl p-2.5 text-start transition ${i === active ? 'bg-stone' : ''}`}
                      >
                        <Img src={p.images[0]} alt="" width={160} sizes="64px" className="size-16 shrink-0 rounded-xl bg-mist" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-xl" dir="auto">
                            {displayName(p)}
                          </span>
                          <span className="block truncate text-[12px] text-ink/50">
                            {p.brand ? `${t('product.inspiredBy')} · ${p.brand}` : t(`gender.${p.gender}`)}
                            {p.kind === 'perfume' && ` · ${t(`family.${p.familyGroup}`)}`}
                          </span>
                        </span>
                        <span className="text-sm font-semibold">{formatPrice(p.price, lang)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {results.length > 0 && (
              <button
                type="button"
                onClick={seeAll}
                className="flex items-center justify-center gap-2 border-t border-ink/10 py-4 text-sm font-semibold hover:bg-stone"
              >
                {t('search.seeAll')} <ArrowRight size={16} className="rtl:rotate-180" />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
