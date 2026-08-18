const posts = [
  { emoji: '🖤', user: '@marcust_atl', caption: 'Je Suis Là on repeat 🔥 Best hoodie ever', likes: '847' },
  { emoji: '🟤', user: '@jasminestyle_htx', caption: 'This brown hoodie is EVERYTHING right now', likes: '1.2K' },
  { emoji: '👕', user: '@carlosmedia_mia', caption: 'Team event shirts came in perfect 💯 @kandoulcustomz', likes: '523' },
  { emoji: '✨', user: '@aaliyah.k.nyc', caption: 'Custom birthday shirt for my sis 😭❤️', likes: '934' },
  { emoji: '🫒', user: '@deshawn.chicago', caption: 'The olive green dropped differently bro 🤌', likes: '2.1K' },
  { emoji: '⬛', user: '@brianna_la', caption: 'Life Goes On tee every Monday morning motivation', likes: '678' },
]

export default function SocialProof() {
  return (
    <section className="section-padding overflow-hidden" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-3 block">The Feed</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Community
          </h2>
          <p className="text-white/40 max-w-lg mx-auto mb-4">
            Tag us on Instagram or TikTok for a chance to be featured.
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-yellow-400/50 transition-all text-sm font-medium"
          >
            Follow @kandoulcustomz
          </a>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post, i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
              style={{ aspectRatio: '1', background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }}
            >
              {/* Image area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl sm:text-8xl transition-transform duration-300 group-hover:scale-110">
                  {post.emoji}
                </span>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <p className="text-yellow-400 font-bold text-sm">{post.user}</p>
                  <p className="text-white/80 text-xs mt-1 leading-snug">{post.caption}</p>
                  <p className="text-white/40 text-xs mt-2">❤️ {post.likes}</p>
                </div>
              </div>

              {/* Corner badge */}
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}
                >
                  <span className="text-xs">📸</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
