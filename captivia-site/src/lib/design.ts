export type Universe = 'parfum' | 'soin' | 'cosmetique'
export type PaletteId = 'amethyste' | 'noir-or' | 'rose' | 'oud' | 'botanique'
export type FontId = 'elegante' | 'editoriale' | 'moderne'
export type FeatureId = 'cod' | 'story' | 'pack' | 'avis' | 'quiz' | 'bilingue'

export interface Design {
  brand: string
  universe: Universe
  palette: PaletteId
  font: FontId
  features: FeatureId[]
}

export interface Palette {
  bg: string
  surface: string
  ink: string
  muted: string
  accent: string
  accentInk: string
  soft: string
}

export const PALETTES: Record<PaletteId, Palette> = {
  amethyste: { bg: '#faf7ff', surface: '#ffffff', ink: '#2e1065', muted: '#7c6f99', accent: '#7c3aed', accentInk: '#ffffff', soft: '#ede9fe' },
  'noir-or': { bg: '#111013', surface: '#1c1a1f', ink: '#f6f0e1', muted: '#a59d8b', accent: '#c9a24d', accentInk: '#111013', soft: '#2a2620' },
  rose: { bg: '#fff6f8', surface: '#ffffff', ink: '#4a1d2f', muted: '#9c6b7d', accent: '#d9668d', accentInk: '#ffffff', soft: '#fde2ea' },
  oud: { bg: '#f7f0e7', surface: '#fffaf3', ink: '#3b2414', muted: '#8f7560', accent: '#8b5a2b', accentInk: '#ffffff', soft: '#ecdcc7' },
  botanique: { bg: '#f3f7f2', surface: '#ffffff', ink: '#1f3a2b', muted: '#6b8576', accent: '#3f7d5a', accentInk: '#ffffff', soft: '#dcebe0' },
}

export const FONTS: Record<FontId, string> = {
  elegante: "'Cormorant Garamond', 'Tajawal', serif",
  editoriale: "'Playfair Display', 'Tajawal', serif",
  moderne: "'Inter Variable', 'Tajawal', sans-serif",
}

export const UNIVERSE_IMAGES: Record<Universe, { hero: string; products: [string, string] }> = {
  parfum: { hero: '/img/perfume-hero.webp', products: ['/img/perfume-oud.webp', '/img/perfume-rose.webp'] },
  soin: { hero: '/img/soin-hero.webp', products: ['/img/soin-serum.webp', '/img/soin-creme.webp'] },
  cosmetique: { hero: '/img/cosmetique-hero.webp', products: ['/img/cosmetique-rouge.webp', '/img/cosmetique-poudre.webp'] },
}

export const UNIVERSES: Universe[] = ['parfum', 'soin', 'cosmetique']
export const PALETTE_IDS = Object.keys(PALETTES) as PaletteId[]
export const FONT_IDS = Object.keys(FONTS) as FontId[]
export const FEATURE_IDS: FeatureId[] = ['cod', 'story', 'pack', 'avis', 'quiz', 'bilingue']

export const DEFAULT_DESIGN: Design = {
  brand: '',
  universe: 'parfum',
  palette: 'amethyste',
  font: 'elegante',
  features: ['cod', 'story', 'pack'],
}
