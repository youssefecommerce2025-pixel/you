import { useEffect, useState } from 'react'

export type Gender = 'homme' | 'femme' | 'unisexe'
export type Kind = 'perfume' | 'pack' | 'musc' | 'bakhour' | 'body' | 'home' | 'kids' | 'candle'
export type FamilyGroup = 'frais' | 'floral' | 'oriental' | 'boise' | 'gourmand' | 'fruite' | 'oud'
export type Season = 'printemps' | 'ete' | 'automne' | 'hiver'
export type Moment = 'jour' | 'soir' | 'occasion'

export interface Variant {
  id: number
  title?: string
  price: number
  compareAt?: number
  available: boolean
}

export interface Product {
  id: number
  handle: string
  title: string
  inspired?: string
  brand?: string
  kind: Kind
  gender: Gender
  collections: string[]
  price: number
  compareAt?: number
  available: boolean
  variants: Variant[]
  images: string[]
  family?: string
  familyGroup: FamilyGroup
  accords: string[]
  notes?: { top: string[]; heart: string[]; base: string[] }
  hours: [number, number]
  strength: number
  seasons: Season[]
  moments: Moment[]
  year?: number
  description: string
  reviews: { text: string; author: string; stars?: number }[]
  packContents?: string[]
  bestRank?: number
  createdAt: string
}

export interface Catalog {
  importedAt: string
  source: string
  products: Product[]
}

let cache: Catalog | null = null
let pending: Promise<Catalog> | null = null

export function loadCatalog(): Promise<Catalog> {
  if (cache) return Promise.resolve(cache)
  pending ??= import('../data/catalog.json').then((m) => {
    cache = m.default as unknown as Catalog
    return cache
  })
  return pending
}

export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(cache)
  useEffect(() => {
    if (!catalog) loadCatalog().then(setCatalog)
  }, [catalog])
  return catalog
}

export const SINGLE_PRICE = 99.99
export const SHIPPING_FEE = 19
export const WHATSAPP_NUMBER = '212665440983'
export const WHATSAPP_DISPLAY = '+212 665-440983'

export function shopifyImage(src: string | undefined, width: number) {
  if (!src) return ''
  return `${src}?width=${width}`
}

export function srcSet(src: string | undefined, widths = [320, 480, 720, 960]) {
  if (!src) return undefined
  return widths.map((w) => `${shopifyImage(src, w)} ${w}w`).join(', ')
}

