'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/lib/context/cart-context';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer() {
  const { state, removeItem, updateQuantity, closeCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Shopping Cart ({state.itemCount})
                </h2>
                <button
                  onClick={closeCart}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close cart"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {state.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add some products to get started</p>
                    <Link
                      href="/products"
                      onClick={closeCart}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {state.items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, x: -100 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 p-3"
                        >
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500">{item.category}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatPrice(item.price)}
                              </span>
                              {item.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(item.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-center space-y-2">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stockCount}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-red-500 hover:text-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  {/* Order Summary */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{formatPrice(state.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">
                        {state.shipping === 0 ? 'Free' : formatPrice(state.shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">{formatPrice(state.tax)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">{formatPrice(state.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Checkout
                    </Link>
                  </div>

                  {/* Free Shipping Notice */}
                  {state.subtotal < 50 && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-md">
                      <p className="text-xs text-blue-700 text-center">
                        Add {formatPrice(50 - state.subtotal)} more for free shipping!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}