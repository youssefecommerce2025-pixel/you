import { useEffect, useState } from 'react'

export const TRACKED_IDS = new Set(['jsl-hoodie', 'jsl-heather-hoodie', 'jsl-espresso-hoodie'])

export function canonicalColor(color) {
  const value = String(color || '').trim()
  if (value === 'Heather') return 'Ash Grey'
  if (value === 'Grey' || value === 'Gray') return 'Slate'
  return value
}

export function variantKey(id, color, size) {
  return `${id}|${canonicalColor(color)}|${String(size || '').trim()}`
}

export function availabilityEndpoint() {
  const checkout = import.meta.env.VITE_CHECKOUT_ENDPOINT || ''
  return checkout.replace(/create-checkout-session\/?$/, 'availability')
}

let state = { ready: false, byKey: {}, error: '' }
let pending = null
const listeners = new Set()

function publish(next) {
  state = next
  listeners.forEach((listener) => listener(state))
}

export function refreshAvailability() {
  if (pending) return pending
  const url = availabilityEndpoint()
  if (!url) {
    publish({ ready: false, byKey: {}, error: 'Availability is not connected.' })
    return Promise.resolve(state)
  }
  pending = fetch(url, { cache: 'no-store' })
    .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (!ok || !Array.isArray(data.variants)) {
        throw new Error(data.error || 'Could not check availability')
      }
      const byKey = {}
      for (const row of data.variants) {
        byKey[variantKey(row.id, row.color, row.size)] = Math.max(0, Number(row.left) || 0)
      }
      publish({ ready: true, byKey, error: '' })
      return state
    })
    .catch((err) => {
      publish({ ready: false, byKey: {}, error: err.message || 'Could not check availability' })
      return state
    })
    .finally(() => {
      pending = null
    })
  return pending
}

export function unitsLeft(snapshot, id, color, size) {
  if (!snapshot.ready) return null
  return snapshot.byKey[variantKey(id, color, size)] ?? 0
}

export function useAvailability() {
  const [snapshot, setSnapshot] = useState(state)
  useEffect(() => {
    listeners.add(setSnapshot)
    refreshAvailability()
    const timer = setInterval(refreshAvailability, 20000)
    return () => {
      listeners.delete(setSnapshot)
      clearInterval(timer)
    }
  }, [])
  return snapshot
}
