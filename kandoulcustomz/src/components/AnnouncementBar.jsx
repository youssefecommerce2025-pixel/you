import { useState } from 'react'

const messages = [
  'Free shipping on all USA orders over $75',
  '✨ 100% Organic Cotton — Ethically Made',
  '🎁 Custom orders ship in 5-7 business days',
  '⭐ Rated 4.9/5 by 500+ happy customers',
]

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0)

  return (
    <div className="announcement-bar text-white text-xs sm:text-sm py-2 px-4 text-center font-medium tracking-wide cursor-pointer"
      onClick={() => setIdx(i => (i + 1) % messages.length)}
    >
      {messages[idx]}
    </div>
  )
}
