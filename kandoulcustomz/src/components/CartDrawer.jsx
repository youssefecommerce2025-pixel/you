import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiShield, FiLock, FiCheck } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { productAsset } from '../data/products'

export default function CartDrawer({ open, onClose, cart, onRemove, onUpdateQty, total }) {
  const navigate = useNavigate()
  const shipping = total >= 75 ? 0 : 7.99
  const finalTotal = total + shipping

  const handleCheckout = () => {
    if (!cart.length) return
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: finalTotal,
        currency: 'USD',
        num_items: cart.reduce((s, i) => s + i.qty, 0)
      })
    }
    if (window.ttq) {
      window.ttq.track('InitiateCheckout', {
        value: finalTotal,
        currency: 'USD'
      })
    }
    navigate('/checkout')
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <FiShoppingBag size={20} className="text-gray-900" />
            <h2 className="font-bold text-base tracking-wide text-gray-900">Your Cart</h2>
            {cart.length > 0 && (
              <span className="bg-black text-white text-xs font-black px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100">
            <FiX size={20} />
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="px-6 py-3 bg-red-50/50 border-b border-red-100 text-xs">
          {total < 75 ? (
            <div>
              <div className="flex justify-between font-semibold text-red-900 mb-1.5">
                <span>Add ${(75 - total).toFixed(2)} more for FREE US Shipping!</span>
                <span>{Math.min(100, Math.round((total / 75) * 100))}%</span>
              </div>
              <div className="w-full bg-red-200/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (total / 75) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-emerald-700 font-bold flex items-center gap-1.5">
              <FiCheck className="text-emerald-600 stroke-[3]" /> You unlocked FREE US Tracked Delivery (3-7 days)!
            </div>
          )}
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl">
                🛍️
              </div>
              <div>
                <p className="text-gray-900 font-bold text-base mb-1">Your cart is currently empty</p>
                <p className="text-gray-400 text-xs max-w-xs">Explore our signature Je Suis Là hoodies and custom drops.</p>
              </div>
              <Link
                to="/shop"
                onClick={onClose}
                className="btn-gold px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase inline-block shadow-md"
              >
                Shop Collection
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 py-3.5">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl border border-gray-100 overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #f8f8f8, #f0f0f0)' }}
                    >
                      {item.image ? (
                        <img src={productAsset(item.image)} alt="" className="w-full h-full object-contain" />
                      ) : (
                        item.emoji || '👕'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-gray-900 truncate">{item.name}</p>
                      <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 mt-0.5">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>• {item.color}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
                          <button onClick={() => onUpdateQty(idx, item.qty - 1)} className="px-2 py-1 text-gray-500 hover:text-black">
                            <FiMinus size={10} />
                          </button>
                          <span className="text-xs font-bold px-1.5 min-w-[20px] text-center">{item.qty}</span>
                          <button onClick={() => onUpdateQty(idx, item.qty + 1)} className="px-2 py-1 text-gray-500 hover:text-black">
                            <FiPlus size={10} />
                          </button>
                        </div>
                        <span className="font-bold text-xs text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(idx)}
                      className="text-gray-300 hover:text-red-500 transition-colors self-start p-1"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Area */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-white space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Items Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>US Shipping</span>
                <span className="text-emerald-600 font-semibold">{total >= 75 ? 'FREE (3-7 days)' : '$7.99 (Standard)'}</span>
              </div>
              <div className="flex justify-between items-center text-base font-black text-gray-950 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-xl" style={{ color: '#CC3731' }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Main Checkout Button */}
            <button
              className="w-full py-4 rounded-full font-black tracking-widest uppercase text-xs btn-gold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              onClick={handleCheckout}
            >
              <FiLock size={14} /> Continue — ${finalTotal.toFixed(2)}
            </button>

            {/* Payment Trust Badges */}
            <div className="pt-2 text-center">
              <p className="text-[10px] text-gray-400 mb-1.5 flex items-center justify-center gap-1">
                <FiShield className="text-emerald-500" /> Accepted: Stripe • PayPal • Apple Pay • Google Pay
              </p>
              <Link
                to="/payment-methods"
                onClick={onClose}
                className="text-[11px] text-red-600 hover:text-red-700 font-semibold underline"
              >
                View Payment Security Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
