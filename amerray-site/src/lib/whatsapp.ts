import { WHATSAPP_NUMBER, formatPrice } from './catalog'
import type { CartLine, Order } from './store'

export const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

const lineLabel = (l: CartLine) => `${l.qty} × ${l.inspired ? `Inspired By ${l.inspired}` : l.title}`

export function orderMessage(order: Order) {
  const { customer: c, totals } = order
  return [
    `Bonjour Amerray, je confirme ma commande n°${order.id} :`,
    '',
    ...order.lines.map(lineLabel),
    '',
    totals.discount ? `Offre 3+1 : -${formatPrice(totals.discount)}` : null,
    `Livraison : ${formatPrice(totals.shipping)}`,
    `Total à la livraison : ${formatPrice(totals.total)}`,
    '',
    `Nom : ${c.name}`,
    `Téléphone : ${c.phone}`,
    `Ville : ${c.city}`,
    `Adresse : ${c.address}`,
    c.note ? `Remarque : ${c.note}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n')
}

export function cartMessage(lines: CartLine[], total: number) {
  return ['Bonjour Amerray, je souhaite commander :', '', ...lines.map(lineLabel), '', `Total estimé : ${formatPrice(total)}`].join('\n')
}

export function productMessage(name: string) {
  return `Bonjour Amerray, je suis intéressé(e) par « ${name} ». Est-il disponible ?`
}
