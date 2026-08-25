export default function Logo({ size = 'md' }) {
  const sizes = { sm: 36, md: 44, lg: 64 }
  const dim = sizes[size] || 44

  return (
    <div className="flex items-center gap-2.5 select-none">
      <img
        src={`${import.meta.env.BASE_URL}jul-logo.png`}
        alt="JUL"
        width={dim}
        height={dim}
        className="rounded-full object-cover bg-white shadow-sm"
        style={{ width: dim, height: dim }}
      />
      <span
        className="font-black tracking-[0.22em] uppercase text-white"
        style={{
          fontFamily: 'Impact, Arial Black, sans-serif',
          fontSize: size === 'lg' ? '1.4rem' : size === 'sm' ? '0.85rem' : '1.05rem',
        }}
      >
        JUL
      </span>
    </div>
  )
}
