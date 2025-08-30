'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  XMarkIcon, 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import ProductCard from '@/components/homepage/ProductCard'
import { cn } from '@/lib/utils'

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

interface ProductCatalogProps {
  products?: Product[]
  currentFilters?: { [key: string]: string | string[] | undefined }
}

const categories = [
  'All Categories',
  'Electronics',
  'Clothing', 
  'Home & Garden',
  'Sports',
  'Books',
  'Beauty',
  'Toys'
]

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Newest', value: 'newest' },
]

const priceRanges = [
  { label: 'Under $25', value: '0-25' },
  { label: '$25 - $50', value: '25-50' },
  { label: '$50 - $100', value: '50-100' },
  { label: '$100 - $200', value: '100-200' },
  { label: 'Over $200', value: '200+' },
]



export default function ProductCatalog({ products = [], currentFilters = {} }: ProductCatalogProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [selectedSort, setSelectedSort] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  // Handle URL search params
  useEffect(() => {
    const category = currentFilters.category as string
    const search = currentFilters.search as string
    const sort = currentFilters.sort as string
    const price = currentFilters.price as string
    
    if (category) setSelectedCategory(category)
    if (search) setSearchQuery(search)
    if (sort) setSelectedSort(sort)
    if (price) setSelectedPriceRange(price)
  }, [currentFilters])

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products]

    // Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Price filter
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.includes('+') 
        ? [parseInt(selectedPriceRange.replace('+', '')), Infinity]
        : selectedPriceRange.split('-').map(Number)
      
      filtered = filtered.filter(product => 
        product.price >= min && product.price <= max
      )
    }

    // Sort products
    switch (selectedSort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        // Mock newest sorting
        break
      default: // featured
        filtered.sort((a, b) => ((b.featured ? 1 : 0) - (a.featured ? 1 : 0)))
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, selectedCategory, searchQuery, selectedPriceRange, selectedSort])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(selectedCategory !== 'All Categories' 
      ? [{ label: selectedCategory, href: `/products?category=${selectedCategory}` }]
      : []
    )
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronDownIcon className="h-4 w-4 text-gray-400 mx-2 rotate-[-90deg]" />
              )}
              <a
                href={crumb.href}
                className={cn(
                  'text-sm font-medium hover:text-blue-600',
                  index === breadcrumbs.length - 1
                    ? 'text-gray-900'
                    : 'text-gray-500'
                )}
              >
                {crumb.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Header with sort and filter toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            {filteredProducts.length} products found
            {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <motion.div
          className={cn(
            'lg:w-64 lg:flex-shrink-0',
            showFilters ? 'block' : 'hidden lg:block'
          )}
          initial={false}
          animate={{ opacity: showFilters ? 1 : 1 }}
        >
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between lg:justify-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden p-1"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Search within results */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={selectedPriceRange === range.value}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedCategory('All Categories')
                setSelectedPriceRange('')
                setSearchQuery('')
                setSelectedSort('featured')
              }}
              className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="flex-1">
          {currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={cn(
                        'px-3 py-2 text-sm font-medium rounded-lg',
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Categories')
                  setSelectedPriceRange('')
                  setSearchQuery('')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}