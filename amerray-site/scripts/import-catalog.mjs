// Pulls the live Amerray Shopify catalogue and writes a trimmed, structured
// catalogue to src/data/catalog.json. Re-run any time: `npm run import:catalog`.
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const STORE = process.env.AMERRAY_STORE ?? 'https://amerray.com'
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/catalog.json')

// Collections imported in full, and large ones capped to their first N products.
const FULL = [
  'les-parfums-les-plus-vendus',
  'meilleurs-parfums-pour-homme',
  'meilleurs-parfums-pour-femme',
  'perfumes-arabic',
  'new-pack-2026',
  'offres-de-packs',
  'pack-homme',
  'pack-femme',
  'pack-4-parfums',
  'musc-musk-tahara',
  'bakhour-oud',
  'body-spray-hair-mist',
  'spray-maison-voiture',
  'parfum-enfant-amerray-kids',
]
const CAPPED = {
  'perfumes-men': 250,
  'perfumes-women': 250,
  'perfumes-unisex': 250,
  'parfum-de-niche': 250,
}

async function getJSON(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'amerray-catalog-import' } })
      if (!res.ok) throw new Error(`${res.status} ${url}`)
      return await res.json()
    } catch (err) {
      if (i === tries - 1) throw err
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i))
    }
  }
}

async function collection(handle, cap = Infinity) {
  const out = []
  for (let page = 1; out.length < cap; page++) {
    const { products } = await getJSON(`${STORE}/collections/${handle}/products.json?limit=250&page=${page}`)
    if (!products.length) break
    out.push(...products)
    if (products.length < 250) break
  }
  return out.slice(0, cap)
}

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;|&laquo;|&raquo;/g, '"')
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))

function toText(html = '') {
  const t = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '\n')
  return decode(t)
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\uFE0F\u200D]/gu
const clean = (s) => s.replace(EMOJI, '').replace(/\s+/g, ' ').trim()
const cap1 = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
const titleCase = (s) =>
  s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length > 2 || /^[a-z]$/.test(w) ? cap1(w) : w))
    .join(' ')

function field(lines, labels) {
  for (let i = 0; i < lines.length; i++) {
    for (const label of labels) {
      const re = new RegExp(`^${label}\\s*:\\s*(.*)$`, 'i')
      const m = lines[i].match(re)
      if (!m) continue
      const v = clean(m[1] || lines[i + 1] || '')
      if (v && v.length < 80 && !v.includes(':')) return v
    }
  }
  return undefined
}

const NOTE_HEADERS = [
  ['top', /^notes? de t[êe]te\s*:?\s*(.*)$/i],
  ['heart', /^notes? de c(œ|oe)ur\s*:?\s*(.*)$/i],
  ['base', /^notes? de fond\s*:?\s*(.*)$/i],
]

function notes(lines) {
  const out = { top: [], heart: [], base: [] }
  let current = null
  for (const raw of lines) {
    const line = clean(raw)
    const header = NOTE_HEADERS.find(([, re]) => re.test(line))
    if (header) {
      current = header[0]
      const inline = line.match(header[1])?.at(-1)
      if (inline) out[current].push(...inline.split(/[,،]/).map(clean).filter(Boolean))
      continue
    }
    if (!current) continue
    if (!line || line.includes(':') || line.length > 32 || /^(prix|tenue|pour qui|type|famille)/i.test(line)) {
      current = null
      continue
    }
    out[current].push(...line.split(/[,،]/).map(clean).filter(Boolean))
  }
  for (const k of Object.keys(out)) out[k] = [...new Set(out[k].map(cap1))].slice(0, 6)
  return out.top.length + out.heart.length + out.base.length ? out : undefined
}

