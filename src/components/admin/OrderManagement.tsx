'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  image: string
}

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567'
    },
    items: [
      {
        id: '1',
        productName: 'Wireless Bluetooth Headphones',
        quantity: 1,
        price: 149.99,
        image: '/api/placeholder/60/60'
      },
      {
        id: '2',
        productName: 'Premium Cotton T-Shirt',
        quantity: 2,
        price: 29.99,
        image: '/api/placeholder/60/60'
      }
    ],
    subtotal: 209.97,
    shipping: 15.00,
    tax: 18.90,
    total: 243.87,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    createdAt: '2024-01-27T10:30:00Z',
    updatedAt: '2024-01-27T11:15:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        id: '3',
        productName: 'Smart Fitness Watch',
        quantity: 1,
        price: 199.99,
        image: '/api/placeholder/60/60'
      }
    ],
    subtotal: 199.99,
    shipping: 10.00,
    tax: 17.00,
    total: 226.99,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'US'
    },
    createdAt: '2024-01-26T14:20:00Z',
    updatedAt: '2024-01-27T09:00:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      name: 'Mike Davis',
      email: 'mike@example.com'
    },
    items: [
      {
        id: '4',
        productName: 'Organic Coffee Beans',
        quantity: 3,
        price: 19.99,
        image: '/api/placeholder/60/60'
      }
    ],
    subtotal: 59.97,
    shipping: 5.00,
    tax: 5.20,
    total: 70.17,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'US'
    },
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-26T12:30:00Z'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: {
      name: 'Emma Wilson',
      email: 'emma@example.com'
    },
    items: [
      {
        id: '5',
        productName: 'Gaming Mechanical Keyboard',
        quantity: 1,
        price: 89.99,
        image: '/api/placeholder/60/60'
      }
    ],
    subtotal: 89.99,
    shipping: 12.00,
    tax: 8.64,
    total: 110.63,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: {
      street: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'US'
    },
    createdAt: '2024-01-27T12:00:00Z',
    updatedAt: '2024-01-27T12:00:00Z'
  }
]

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
  const paymentStatuses = ['all', 'pending', 'paid', 'failed', 'refunded']

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesPayment = selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status: Order['status']) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getPaymentBadge = (status: Order['paymentStatus']) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage customer orders and fulfillment
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {paymentStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Payment Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">
            Orders ({filteredOrders.length})
          </h3>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No orders found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{order.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View order details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900 p-1">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <div className="absolute right-0 top-6 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="p-2 space-y-1">
                              {['processing', 'shipped', 'delivered'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => updateOrderStatus(order.id, status as Order['status'])}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                  disabled={order.status === status}
                                >
                                  Mark as {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Order Details - {selectedOrder.orderNumber}
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Customer</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{selectedOrder.customer.name}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                      {selectedOrder.customer.phone && (
                        <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.productName}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatPrice(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{formatPrice(selectedOrder.shipping)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatPrice(selectedOrder.tax)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>{formatPrice(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex space-x-4">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Order Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">Payment Status:</span>
                      <div className="mt-1">{getPaymentBadge(selectedOrder.paymentStatus)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}