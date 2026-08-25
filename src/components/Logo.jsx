export default function Logo({ size = 'md' }) {
  const heights = { sm: 40, md: 56, lg: 88 }
  const maxWidths = { sm: 180, md: 280, lg: 420 }
  const h = heights[size] || 56

  return (
    <img
      src={`${import.meta.env.BASE_URL}jesuisla-logo.png`}
      alt="Je suis là"
      className="object-contain select-none"
      style={{ height: h, width: 'auto', maxWidth: maxWidths[size] || 280 }}
    />
  )
}
