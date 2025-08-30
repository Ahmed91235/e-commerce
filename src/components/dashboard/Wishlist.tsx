'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  HeartIcon as HeartOutlineIcon,
  ShoppingCartIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import Button from '@/components/ui/Button'
import { useCart } from '@/lib/context/cart-context'
import Link from 'next/link'
import { clsx } from 'clsx'

interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  inStock: boolean
  addedDate: string
  rating: number
  reviews: number
}

const mockWishlistItems: WishlistItem[] = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
    category: 'Electronics',
    inStock: true,
    addedDate: '2024-01-10',
    rating: 4.8,
    reviews: 1247
  },
  {
    id: '2',
    name: 'Premium Leather Jacket',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop&crop=center',
    category: 'Clothing',
    inStock: false,
    addedDate: '2024-01-12',
    rating: 4.5,
    reviews: 523
  },
  {
    id: '3',
    name: 'Smart Home Security Camera',
    price: 149.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center',
    category: 'Electronics',
    inStock: true,
    addedDate: '2024-01-15',
    rating: 4.6,
    reviews: 789
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&crop=center',
    category: 'Furniture',
    inStock: true,
    addedDate: '2024-01-18',
    rating: 4.7,
    reviews: 342
  },
  {
    id: '5',
    name: 'Organic Skincare Set',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=300&fit=crop&crop=center',
    category: 'Beauty',
    inStock: true,
    addedDate: '2024-01-20',
    rating: 4.4,
    reviews: 156
  }
]

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem, openCart } = useCart()

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWishlistItems(mockWishlistItems)
      setLoading(false)
    }, 1000)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleAddToCart = async (item: WishlistItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      brand: 'Various', // Default brand
      inStock: true, // Default to in stock
      stockCount: 10 // Default stock count
    }
    
    addItem(cartItem)
    openCart()
  }

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <motion.div
            className="p-3 bg-pink-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            <HeartSolid className="h-6 w-6 text-pink-600" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
            <p className="text-gray-600">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
        </div>

        {wishlistItems.length > 0 && (
          <Button
            onClick={() => {
              // Add all available items to cart
              wishlistItems
                .filter(item => item.inStock)
                .forEach(item => handleAddToCart(item))
            }}
            className="flex items-center space-x-2"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>Add All to Cart</span>
          </Button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <HeartOutlineIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Wishlist is Empty</h3>
          <p className="text-gray-600 mb-6">
            Start adding items you love to your wishlist and come back to them later.
          </p>
          <Button>
            <Link href="/products">
              Start Shopping
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Discount Badge */}
                {item.originalPrice && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                      -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                    </span>
                  </div>
                )}

                {/* Stock Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={clsx(
                    'px-2 py-1 rounded-md text-xs font-medium',
                    item.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Remove from Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase">{item.category}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={clsx(
                          'h-4 w-4',
                          star <= Math.floor(item.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        )}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {item.rating} ({item.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Added Date */}
                <p className="text-xs text-gray-500 mb-4">
                  Added on {formatDate(item.addedDate)}
                </p>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="flex-1 text-sm"
                    size="sm"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  
                  <Link
                    href={`/products/${item.id}`}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}