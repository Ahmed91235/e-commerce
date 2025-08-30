'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from '@/components/homepage/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  featured?: boolean
  discount?: number
}

interface SearchResultsProps {
  query: string
  results: Product[]
  resultsCount: number
}

export default function SearchResults({ query, results, resultsCount }: SearchResultsProps) {
  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results for &quot;{query}&quot;
            </h2>
            <p className="text-gray-600 mt-1">
              Found {resultsCount} product{resultsCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all products →
            </Link>
          </div>
        </div>
      </div>

      {/* Search Results Grid */}
      {resultsCount > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                category={product.category}
                rating={product.rating}
                reviews={product.reviews}
                featured={product.featured}
                discount={product.discount}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find any products matching your search for &quot;{query}&quot;.
          </p>
          <p className="text-sm text-gray-500">
            Try adjusting your search terms or browse our categories.
          </p>
        </div>
      )}
    </div>
  )
}