const steps = [
  {
    num: '01',
    icon: '💡',
    title: 'Share Your Vision',
    desc: 'Tell us your idea — a design, a quote, a logo, or a feeling. Use our custom order form or just send us a message.',
  },
  {
    num: '02',
    icon: '🎨',
    title: 'We Design It',
    desc: "Our team brings your vision to life. We'll send you a digital mockup for approval before we print a single thread.",
  },
  {
    num: '03',
    icon: '✂️',
    title: 'We Craft It',
    desc: 'Using premium materials and precision printing or embroidery, we produce your piece with obsessive attention to quality.',
  },
  {
    num: '04',
    icon: '📦',
    title: 'Delivered to Your Door',
    desc: "Carefully packaged and shipped directly to you. Standard delivery in 2-3 days. Custom orders in 5-7 days.",
  },
]

export default function HowItWorks() {
  return (
    <section className="section-padding bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-3 block">The Process</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Simple. Personal. Perfect.
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Getting a custom piece from JUL is simple, fast, and stress-free. Here's how it works:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              {/* Step number */}
              <div className="relative mb-6">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-3 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={{ background: 'linear-gradient(135deg, #0A0A0A, #2a2a2a)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
                >
                  {step.icon}
                </div>
                <span
                  className="absolute -top-2 -right-2 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', color: '#0A0A0A' }}
                >
                  {i + 1}
                </span>
              </div>
              <h3 className="font-black text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="/custom-order"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
          >
            Start Your Custom Order Today
          </a>
        </div>
      </div>
    </section>
  )
}
