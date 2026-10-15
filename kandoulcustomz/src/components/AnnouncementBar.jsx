export default function AnnouncementBar() {
  return (
    <div className="announcement-bar relative z-[60] flex min-h-10 items-center justify-center px-4 text-center">
      <p className="text-sm font-black uppercase tracking-[0.22em] sm:text-base" style={{ color: '#E8C97A' }}>
        <span className="mr-2 align-middle text-xl leading-none" role="img" aria-label="United States flag">🇺🇸</span>
        USA Made
      </p>
    </div>
  )
}
