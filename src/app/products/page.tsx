import { Suspense } from 'react'
import ProductCatalog from '@/components/product/ProductCatalog'
import SearchResults from '@/components/product/SearchResults'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products - EStore',
  description: 'Browse our wide selection of products across all categories. Electronics, fashion, home goods, and more.',
}

// Mock product data - in real app, this would come from API/database with search/filter functionality
const allProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center',
    category: 'Electronics',
    rating: 4.5,
    reviews: 1247,
    featured: true,
    discount: 31
  },
  {
    id: '2',
    name: 'Premium Cotton T-Shirt',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center',
    category: 'Clothing',
    rating: 4.3,
    reviews: 834,
    featured: true
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center',
    category: 'Electronics',
    rating: 4.7,
    reviews: 2156,
    featured: true,
    discount: 20
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&crop=center',
    category: 'Home & Garden',
    rating: 4.4,
    reviews: 623,
    discount: 25
  },
  {
    id: '5',
    name: 'Wireless Gaming Mouse',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&crop=center',
    category: 'Electronics',
    rating: 4.6,
    reviews: 423
  },
  {
    id: '6',
    name: 'Stylish Denim Jacket',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=500&h=500&fit=crop&crop=center',
    category: 'Clothing',
    rating: 4.2,
    reviews: 312,
    discount: 22
  },
  {
    id: '7',
    name: 'Yoga Mat with Carrying Strap',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop&crop=center',
    category: 'Sports',
    rating: 4.5,
    reviews: 789
  },
  {
    id: '8',
    name: 'LED Desk Lamp',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop&crop=center',
    category: 'Home & Garden',
    rating: 4.3,
    reviews: 654
  },
  {
    id: '9',
    name: 'Basketball Sneakers',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&crop=center',
    category: 'Sports',
    rating: 4.6,
    reviews: 892
  },
  {
    id: '10',
    name: 'Ceramic Coffee Mug Set',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500&h=500&fit=crop&crop=center',
    category: 'Home & Garden',
    rating: 4.4,
    reviews: 445
  }
]

function filterProducts(products: typeof allProducts, searchParams: { [key: string]: string | string[] | undefined }) {
  let filtered = [...products]

  // Apply search filter
  if (searchParams.search && typeof searchParams.search === 'string') {
    const searchTerm = searchParams.search.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    )
  }

  // Apply category filter
  if (searchParams.category && typeof searchParams.category === 'string') {
    filtered = filtered.filter(product => product.category === searchParams.category)
  }

  // Apply price range filter
  if (searchParams.minPrice || searchParams.maxPrice) {
    const minPrice = parseFloat(typeof searchParams.minPrice === 'string' ? searchParams.minPrice : '0')
    const maxPrice = parseFloat(typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : '999999')
    
    filtered = filtered.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    )
  }

  // Apply sorting
  const sortBy = typeof searchParams.sort === 'string' ? searchParams.sort : 'featured'
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return parseInt(b.id) - parseInt(a.id)
      case 'featured':
      default:
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.rating - a.rating
    }
  })

  return filtered
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const params = await searchParams
  const filteredProducts = filterProducts(allProducts, params)
  const isSearchResults = !!params.search

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>}>
          {isSearchResults ? (
            <SearchResults
              query={typeof params.search === 'string' ? params.search : ''}
              results={filteredProducts}
              resultsCount={filteredProducts.length}
            />
          ) : (
            <ProductCatalog 
              products={filteredProducts}
              currentFilters={params}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}