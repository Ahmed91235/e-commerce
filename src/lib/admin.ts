import { Session } from 'next-auth'

/**
 * Check if a user has admin privileges
 * In a real application, this would check against user roles from the database
 */
export function isAdmin(session: Session | null): boolean {
  if (!session?.user?.email) return false
  
  // For demo purposes, we'll consider any authenticated user as admin
  // In production, you would check against actual admin roles
  // Example: return session.user.role === 'admin'
  
  return true // Allow any authenticated user for demo
}

/**
 * Admin role types for future expansion
 */
export type AdminRole = 'super_admin' | 'admin' | 'moderator'

/**
 * Get admin permissions for a user
 */
export function getAdminPermissions(session: Session | null): {
  canManageProducts: boolean
  canManageOrders: boolean
  canManageCustomers: boolean
  canViewReports: boolean
  canManageSettings: boolean
} {
  if (!isAdmin(session)) {
    return {
      canManageProducts: false,
      canManageOrders: false,
      canManageCustomers: false,
      canViewReports: false,
      canManageSettings: false,
    }
  }

  // For demo, give all permissions to admin users
  return {
    canManageProducts: true,
    canManageOrders: true,
    canManageCustomers: true,
    canViewReports: true,
    canManageSettings: true,
  }
}

/**
 * Secure admin route checker
 */
export function requireAdminAuth(session: Session | null): boolean {
  return isAdmin(session)
}