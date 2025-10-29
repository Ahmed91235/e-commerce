'use client'

import { useState, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
  image: string
  rating?: number
  reviewCount?: number
}

interface ProductCarouselProps {
  title: string
  products: Product[]
  viewAllLink?: string
}

export default function ProductCarousel({ title, products, viewAllLink }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount)
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      })

      // Update arrow visibility
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
          setShowLeftArrow(scrollLeft > 0)
          setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
        }
      }, 300)
    }
  }

  return (
    <div className="bg-white p-6 rounded-sm shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
          >
            View All
          </Link>
        )}
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeftIcon className="h-8 w-8 text-gray-700" />
          </button>
        )}

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex-shrink-0 w-48 group/item"
            >
              <div className="border rounded-sm p-3 hover:shadow-lg transition-shadow">
                <div className="relative aspect-square mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-sm line-clamp-2 mb-2 group-hover/item:text-[#C7511F]">
                  {product.title}
                </h3>
                {product.rating && (
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-[#FF9900]">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(product.rating!) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    {product.reviewCount && (
                      <span className="text-xs text-gray-600">
                        ({product.reviewCount.toLocaleString()})
                      </span>
                    )}
                  </div>
                )}
                <p className="text-lg font-bold">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRightIcon className="h-8 w-8 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  )
}
