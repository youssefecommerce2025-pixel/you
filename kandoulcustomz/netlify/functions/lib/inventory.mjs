export const CATALOG = {
  'jsl-hoodie': { name: 'French terry midweight organic 100% by Je suis là', amount: 5500 },
  'jsl-heather-hoodie': { name: 'Heavyweight organic 100 % brushed hood by Je suis là', amount: 6500 },
  'jsl-espresso-hoodie': { name: 'Heavyweight French terry espresso', amount: 6500 },
  'jsl-crewneck': { name: 'Heavyweight crewneck by Je suis là', amount: 6500 },
}

// On-hand units. This list stays on the server. The site never renders these numbers.
const STOCK = [
  { id: 'jsl-heather-hoodie', color: 'Slate', size: 'L', qty: 5 },
  { id: 'jsl-heather-hoodie', color: 'Ash Grey', size: 'M', qty: 5 },
  { id: 'jsl-heather-hoodie', color: 'Black', size: 'L', qty: 3 },
  { id: 'jsl-hoodie', color: 'Black', size: 'L', qty: 5 },
  { id: 'jsl-hoodie', color: 'Black', size: 'M', qty: 4 },
  { id: 'jsl-hoodie', color: 'Camel', size: 'L', qty: 3 },
  { id: 'jsl-espresso-hoodie', color: 'Espresso', size: 'XL', qty: 2 },
  { id: 'jsl-espresso-hoodie', color: 'Espresso', size: 'L', qty: 2 },
  { id: 'jsl-espresso-hoodie', color: 'Espresso', size: 'M', qty: 1 },
  { id: 'jsl-crewneck', color: 'Grey', size: 'L', qty: 2 },
  { id: 'jsl-crewneck', color: 'Black', size: 'L', qty: 2 },
  { id: 'jsl-crewneck', color: 'Olive', size: 'L', qty: 2 },
]

export function canonicalColor(color) {
  const value = String(color || '').trim()
  if (value === 'Heather') return 'Ash Grey'
  if (value === 'Grey' || value === 'Gray') return 'Slate'
  if (value === 'Mustard') return 'Camel'
  return value
}

export function variantKey(id, color, size) {
  return `${id}|${canonicalColor(color)}|${String(size || '').trim()}`
}

function stockMap() {
  return new Map(STOCK.map((row) => [variantKey(row.id, row.color, row.size), row.qty]))
}

export function extractVariant(text) {
  const source = String(text || '')
  const paren = source.match(/\((XS|S|M|L|XL)\s*\/\s*([^)]+)\)\s*$/)
  if (paren) return { size: paren[1], color: canonicalColor(paren[2].trim()) }
  const parts = source.split(' · ').map((part) => part.trim()).filter(Boolean)
  if (/^(XS|S|M|L|XL)$/.test(parts[0] || '') && parts[1]) {
    return { size: parts[0], color: canonicalColor(parts[1]) }
  }
  return null
}

function idFromName(name) {
  const text = String(name || '')
  return Object.keys(CATALOG).find((id) => text.startsWith(CATALOG[id].name)) || ''
}

export function rowsFromSession(session) {
  const raw = session?.metadata?.cart
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
          .filter((row) => row && CATALOG[row.id])
          .map((row) => ({
            id: row.id,
            color: canonicalColor(row.color),
            size: String(row.size || '').trim(),
            qty: Math.max(1, Number(row.qty) || 1),
          }))
      }
    } catch {
      // Fall through to the line-item text.
    }
  }

  const lines = session?.line_items?.data || []
  const rows = []
  for (const line of lines) {
    const label = line.description || line.price?.product?.name || ''
    const id = idFromName(label)
    const variant = extractVariant(label) || extractVariant(line.price?.product?.description)
    if (!id || !variant) continue
    rows.push({ id, color: variant.color, size: variant.size, qty: Math.max(1, Number(line.quantity) || 1) })
  }
  return rows
}

export function tallySessions(sessions, nowSec) {
  const counts = new Map()
  for (const session of sessions) {
    const paid = session.status === 'complete' && session.payment_status === 'paid'
    const held = session.status === 'open' && Number(session.expires_at) > nowSec
    if (!paid && !held) continue
    for (const row of rowsFromSession(session)) {
      const key = variantKey(row.id, row.color, row.size)
      counts.set(key, (counts.get(key) || 0) + row.qty)
    }
  }
  return counts
}

export function publicAvailability(usage) {
  const onHand = stockMap()
  return STOCK.map((row) => {
    const key = variantKey(row.id, row.color, row.size)
    const left = Math.max(0, row.qty - (usage.get(key) || 0))
    return { id: row.id, color: row.color, size: row.size, available: left > 0, left }
  })
}

export function checkRequested(items, usage) {
  const onHand = stockMap()
  const requested = new Map()
  for (const item of items) {
    if (!CATALOG[item?.id]) return { error: 'Unknown product' }
    const qty = Math.max(1, Math.min(20, Number(item.qty) || 1))
    const key = variantKey(item.id, item.color, item.size)
    if (!onHand.has(key)) return { error: 'This color and size is sold out.' }
    requested.set(key, (requested.get(key) || 0) + qty)
  }
  for (const [key, qty] of requested) {
    const cap = onHand.get(key)
    const used = usage.get(key) || 0
    if (used >= cap || used + qty > cap) {
      return { error: used >= cap ? 'This color and size is sold out.' : 'That quantity is no longer available.' }
    }
  }
  return { ok: true }
}

let cache = { at: 0, usage: new Map() }

async function listSessions(stripe, params) {
  const all = []
  let startingAfter
  for (let page = 0; page < 10; page += 1) {
    const result = await stripe.checkout.sessions.list({
      limit: 100,
      starting_after: startingAfter,
      ...params,
      expand: ['data.line_items'],
    })
    all.push(...result.data)
    if (!result.has_more || !result.data.length) break
    startingAfter = result.data[result.data.length - 1].id
  }
  return all
}

export async function loadUsage(stripe, { force = false } = {}) {
  if (!force && Date.now() - cache.at < 15000) return cache.usage
  const [paid, open] = await Promise.all([
    listSessions(stripe, { status: 'complete' }),
    listSessions(stripe, { status: 'open' }),
  ])
  const usage = tallySessions([...paid, ...open], Math.floor(Date.now() / 1000))
  cache = { at: Date.now(), usage }
  return usage
}

export function clearUsageCache() {
  cache = { at: 0, usage: new Map() }
}
