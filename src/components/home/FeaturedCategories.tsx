'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ComputerDesktopIcon, UserIcon, HomeIcon, BoltIcon } from '@heroicons/react/24/outline'

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets & tech',
    icon: ComputerDesktopIcon,
    href: '/products?category=Electronics',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Fashion & apparel',
    icon: UserIcon,
    href: '/products?category=Clothing',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    description: 'Home essentials',
    icon: HomeIcon,
    href: '/products?category=Home & Garden',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Fitness & outdoor',
    icon: BoltIcon,
    href: '/products?category=Sports',
    color: 'from-orange-500 to-orange-600'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export default function FeaturedCategories() {
  return (
    <section id="featured-categories" className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Explore our wide range of products across different categories
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link 
                  href={category.href}
                  className="group block"
                >
                  <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}