const env = import.meta.env

export const CONTACT = {
  whatsapp: (env.VITE_WHATSAPP_NUMBER as string | undefined) ?? '212772234117',
  email: (env.VITE_CONTACT_EMAIL as string | undefined) ?? 'contact@captivia.ma',
  instagram: (env.VITE_INSTAGRAM_URL as string | undefined) ?? 'https://www.instagram.com/captivia.online/',
  facebook: (env.VITE_FACEBOOK_URL as string | undefined) ?? 'https://www.facebook.com/profile.php?id=61596761401635',
}

export const LEAD_WEBHOOK = env.VITE_LEAD_WEBHOOK as string | undefined

declare global {
  interface Window {
    CAPTIVIA_LEADS?: { webhook?: string }
  }
}

/** Webhook pasted in public/leads-config.js, otherwise the build-time env value. */
export function leadWebhook() {
  if (typeof window !== 'undefined') {
    const fromFile = window.CAPTIVIA_LEADS?.webhook?.trim()
    if (fromFile) return fromFile
  }
  return (LEAD_WEBHOOK ?? '').trim()
}

export function whatsappLink(text: string) {
  return `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
}

/** Keeps a name in its own direction so Arabic and Latin stay in the written order on WhatsApp. */
export function isolate(value: string) {
  return `\u2068${value.trim()}\u2069`
}
