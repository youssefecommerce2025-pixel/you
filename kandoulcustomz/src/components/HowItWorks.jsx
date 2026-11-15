import { Link } from 'react-router-dom'
const steps = [
  {
    num: '01',
    icon: '🧵',
    title: 'Sustainably Sourced',
    desc: 'We start with 100% organic cotton, selected for its heavyweight durability and ultra-soft feel. No synthetic shortcuts.',
  },
  {
    num: '02',
    icon: '✂️',
    title: 'Precision Cut',
    desc: "Engineered for the perfect boxy, structured fit. Our hoodies are cut to sit perfectly on the shoulders without sagging.",
  },
  {
    num: '03',
    icon: '🪡',
    title: 'Hand Finished',
    desc: 'Every piece is embroidered, inspected, and finished by hand in the USA to ensure flawless quality.',
  },
  {
    num: '04',
    icon: '📦',
    title: 'Delivered to You',
    desc: "Carefully packaged and shipped directly to your door. Standard tracked US delivery in 3-7 business days.",
  },
]

export default function HowItWorks() {
  return (
    <section className="section-padding bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3 block">The Process</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Uncompromising Quality.
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From raw organic cotton to the final stitch, we control every step of the process to deliver the perfect men's heavyweight hoodie.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-red-300 to-transparent" />

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
                  style={{ background: 'linear-gradient(135deg, #CC3731, #E2574C)', color: '#FFFFFF' }}
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
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
          >
            Shop the Collection
          </Link>
        </div>
      </div>
    </section>
  )
}
