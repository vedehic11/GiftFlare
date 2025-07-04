import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Gift, 
  Heart, 
  User,
  Package,
  MessageSquare,
  CreditCard,
  Truck
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CheckoutModal } from './CheckoutModal';

export const CartSidebar: React.FC = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    updateCartItem,
    getTotalPrice, 
    getTotalItems,
    isCartOpen, 
    setIsCartOpen 
  } = useCart();
  
  const [showCheckout, setShowCheckout] = useState(false);

  const handleGiftToggle = (itemId: string, isGift: boolean) => {
    updateCartItem(itemId, { 
      isGift,
      giftNote: isGift ? '' : undefined,
      giftPackaging: isGift ? false : false,
      deliverToFriend: isGift ? false : false
    });
  };

  const handleGiftPackagingToggle = (itemId: string, giftPackaging: boolean) => {
    updateCartItem(itemId, { giftPackaging });
  };

  const handleDeliverToFriendToggle = (itemId: string, deliverToFriend: boolean) => {
    updateCartItem(itemId, { deliverToFriend });
  };

  const handleGiftNoteChange = (itemId: string, giftNote: string) => {
    updateCartItem(itemId, { giftNote });
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            {/* Cart Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-amber-200 bg-amber-50">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-600 p-2 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-amber-900">Your Cart</h2>
                    <p className="text-sm text-amber-700">{getTotalItems()} items</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-amber-600 hover:text-amber-800 p-2 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-amber-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Your cart is empty</h3>
                    <p className="text-amber-700 text-sm">Add some beautiful handmade items to get started</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        {/* Product Info */}
                        <div className="flex items-start space-x-3 mb-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-amber-900 text-sm line-clamp-2">
                              {item.product.name}
                            </h4>
                            <p className="text-xs text-amber-600 mb-2">by {item.product.sellerName}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-800">
                                ₹{item.product.price.toLocaleString()}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center hover:bg-amber-300 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold text-amber-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center hover:bg-amber-300 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="font-bold text-amber-800">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        {/* Gift Options */}
                        <div className="space-y-3 border-t border-amber-200 pt-3">
                          {/* Make it a Gift */}
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isGift}
                              onChange={(e) => handleGiftToggle(item.id, e.target.checked)}
                              className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                            />
                            <div className="flex items-center space-x-2">
                              <Gift className="w-4 h-4 text-amber-600" />
                              <span className="text-sm font-medium text-amber-900">Make it a gift</span>
                            </div>
                          </label>

                          {item.isGift && (
                            <div className="space-y-3 ml-7">
                              {/* Gift Packaging */}
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.giftPackaging}
                                  onChange={(e) => handleGiftPackagingToggle(item.id, e.target.checked)}
                                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                />
                                <div className="flex items-center space-x-2">
                                  <Package className="w-4 h-4 text-amber-600" />
                                  <span className="text-sm text-amber-900">Gift packaging (+₹50)</span>
                                </div>
                              </label>

                              {/* Deliver to Friend */}
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.deliverToFriend}
                                  onChange={(e) => handleDeliverToFriendToggle(item.id, e.target.checked)}
                                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                />
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4 text-amber-600" />
                                  <span className="text-sm text-amber-900">Deliver to friend</span>
                                </div>
                              </label>

                              {/* Gift Note */}
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <MessageSquare className="w-4 h-4 text-amber-600" />
                                  <span className="text-sm font-medium text-amber-900">Gift note</span>
                                </div>
                                <textarea
                                  value={item.giftNote || ''}
                                  onChange={(e) => handleGiftNoteChange(item.id, e.target.value)}
                                  placeholder="Write a personal message..."
                                  className="w-full text-xs border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                                  rows={2}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-amber-200 p-6 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-amber-900">Total</span>
                    <span className="text-2xl font-bold text-amber-600">
                      ₹{getTotalPrice().toLocaleString()}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </>
  );
};