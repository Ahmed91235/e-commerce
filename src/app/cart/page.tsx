'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/context/cart-context';
import { CartItem } from '@/components/cart/CartItem';
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="font-medium text-gray-900">Shopping Cart</li>
            </ol>
          </nav>

          {/* Empty Cart State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="font-medium text-gray-900">Shopping Cart</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          {state.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Clear all items
            </button>
          )}
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {state.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link
                href="/products"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Summary Details */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({state.itemCount} {state.itemCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(state.subtotal)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {state.shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(state.shipping)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(state.tax)}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatPrice(state.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full mt-6 bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors inline-flex items-center justify-center"
              >
                Proceed to Checkout
              </Link>

              {/* Security Features */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1L5 6v6l5 5 5-5V6l-5-5zM8.5 6.5L10 5l1.5 1.5L10 8 8.5 6.5zM13 9H7v4h6V9z" clipRule="evenodd"/>
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                  </svg>
                  <span>30-day return policy</span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {state.subtotal > 0 && state.subtotal < 50 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Add <span className="font-semibold">{formatPrice(50 - state.subtotal)}</span> more for free shipping!
                  </p>
                  <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${Math.min((state.subtotal / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 mb-2">We accept</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">VISA</span>
                  </div>
                  <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">MC</span>
                  </div>
                  <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">AMEX</span>
                  </div>
                  <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">PP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}