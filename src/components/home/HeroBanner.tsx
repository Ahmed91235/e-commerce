'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

export default function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-r from-primary-50 to-primary-100 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6"
        >
          Discover Amazing Products
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-neutral-600 mb-8 max-w-3xl mx-auto"
        >
          From electronics to fashion, find everything you need at unbeatable prices. 
          Shop our curated collection of premium products with secure checkout and fast delivery.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="px-8 py-3"
            onClick={() => document.getElementById('featured-categories')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3"
            onClick={() => document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}