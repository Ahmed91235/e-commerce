import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email().toLowerCase().trim()

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
  .transform(val => val.trim())

export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional()

export const addressSchema = z.string()
  .min(5, 'Address must be at least 5 characters')
  .max(200, 'Address must be less than 200 characters')
  .transform(val => val.trim())

export const postalCodeSchema = z.string()
  .min(3, 'Postal code must be at least 3 characters')
  .max(10, 'Postal code must be less than 10 characters')
  .regex(/^[A-Za-z0-9\s-]+$/, 'Invalid postal code format')
  .transform(val => val.trim().toUpperCase())

export const slugSchema = z.string()
  .min(1, 'Slug is required')
  .max(100, 'Slug must be less than 100 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .refine(val => !val.startsWith('-') && !val.endsWith('-'), 'Slug cannot start or end with hyphen')

export const priceSchema = z.number()
  .positive('Price must be positive')
  .max(999999.99, 'Price cannot exceed $999,999.99')
  .refine(val => Number.isFinite(val), 'Price must be a valid number')

// Sanitization functions
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>'"&]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 100) // Limit search query length
}

// File validation
export const imageUrlSchema = z.string()
  .url('Invalid image URL')
  .refine(val => {
    const extension = val.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension || '')
  }, 'Invalid image format. Supported formats: jpg, jpeg, png, webp, gif')

// User input validation with rate limiting consideration
export function validateAndSanitizeQuery(searchParams: URLSearchParams) {
  const query = searchParams.get('q')
  if (!query) return null
  
  // Basic validation
  if (query.length > 100) {
    throw new Error('Search query too long')
  }
  
  if (query.length < 2) {
    throw new Error('Search query too short')
  }
  
  return sanitizeSearchQuery(query)
}

// Common response schemas
export const successResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional()
})

export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.any().optional()
})

export const paginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  total: z.number().min(0),
  totalPages: z.number().min(0)
})