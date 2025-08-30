'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ClockIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  itemsCount: number
  items: OrderItem[]
}

interface OrderItem {
  id: string
  name: string
  image: string
  price: number
  quantity: number
  category: string
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 194.38,
    itemsCount: 2,
    items: [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center',
        price: 89.99,
        quantity: 2,
        category: 'Electronics'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 149.97,
    itemsCount: 3,
    items: [
      {
        id: '2',
        name: 'Premium Cotton T-Shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop&crop=center',
        price: 24.99,
        quantity: 2,
        category: 'Clothing'
      },
      {
        id: '3',
        name: 'Smart Fitness Watch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center',
        price: 199.99,
        quantity: 1,
        category: 'Electronics'
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-25',
    status: 'confirmed',
    total: 64.98,
    itemsCount: 2,
    items: [
      {
        id: '4',
        name: 'Ceramic Plant Pot Set',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=100&h=100&fit=crop&crop=center',
        price: 34.99,
        quantity: 1,
        category: 'Home & Garden'
      },
      {
        id: '5',
        name: 'Yoga Mat with Carrying Strap',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop&crop=center',
        price: 29.99,
        quantity: 1,
        category: 'Sports'
      }
    ]
  }
]

const statusConfig = {
  pending: {
    label: 'Order Pending',
    color: 'text-yellow-600 bg-yellow-100',
    icon: ClockIcon
  },
  confirmed: {
    label: 'Order Confirmed',
    color: 'text-blue-600 bg-blue-100',
    icon: CheckCircleIcon
  },
  shipped: {
    label: 'Shipped',
    color: 'text-indigo-600 bg-indigo-100',
    icon: TruckIcon
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-600 bg-green-100',
    icon: CheckCircleIcon
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-600 bg-red-100',
    icon: ClockIcon
  }
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Section Header */}
      <div className="flex items-center space-x-3 mb-8">
        <motion.div
          className="p-3 bg-indigo-100 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <ClockIcon className="h-6 w-6 text-indigo-600" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven&apos;t placed any orders. Start shopping to see your order history here.
          </p>
          <Button>
            Start Shopping
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => {
            const StatusIcon = statusConfig[order.status].icon
            const isExpanded = expandedOrder === order.id

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={clsx(
                          'px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1',
                          statusConfig[order.status].color
                        )}>
                          <StatusIcon className="h-4 w-4" />
                          <span>{statusConfig[order.status].label}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Placed on {formatDate(order.date)} • {order.itemsCount} item{order.itemsCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-sm text-gray-500">Total</p>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="flex items-center space-x-1"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>{isExpanded ? 'Hide' : 'View'} Details</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order Items (Expanded) */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 bg-gray-50"
                  >
                    <div className="p-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Order Items
                      </h4>
                      
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-4 bg-white rounded-lg p-4"
                          >
                            <div className="flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <p className="text-sm text-gray-500">{item.category}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Order Actions */}
                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                        <Button variant="outline" size="sm">
                          Download Invoice
                        </Button>
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            Write Review
                          </Button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <Button variant="outline" size="sm">
                            Track Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}