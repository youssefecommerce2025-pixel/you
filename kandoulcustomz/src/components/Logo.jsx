export default function Logo({ size = 'md' }) {
  const heightClass = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-12 lg:h-14',
    lg: 'h-14 sm:h-16',
  }[size] || 'h-9 sm:h-12'

  return (
    <img
      src={`${import.meta.env.BASE_URL}jesuisla-logo.png`}
      alt="Je suis là"
      className={`${heightClass} w-auto max-w-[160px] sm:max-w-[220px] lg:max-w-[280px] object-contain select-none block`}
    />
  )
}
