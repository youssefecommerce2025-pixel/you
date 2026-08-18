import { Fragment } from 'react'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function CartDrawer({ open, onClose, cart, onRemove, onUpdateQty, total }) {
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
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FiShoppingBag size={20} />
            <h2 className="font-bold text-lg tracking-wide">Your Cart</h2>
            {cart.length > 0 && (
              <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors">
            <FiX size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <FiShoppingBag size={48} className="text-gray-200" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="btn-gold px-6 py-3 rounded-full text-sm font-bold tracking-wide inline-block"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 py-4 border-b border-gray-50">
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f5f5f5, #e8e8e8)' }}
                  >
                    <span className="text-3xl">{item.emoji || '👕'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    {item.size && <p className="text-xs text-gray-500 capitalize">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-gray-500 capitalize">Color: {item.color}</p>}
                    {item.logo && <p className="text-xs text-gray-500 capitalize">Logo: {item.logo}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2">
                        <button onClick={() => onUpdateQty(idx, item.qty - 1)} className="p-1 hover:text-yellow-600">
                          <FiMinus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">{item.qty}</span>
                        <button onClick={() => onUpdateQty(idx, item.qty + 1)} className="p-1 hover:text-yellow-600">
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <span className="font-bold text-sm">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(idx)}
                    className="text-gray-300 hover:text-red-400 transition-colors self-start mt-1"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}

              {/* Free shipping progress */}
              {total < 75 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-center">
                  <span className="text-yellow-700 font-medium">
                    Add ${(75 - total).toFixed(2)} more for FREE shipping! 🚀
                  </span>
                </div>
              )}
              {total >= 75 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-center">
                  <span className="text-green-700 font-medium">
                    🎉 You've unlocked FREE shipping!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 text-center">Taxes & shipping calculated at checkout</p>
            <button
              className="w-full py-4 rounded-full font-bold tracking-widest uppercase text-sm btn-gold"
              onClick={() => {
                if (window.fbq) fbq('track', 'InitiateCheckout', { value: total, currency: 'USD' })
                if (window.ttq) ttq.track('InitiateCheckout', { value: total, currency: 'USD' })
                alert('Checkout integration coming soon! Contact us to complete your order.')
              }}
            >
              Checkout — ${total.toFixed(2)}
            </button>
            <p className="text-xs text-gray-400 text-center">
              🔒 Secure checkout · Visa · Mastercard · PayPal · Apple Pay
            </p>
          </div>
        )}
      </div>
    </>
  )
}
