'use client';

import { motion } from 'framer-motion';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CartItem as CartItemType } from '@/lib/types/cart';
import Image from 'next/image';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= item.stockCount) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Link href={`/products/${item.id}`} className="block group">
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-md object-cover group-hover:opacity-75 transition-opacity"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/products/${item.id}`}
              className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              {item.category} • {item.brand}
            </p>
            
            {/* Price */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(item.price)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(item.originalPrice)}
                </span>
              )}
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-sm text-green-600 font-medium">
                  Save {formatPrice(item.originalPrice - item.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center mt-2">
              {item.inStock ? (
                <span className="text-sm text-green-600 font-medium">
                  In Stock ({item.stockCount} available)
                </span>
              ) : (
                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          
          <input
            type="number"
            min="1"
            max={item.stockCount}
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-16 px-3 py-2 text-center text-sm font-medium text-gray-900 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Quantity"
          />
          
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.stockCount}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Remove Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRemove(item.id)}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Remove
        </motion.button>
      </div>

      {/* Item Total */}
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </div>
        {item.quantity > 1 && (
          <div className="text-sm text-gray-500">
            {formatPrice(item.price)} each
          </div>
        )}
      </div>
    </motion.div>
  );
}