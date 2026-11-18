import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SHIPPING_FEE, isPackEligible, type Product } from './catalog'

export interface CartLine {
  key: string
  productId: number
  variantId: number
  handle: string
  title: string
  inspired?: string
  brand?: string
  image?: string
  unitPrice: number
  qty: number
  packEligible: boolean
}

export interface PricedUnit {
  key: string
  price: number
  free: boolean
}

export interface CartTotals {
  subtotal: number
  discount: number
  shipping: number
  total: number
  eligibleCount: number
  freeCount: number
  freeUnits: Map<string, number>
  toNextFree: number
}

/** "3 achetés = 1 offert": within each group of 4 eligible bottles, the cheapest one is free. */
export function computeTotals(lines: CartLine[]): CartTotals {
  const units: PricedUnit[] = []
  for (const l of lines) if (l.packEligible) for (let i = 0; i < l.qty; i++) units.push({ key: l.key, price: l.unitPrice, free: false })
  units.sort((a, b) => b.price - a.price)
  const freeUnits = new Map<string, number>()
  let discount = 0
  for (let g = 0; g + 4 <= units.length; g += 4) {
    const cheapest = units[g + 3]
    cheapest.free = true
    discount += cheapest.price
    freeUnits.set(cheapest.key, (freeUnits.get(cheapest.key) ?? 0) + 1)
  }
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)
  const shipping = lines.length ? SHIPPING_FEE : 0
  const eligibleCount = units.length
  return {
    subtotal,
    discount,
    shipping,
    total: Math.max(0, subtotal - discount + shipping),
    eligibleCount,
    freeCount: Math.floor(eligibleCount / 4),
    freeUnits,
    toNextFree: eligibleCount === 0 ? 4 : (4 - (eligibleCount % 4)) % 4,
  }
}

export interface Order {
  id: string
  createdAt: string
  customer: { name: string; phone: string; city: string; address: string; note?: string }
  lines: CartLine[]
  totals: { subtotal: number; discount: number; shipping: number; total: number }
}

interface Store {
  lines: CartLine[]
  totals: CartTotals
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  checkoutOpen: boolean
  setCheckoutOpen: (v: boolean) => void
  add: (p: Product, qty?: number, opts?: { silent?: boolean; variantId?: number }) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  lastAdded: { title: string; at: number } | null
  wishlist: number[]
  toggleWish: (id: number) => void
  recent: number[]
  pushRecent: (id: number) => void
  orders: Order[]
  saveOrder: (o: Order) => void
}

const Ctx = createContext<Store | null>(null)

function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue] as const
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = usePersisted<CartLine[]>('amerray.cart', [])
  const [wishlist, setWishlist] = usePersisted<number[]>('amerray.wishlist', [])
  const [recent, setRecent] = usePersisted<number[]>('amerray.recent', [])
  const [orders, setOrders] = usePersisted<Order[]>('amerray.orders', [])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<Store['lastAdded']>(null)

  const add = useCallback<Store['add']>(
    (p, qty = 1, opts) => {
      const variant = p.variants.find((v) => v.id === opts?.variantId) ?? p.variants.reduce((a, b) => (b.price < a.price ? b : a))
      const key = `${p.id}:${variant.id}`
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key)
        if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
        return [
          ...prev,
          {
            key,
            productId: p.id,
            variantId: variant.id,
            handle: p.handle,
            title: p.title,
            inspired: p.inspired,
            brand: p.brand,
            image: p.images[0],
            unitPrice: variant.price,
            qty,
            packEligible: isPackEligible(p),
          },
        ]
      })
      setLastAdded({ title: p.inspired ?? p.title, at: Date.now() })
      if (!opts?.silent) setCartOpen(true)
    },
    [setLines],
  )

  const setQty = useCallback(
    (key: string, qty: number) =>
      setLines((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)))),
    [setLines],
  )
  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), [setLines])
  const clear = useCallback(() => setLines([]), [setLines])
  const toggleWish = useCallback(
    (id: number) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [id, ...w])),
    [setWishlist],
  )
  const pushRecent = useCallback((id: number) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12)), [setRecent])
  const saveOrder = useCallback((o: Order) => setOrders((prev) => [o, ...prev].slice(0, 20)), [setOrders])

  const totals = useMemo(() => computeTotals(lines), [lines])

  const value = useMemo<Store>(
    () => ({
      lines,
      totals,
      cartOpen,
      setCartOpen,
      checkoutOpen,
      setCheckoutOpen,
      add,
      setQty,
      remove,
      clear,
      lastAdded,
      wishlist,
      toggleWish,
      recent,
      pushRecent,
      orders,
      saveOrder,
    }),
    [lines, totals, cartOpen, checkoutOpen, add, setQty, remove, clear, lastAdded, wishlist, toggleWish, recent, pushRecent, orders, saveOrder],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore outside provider')
  return ctx
}
