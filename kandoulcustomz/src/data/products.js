export const productAsset = (path) => {
  if (!path || typeof path !== 'string') return null
  if (path.startsWith('http') || path.startsWith('data:')) return path
  if (!path.includes('/') && !path.includes('.')) return null
  const base = import.meta.env.BASE_URL || '/'
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
    description: `French terry midweight organic 100% by Je suis là. A midweight organic French terry hoodie — breathable, structured, and made to be worn every day. Signature "Je suis là" chest graphic, kangaroo pocket, in Mustard or Black.`,
    features: [
      '100% organic midweight French terry',
      'Signature "Je suis là" chest graphic',
      'Kangaroo front pocket with JSL woven label',
      'Ribbed cuffs and hem',
      'Ethically made',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: ['Mustard', 'Black'],
    photos: [
      'products/jsl-hoodie-camel-front-catalog.png',
      'products/jsl-hoodie-camel-back-catalog.png',
    ],
    colorPhotos: {
      Mustard: [
        'products/jsl-hoodie-camel-front-catalog.png',
        'products/jsl-hoodie-camel-back-catalog.png',
      ],
      Black: [
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
        ['2XL', '50-52', '31', '37'],
      ]
    },
    care: 'Machine wash cold, tumble dry low. Do not bleach.',
    shipping: 'Delivered in 3-7 business days across the USA. Free shipping on orders over $75.',
    reviews: [
      { name: 'Marcus T.', city: 'Atlanta, GA', rating: 5, text: "Best hoodie I've ever owned. The quality is insane — thick, soft, and the embroidery is clean. Got so many compliments the first day I wore it.", date: '2 weeks ago' },
      { name: 'Jasmine R.', city: 'Houston, TX', rating: 5, text: "Ordered the olive green and I'm obsessed. The fit is perfect, true to size. Will definitely be ordering more colors!", date: '1 month ago' },
      { name: 'DeShawn M.', city: 'Chicago, IL', rating: 5, text: "Statement piece. People ask about it everywhere I go. The 'Je Suis Là' meaning hits different once you understand it.", date: '3 weeks ago' },
    ],
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
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: ['Heather', 'Grey', 'Olive Military', 'Black'],
    photos: [
      'products/jsl-hoodie-heather-front-catalog.png',
      'products/jsl-hoodie-heather-back-catalog.png',
    ],
    colorPhotos: {
      Heather: [
        'products/jsl-hoodie-heather-front-catalog.png',
        'products/jsl-hoodie-heather-back-catalog.png',
      ],
      Grey: [
        'products/jsl-hoodie-grey-front-catalog.png',
        'products/jsl-hoodie-grey-back-catalog.png',
      ],
      'Olive Military': [
        'products/jsl-hoodie-olive-front-catalog.png',
        'products/jsl-hoodie-olive-back-catalog.png',
      ],
      Black: [
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
        ['2XL', '50-52', '31', '37'],
      ]
    },
    care: 'Machine wash cold, tumble dry low. Do not bleach.',
    shipping: 'Delivered in 3-7 business days across the USA. Free shipping on orders over $75.',
    reviews: [
      { name: 'Marcus T.', city: 'Atlanta, GA', rating: 5, text: "The heather is thick and soft. Brushed inside, holds its shape, and the chest graphic is clean.", date: '1 week ago' },
      { name: 'Jasmine R.', city: 'Houston, TX', rating: 5, text: "Heavier than my usual hoodie and it still feels breathable. True to size.", date: '2 weeks ago' },
      { name: 'DeShawn M.', city: 'Chicago, IL', rating: 5, text: "The heather color looks exactly like the photos. People ask about the logo every time.", date: '3 weeks ago' },
    ],
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
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: ['Espresso'],
    photos: [
      'products/jsl-hoodie-espresso-front-catalog.png',
    ],
    colorPhotos: {
      Espresso: [
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
        ['2XL', '50-52', '31', '37'],
      ]
    },
    care: 'Machine wash cold, tumble dry low. Do not bleach.',
    shipping: 'Delivered in 3-7 business days across the USA. Free shipping on orders over $75.',
    reviews: [
      { name: 'Marcus T.', city: 'Atlanta, GA', rating: 5, text: "The espresso brown is rich and the French terry has real weight. The chest patch looks clean.", date: '1 week ago' },
      { name: 'Jasmine R.', city: 'Houston, TX', rating: 5, text: "True to size, soft, and it holds its shape. Easy everyday hoodie.", date: '2 weeks ago' },
      { name: 'DeShawn M.', city: 'Chicago, IL', rating: 5, text: "Looks exactly like the studio photo. People ask about the logo.", date: '3 weeks ago' },
    ],
  },
]

export const getProduct = (id) => products.find(p => p.id === id)

export const photosForColor = (product, color) =>
  product?.colorPhotos?.[color] || product?.photos || []
