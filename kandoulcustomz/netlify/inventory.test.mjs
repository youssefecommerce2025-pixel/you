import test from 'node:test'
import assert from 'node:assert/strict'
import { checkRequested, publicAvailability, tallySessions } from './functions/lib/inventory.mjs'

const now = 1_700_000_000

test('paid sales reduce a color and size until it is blocked', () => {
  const usage = tallySessions([
    {
      status: 'complete',
      payment_status: 'paid',
      metadata: { cart: JSON.stringify([{ id: 'jsl-heather-hoodie', color: 'Slate', size: 'L', qty: 5 }]) },
    },
    {
      status: 'complete',
      payment_status: 'paid',
      metadata: { cart: JSON.stringify([{ id: 'jsl-hoodie', color: 'Black', size: 'M', qty: 3 }]) },
    },
  ], now)

  const variants = publicAvailability(usage)
  const slate = variants.find((row) => row.color === 'Slate' && row.size === 'L')
  const blackM = variants.find((row) => row.id === 'jsl-hoodie' && row.size === 'M')
  assert.equal(slate.available, false)
  assert.equal(slate.left, 0)
  assert.equal(blackM.available, true)
  assert.equal(blackM.left, 1)
})

test('an open checkout holds a unit and an expired one does not', () => {
  const usage = tallySessions([
    { status: 'open', expires_at: now + 60, metadata: { cart: JSON.stringify([{ id: 'jsl-heather-hoodie', color: 'Black', size: 'L', qty: 1 }]) } },
    { status: 'open', expires_at: now - 60, metadata: { cart: JSON.stringify([{ id: 'jsl-heather-hoodie', color: 'Black', size: 'L', qty: 1 }]) } },
    { status: 'complete', payment_status: 'unpaid', metadata: { cart: JSON.stringify([{ id: 'jsl-heather-hoodie', color: 'Black', size: 'L', qty: 1 }]) } },
  ], now)
  const black = publicAvailability(usage).find((row) => row.id === 'jsl-heather-hoodie' && row.color === 'Black')
  assert.equal(black.left, 2)
})

test('older Stripe line items count by size and color', () => {
  const usage = tallySessions([
    {
      status: 'complete',
      payment_status: 'paid',
      line_items: {
        data: [{
          description: 'French terry midweight organic 100% by Je suis là (L / Black)',
          quantity: 2,
        }],
      },
    },
  ], now)
  const row = publicAvailability(usage).find((item) => item.id === 'jsl-hoodie' && item.size === 'L')
  assert.equal(row.left, 3)
})

test('camel, espresso, and the crewneck follow the same hidden caps', () => {
  const usage = new Map()
  assert.equal(checkRequested([{ id: 'jsl-hoodie', color: 'Camel', size: 'L', qty: 1 }], usage).ok, true)
  assert.equal(checkRequested([{ id: 'jsl-hoodie', color: 'Mustard', size: 'L', qty: 1 }], usage).ok, true)
  assert.equal(checkRequested([{ id: 'jsl-espresso-hoodie', color: 'Espresso', size: 'XL', qty: 2 }], usage).ok, true)
  assert.equal(checkRequested([{ id: 'jsl-espresso-hoodie', color: 'Espresso', size: 'M', qty: 2 }], usage).error, 'That quantity is no longer available.')
  assert.equal(checkRequested([{ id: 'jsl-crewneck', color: 'Grey', size: 'L', qty: 1 }], usage).ok, true)
  assert.equal(checkRequested([{ id: 'jsl-crewneck', color: 'Olive', size: 'M', qty: 1 }], usage).error, 'This color and size is sold out.')
  const crew = publicAvailability(usage).find((row) => row.id === 'jsl-crewneck' && row.color === 'Black')
  assert.equal(crew.available, true)
})

test('checkout rejects a sold-out color and a quantity over what remains, without stating the cap', () => {
  const usage = tallySessions([
    { status: 'complete', payment_status: 'paid', metadata: { cart: JSON.stringify([{ id: 'jsl-hoodie', color: 'Black', size: 'L', qty: 4 }]) } },
  ], now)
  const soldOut = checkRequested([{ id: 'jsl-espresso-hoodie', color: 'Espresso', size: 'S', qty: 1 }], usage)
  const tooMany = checkRequested([{ id: 'jsl-hoodie', color: 'Black', size: 'L', qty: 2 }], usage)
  const ok = checkRequested([{ id: 'jsl-hoodie', color: 'Black', size: 'L', qty: 1 }], usage)
  assert.equal(soldOut.error, 'This color and size is sold out.')
  assert.equal(tooMany.error, 'That quantity is no longer available.')
  assert.equal(ok.ok, true)
  assert.equal(/\d/.test(soldOut.error + tooMany.error), false)
})
