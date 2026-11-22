import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { content, type Content, type Lang } from './content'

interface LangState {
  lang: Lang
  dir: 'ltr' | 'rtl'
  t: Content
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangState | null>(null)

const CHOICE_KEY = 'captivia-lang-choice'

function visitorSpeaksArabic() {
  const list = navigator.languages?.length ? navigator.languages : [navigator.language]
  return list.some((code) => code?.toLowerCase().startsWith('ar'))
}

function visitorInMorocco() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone === 'Africa/Casablanca'
  } catch {
    return false
  }
}

function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  const stored = localStorage.getItem(CHOICE_KEY)
  const lang: Lang =
    fromUrl === 'ar' || fromUrl === 'fr'
      ? fromUrl
      : stored === 'ar' || stored === 'fr'
        ? stored
        : visitorInMorocco() || visitorSpeaksArabic()
          ? 'ar'
          : 'fr'
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  return lang
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = dir
    document.title = content[lang].meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', content[lang].meta.description)
  }, [lang, dir])

  const choose = (next: Lang) => {
    localStorage.setItem(CHOICE_KEY, next)
    setLang(next)
  }
  const value = useMemo(() => ({ lang, dir, t: content[lang], setLang: choose }), [lang, dir]) as LangState
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
