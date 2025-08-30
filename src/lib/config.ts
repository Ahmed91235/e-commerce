/**
 * Application configuration with security validations
 */

// Validate required environment variables
const requiredEnvVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const

// Optional environment variables for OAuth and database
// These are checked individually where needed

// Check if we're in production
const isProd = process.env.NODE_ENV === 'production'

// Validate environment variables
function validateEnvironment() {
  const missingRequired: string[] = []
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingRequired.push(envVar)
    }
  }
  
  if (missingRequired.length > 0 && isProd) {
    throw new Error(
      `Missing required environment variables: ${missingRequired.join(', ')}`
    )
  }
  
  // Validate NEXTAUTH_SECRET length in production
  if (isProd && process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    throw new Error('NEXTAUTH_SECRET must be at least 32 characters long in production')
  }
}

// Run validation
validateEnvironment()

export const config = {
  // App settings
  app: {
    name: 'EStore',
    description: 'Your Online Marketplace',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  
  // Auth settings
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Security settings
  security: {
    bcryptRounds: isProd ? 12 : 10,
    rateLimiting: {
      api: { maxRequests: isProd ? 100 : 1000, windowMs: 15 * 60 * 1000 }, // 15 minutes
      auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 15 minutes
      admin: { maxRequests: isProd ? 50 : 500, windowMs: 15 * 60 * 1000 }, // 15 minutes
    },
    cors: {
      origin: isProd ? process.env.NEXTAUTH_URL : ['http://localhost:3000', 'http://localhost:52280'],
      credentials: true,
    },
  },
  
  // Database settings
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: isProd ? 20 : 10,
  },
  
  // OAuth providers
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
  
  // Feature flags
  features: {
    adminDashboard: true,
    userRegistration: true,
    oauth: Boolean(process.env.GOOGLE_CLIENT_ID || process.env.GITHUB_CLIENT_ID),
    guestCheckout: true,
    newsletter: true,
  },
  
  // Business settings
  business: {
    currency: 'USD',
    taxRate: 0.08, // 8%
    shippingRate: 9.99,
    freeShippingThreshold: 75.00,
  },
} as const

export type Config = typeof config