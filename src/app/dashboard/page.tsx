'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardNav from '@/components/dashboard/DashboardNav'
import ProfileSection from '@/components/dashboard/ProfileSection'
import OrderHistory from '@/components/dashboard/OrderHistory'
import Wishlist from '@/components/dashboard/Wishlist'
import AddressBook from '@/components/dashboard/AddressBook'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { redirect } from 'next/navigation'

export default function Dashboard() {
  const { user, loading } = useSupabaseAuth()
  const [activeSection, setActiveSection] = useState('profile')

  // Redirect if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    redirect('/auth/signin')
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection user={user} />
      case 'orders':
        return <OrderHistory />
      case 'wishlist':
        return <Wishlist />
      case 'addresses':
        return <AddressBook />
      default:
        return <ProfileSection user={user} />
    }
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg className="w-6 h-6 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-500 text-sm font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <a
                    href={crumb.href}
                    className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
                  >
                    {crumb.label}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Dashboard Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600">
              Manage your account, view your orders, and update your preferences.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Dashboard Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/4"
          >
            <DashboardNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </motion.div>

          {/* Dashboard Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:w-3/4"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {renderSection()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}