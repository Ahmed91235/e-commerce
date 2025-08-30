'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/context/cart-context'

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand?: string
  stock?: number
  rating: number
  reviews: number
  featured?: boolean
  discount?: number
  onAddToCart?: (id: string) => void
  className?: string
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  brand = 'Unknown',
  stock = 10,
  rating,
  reviews,
  featured,
  discount,
  onAddToCart,
  className
}: ProductCardProps) {
  const { addItem, openCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Add to cart using context
    addItem({
      id,
      name,
      price,
      originalPrice,
      image,
      category,
      brand,
      inStock: stock > 0,
      stockCount: stock,
    })
    
    // Open cart drawer to show feedback
    openCart()
    
    // Also call the optional onAddToCart callback
    onAddToCart?.(id)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={cn(
              'h-4 w-4',
              star <= rating ? 'text-yellow-400' : 'text-gray-200'
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <Link href={`/products/${id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300',
          className
        )}
      >
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden">
            <Image
              src={image}
              alt={name}
              width={400}
              height={400}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {discount && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {featured && (
              <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>

          {/* Quick Add to Cart Button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddToCart}
              className="p-2 shadow-lg"
            >
              <ShoppingCartIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {/* Category */}
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
            {category}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {name}
          </h3>

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-2 mb-2">
            {renderStars(rating)}
            <span className="text-sm text-gray-500">
              ({reviews.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${price}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}