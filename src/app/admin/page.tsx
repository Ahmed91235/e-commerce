'use client'

import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminNav from '@/components/admin/AdminNav'
import DashboardOverview from '@/components/admin/DashboardOverview'

export default function AdminDashboard() {
  const { user, loading } = useSupabaseAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // Still loading
    
    if (!user) {
      router.push('/auth/signin')
      return
    }

    // Check if user has admin role
    if (user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null // Will redirect to signin or dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Navigation */}
        <AdminNav />
        
        {/* Main Content */}
        <div className="flex-1 md:ml-0">
          {/* Mobile header space */}
          <div className="md:hidden h-16"></div>
          
          {/* Page Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Welcome back, {session.user?.name || session.user?.email}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            <DashboardOverview />
          </div>
        </div>
      </div>
    </div>
  )
}