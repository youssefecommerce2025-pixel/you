import { motion, type HTMLMotionProps } from 'framer-motion'
import { Star } from 'lucide-react'
import { useState, type ReactNode, type SVGProps } from 'react'
import { shopifyImage, srcSet } from '../lib/catalog'

export function Logo({ tone = 'dark', className = '' }: { tone?: 'dark' | 'light'; className?: string }) {
  return (
    <img
      src={tone === 'dark' ? '/amerray-signature-black.png' : '/amerray-signature-white.png'}
      alt="Amerray & Co."
      className={`h-auto select-none ${className}`}
      draggable={false}
    />
  )
}

export function Img({
  src,
  alt,
  width = 720,
  sizes = '(min-width: 1024px) 25vw, 50vw',
  className = '',
  eager = false,
}: {
  src?: string
  alt: string
  width?: number
  sizes?: string
  className?: string
  eager?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  return (
    <span className={`${/(^|\s)absolute(\s|$)/.test(className) ? '' : 'relative'} block overflow-hidden ${loaded ? '' : 'skeleton'} ${className}`}>
      {src && (
        <img
          src={shopifyImage(src, width)}
          srcSet={srcSet(src)}
          sizes={sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-luxe)] ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </span>
  )
}

export function Stars({ value = 5, size = 14, className = '' }: { value?: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-gold ${className}`} aria-label={`${value}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} strokeWidth={0} fill={i < Math.round(value) ? 'currentColor' : '#d9d6cf'} />
      ))}
    </span>
  )
}

export function Meter({ value, max = 5, className = '' }: { value: number; max?: number; className?: string }) {
  return (
    <span className={`flex gap-1 ${className}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-1.5 flex-1 rounded-full ${i < value ? 'bg-gold' : 'bg-current/15'}`} />
      ))}
    </span>
  )
}

export function Reveal({ children, delay = 0, y = 24, className = '', ...rest }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'left',
  tone = 'dark',
  action,
}: {
  eyebrow?: string
  title: ReactNode
  text?: string
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  action?: ReactNode
}) {
  return (
    <Reveal className={`mb-10 flex flex-col gap-4 md:mb-14 ${align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className={`eyebrow mb-3 ${tone === 'dark' ? 'text-gold-deep' : 'text-gold'}`}>{eyebrow}</p>}
        <h2 className={`font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl ${tone === 'dark' ? 'text-ink' : 'text-white'}`}>{title}</h2>
        {text && <p className={`mt-4 text-base leading-relaxed ${tone === 'dark' ? 'text-ink/60' : 'text-white/60'}`}>{text}</p>}
      </div>
      {action}
    </Reveal>
  )
}

export const WhatsAppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 7 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.9 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.49-8.4" />
  </svg>
)

export const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const TikTokIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M19.6 6.7a4.8 4.8 0 0 1-3.8-4.2V2h-3.4v13.4a2.9 2.9 0 1 1-2-2.7V9.2a6.3 6.3 0 1 0 5.4 6.2V8.6a8.2 8.2 0 0 0 4.8 1.5V6.7h-1z" />
  </svg>
)

export const YoutubeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
  </svg>
)
