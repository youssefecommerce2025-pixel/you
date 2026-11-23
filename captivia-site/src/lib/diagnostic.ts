import { leadWebhook } from './config'
import { leadReport } from './leadReport'
import type { Design } from './design'

export type OfferId = 'essentiel' | 'experience' | 'prestige'
export const OFFER_IDS: OfferId[] = ['essentiel', 'experience', 'prestige']

export type QuestionId = 'univers' | 'canal' | 'catalogue' | 'commandes' | 'frustration' | 'fonctions' | 'budget' | 'delai'

export interface QuestionDef {
  id: QuestionId
  options: string[]
  multi?: boolean
}

export const QUESTIONS: QuestionDef[] = [
  { id: 'univers', options: ['parfum', 'soin', 'cosmetique', 'multi'] },
  { id: 'canal', options: ['dm', 'site', 'boutique', 'lancement'] },
  { id: 'catalogue', options: ['s', 'm', 'l'] },
  { id: 'commandes', options: ['s', 'm', 'l'] },
  { id: 'frustration', options: ['dm', 'image', 'panier', 'unique'] },
  { id: 'fonctions', options: ['cod', 'story', 'pack', 'avis', 'quiz', 'bilingue', 'wow', 'dashboard'], multi: true },
  { id: 'budget', options: ['s', 'm', 'l', 'conseil'] },
  { id: 'delai', options: ['urgent', 'mois', 'flexible'] },
]

export type Answers = Partial<Record<QuestionId, string[]>>

const WEIGHTS: Record<string, Partial<Record<OfferId, number>>> = {
  'canal.dm': { essentiel: 2 },
  'canal.site': { experience: 2 },
  'canal.boutique': { experience: 1, prestige: 1 },
  'canal.lancement': { essentiel: 2 },
  'catalogue.s': { essentiel: 2 },
  'catalogue.m': { experience: 2 },
  'catalogue.l': { prestige: 2, experience: 1 },
  'commandes.s': { essentiel: 2 },
  'commandes.m': { experience: 2 },
  'commandes.l': { prestige: 2 },
  'frustration.dm': { essentiel: 2 },
  'frustration.image': { experience: 1, prestige: 1 },
  'frustration.panier': { experience: 2 },
  'frustration.unique': { prestige: 2 },
  'fonctions.cod': { essentiel: 1 },
  'fonctions.story': { experience: 1 },
  'fonctions.pack': { experience: 1 },
  'fonctions.avis': { experience: 1 },
  'fonctions.quiz': { prestige: 2 },
  'fonctions.bilingue': { prestige: 1 },
  'fonctions.wow': { prestige: 1 },
  'fonctions.dashboard': { prestige: 1 },
  'budget.s': { essentiel: 3 },
  'budget.m': { experience: 3 },
  'budget.l': { prestige: 3 },
  'delai.urgent': { essentiel: 1 },
}

const TIE_BREAK: OfferId[] = ['experience', 'prestige', 'essentiel']

export interface Recommendation {
  offer: OfferId
  alternative: OfferId
  match: number
  scores: Record<OfferId, number>
  reasons: string[]
}

export function recommend(answers: Answers): Recommendation {
  const scores: Record<OfferId, number> = { essentiel: 0, experience: 0, prestige: 0 }
  const contributions: Record<OfferId, string[]> = { essentiel: [], experience: [], prestige: [] }

  for (const [qid, values] of Object.entries(answers)) {
    for (const v of values ?? []) {
      const key = `${qid}.${v}`
      const w = WEIGHTS[key]
      if (!w) continue
      for (const offer of OFFER_IDS) {
        const n = w[offer] ?? 0
        scores[offer] += n
        if (n > 0) contributions[offer].push(key)
      }
    }
  }

  const ranked = [...OFFER_IDS].sort((a, b) => scores[b] - scores[a] || TIE_BREAK.indexOf(a) - TIE_BREAK.indexOf(b))
  const [offer, alternative] = ranked
  const gap = scores[offer] - scores[alternative]
  const match = Math.min(98, 78 + gap * 4 + Math.min(scores[offer], 6))
  return { offer, alternative, match, scores, reasons: contributions[offer] }
}

export interface Contact {
  firstName: string
  lastName: string
  brand: string
  phone: string
  email: string
}

export interface Lead {
  answers: Answers
  comment: string
  contact: Contact
  recommendation: Recommendation
  design: Design
  lang: string
  createdAt: string
  interestedOffer?: OfferId | null
}

export function isValidPhone(raw: string) {
  const v = raw.replace(/[\s.\-()]/g, '')
  return /^(?:\+212|00212|0)[5-7]\d{8}$/.test(v) || /^\+\d{8,15}$/.test(v)
}

export function isValidEmail(raw: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim())
}

export async function submitLead(lead: Lead) {
  try {
    const saved = JSON.parse(localStorage.getItem('captivia-leads') ?? '[]') as Lead[]
    localStorage.setItem('captivia-leads', JSON.stringify([...saved, lead].slice(-20)))
  } catch {
    /* storage may be unavailable in private mode */
  }

  const report = leadReport(lead)
  const flat: Record<string, string> = {
    'form-name': 'diagnostic',
    prenom: report.prenom,
    nom: report.nom,
    brand: report.marque,
    telephone: report.telephone,
    email: report.email,
    offre: report.offre,
    compatibilite: report.compatibilite,
    reponses: JSON.stringify(report),
    commentaire: report.commentaire,
    maquette: report.maquette,
    langue: report.langue,
  }

  const requests: Promise<unknown>[] = [
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(flat).toString(),
    }),
  ]
  const webhook = leadWebhook()
  if (webhook) {
    const googleScript = /script\.google\.com/.test(webhook)
    requests.push(
      fetch(webhook, {
        method: 'POST',
        mode: googleScript ? 'no-cors' : 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(report),
      }),
    )
  }
  await Promise.allSettled(requests)
}
