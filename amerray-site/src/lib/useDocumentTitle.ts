import { useEffect } from 'react'

const BASE = 'Amerray & Co.'
const DEFAULT_TITLE = `${BASE} — Parfums inspirés des grandes maisons, livrés partout au Maroc`

export function useDocumentTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : DEFAULT_TITLE
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
