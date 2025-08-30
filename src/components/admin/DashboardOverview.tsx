'use client'

import { motion } from 'framer-motion'
import {
  ShoppingCartIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  CubeIcon
} from '@heroicons/react/24/outline'
import {
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  UsersIcon as UsersIconSolid,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid'

interface StatsCardProps {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<React.ComponentProps<'svg'>>
  iconBg: string
}

function StatsCard({ title, value, change, changeType, icon: Icon, iconBg }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-xl p-6"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {changeType === 'increase' ? (
                  <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                )}
                <span className="sr-only">
                  {changeType === 'increase' ? 'Increased' : 'Decreased'} by
                </span>
                {change}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </motion.div>
  )
}

interface Order {
  id: string
  customer: string
  email: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
}

interface Product {
  id: string
  name: string
  category: string
  sales: number
  revenue: number
  image: string
}

const recentOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    email: 'john@example.com',
    total: 299.99,
    status: 'processing',
    date: '2025-01-27'
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    total: 149.99,
    status: 'shipped',
    date: '2025-01-27'
  },
  {
    id: 'ORD-003',
    customer: 'Mike Davis',
    email: 'mike@example.com',
    total: 89.99,
    status: 'delivered',
    date: '2025-01-26'
  },
  {
    id: 'ORD-004',
    customer: 'Emma Wilson',
    email: 'emma@example.com',
    total: 199.99,
    status: 'pending',
    date: '2025-01-26'
  }
]

const popularProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    sales: 156,
    revenue: 23400,
    image: '/api/placeholder/60/60'
  },
  {
    id: '2',
    name: 'Premium Cotton T-Shirt',
    category: 'Clothing',
    sales: 234,
    revenue: 7020,
    image: '/api/placeholder/60/60'
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    category: 'Electronics',
    sales: 89,
    revenue: 17800,
    image: '/api/placeholder/60/60'
  },
  {
    id: '4',
    name: 'Organic Coffee Beans',
    category: 'Food & Beverage',
    sales: 345,
    revenue: 6900,
    image: '/api/placeholder/60/60'
  }
]

export default function DashboardOverview() {
  const getStatusBadge = (status: Order['status']) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Overview</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="$54,239"
            change="12.5%"
            changeType="increase"
            icon={CurrencyDollarIconSolid}
            iconBg="bg-green-500"
          />
          <StatsCard
            title="Total Orders"
            value="1,429"
            change="8.2%"
            changeType="increase"
            icon={ShoppingCartIconSolid}
            iconBg="bg-blue-500"
          />
          <StatsCard
            title="Total Customers"
            value="892"
            change="15.3%"
            changeType="increase"
            icon={UsersIconSolid}
            iconBg="bg-purple-500"
          />
          <StatsCard
            title="Conversion Rate"
            value="3.24%"
            change="2.1%"
            changeType="decrease"
            icon={ArrowTrendingUpIcon}
            iconBg="bg-orange-500"
          />
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-sm border border-gray-200 rounded-xl"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{order.id}</p>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${order.total}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                View All Orders
              </button>
            </div>
          </div>
        </motion.div>

        {/* Popular Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white shadow-sm border border-gray-200 rounded-xl"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Popular Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {popularProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                View All Products
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white shadow-sm border border-gray-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <CubeIcon className="h-6 w-6 text-gray-400" />
            <span className="font-medium text-gray-700">Add Product</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <UsersIcon className="h-6 w-6 text-gray-400" />
            <span className="font-medium text-gray-700">Add Customer</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <EyeIcon className="h-6 w-6 text-gray-400" />
            <span className="font-medium text-gray-700">View Reports</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
            <span className="font-medium text-gray-700">Manage Orders</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}