const ACCORDS = {
  vanilla: 'Vanillé', vanillé: 'Vanillé', sweet: 'Sucré', sucré: 'Sucré', amber: 'Ambré', ambré: 'Ambré',
  cinnamon: 'Cannelle', 'warm spicy': 'Épicé chaud', 'épicé chaud': 'Épicé chaud', 'soft spicy': 'Épicé doux',
  'épicé doux': 'Épicé doux', 'fresh spicy': 'Épicé frais', 'épicé frais': 'Épicé frais', powdery: 'Poudré',
  poudreux: 'Poudré', poudré: 'Poudré', aromatic: 'Aromatique', aromatique: 'Aromatique', caramel: 'Caramel',
  woody: 'Boisé', boisé: 'Boisé', fruity: 'Fruité', fruité: 'Fruité', floral: 'Floral', 'white floral': 'Floral blanc',
  'floral blanc': 'Floral blanc', fresh: 'Frais', frais: 'Frais', citrus: 'Hespéridé', agrumes: 'Hespéridé',
  hespéridé: 'Hespéridé', leather: 'Cuir', cuir: 'Cuir', musky: 'Musqué', musqué: 'Musqué', oud: 'Oud',
  smoky: 'Fumé', fumé: 'Fumé', tobacco: 'Tabac', tabac: 'Tabac', rose: 'Rose', marine: 'Marin', marin: 'Marin',
  aquatic: 'Aquatique', aquatique: 'Aquatique', earthy: 'Terreux', green: 'Vert', vert: 'Vert', honey: 'Miel',
  miel: 'Miel', coffee: 'Café', café: 'Café', lavender: 'Lavande', lavande: 'Lavande', iris: 'Iris',
  balsamic: 'Balsamique', balsamique: 'Balsamique', 'tropical': 'Tropical', coconut: 'Coco', 'tuberose': 'Tubéreuse',
  chocolate: 'Chocolat', cacao: 'Cacao', patchouli: 'Patchouli', ozonic: 'Ozonique', ozonique: 'Ozonique',
  'fresh spicy ': 'Épicé frais', gourmand: 'Gourmand', oriental: 'Oriental', animalic: 'Animal', salty: 'Salé',
  salé: 'Salé', mossy: 'Mousse', yellow: 'Floral jaune', 'yellow floral': 'Floral jaune', almond: 'Amande',
  amande: 'Amande', cherry: 'Cerise', cerise: 'Cerise', metallic: 'Métallique', rum: 'Rhum', whiskey: 'Whisky',
  'aldehydic': 'Aldéhydé', aldéhydé: 'Aldéhydé', lactonic: 'Lacté', lacté: 'Lacté', herbal: 'Herbacé',
  herbacé: 'Herbacé', 'violet': 'Violette', violette: 'Violette', mineral: 'Minéral', minéral: 'Minéral',
}

function accords(lines) {
  const found = []
  for (const l of lines) {
    const k = clean(l).toLowerCase()
    if (ACCORDS[k] && !found.includes(ACCORDS[k])) found.push(ACCORDS[k])
  }
  return found.slice(0, 6)
}

