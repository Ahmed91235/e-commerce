'use client'

import { motion } from 'framer-motion'
import {
  UserIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { clsx } from 'clsx'

interface DashboardNavProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const navItems: NavItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: UserIcon,
    description: 'Manage your personal information'
  },
  {
    id: 'orders',
    label: 'Order History',
    icon: ClockIcon,
    description: 'Track your orders and purchases'
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    icon: HeartIcon,
    description: 'Items you want to buy later'
  },
  {
    id: 'addresses',
    label: 'Addresses',
    icon: MapPinIcon,
    description: 'Manage shipping addresses'
  }
]

export default function DashboardNav({ activeSection, onSectionChange }: DashboardNavProps) {
  const { signOut } = useSupabaseAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Navigation Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Cog6ToothIcon className="h-5 w-5 mr-2 text-blue-600" />
          Dashboard
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Navigation Items */}
      <div className="p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={clsx(
                'w-full text-left p-4 rounded-lg transition-all duration-200 group',
                'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                isActive
                  ? 'bg-blue-50 border-l-4 border-blue-600 shadow-sm'
                  : 'hover:border-l-2 hover:border-gray-200'
              )}
              whileHover={{ x: isActive ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                <motion.div
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className={clsx(
                    'text-sm font-medium transition-colors',
                    isActive ? 'text-blue-900' : 'text-gray-900'
                  )}>
                    {item.label}
                  </p>
                  <p className={clsx(
                    'text-xs mt-1 transition-colors',
                    isActive ? 'text-blue-700' : 'text-gray-500'
                  )}>
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mx-4 my-2" />

      {/* Sign Out Button */}
      <div className="p-2 pb-4">
        <motion.button
          onClick={handleSignOut}
          className="w-full text-left p-4 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-2 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </motion.div>
            <div>
              <p className="text-sm font-medium">Sign Out</p>
              <p className="text-xs text-red-500 mt-1">
                Sign out of your account
              </p>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}