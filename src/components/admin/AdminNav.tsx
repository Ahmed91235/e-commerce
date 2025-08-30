'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import {
  ChartBarIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<React.ComponentProps<'svg'>>
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
  { name: 'Products', href: '/admin/products', icon: CubeIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Reports', href: '/admin/reports', icon: DocumentChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
]

export default function AdminNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex z-50">
        <div className="flex w-64 flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto bg-white shadow-lg">
            <div className="flex h-16 flex-shrink-0 items-center px-4 bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <span className="text-lg font-semibold text-gray-900">Admin Portal</span>
              </div>
            </div>
            
            <div className="flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  
                  return (
                    <Link key={item.name} href={item.href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={clsx(
                          'group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                          active
                            ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <Icon
                          className={clsx(
                            'mr-3 h-5 w-5 flex-shrink-0',
                            active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                          )}
                        />
                        {item.name}
                        {active && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto h-1.5 w-1.5 bg-blue-600 rounded-full"
                          />
                        )}
                      </motion.div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile menu button */}
        <div className="flex h-16 items-center justify-between bg-white px-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="text-lg font-semibold text-gray-900">Admin Portal</span>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile menu panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl md:hidden"
        >
          <div className="flex h-16 items-center px-4 bg-slate-50">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="text-lg font-semibold text-gray-900">Admin Portal</span>
            </div>
          </div>

          <nav className="mt-4 space-y-1 px-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={clsx(
                      'group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    {item.name}
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </motion.div>
      </div>
    </>
  )
}