function reviews(lines) {
  const out = []
  for (let i = 1; i < lines.length; i++) {
    const author = lines[i].match(/^[-–]\s*([A-ZÀ-Ý][^⭐"]{1,40}?)\s*(⭐+)?$/u)
    if (!author) continue
    const stars = author[2] || lines[i + 1]?.startsWith('⭐')
    if (!stars) continue
    const text = clean(lines[i - 1]).replace(/^["“«]\s*|\s*["”»]$/g, '')
    if (text.length < 25 || /^[,.;]/.test(text) || text.includes('⭐')) continue
    out.push({ text: cap1(text), author: clean(author[1]) })
  }
  return out.slice(0, 4)
}

function duration(lines, family) {
  const joined = lines.join(' ')
  const range = joined.match(/(\d{1,2})\s*(?:à|-|–)\s*(\d{1,2})\s*(?:h\b|heures)/i)
  if (range) return [Number(range[1]), Number(range[2])]
  const plus = joined.match(/(\d{1,2})\s*\+\s*heures/i)
  if (plus) return [Number(plus[1]), Number(plus[1]) + 2]
  return /oriental|boisé|oud|ambr|gourmand/i.test(family ?? '') ? [8, 12] : [6, 8]
}

function strength(force, hours) {
  const f = (force ?? '').toLowerCase()
  if (/très fort|extr|scandal|bête/.test(f)) return 5
  if (/fort/.test(f) && !/moyen/.test(f)) return 4
  if (/moyen|modér/.test(f)) return 3
  if (/léger|doux|lég/.test(f)) return 2
  return hours[1] >= 10 ? 4 : 3
}

const KIND_BY_COLLECTION = {
  'musc-musk-tahara': 'musc',
  'bakhour-oud': 'bakhour',
  'body-spray-hair-mist': 'body',
  'spray-maison-voiture': 'home',
  'parfum-enfant-amerray-kids': 'kids',
}
const PACK_COLLECTIONS = ['new-pack-2026', 'offres-de-packs', 'pack-homme', 'pack-femme', 'pack-4-parfums']

function seasonList(s, family) {
  const v = (s ?? '').toLowerCase()
  const out = []
  if (/printemps|spring/.test(v)) out.push('printemps')
  if (/été|ete|summer/.test(v)) out.push('ete')
  if (/automne|fall|autumn/.test(v)) out.push('automne')
  if (/hiver|winter/.test(v)) out.push('hiver')
  if (/toute|all|4 saisons/.test(v)) return ['printemps', 'ete', 'automne', 'hiver']
  if (out.length) return out
  if (/frais|aquat|marin|hespér|agrume|citr|fruité/i.test(family ?? '')) return ['printemps', 'ete']
  if (/oriental|boisé|gourmand|oud|ambr|cuir|épic/i.test(family ?? '')) return ['automne', 'hiver']
  return ['printemps', 'ete', 'automne', 'hiver']
}

function momentList(s, family) {
  const v = (s ?? '').toLowerCase()
  const out = []
  if (/jour|bureau|travail|quotidien|day|office/.test(v)) out.push('jour')
  if (/soir|nuit|club|sortie|séduction|night|date|rendez/.test(v)) out.push('soir')
  if (/occasion|mariage|fête|spécial|cérémon/.test(v)) out.push('occasion')
  if (out.length) return out
  return /frais|aquat|hespér|agrume|citr/i.test(family ?? '') ? ['jour'] : ['soir', 'occasion']
}

const GROUP_RULES = [
  ['oud', /\boud/],
  ['gourmand', /gourmand|vanill|sucré|caramel|chocolat|café|tonka/],
  ['frais', /aquat|marin|frais|fraîch|hespér|agrume|citr|ozon|aromatique|fougère|vert/],
  ['floral', /floral|rose|jasmin|fleur|iris|tubér|chypr|poudr/],
  ['boise', /boisé|cuir|santal|cèdre|fumé|tabac|vétiver|musc/],
  ['oriental', /oriental|ambr|épic|encens/],
  ['fruite', /fruit/],
]

function familyGroup(family = '', acc = []) {
  for (const source of [family.toLowerCase(), acc.slice(0, 2).join(' ').toLowerCase()]) {
    if (!source) continue
    const hit = GROUP_RULES.find(([, re]) => re.test(source))
    if (hit) return hit[0]
  }
  return 'oriental'
}

function trimSentences(text, max = 260) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text]
  let out = ''
  for (const s of sentences) {
    if (out && (out + s).length > max) break
    out += s
  }
  return clean(out.length > max + 40 ? `${out.slice(0, max).replace(/\s+\S*$/, '')}…` : out)
}

function shortDescription(lines, inspired, brand) {
  const fallback = inspired ? `Notre interprétation de ${inspired}${brand ? ` de ${brand}` : ''}, en Eau de Parfum concentrée à 25-30 %.` : ''
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    if (/^[-–]\s/.test(l) && l.length > 40) return trimSentences(clean(l.replace(/^[-–]\s*/, '')).replace(/ au Maroc ?!/i, ' !'))
    if (l.length > 70 && /parfum|composition|essence|senteur|fragrance|musc|pack/i.test(l) && !/s'inspirent|livr|^nous /i.test(l)) {
      let text = clean(l)
      if (/^[a-zà-ÿ]/.test(text)) text = `${clean(lines[i - 1] ?? inspired ?? '')} ${text}`.replace(/ parfum maroc /i, ' ')
      return trimSentences(text)
    }
  }
  return fallback
}

function packContents(lines) {
  const joined = lines.join(' ')
  const m = joined.match(/\(([A-Z][^()]{2,40})\)[^()]{0,60}\(([A-Z][^()]{2,40})\)[^()]{0,60}\(([A-Z][^()]{2,40})\)(?:[^()]{0,60}\(([A-Z][^()]{2,40})\))?/)
  return m ? m.slice(1).filter(Boolean) : undefined
}

