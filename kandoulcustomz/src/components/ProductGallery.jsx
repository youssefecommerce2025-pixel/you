import { useState } from 'react'
import { productAsset } from '../data/products'

export default function ProductGallery({ images = [], alt = '', compact = false }) {
  const photos = images.map(productAsset).filter(Boolean)
  const [idx, setIdx] = useState(0)
  const [hoverBack, setHoverBack] = useState(false)

  if (!photos.length) return null

  const shown = compact && photos[1] && hoverBack ? photos[1] : photos[idx] || photos[0]

  return (
    <div
      className={`relative w-full h-full flex flex-col ${compact ? 'min-h-full' : 'min-h-[400px]'}`}
      onMouseEnter={() => compact && setHoverBack(true)}
      onMouseLeave={() => compact && setHoverBack(false)}
    >
      <div className={`flex-1 flex items-center justify-center ${compact ? 'p-4' : 'p-6'}`}>
        <img
          src={shown}
          alt={alt}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      {photos.length > 1 && !compact && (
        <div className="flex justify-center gap-2 pb-4">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIdx(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-white ${
                idx === i ? 'border-yellow-400' : 'border-gray-200'
              }`}
              aria-label={i === 0 ? 'Front' : 'Back'}
            >
              <img src={src} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
