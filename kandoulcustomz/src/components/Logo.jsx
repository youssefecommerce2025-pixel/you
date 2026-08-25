export default function Logo({ size = 'md' }) {
  const heights = { sm: 28, md: 36, lg: 48 }
  const h = heights[size] || 36

  return (
    <img
      src={`${import.meta.env.BASE_URL}jesuisla-logo.png`}
      alt="Je suis là"
      className="object-contain select-none"
      style={{ height: h, width: 'auto', maxWidth: size === 'lg' ? 280 : size === 'sm' ? 140 : 190 }}
    />
  )
}