async function main() {
  const membership = new Map()
  const byId = new Map()
  const handles = [...FULL, ...Object.keys(CAPPED)]
  for (const handle of handles) {
    const products = await collection(handle, CAPPED[handle] ?? Infinity)
    console.log(`${handle}: ${products.length}`)
    for (const p of products) {
      byId.set(p.id, p)
      if (!membership.has(p.id)) membership.set(p.id, new Set())
      membership.get(p.id).add(handle)
    }
  }

  const bestOrder = new Map()
  ;(await collection('les-parfums-les-plus-vendus')).forEach((p, i) => bestOrder.set(p.id, i))

  const products = []
  const seenPackTitles = new Set()
  for (const p of byId.values()) {
    if (/\(tik\)|^amerray & co\. - perfume$/i.test(p.title)) continue
    const cols = membership.get(p.id)
    const lines = toText(p.body_html)
    const minPrice = Math.min(...p.variants.map((v) => Number(v.price)))
    const brandRaw = (p.product_type || '').replace(/^notre création de\s*/i, '').trim()
    const styledAs = p.title.match(/^(.+?) de ([A-Z][A-Z .&'-]+)$/)
    const isPerfume = /^inspired by/i.test(p.title) || (styledAs && minPrice < 200)
    let kind = 'perfume'
    for (const [c, k] of Object.entries(KIND_BY_COLLECTION)) if (cols.has(c)) kind = k
    if (!isPerfume && kind === 'perfume' && (PACK_COLLECTIONS.some((c) => cols.has(c)) || minPrice >= 200)) kind = 'pack'
    if (kind === 'pack') {
      if (!p.variants.some((v) => Number(v.price) >= 200)) continue
      const key = p.title.toLowerCase()
      if (seenPackTitles.has(key)) continue
      seenPackTitles.add(key)
    }

    const brandSource = brandRaw || (styledAs ? styledAs[2] : '')
    const brand = /collection arab/i.test(brandSource) ? 'Collection Arabic' : brandSource ? titleCase(brandSource) : undefined
    const inspired = isPerfume ? (styledAs ? styledAs[1] : p.title.replace(/^inspired by\s*/i, '')).trim() : undefined
    const family = field(lines, ['Famille', 'Famille olfactive'])
    const acc = accords(lines)
    const hours = duration(lines, family)
    const force = field(lines, ['Force', 'Sillage', 'Intensité'])
    const season = field(lines, ['Meilleure saison', 'Saison', 'Saisons'])
    const moment = field(lines, ['Quand', 'Occasion', 'Moment'])

    const declared = (field(lines, ['Genre', 'Pour']) ?? '').toLowerCase()
    const inMen = cols.has('perfumes-men') || cols.has('meilleurs-parfums-pour-homme') || cols.has('pack-homme')
    const inWomen = cols.has('perfumes-women') || cols.has('meilleurs-parfums-pour-femme') || cols.has('pack-femme')
    let gender = 'unisexe'
    if (/unisex|mixte|homme (et|&) femme|femme (et|&) homme|tous/.test(declared)) gender = 'unisexe'
    else if (/femme|féminin|women/.test(declared)) gender = 'femme'
    else if (/homme|masculin|men/.test(declared)) gender = 'homme'
    else if (inMen && !inWomen) gender = 'homme'
    else if (inWomen && !inMen) gender = 'femme'
    else if (/\bfemme\b|for her|pour elle/i.test(p.title)) gender = 'femme'
    else if (/\bhomme\b|for him|pour homme/i.test(p.title)) gender = 'homme'

    const variants = p.variants
      .filter((v) => kind !== 'pack' || Number(v.price) >= 200)
      .map((v) => ({
      id: v.id,
      title: v.title === 'Default Title' ? undefined : v.title,
      price: Number(v.price),
      compareAt: v.compare_at_price && Number(v.compare_at_price) > Number(v.price) ? Number(v.compare_at_price) : undefined,
      available: v.available,
    }))

    products.push({
      id: p.id,
      handle: p.handle,
      title: clean(p.title),
      inspired,
      brand,
      kind,
      gender,
      collections: [...cols],
      price: Math.min(...variants.map((v) => v.price)),
      compareAt: variants[0].compareAt,
      available: variants.some((v) => v.available),
      variants,
      images: p.images.slice(0, 5).map((i) => i.src.split('?')[0]),
      family: family ? cap1(family.replace(/[.!]+$/, '')) : undefined,
      familyGroup: familyGroup(family, acc),
      accords: acc,
      notes: notes(lines),
      hours,
      strength: strength(force, hours),
      seasons: seasonList(season, family ?? acc.join(' ')),
      moments: momentList(moment, family ?? acc.join(' ')),
      year: Number(field(lines, ['Année'])) || undefined,
      description: shortDescription(lines, inspired, brand),
      reviews: reviews(lines),
      packContents: kind === 'pack' ? packContents(lines) : undefined,
      bestRank: bestOrder.get(p.id),
      createdAt: p.created_at,
    })
  }

  products.sort((a, b) => (a.bestRank ?? 9999) - (b.bestRank ?? 9999))
  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify({ importedAt: new Date().toISOString(), source: STORE, products }))
  const counts = products.reduce((acc, p) => ((acc[p.kind] = (acc[p.kind] ?? 0) + 1), acc), {})
  console.log(`\n${products.length} produits →`, OUT, counts)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
