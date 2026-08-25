import { Link } from 'react-router-dom'

const values = [
  { icon: '🎯', title: 'Purpose Over Product', desc: 'We don\'t just make clothes. Every piece we create carries meaning — a milestone, a message, an identity.' },
  { icon: '🌿', title: 'Ethical by Design', desc: 'From the cotton we source to the conditions we operate in — sustainability and fair practices are non-negotiable.' },
  { icon: '🤝', title: 'Community First', desc: 'We\'re not a faceless corporation. We\'re real people who care about every order, every customer, every story.' },
  { icon: '💎', title: 'Quality Without Compromise', desc: 'We only produce what we\'d be proud to wear ourselves. Premium materials, precision craftsmanship, zero shortcuts.' },
]

const team = [
  { emoji: '👑', name: 'Founder & Creative Director', desc: 'Behind every piece is a vision: clothing that makes people feel seen, celebrated, and present.' },
  { emoji: '🎨', name: 'Lead Designer', desc: 'Turning ideas into art. Every custom order is treated like a personal mission.' },
  { emoji: '⚙️', name: 'Production Manager', desc: 'Making sure every piece is perfect before it leaves our hands.' },
]

export default function About() {
  return (
    <div className="pt-40 pb-20">
      {/* Hero */}
      <section className="pb-20 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-4 block">Our Story</span>
          <h1 className="text-5xl sm:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            We Started With
            <span className="block italic" style={{ color: '#C9A84C' }}>Three Words.</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
            <em>"Je Suis Là."</em> — I Am Here. That's the heartbeat of everything we do.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20" style={{ background: '#0A0A0A' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div
                  className="rounded-3xl p-16 flex flex-col items-center text-center"
                  style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }}
                >
                  <span className="text-8xl mb-6">👑</span>
                  <p className="text-white font-black text-4xl italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Je Suis Là
                  </p>
                  <p className="text-yellow-400 text-lg mt-2 font-medium">"I Am Here."</p>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-black font-black text-sm">Made in USA</p>
                </div>
              </div>
            </div>

            {/* Story text */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-4 block">The Beginning</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Born from a Need to Be Seen
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  JUL was born from a simple but powerful frustration: generic clothing that says nothing about who you actually are. We believed clothing could be more — a statement, a keepsake, a conversation starter.
                </p>
                <p>
                  The name <strong className="text-white">"Je Suis Là"</strong> — I Am Here — became our signature. It's what you say when you refuse to blend in. When you decide your story matters enough to be worn, shared, and celebrated.
                </p>
                <p>
                  We started small, crafting personalized pieces for friends and family. Word spread. Orders grew. Today, we've fulfilled over 500 orders across the US, from individual birthday gifts to corporate team hoodies for hundreds of people.
                </p>
                <p>
                  But the mission hasn't changed: <strong className="text-white">make clothing that means something.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-3 block">What We Stand For</span>
            <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h3 className="font-black text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-3 block">The People Behind the Brand</span>
            <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>Meet the Team</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl"
                  style={{ background: 'linear-gradient(135deg, #0A0A0A, #2a2a2a)' }}
                >
                  {member.emoji}
                </div>
                <h3 className="font-black text-sm uppercase tracking-wide mb-2">{member.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: '#0A0A0A' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Story Deserves to Be Worn.
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            Whether it's a single piece or a bulk order — we're here for every story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/custom-order" className="px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold">
              Start Your Order
            </Link>
            <Link to="/contact" className="px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm border-2 border-white/20 text-white hover:border-yellow-400/50 hover:text-yellow-400 transition-all">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
