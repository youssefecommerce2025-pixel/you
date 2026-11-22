import { motion } from 'framer-motion'
import { Mail, MessageCircle, Sparkles } from 'lucide-react'
import { Logo } from '../components/Logo'
import { CONTACT, whatsappLink } from '../lib/config'
import { useLang } from '../lib/i18n'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1h1.3V3h-2.2C11.9 3 11 4.4 11 6.5v2H9v2.8h2V21h3.5v-9.7h2.3l.4-2.8h-2.7Z" />
    </svg>
  )
}

export function FinalCta() {
  const { t } = useLang()
  return (
    <section className="bg-pearl pb-24">
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="grain relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet via-violet-deep to-night px-8 py-16 text-center text-white sm:px-16 sm:py-20"
        >
          <img
            src="/img/perfume-hero.webp"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-luminosity"
          />
          <div className="relative">
            <h2 className="font-display mx-auto max-w-3xl text-4xl leading-tight font-semibold sm:text-6xl">{t.final.title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">{t.final.subtitle}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href="#diagnostic" className="btn-light">
                <Sparkles size={17} /> {t.final.cta}
              </a>
              <a
                href={whatsappLink(t.whatsappHello)}
                target="_blank"
                rel="noreferrer"
                className="btn border border-white/30 text-white hover:bg-white/10"
              >
                <MessageCircle size={17} /> {t.final.whatsapp}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="bg-night py-14 text-white/70">
      <div className="container-luxe grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{t.footer.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t.footer.contact}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={whatsappLink(t.whatsappHello)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail size={16} /> {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t.footer.follow}</p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
              <InstagramIcon /> Instagram
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
              <FacebookIcon /> Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="container-luxe mt-12 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45">
        <span>
          © {new Date().getFullYear()} Captivia. {t.footer.rights}
        </span>
        <span>{t.footer.madeIn}</span>
      </div>
    </footer>
  )
}

export function WhatsAppFab() {
  const { t } = useLang()
  return (
    <a
      href={whatsappLink(t.whatsappHello)}
      target="_blank"
      rel="noreferrer"
      aria-label={t.fab}
      className="group fixed bottom-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition hover:scale-105 ltr:right-5 rtl:left-5"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.9.99 6.68 2.77a9.4 9.4 0 0 1 2.76 6.68c0 5.2-4.24 9.44-9.45 9.44m8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.3l5.7-1.5a11.33 11.33 0 0 0 5.77 1.5c6.27 0 11.37-5.1 11.37-11.37 0-3.03-1.18-5.89-3.33-8.03" />
      </svg>
      <span className="hidden max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-500 group-hover:max-w-xs sm:inline">
        {t.fab}
      </span>
    </a>
  )
}
