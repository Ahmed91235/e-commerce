import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(content: string): string {
  return DOMPurify.sanitize(content)
}

/**
 * Sanitize user input strings
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Validate product price
 */
export function validatePrice(price: string | number): boolean {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 999999.99
}

/**
 * Validate product stock quantity
 */
export function validateStock(stock: string | number): boolean {
  const numStock = typeof stock === 'string' ? parseInt(stock, 10) : stock
  return !isNaN(numStock) && numStock >= 0 && numStock <= 999999
}

/**
 * Rate limiting utility (simple in-memory implementation)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  isAllowed(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []
    
    // Clean old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= maxRequests) {
      return false
    }

    // Add current request
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    
    return true
  }
}

export const rateLimiter = new RateLimiter()

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

/**
 * Validate required fields
 */
export function validateRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validate string length
 */
export function validateLength(value: string, min: number = 0, max: number = 1000): boolean {
  const length = value?.trim().length || 0
  return length >= min && length <= max
}

/**
 * Security headers for API routes
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
}