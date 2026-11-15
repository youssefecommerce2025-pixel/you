import Stripe from 'stripe'
import { loadUsage, publicAvailability } from './lib/inventory.mjs'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

function json(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' }
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' })

  const stripeKey = process.env['STRIPE_SECRET_KEY']
  if (!stripeKey) return json(500, { error: 'Stripe is not configured on the server' })

  try {
    const stripe = new Stripe(stripeKey)
    const usage = await loadUsage(stripe)
    return json(200, { variants: publicAvailability(usage) })
  } catch (err) {
    return json(500, { error: err.message || 'Could not check availability' })
  }
}
