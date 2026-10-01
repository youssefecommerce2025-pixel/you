import Stripe from 'stripe'

const CATALOG = {
  'jsl-hoodie': { name: 'Je Suis Là Hoodie', amount: 5500 },
  'custom-hoodie': { name: '100% Custom Hoodie', amount: 6900 },
}

const GIFT_BOX_CENTS = 499
const RUSH_CENTS = 399
const FREE_SHIPPING_FROM = 7500
const SHIPPING_CENTS = 799

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

function json(statusCode, body) {
  return { statusCode, headers: corsHeaders, body: JSON.stringify(body) }
}

function clean(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max)
}

function readCustomer(body) {
  const c = body.customer && typeof body.customer === 'object' ? body.customer : {}
  const customer = {
    firstName: clean(c.firstName, 60),
    lastName: clean(c.lastName, 60),
    address: clean(c.address, 200),
    city: clean(c.city, 80),
    state: clean(c.state, 2).toUpperCase(),
    postalCode: clean(c.postalCode, 10),
    phone: clean(c.phone, 30),
    email: clean(c.email, 120).toLowerCase(),
  }
  if (!customer.firstName || !customer.lastName) return { error: 'Name is required' }
  if (!customer.address || !customer.city || !/^[A-Z]{2}$/.test(customer.state)) return { error: 'Address is required' }
  if (!/^\d{5}(-\d{4})?$/.test(customer.postalCode)) return { error: 'Enter a valid US ZIP code' }
  const digits = customer.phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) return { error: 'Enter a valid phone number' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return { error: 'Enter a valid email' }
  return { customer }
}

function allowedReturnUrl(url) {
  if (typeof url !== 'string') return false
  try {
    const parsed = new URL(url.replace('{CHECKOUT_SESSION_ID}', 'cs_test_placeholder'))
    const host = parsed.hostname
    return host === 'youssefecommerce2025-pixel.github.io' || host === 'localhost' || host === '127.0.0.1'
  } catch {
    return false
  }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }
  // Bracket access so Netlify's bundler does not freeze an empty key at build time.
  const stripeKey = process.env['STRIPE_SECRET_KEY']
  if (!stripeKey) {
    return json(500, { error: 'Stripe is not configured on the server' })
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }

  const items = Array.isArray(body.items) ? body.items : []
  if (!items.length) return json(400, { error: 'Cart is empty' })

  const parsedCustomer = readCustomer(body)
  if (parsedCustomer.error) return json(400, { error: parsedCustomer.error })
  const customer = parsedCustomer.customer
  const fullName = `${customer.firstName} ${customer.lastName}`
  const shippingAddress = {
    line1: customer.address,
    city: customer.city,
    state: customer.state,
    postal_code: customer.postalCode,
    country: 'US',
  }

  const lineItems = []
  let merchandise = 0

  for (const item of items) {
    const product = CATALOG[item.id]
    if (!product) return json(400, { error: 'Unknown product' })
    const qty = Math.max(1, Math.min(20, Number(item.qty) || 1))
    merchandise += product.amount * qty
    const details = [item.size, item.color, item.logo].filter(Boolean).join(' · ')
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: 'usd',
        unit_amount: product.amount,
        product_data: {
          name: product.name,
          ...(details ? { description: details } : {}),
        },
      },
    })
  }

  if (body.giftBox) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: GIFT_BOX_CENTS,
        product_data: { name: 'Gift packaging' },
      },
    })
  }
  if (body.rush) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: RUSH_CENTS,
        product_data: { name: 'Priority queue' },
      },
    })
  }

  const shippingCents = merchandise >= FREE_SHIPPING_FROM ? 0 : SHIPPING_CENTS
  const successUrl = allowedReturnUrl(body.successUrl)
    ? body.successUrl
    : 'https://youssefecommerce2025-pixel.github.io/you/thank-you?session_id={CHECKOUT_SESSION_ID}'
  const cancelUrl = allowedReturnUrl(body.cancelUrl)
    ? body.cancelUrl
    : 'https://youssefecommerce2025-pixel.github.io/you/shop'

  try {
    const stripe = new Stripe(stripeKey)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customer.email,
      metadata: {
        customer_name: fullName,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        postal_code: customer.postalCode,
      },
      payment_intent_data: {
        receipt_email: customer.email,
        shipping: {
          name: fullName,
          phone: customer.phone,
          address: shippingAddress,
        },
        metadata: {
          customer_name: fullName,
          phone: customer.phone,
          email: customer.email,
        },
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingCents, currency: 'usd' },
            display_name: shippingCents === 0 ? 'Free US shipping (3-7 days)' : 'US shipping (3-7 days)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
    })
    return json(200, { url: session.url })
  } catch (err) {
    return json(500, { error: err.message || 'Could not start checkout' })
  }
}
