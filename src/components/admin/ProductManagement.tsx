'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  stock: number
  status: 'active' | 'draft' | 'out_of_stock'
  image: string
  description: string
  rating: number
  reviews: number
  createdAt: string
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    price: 149.99,
    originalPrice: 199.99,
    stock: 45,
    status: 'active',
    image: '/api/placeholder/100/100',
    description: 'High-quality wireless headphones with noise cancellation',
    rating: 4.5,
    reviews: 234,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Premium Cotton T-Shirt',
    category: 'Clothing',
    price: 29.99,
    stock: 120,
    status: 'active',
    image: '/api/placeholder/100/100',
    description: 'Comfortable premium cotton t-shirt',
    rating: 4.2,
    reviews: 89,
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    category: 'Electronics',
    price: 199.99,
    stock: 0,
    status: 'out_of_stock',
    image: '/api/placeholder/100/100',
    description: 'Advanced fitness tracking with heart rate monitor',
    rating: 4.8,
    reviews: 156,
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    name: 'Organic Coffee Beans',
    category: 'Food & Beverage',
    price: 19.99,
    stock: 85,
    status: 'active',
    image: '/api/placeholder/100/100',
    description: 'Premium organic coffee beans from sustainable farms',
    rating: 4.6,
    reviews: 78,
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    name: 'Gaming Mechanical Keyboard',
    category: 'Electronics',
    price: 89.99,
    originalPrice: 129.99,
    stock: 0,
    status: 'draft',
    image: '/api/placeholder/100/100',
    description: 'RGB backlit mechanical keyboard for gaming',
    rating: 4.3,
    reviews: 45,
    createdAt: '2024-01-10'
  }
]

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))]
  const statuses = ['all', 'active', 'draft', 'out_of_stock']

  const handleAddProduct = () => {
    // In a real application, this would open a modal or redirect to add product page
    alert('Add Product functionality would open here')
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: Product['status']) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      out_of_stock: 'bg-red-100 text-red-800 border-red-200'
    }

    const statusText = {
      active: 'Active',
      draft: 'Draft',
      out_of_stock: 'Out of Stock'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    )
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button
          onClick={handleAddProduct}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : 
                   status === 'out_of_stock' ? 'Out of Stock' : 
                   status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">
            Products ({filteredProducts.length})
          </h3>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPrice(product.price)}
                        {product.originalPrice && (
                          <span className="block text-xs text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock > 0 ? product.stock : 'Out of stock'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View product"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Edit product"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete product"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination (placeholder) */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to{' '}
          <span className="font-medium">{filteredProducts.length}</span> of{' '}
          <span className="font-medium">{products.length}</span> results
        </p>
        {/* Add pagination component here if needed */}
      </div>
    </div>
  )
}