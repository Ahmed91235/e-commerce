'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageUrl: string
  category: string
}

interface ProductSectionProps {
  title: string
  description?: string
  products: Product[]
  viewAllLink?: string
  isFeatured?: boolean
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export default function ProductSection({
  title,
  description,
  products,
  viewAllLink,
  isFeatured = false,
  className = ""
}: ProductSectionProps) {
  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId)
  }

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {viewAllLink && (
            <div className="mt-6">
              <Link 
                href={viewAllLink}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                View All Products
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                {...product}
                isFeatured={isFeatured}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="text-neutral-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-600 mb-6">We&apos;re working on adding more products to this section.</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Browse All Products
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}