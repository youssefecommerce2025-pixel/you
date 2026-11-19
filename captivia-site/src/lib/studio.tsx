import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_DESIGN, type Design } from './design'
import type { OfferId } from './diagnostic'

interface StudioState {
  design: Design
  setDesign: (update: (d: Design) => Design) => void
  interestedOffer: OfferId | null
  setInterestedOffer: (offer: OfferId | null) => void
}

const StudioContext = createContext<StudioState | null>(null)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [design, setDesignState] = useState<Design>(DEFAULT_DESIGN)
  const [interestedOffer, setInterestedOffer] = useState<OfferId | null>(null)
  const value = useMemo(
    () => ({ design, setDesign: setDesignState, interestedOffer, setInterestedOffer }),
    [design, interestedOffer],
  )
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used inside StudioProvider')
  return ctx
}
