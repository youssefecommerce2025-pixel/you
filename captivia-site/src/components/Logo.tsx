import { useId } from 'react'

export function LogoMark({ className = 'h-10 w-10', light = false }: { className?: string; light?: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`cg-${id}`} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={light ? '#ffffff' : '#4c1d95'} />
          <stop offset="0.55" stopColor={light ? '#ede9fe' : '#7c3aed'} />
          <stop offset="1" stopColor={light ? '#c4b5fd' : '#a78bfa'} />
        </linearGradient>
      </defs>
      <path
        d="M47.5 15.5A23 23 0 1 0 47.5 48.5"
        fill="none"
        stroke={`url(#cg-${id})`}
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M49 21.5c3.6 4.6 6 8.4 6 11.6a6 6 0 0 1-12 0c0-3.2 2.4-7 6-11.6Z"
        fill={`url(#cg-${id})`}
      />
      <path
        d="M29 21.5l2.3 7.2 7.2 2.3-7.2 2.3L29 40.5l-2.3-7.2-7.2-2.3 7.2-2.3Z"
        fill={light ? '#ffffff' : '#6d28d9'}
      />
    </svg>
  )
}

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" dir="ltr">
      <LogoMark light={light} className={compact ? 'h-8 w-8' : 'h-10 w-10'} />
      <span className="flex flex-col leading-none">
        <span
          className={`text-[1.55rem] font-semibold tracking-[0.18em] ${light ? 'text-white' : 'text-violet-deep'}`}
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          CAPTIVIA
        </span>
        {!compact && (
          <span className={`mt-1 hidden text-[0.56rem] sm:block font-semibold tracking-[0.38em] ${light ? 'text-lavender' : 'text-violet/70'}`}>
            E-COMMERCE · BEAUTÉ
          </span>
        )}
      </span>
    </span>
  )
}
