import { RateLimiterMemory } from 'rate-limiter-flexible'
import { NextRequest } from 'next/server'

// Rate limiter configuration
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'middleware',
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Number of requests
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000, // Per 900 seconds (15 minutes)
})

const authRateLimiter = new RateLimiterMemory({
  keyPrefix: 'auth',
  points: 5, // Limit auth attempts
  duration: 900, // Per 15 minutes
})

export async function checkRateLimit(req: NextRequest, limitType: 'general' | 'auth' = 'general') {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') ?? '127.0.0.1'
  
  const limiter = limitType === 'auth' ? authRateLimiter : rateLimiter
  
  try {
    await limiter.consume(ip)
    return { success: true }
  } catch (rateLimiterRes: unknown) {
    const res = rateLimiterRes as { msBeforeNext?: number; remainingPoints?: number; totalHits?: number }
    return {
      success: false,
      msBeforeNext: res.msBeforeNext || 0,
      remainingPoints: res.remainingPoints || 0,
      totalHits: res.totalHits || 0
    }
  }
}

export async function getRateLimitStatus(req: NextRequest, limitType: 'general' | 'auth' = 'general') {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') ?? '127.0.0.1'
  const limiter = limitType === 'auth' ? authRateLimiter : rateLimiter
  
  try {
    const resRateLimiter = await limiter.get(ip)
    return {
      remainingPoints: resRateLimiter ? resRateLimiter.remainingPoints : limiter.points,
      msBeforeNext: resRateLimiter ? resRateLimiter.msBeforeNext : 0,
      totalHits: resRateLimiter ? limiter.points - resRateLimiter.remainingPoints : 0,
    }
  } catch {
    return {
      remainingPoints: limiter.points,
      msBeforeNext: 0,
      totalHits: 0,
    }
  }
}