'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { 
  UserIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/solid'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: 'active' | 'inactive' | 'banned'
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  registrationDate: string
  address: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  preferences: {
    emailMarketing: boolean
    smsMarketing: boolean
  }
  tags: string[]
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '/api/placeholder/60/60',
    status: 'active',
    totalOrders: 15,
    totalSpent: 2340.50,
    lastOrderDate: '2024-01-27T10:30:00Z',
    registrationDate: '2023-06-15T09:00:00Z',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    preferences: {
      emailMarketing: true,
      smsMarketing: false
    },
    tags: ['VIP', 'Repeat Customer']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    totalOrders: 8,
    totalSpent: 890.25,
    lastOrderDate: '2024-01-26T14:20:00Z',
    registrationDate: '2023-09-22T11:30:00Z',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'US'
    },
    preferences: {
      emailMarketing: true,
      smsMarketing: true
    },
    tags: ['Electronics Buyer']
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@example.com',
    status: 'active',
    totalOrders: 3,
    totalSpent: 245.80,
    lastOrderDate: '2024-01-25T16:45:00Z',
    registrationDate: '2024-01-10T14:15:00Z',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'US'
    },
    preferences: {
      emailMarketing: false,
      smsMarketing: false
    },
    tags: ['New Customer']
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+1 (555) 567-8901',
    status: 'inactive',
    totalOrders: 0,
    totalSpent: 0,
    registrationDate: '2023-12-05T16:20:00Z',
    address: {
      street: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'US'
    },
    preferences: {
      emailMarketing: true,
      smsMarketing: false
    },
    tags: ['No Purchases']
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    status: 'banned',
    totalOrders: 2,
    totalSpent: 150.00,
    lastOrderDate: '2023-11-15T12:00:00Z',
    registrationDate: '2023-10-01T10:00:00Z',
    address: {},
    preferences: {
      emailMarketing: false,
      smsMarketing: false
    },
    tags: ['Policy Violation']
  }
]

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const statuses = ['all', 'active', 'inactive', 'banned']

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchQuery))
    
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Customer['status']) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      banned: 'bg-red-100 text-red-800 border-red-200'
    }

    const statusIcons = {
      active: CheckBadgeIcon,
      inactive: UserIcon,
      banned: UserIcon
    }

    const Icon = statusIcons[status]

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const updateCustomerStatus = (customerId: string, newStatus: Customer['status']) => {
    setCustomers(customers.map(customer => 
      customer.id === customerId 
        ? { ...customer, status: newStatus }
        : customer
    ))
  }

  const deleteCustomer = (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== customerId))
    }
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
      day: 'numeric'
    })
  }

  const getCustomerSegment = (customer: Customer) => {
    if (customer.totalSpent > 1000) return 'VIP'
    if (customer.totalOrders > 5) return 'Frequent'
    if (customer.totalOrders === 0) return 'New'
    return 'Regular'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage customer accounts and preferences
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-xl font-semibold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckBadgeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-xl font-semibold text-gray-900">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatPrice(
                  customers.reduce((sum, c) => sum + c.totalSpent, 0) / 
                  Math.max(customers.reduce((sum, c) => sum + c.totalOrders, 0), 1)
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search customers..."
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
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">
            Customers ({filteredCustomers.length})
          </h3>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No customers found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {customer.avatar ? (
                            <img
                              src={customer.avatar}
                              alt={customer.name}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              getCustomerSegment(customer) === 'VIP' 
                                ? 'bg-purple-100 text-purple-800'
                                : getCustomerSegment(customer) === 'Frequent'
                                ? 'bg-blue-100 text-blue-800'
                                : getCustomerSegment(customer) === 'New'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {getCustomerSegment(customer)}
                            </span>
                            {customer.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center mt-1">
                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.totalOrders}
                      {customer.lastOrderDate && (
                        <div className="text-xs text-gray-500">
                          Last: {formatDate(customer.lastOrderDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(customer.registrationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View customer"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900 p-1">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="p-2 space-y-1">
                              {['active', 'inactive', 'banned'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => updateCustomerStatus(customer.id, status as Customer['status'])}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                  disabled={customer.status === status}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete customer"
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

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedCustomer(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Customer Details - {selectedCustomer.name}
                  </h3>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedCustomer.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
                      {selectedCustomer.phone && <p><span className="font-medium">Phone:</span> {selectedCustomer.phone}</p>}
                      <p>
                        <span className="font-medium">Status:</span> 
                        <span className="ml-2">{getStatusBadge(selectedCustomer.status)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Order Stats */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Order Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalOrders}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(selectedCustomer.totalSpent)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Address</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedCustomer.address.street ? (
                        <div>
                          {selectedCustomer.address.street && <p>{selectedCustomer.address.street}</p>}
                          {selectedCustomer.address.city && (
                            <p>
                              {selectedCustomer.address.city}
                              {selectedCustomer.address.state && `, ${selectedCustomer.address.state}`}
                              {selectedCustomer.address.zipCode && ` ${selectedCustomer.address.zipCode}`}
                            </p>
                          )}
                          {selectedCustomer.address.country && <p>{selectedCustomer.address.country}</p>}
                        </div>
                      ) : (
                        <p className="text-gray-500">No address provided</p>
                      )}
                    </div>
                  </div>

                  {/* Marketing Preferences */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Marketing Preferences</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span>Email Marketing</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedCustomer.preferences.emailMarketing 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedCustomer.preferences.emailMarketing ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SMS Marketing</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedCustomer.preferences.smsMarketing 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedCustomer.preferences.smsMarketing ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Important Dates</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="font-medium">Registration:</span> {formatDate(selectedCustomer.registrationDate)}
                      </p>
                      {selectedCustomer.lastOrderDate && (
                        <p>
                          <span className="font-medium">Last Order:</span> {formatDate(selectedCustomer.lastOrderDate)}
                        </p>
                      )}
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