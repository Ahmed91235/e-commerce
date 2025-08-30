'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  HeartIcon,
  ShareIcon,
  MinusIcon,
  PlusIcon,
  ChevronDownIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import Button from '@/components/ui/Button'
import ProductCard from '@/components/homepage/ProductCard'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/context/cart-context'

interface Specification {
  label: string
  value: string
}

interface ProductDetailProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    description: string
    images: string[]
    category: string
    rating: number
    reviews: number
    featured?: boolean
    discount?: number
    inStock: boolean
    stockCount: number
    specifications: Specification[]
    features: string[]
  }
}

const relatedProducts = [
  {
    id: '5',
    name: 'Wireless Gaming Mouse',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&crop=center',
    category: 'Electronics',
    rating: 4.6,
    reviews: 423
  },
  {
    id: '6',
    name: 'Stylish Denim Jacket',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=400&h=400&fit=crop&crop=center',
    category: 'Clothing',
    rating: 4.2,
    reviews: 312,
    discount: 22
  },
  {
    id: '7',
    name: 'Yoga Mat with Carrying Strap',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center',
    category: 'Sports',
    rating: 4.5,
    reviews: 789
  },
  {
    id: '8',
    name: 'LED Desk Lamp',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&crop=center',
    category: 'Home & Garden',
    rating: 4.3,
    reviews: 654
  }
]

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, updateQuantity, openCart } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product.category, href: `/products?category=${product.category}` },
    { label: product.name, href: `/products/${product.id}` }
  ]

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    // Add item to cart
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      brand: 'Unknown', // Could be extracted from product if available
      inStock: product.inStock,
      stockCount: product.stockCount,
    })
    
    // If quantity is more than 1, update the quantity directly
    if (quantity > 1) {
      // Use setTimeout to ensure the item is added first
      setTimeout(() => {
        updateQuantity(product.id, quantity)
      }, 0)
    }
    
    // Open cart drawer to show feedback
    openCart()
  }

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={cn(
              sizeClass,
              star <= rating ? 'text-yellow-400' : 'text-gray-200'
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div 
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                    -{product.discount}%
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                    Featured
                  </div>
                )}
              </motion.div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImage === index
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Title and Category */}
              <div>
                <p className="text-sm text-blue-600 font-medium mb-2">
                  {product.category.toUpperCase()}
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews.toLocaleString()} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {product.inStock ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-600">
                      In stock ({product.stockCount} available)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-red-600">Out of stock</span>
                  </>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity and Add to Cart */}
              {product.inStock && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-center min-w-[3rem]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stockCount}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1"
                      size="lg"
                    >
                      Add to Cart
                    </Button>
                    <Button variant="secondary" className="flex-1" size="lg">
                      Buy Now
                    </Button>
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={cn(
                        'p-3 rounded-lg border transition-colors',
                        isWishlisted
                          ? 'border-red-300 text-red-600 bg-red-50'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      <HeartIcon className={cn(
                        'h-5 w-5',
                        isWishlisted && 'fill-current'
                      )} />
                    </button>
                    <button className="p-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Shipping and Policy Info */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <TruckIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Free shipping on orders over $50
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowPathIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    30-day return policy
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    2-year manufacturer warranty
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="border-t p-8">
            <div className="max-w-4xl">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('description')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                    activeTab === 'description'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                    activeTab === 'specifications'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                    activeTab === 'reviews'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  Reviews ({product.reviews})
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                      Features & Benefits
                    </h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-3"></div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-700">
                          {spec.label}
                        </span>
                        <span className="text-sm text-gray-600">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {product.rating}
                        </div>
                        {renderStars(product.rating, 'md')}
                        <div className="text-sm text-gray-500 mt-1">
                          {product.reviews} reviews
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center py-8 text-gray-500">
                      <p>Reviews functionality will be implemented in a future update.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all products →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProductCard
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  originalPrice={relatedProduct.originalPrice}
                  image={relatedProduct.image}
                  category={relatedProduct.category}
                  rating={relatedProduct.rating}
                  reviews={relatedProduct.reviews}
                  discount={relatedProduct.discount}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}