'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import Button from './Button'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/context/cart-context'

interface ProductCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageUrl: string
  category: string
  brand?: string
  stock?: number
  isFeatured?: boolean
  onAddToCart?: (id: string) => void
  className?: string
}

export default function ProductCard({
  id,
  title,
  price,
  originalPrice,
  rating,
  reviewCount,
  imageUrl,
  category,
  brand = 'Unknown',
  stock = 10,
  isFeatured = false,
  onAddToCart,
  className
}: ProductCardProps) {
  const { addItem, openCart } = useCart()
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Add to cart using context
    addItem({
      id,
      name: title,
      price,
      originalPrice,
      image: imageUrl,
      category,
      brand,
      inStock: stock > 0,
      stockCount: stock,
    })
    
    // Open cart drawer to show feedback
    openCart()
    
    // Also call the optional onAddToCart callback
    if (onAddToCart) {
      onAddToCart(id)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        )
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <StarOutlineIcon className="absolute inset-0 w-4 h-4 text-yellow-400" />
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${(rating % 1) * 100}%` }}
            >
              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          </div>
        )
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
        )
      }
    }
    return stars
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className={cn(
        "group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden",
        isFeatured && "ring-2 ring-primary-200",
        className
      )}
    >
      <Link href={`/products/${id}`}>
        <div className="relative">
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{discount}%
            </div>
          )}
          
          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-3 right-3 z-10 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}

          {/* Product Image */}
          <div className="relative aspect-square bg-neutral-100 overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Product Info */}
          <div className="p-4">
            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
              {category}
            </p>
            
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center gap-1">
                {renderStars()}
              </div>
              <span className="text-sm text-neutral-500 ml-1">
                ({reviewCount.toLocaleString()})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-neutral-900">
                ${price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-sm text-neutral-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full group-hover:bg-primary-600 transition-colors"
              size="sm"
            >
              <ShoppingCartIcon className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}