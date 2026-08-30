export default function Logo({ size = 'md' }) {
  // md matches the Our Story card logo (~280px wide)
  const widths = { sm: 180, md: 280, lg: 340 }
  const w = widths[size] || 280

  return (
    <img
      src={`${import.meta.env.BASE_URL}jesuisla-logo.png`}
      alt="Je suis là"
      className="object-contain select-none block"
      style={{ width: w, height: 'auto', maxWidth: '100%' }}
    />
  )
}