export const formatPrice = (value: number, lang: 'fr' | 'ar' = 'fr') => {
  const rounded = Math.abs(value - Math.round(value)) < 0.005 ? Math.round(value) : value
  const n = new Intl.NumberFormat(lang === 'ar' ? 'fr-MA' : 'fr-MA', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rounded)
  return lang === 'ar' ? `${n} درهم` : `${n} DH`
}

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`]/g, '')
    .replace(/[^a-z0-9\u0600-\u06ff ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export function displayName(p: Product) {
  return p.inspired ?? p.title
}

/** Small ranked full-text search over the fields people actually type: the original perfume, brand, notes. */
export function searchProducts(products: Product[], query: string, limit = 24) {
  const q = normalize(query)
  if (!q) return []
  const terms = q.split(' ')
  const scored: { p: Product; score: number }[] = []
  for (const p of products) {
    const name = normalize(displayName(p))
    const brand = normalize(p.brand ?? '')
    const notes = normalize(
      [...(p.notes?.top ?? []), ...(p.notes?.heart ?? []), ...(p.notes?.base ?? []), ...p.accords, p.family ?? ''].join(' '),
    )
    let score = 0
    if (name === q) score += 100
    else if (name.startsWith(q)) score += 60
    else if (name.includes(q)) score += 40
    for (const t of terms) {
      if (name.split(' ').some((w) => w.startsWith(t))) score += 12
      if (brand.includes(t)) score += 8
      if (notes.includes(t)) score += 3
    }
    if (terms.every((t) => `${name} ${brand} ${notes}`.includes(t))) score += 10
    else if (score < 12) continue
    if (score > 0) scored.push({ p, score: score + (p.bestRank !== undefined ? 6 - Math.min(p.bestRank, 120) / 20 : 0) })
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.p)
}

export function averageRating(p: Product) {
  return p.reviews.length ? 5 : undefined
}

export function similarProducts(all: Product[], p: Product, limit = 8) {
  return all
    .filter((o) => o.id !== p.id && o.kind === 'perfume' && o.available)
    .map((o) => {
      let s = 0
      if (o.familyGroup === p.familyGroup) s += 5
      if (o.gender === p.gender) s += 3
      else if (o.gender === 'unisexe' || p.gender === 'unisexe') s += 1
      s += o.accords.filter((a) => p.accords.includes(a)).length * 2
      s += o.seasons.filter((a) => p.seasons.includes(a)).length * 0.5
      if (o.bestRank !== undefined) s += 2
      return { o, s }
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.o)
}

export interface CollectionDef {
  handle: string
  match: (p: Product) => boolean
  image?: string
}

const isPerfume = (p: Product) => p.kind === 'perfume'

export const COLLECTIONS: CollectionDef[] = [
  { handle: 'tous', match: isPerfume },
  { handle: 'best-sellers', match: (p) => p.bestRank !== undefined && p.kind === 'perfume' },
  { handle: 'homme', match: (p) => isPerfume(p) && (p.gender === 'homme' || (p.gender === 'unisexe' && p.collections.includes('perfumes-men'))) },
  { handle: 'femme', match: (p) => isPerfume(p) && (p.gender === 'femme' || (p.gender === 'unisexe' && p.collections.includes('perfumes-women'))) },
  { handle: 'unisexe', match: (p) => isPerfume(p) && p.gender === 'unisexe' },
  { handle: 'arabic', match: (p) => isPerfume(p) && p.collections.includes('perfumes-arabic') },
  { handle: 'niche', match: (p) => isPerfume(p) && p.collections.includes('parfum-de-niche') },
  { handle: 'packs', match: (p) => p.kind === 'pack' },
  { handle: 'pack-homme', match: (p) => p.kind === 'pack' && p.collections.includes('pack-homme') },
  { handle: 'pack-femme', match: (p) => p.kind === 'pack' && p.collections.includes('pack-femme') },
  { handle: 'musc-bakhour', match: (p) => p.kind === 'musc' || p.kind === 'bakhour' },
  { handle: 'musc', match: (p) => p.kind === 'musc' },
  { handle: 'bakhour-oud', match: (p) => p.kind === 'bakhour' },
  { handle: 'maison-corps', match: (p) => p.kind === 'home' || p.kind === 'body' },
  { handle: 'maison-voiture', match: (p) => p.kind === 'home' },
  { handle: 'body-hair', match: (p) => p.kind === 'body' },
  { handle: 'kids', match: (p) => p.kind === 'kids' },
  { handle: 'bougies', match: (p) => p.kind === 'candle' },
]

/** Perfume collections keep scent filters. Everything else is its own rayon. */
export const NON_PERFUME_COLLECTIONS = new Set([
  'packs',
  'pack-homme',
  'pack-femme',
  'musc-bakhour',
  'musc',
  'bakhour-oud',
  'maison-corps',
  'maison-voiture',
  'body-hair',
  'kids',
  'bougies',
])

export function collectionHandle(p: Product) {
  if (p.kind === 'perfume') return p.gender
  if (p.kind === 'pack') {
    if (p.collections.includes('pack-femme')) return 'pack-femme'
    if (p.collections.includes('pack-homme')) return 'pack-homme'
    return 'packs'
  }
  if (p.kind === 'musc') return 'musc'
  if (p.kind === 'bakhour') return 'bakhour-oud'
  if (p.kind === 'home') return 'maison-voiture'
  if (p.kind === 'body') return 'body-hair'
  if (p.kind === 'kids') return 'kids'
  if (p.kind === 'candle') return 'bougies'
  return 'tous'
}

export const isPackEligible = (p: Product) => p.kind === 'perfume'
