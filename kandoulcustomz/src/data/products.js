export const productAsset = (path) => {
  if (!path || typeof path !== 'string') return null
  if (path.startsWith('http') || path.startsWith('data:')) return path
  if (!path.includes('/') && !path.includes('.')) return null
  const base = import.meta.env.BASE_URL || '/'
  if (base !== '/' && path.startsWith(base)) return path
  return `${base}${path.replace(/^\//, '')}`
}

export const products = [
  {
    id: 'jsl-hoodie',
    name: 'French terry midweight organic 100% by Je suis là',
    tagline: 'Midweight organic French terry. Presence, stitched in.',
    price: 55,
    comparePrice: 80,
    emoji: '🧥',
    badge: 'BESTSELLER',
    description: `French terry midweight organic 100% by Je suis là. A midweight organic French terry hoodie — breathable, structured, and made to be worn every day. Signature "Je suis là" chest graphic, kangaroo pocket, in Camel or Black.`,
    features: [
      '100% organic midweight French terry',
      'Signature "Je suis là" chest graphic',
      'Kangaroo front pocket with JSL woven label',
      'Ribbed cuffs and hem',
      'Ethically made',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Camel'],
    photos: [
      'products/hoodie-black-wear.jpg',
      'products/jsl-hoodie-black-front-catalog.png',
    ],
    colorPhotos: {
      Camel: [
        'products/hoodie-camel-small.jpg',
        'products/hoodie-camel-large.jpg',
        'products/jsl-hoodie-camel-front-catalog.png',
        'products/jsl-hoodie-camel-back-catalog.png',
      ],
      Black: [
        'products/hoodie-black-wear.jpg',
        'products/jsl-hoodie-black-front-catalog.png',
      ],
    },
    logos: ['Large Logo (Chest)', 'Small Corner Logo'],
    sizeChart: {
      headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
      rows: [
        ['XS', '34-36', '26', '32'],
        ['S', '36-38', '27', '33'],
        ['M', '38-40', '28', '34'],
        ['L', '42-44', '29', '35'],
        ['XL', '46-48', '30', '36'],
      ]
    },
    care: 'Machine wash cold, tumble dry low. Do not bleach.',
    shipping: 'Delivered in 3-7 business days across the USA. Free shipping on orders over $75.',
  },
  {
    id: 'jsl-heather-hoodie',
    name: 'Heavyweight organic 100 % brushed hood by Je suis là',
    tagline: 'Heavyweight brushed organic fleece. Soft, dense, present.',
    price: 65,
    emoji: '🧥',
    badge: 'HEAVYWEIGHT',
    description: `Heavyweight organic 100 % brushed hood by Je suis là. A dense brushed organic fleece with a soft face, the signature "Je suis là" chest graphic, and a heather studio finish.`,
    features: [
      '100% organic heavyweight brushed fleece',
      'Signature "Je suis là" chest graphic',
      'Kangaroo front pocket with JSL woven label',
      'Ribbed cuffs and hem',
      'Ethically made',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Slate', 'Ash Grey', 'Black', 'Olive Military'],
    photos: [
      'products/hoodie-slate-wear.jpg',
      'products/jsl-hoodie-grey-front-catalog.png',
    ],
    colorPhotos: {
      'Ash Grey': [
        'products/hoodie-ash-wear.jpg',
        'products/jsl-hoodie-heather-front-catalog.png',
        'products/jsl-hoodie-heather-back-catalog.png',
      ],
      Slate: [
        'products/hoodie-slate-wear.jpg',
        'products/jsl-hoodie-grey-front-catalog.png',
        'products/jsl-hoodie-grey-back-catalog.png',
      ],
      'Olive Military': [
        'products/hoodie-olive-wear.jpg',
        'products/jsl-hoodie-olive-front-catalog.png',
        'products/jsl-hoodie-olive-back-catalog.png',
      ],
      Black: [
        'products/hoodie-black-wear.jpg',
        'products/jsl-hoodie-black-front-catalog.png',
      ],
    },
    logos: ['Large Logo (Chest)', 'Small Corner Logo'],
    sizeChart: {
      headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
      rows: [
        ['XS', '34-36', '26', '32'],
        ['S', '36-38', '27', '33'],
        ['M', '38-40', '28', '34'],
        ['L', '42-44', '29', '35'],
        ['XL', '46-48', '30', '36'],
      ]
    },
    care: 'Machine wash cold, tumble dry low. Do not bleach.',
    shipping: 'Delivered in 3-7 business days across the USA. Free shipping on orders over $75.',
  },
  {
    id: 'jsl-espresso-hoodie',
    name: 'Heavyweight French terry espresso',
    tagline: 'Heavyweight French terry in espresso. Dense, calm, everyday.',
    price: 65,
    emoji: '🧥',
    badge: 'HEAVYWEIGHT',
    description: `Heavyweight French terry espresso by Je suis là. A dense espresso-brown heavyweight French terry hoodie with the signature chest graphic, built for comfort and everyday wear.`,
    features: [
      '100% organic heavyweight French terry',
      'Espresso brown',
      'Signature "Je suis là" chest graphic',
      'Kangaroo front pocket with JSL woven label',
      'Ribbed cuffs and hem',
      'Ethically made',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Espresso'],
    photos: [
      'products/hoodie-espresso-wear.jpg',
      'products/jsl-hoodie-espresso-front-catalog.png',
    ],
    colorPhotos: {
      Espresso: [
        'products/hoodie-espresso-wear.jpg',
        'products/jsl-hoodie-espresso-front-catalog.png',
      ],
    },
    logos: ['Large Logo (Chest)', 'Small Corner Logo'],
    sizeChart: {
      headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
      rows: [
        ['XS', '34-36', '26', '32'],
        ['S', '36-38', '27', '33'],
        ['M', '38-40', '28', '34'],
        ['L', '42-44', '29', '35'],
        ['XL', '46-48', '30', '36'],
      ]
    },
    care: 'Machine wash cold, tumble dry low. Do not bleach.',
    shipping: 'Delivered in 3-7 business days across the USA. Free shipping on orders over $75.',
  },
  {
    id: 'jsl-crewneck',
    name: 'Heavyweight crewneck by Je suis là',
    tagline: 'Heavyweight crewneck. Soft, dense, present.',
    price: 65,
    emoji: '👕',
    badge: 'HEAVYWEIGHT',
    description: `Heavyweight crewneck by Je suis là. A dense heavyweight crewneck in Grey, Black, or Olive, with the signature chest graphic.`,
    features: [
      '100% organic heavyweight cotton',
      'Signature "Je suis là" chest graphic',
      'Ribbed collar, cuffs, and hem',
      'Ethically made',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Grey', 'Black', 'Olive'],
    photos: [
      'products/crew-grey-stand.jpg',
      'products/crew-grey-sit.jpg',
    ],
    colorPhotos: {
      Grey: ['products/crew-grey-stand.jpg', 'products/crew-grey-sit.jpg', 'products/jsl_gray.jpg'],
      Black: ['products/crew-black-sit.jpg', 'products/jsl_black.jpg', 'products/jsl_studio_3.jpg'],
      Olive: ['products/crew-olive-stand.jpg', 'products/crew-olive-sit.jpg', 'products/jsl_olive.jpg'],
    },
    logos: ['Large Logo (Chest)', 'Small Corner Logo'],
    sizeChart: {
      headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
      rows: [
        ['XS', '34-36', '26', '32'],
        ['S', '36-38', '27', '33'],
        ['M', '38-40', '28', '34'],
        ['L', '42-44', '29', '35'],
        ['XL', '46-48', '30', '36'],
      ]
    },
    care: 'Machine wash cold, tumble dry low. Do not bleach.',
    shipping: 'Delivered in 3-7 business days across the USA. Free shipping on orders over $75.',
  },
]

export const getProduct = (id) => products.find(p => p.id === id)

export const photosForColor = (product, color) =>
  product?.colorPhotos?.[color] || product?.photos || []
