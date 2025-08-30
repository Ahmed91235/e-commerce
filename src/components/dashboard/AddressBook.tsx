'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'

interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  fullName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault: boolean
}

const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'home',
    fullName: 'John Doe',
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567',
    isDefault: true
  },
  {
    id: '2',
    type: 'work',
    fullName: 'John Doe',
    company: 'Tech Corp Inc.',
    addressLine1: '456 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    country: 'United States',
    phone: '+1 (555) 987-6543',
    isDefault: false
  }
]

const addressTypeConfig = {
  home: {
    label: 'Home',
    icon: HomeIcon,
    color: 'text-blue-600 bg-blue-100'
  },
  work: {
    label: 'Work',
    icon: BuildingOfficeIcon,
    color: 'text-green-600 bg-green-100'
  },
  other: {
    label: 'Other',
    icon: MapPinIcon,
    color: 'text-purple-600 bg-purple-100'
  }
}

const emptyAddress: Omit<Address, 'id'> = {
  type: 'home',
  fullName: '',
  company: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  phone: '',
  isDefault: false
}

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Address, 'id'>>(emptyAddress)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAddresses(mockAddresses)
      setLoading(false)
    }, 1000)
  }, [])

  const handleInputChange = (field: keyof Omit<Address, 'id'>, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddNew = () => {
    setFormData(emptyAddress)
    setIsAddingNew(true)
    setEditingId(null)
  }

  const handleEdit = (address: Address) => {
    setFormData({
      type: address.type,
      fullName: address.fullName,
      company: address.company || '',
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault
    })
    setEditingId(address.id)
    setIsAddingNew(false)
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingId(null)
    setFormData(emptyAddress)
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (isAddingNew) {
        // Add new address
        const newAddress: Address = {
          ...formData,
          id: Date.now().toString()
        }
        
        // If this is set as default, make sure other addresses aren't
        if (formData.isDefault) {
          setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })))
        }
        
        setAddresses(prev => [...prev, newAddress])
      } else if (editingId) {
        // Update existing address
        if (formData.isDefault) {
          setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefault: addr.id === editingId ? true : false
          })))
        }
        
        setAddresses(prev => prev.map(addr =>
          addr.id === editingId ? { ...formData, id: addr.id } : addr
        ))
      }

      handleCancel()
    } catch (error) {
      console.error('Failed to save address:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId))
    }
  }

  const handleSetDefault = async (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })))
  }

  const isFormValid = formData.fullName && formData.addressLine1 && 
                     formData.city && formData.state && formData.zipCode

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <motion.div
            className="p-3 bg-emerald-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            <MapPinIcon className="h-6 w-6 text-emerald-600" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Address Book</h2>
            <p className="text-gray-600">Manage your shipping addresses</p>
          </div>
        </div>

        <Button
          onClick={handleAddNew}
          disabled={isAddingNew || editingId !== null}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add New Address</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(isAddingNew || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 overflow-hidden"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {isAddingNew ? 'Add New Address' : 'Edit Address'}
            </h3>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <div className="flex space-x-4">
                  {(Object.keys(addressTypeConfig) as Array<keyof typeof addressTypeConfig>).map((type) => {
                    const config = addressTypeConfig[type]
                    const Icon = config.icon
                    return (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={formData.type === type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="text-blue-600"
                        />
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{config.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter full name"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company (optional)
                </label>
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <Input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  placeholder="Street address"
                />
              </div>

              {/* Address Line 2 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2 (optional)
                </label>
                <Input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  placeholder="Apartment, suite, unit, etc."
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <Input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <Input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (optional)
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              {/* Set as Default */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Set as default address
                  </span>
                </label>
              </div>
            </form>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-blue-200">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isFormValid || saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Address'
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address List */}
      {addresses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <MapPinIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Addresses Yet</h3>
          <p className="text-gray-600 mb-6">
            Add your first address to make checkout faster and easier.
          </p>
          <Button onClick={handleAddNew}>
            Add Your First Address
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address, index) => {
            const TypeIcon = addressTypeConfig[address.type].icon
            
            return (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={clsx(
                  'bg-white border rounded-xl shadow-sm p-6 relative',
                  address.isDefault 
                    ? 'border-blue-200 ring-1 ring-blue-200 bg-blue-50' 
                    : 'border-gray-200 hover:shadow-md'
                )}
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="absolute -top-2 left-6">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <CheckCircleIcon className="h-3 w-3" />
                      <span>Default</span>
                    </span>
                  </div>
                )}

                {/* Address Type */}
                <div className="flex items-center justify-between mb-4">
                  <div className={clsx(
                    'flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium',
                    addressTypeConfig[address.type].color
                  )}>
                    <TypeIcon className="h-4 w-4" />
                    <span>{addressTypeConfig[address.type].label}</span>
                  </div>

                  <div className="flex space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(address)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-1 mb-4">
                  <p className="font-semibold text-gray-900">{address.fullName}</p>
                  {address.company && (
                    <p className="text-gray-600">{address.company}</p>
                  )}
                  <p className="text-gray-700">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="text-gray-700">{address.addressLine2}</p>
                  )}
                  <p className="text-gray-700">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-gray-700">{address.country}</p>
                  {address.phone && (
                    <p className="text-gray-600">{address.phone}</p>
                  )}
                </div>

                {/* Set as Default Button */}
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="w-full"
                  >
                    Set as Default
                  </Button>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}