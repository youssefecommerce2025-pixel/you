import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { content, type Content, type Lang } from './content'

interface LangState {
  lang: Lang
  dir: 'ltr' | 'rtl'
  t: Content
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangState | null>(null)

function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'ar' || fromUrl === 'fr') return fromUrl
  const stored = localStorage.getItem('captivia-lang')
  if (stored === 'ar' || stored === 'fr') return stored
  return navigator.language?.startsWith('ar') ? 'ar' : 'fr'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = dir
    localStorage.setItem('captivia-lang', lang)
    document.title = content[lang].meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', content[lang].meta.description)
  }, [lang, dir])

  const value = useMemo(() => ({ lang, dir, t: content[lang], setLang }), [lang, dir]) as LangState
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
