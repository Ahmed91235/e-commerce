// /src/app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limiter'

const signinSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting for auth endpoints
    const rateLimitResult = await checkRateLimit(req, 'auth')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.round((rateLimitResult.msBeforeNext || 0) / 1000).toString(),
          }
        }
      )
    }

    const body = await req.json()
    
    // Validate input
    const validated = signinSchema.parse(body)
    
    const supabase = createClient()
    
    // Sign in user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })
    
    if (authError) {
      console.error('Auth signin error:', authError)
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: 'Signed in successfully',
      user: profile,
      session: authData.session
    }, { status: 200 })
    
  } catch (error) {
    console.error('Signin error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}