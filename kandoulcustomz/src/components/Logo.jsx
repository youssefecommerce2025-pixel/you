export default function Logo({ size = 'md', dark = false }) {
  const sizes = { sm: 32, md: 40, lg: 56 }
  const dim = sizes[size] || 40
  const textColor = dark ? '#0A0A0A' : '#FFFFFF'

  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="10" fill="#0A0A0A"/>
        {/* Crown points */}
        <path d="M12 46 L12 22 L22 32 L32 16 L42 32 L52 22 L52 46 Z" fill="#C9A84C"/>
        <rect x="12" y="44" width="40" height="4" rx="2" fill="#C9A84C"/>
        {/* Inner shine */}
        <path d="M22 32 L32 20 L42 32" fill="#E8C97A" opacity="0.5"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span
          className="font-black tracking-widest uppercase"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: size === 'lg' ? '1.25rem' : size === 'sm' ? '0.75rem' : '1rem',
            color: dark ? '#0A0A0A' : '#FFFFFF',
            letterSpacing: '0.15em',
          }}
        >
          KANDOUL
        </span>
        <span
          className="font-bold tracking-[0.3em] uppercase"
          style={{
            fontSize: size === 'lg' ? '0.65rem' : size === 'sm' ? '0.45rem' : '0.55rem',
            color: '#C9A84C',
            letterSpacing: '0.35em',
          }}
        >
          CUSTOMZ
        </span>
      </div>
    </div>
  )
}
