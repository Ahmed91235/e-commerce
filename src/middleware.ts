import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'
import { checkRateLimit } from '@/lib/rate-limiter'

export async function middleware(req: NextRequest) {
  // Handle Supabase Auth refresh
  const { supabase, response } = createClient(req)
  
  // Refresh the user's session if expired
  await supabase.auth.getUser()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'ALLOWALL')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Protected routes check
  const protectedRoutes = ['/dashboard', '/admin', '/profile', '/orders']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  if (isProtectedRoute) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      const redirectUrl = new URL('/auth/signin', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Admin-only routes
    const adminRoutes = ['/admin']
    const isAdminRoute = adminRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    )
    
    if (isAdminRoute) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (!profile || profile.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  }
  
  // CORS headers for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.APP_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }
    
    // Rate limiting for API routes
    const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth/')
    const rateLimitResult = await checkRateLimit(req, isAuthRoute ? 'auth' : 'general')
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: Math.round((rateLimitResult.msBeforeNext || 0) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.round((rateLimitResult.msBeforeNext || 0) / 1000).toString(),
            'X-RateLimit-Limit': isAuthRoute ? '5' : process.env.RATE_LIMIT_MAX_REQUESTS || '100',
            'X-RateLimit-Remaining': (rateLimitResult.remainingPoints || 0).toString(),
            'X-RateLimit-Reset': new Date(Date.now() + (rateLimitResult.msBeforeNext || 0)).toISOString(),
          }
        }
      )
    }
    
    // Add rate limit headers to successful requests
    response.headers.set('X-RateLimit-Limit', isAuthRoute ? '5' : process.env.RATE_LIMIT_MAX_REQUESTS || '100')
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remainingPoints?.toString() || '0')
  }
  
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}