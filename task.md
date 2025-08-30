Now, I build this app using agent system and i got many errors when I build the app using 'npm run build' and I want you to review all me files to ensure there is no any errors.

This what I got when I tried to build the app:-
'''
   Linting and checking validity of types  .Failed to compile.

./src/app/api/auth/callback/route.ts:12:38
Type error: Property 'auth' does not exist on type 'Promise<SupabaseClient<Database, "public", "public", never, { PostgrestVersion: "12"; }>>'.

  10 |     const supabase = createClient()  // Fixed: Use createClient() instead of supabaseAdmin
  11 |
> 12 |     const { error } = await supabase.auth.exchangeCodeForSession(code)
     |                                      ^
  13 |
  14 |     if (!error) {
  15 |       const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
'''

# Insructions:-
1. You must review the fiels and tell me the other files that related to these files that needed to be reviewed.

# Files:-
## src\app\api\cart\route.ts:-
'''
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limiter'
import type { Database } from '@/lib/supabase/database.types'

// Use the Database types directly
type CartItem = Database['public']['Tables']['cart_items']['Row']
type Product = Database['public']['Tables']['products']['Row']

// Type for cart item with joined product
type CartItemWithProduct = CartItem & {
  products: Product
}

const cartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().min(1).max(10)
})

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 'general')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Get authenticated user
    const user = await requireAuth()
    const supabase = supabaseAdmin
    
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products!inner (*)
      `)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Cart query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cart items' },
        { status: 500 }
      )
    }
    
    // Type assertion for cart items with products
    const typedCartItems = cartItems as CartItemWithProduct[] | null
    
    // Calculate cart totals
    const subtotal = (typedCartItems || []).reduce((total, item) => {
      return total + (Number(item.products.price) * item.quantity)
    }, 0)
    
    const itemCount = (typedCartItems || []).reduce((total, item) => total + item.quantity, 0)
    
    return NextResponse.json({
      items: typedCartItems || [],
      subtotal,
      itemCount
    })
    
  } catch (error) {
    console.error('Cart GET error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 'general')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Get authenticated user
    const user = await requireAuth()
    const supabase = supabaseAdmin
    
    const body = await req.json()
    const validated = cartItemSchema.parse(body)
    
    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', validated.productId)
      .single()
    
    // Type assertion for product
    const typedProduct = product as Product | null
    
    if (productError || !typedProduct || !typedProduct.is_active) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      )
    }
    
    if (typedProduct.stock < validated.quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }
    
    // Check if item already exists in cart
    const { data: existingCartItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', validated.productId)
      .single()
    
    // Type assertion for existing cart item
    const typedExistingCartItem = existingCartItem as CartItem | null
    
    let cartItem: CartItemWithProduct | null = null
    
    if (typedExistingCartItem) {
      // Update quantity
      const newQuantity = typedExistingCartItem.quantity + validated.quantity
      
      if (newQuantity > typedProduct.stock) {
        return NextResponse.json(
          { error: 'Total quantity exceeds available stock' },
          { status: 400 }
        )
      }
      
      // Create update object
      const updateData = { 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      }
      
      // @ts-expect-error - Supabase TypeScript issue with update operations
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update(updateData)
        .eq('id', typedExistingCartItem.id)
        .select(`
          *,
          products!inner (*)
        `)
        .single()
      
      if (updateError) {
        console.error('Cart update error:', updateError)
        return NextResponse.json(
          { error: 'Failed to update cart item' },
          { status: 500 }
        )
      }
      
      cartItem = updatedItem as CartItemWithProduct
    } else {
      // Create new cart item
      const insertData = {
        user_id: user.id,
        product_id: validated.productId,
        quantity: validated.quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // @ts-ignore - Supabase TypeScript issue with insert operations
      const { data: newItem, error: createError } = await supabase
        .from('cart_items')
        .insert([insertData])
        .select(`
          *,
          products!inner (*)
        `)
        .single()
      
      if (createError) {
        console.error('Cart creation error:', createError)
        return NextResponse.json(
          { error: 'Failed to add item to cart' },
          { status: 500 }
        )
      }
      
      cartItem = newItem as CartItemWithProduct
    }
    
    return NextResponse.json(cartItem, { status: 201 })
    
  } catch (error) {
    console.error('Cart POST error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
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

export async function DELETE(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 'general')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Get authenticated user
    const user = await requireAuth()
    const supabase = supabaseAdmin
    
    // Clear entire cart
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Cart clear error:', error)
      return NextResponse.json(
        { error: 'Failed to clear cart' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ message: 'Cart cleared successfully' })
    
  } catch (error) {
    console.error('Cart DELETE error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
'''
## src\app\api\auth\callback\route.ts:-
'''
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()  // Fixed: Use createClient() instead of supabaseAdmin
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
'''
## src\app\api\auth\register\route.ts:-
'''
// /src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limiter'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting for auth endpoints
    const rateLimitResult = await checkRateLimit(req, 'auth')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
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
    const validated = registerSchema.parse(body)
    
    const supabase = createClient()
    
    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          name: validated.name,
        },
      },
    })
    
    if (authError) {
      console.error('Auth signup error:', authError)
      
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Get the created user profile (created by database trigger)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
    }
    
    return NextResponse.json({
      message: 'User created successfully. Please check your email to confirm your account.',
      user: profile || {
        id: authData.user.id,
        email: authData.user.email,
        name: validated.name,
        role: 'USER'
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Registration error:', error)
    
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
'''
## src\app\api\auth\signin\route.ts:-
'''
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
'''
## src\app\api\auth\signout\route.ts:-
'''
// /src/app/api/auth/signout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()

    // Sign out user
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Signout error:', error)
      return NextResponse.json(
        { error: 'Failed to sign out' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: 'Signed out successfully' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Signout error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
'''
## src\app\auth\signin\page.tsx:-
'''
'use client'

import { useState } from 'react'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { signIn, user } = useSupabaseAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn(email, password)

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="text-center">
          <Link href="/" className="inline-flex items-center">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
              E
            </div>
            <span className="text-2xl font-bold text-gray-900">EStore</span>
          </Link>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full justify-center"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
'''
## src\app\auth\signup\page.tsx:-
'''
'use client'

import { useState } from 'react'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { signUp, signIn } = useSupabaseAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(formData.email, formData.password, formData.name)

      if (result.error) {
        setError(result.error)
      } else {
        // Try to sign in automatically after signup
        const signInResult = await signIn(formData.email, formData.password)
        
        if (signInResult.error) {
          setSuccess('Account created successfully! Please check your email to verify your account, then sign in.')
        } else {
          router.push('/dashboard')
          router.refresh()
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="text-center">
          <Link href="/" className="inline-flex items-center">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
              E
            </div>
            <span className="text-2xl font-bold text-gray-900">EStore</span>
          </Link>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
              >
                {error}
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm"
              >
                {success}
              </motion.div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-10"
                  placeholder="Create a password (min 6 characters)"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full justify-center"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
'''
## src\lib\supabase\server.ts:-
'''
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './database.types'

export async function createClient() {
  const cookieStore = await cookies()  // cookies() returns a Promise in Next.js 14+

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // Server component cookie setting error - ignore
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch {
            // Server component cookie removal error - ignore
          }
        },
      },
    }
  )
}
'''
## src\lib\auth.ts:-
'''
import { createClient } from './supabase/server'
import { createClient as createBrowserClient } from './supabase/client'
import { z } from 'zod'
import { cache } from 'react'
import { redirect } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export type User = {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  created_at: string
}

export type AuthState = {
  user: User | null
  isLoading: boolean
}

// Server-side auth helpers
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = createClient()
  
  try {
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    
    if (error || !authUser) {
      return null
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      created_at: profile.created_at
    }
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
})

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/signin')
  }
  
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  
  if (user.role !== 'ADMIN') {
    redirect('/')
  }
  
  return user
}

// Client-side auth actions
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient()
  
  try {
    const validated = loginSchema.parse({ email, password })
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'An unexpected error occurred' }
  }
}

export async function signUp(email: string, password: string, name: string) {
  const supabase = createBrowserClient()
  
  try {
    const validated = signupSchema.parse({ email, password, name })
    
    const { data, error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          name: validated.name,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'An unexpected error occurred' }
  }
}

export async function signOut() {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    return { error: error.message }
  }
  
  return { success: true }
}

export async function resetPassword(email: string) {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  
  if (error) {
    return { error: error.message }
  }
  
  return { success: true }
}
'''
## src/lib/hooks/useSupabaseAuth.ts:-
'''
'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { User as AppUser } from '@/lib/auth'

type AuthContextType = {
  user: AppUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchUserProfile = async (authUser: User): Promise<AppUser | null> => {
    try {
      console.log('Fetching profile for auth user:', authUser.id, authUser.email)
      
      // First, try to get the existing profile
      let { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // Row not found
          console.log('Profile not found for user:', authUser.id, '- Creating new profile...')
          
          // Create the profile
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email!,
              name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
              role: 'USER'
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creating user profile:', createError)
            // If insert fails, maybe it exists but with wrong permissions, try upsert
            const { data: upsertProfile, error: upsertError } = await supabase
              .from('users')
              .upsert({
                id: authUser.id,
                email: authUser.email!,
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                role: 'USER'
              })
              .select()
              .single()
            
            if (upsertError) {
              console.error('Error upserting user profile:', upsertError)
              // Last resort: return a basic user object
              return {
                id: authUser.id,
                email: authUser.email!,
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                role: 'USER' as const,
                created_at: authUser.created_at
              }
            }
            
            profile = upsertProfile
          } else {
            profile = newProfile
          }
        } else {
          console.error('Error fetching user profile:', error)
          // Return basic user object as fallback
          return {
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            role: 'USER' as const,
            created_at: authUser.created_at
          }
        }
      }

      if (!profile) {
        console.error('Profile is null for user:', authUser.id)
        return {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          role: 'USER' as const,
          created_at: authUser.created_at
        }
      }

      console.log('Successfully fetched/created profile:', profile)
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        created_at: profile.created_at
      }
    } catch (error) {
      console.error('Unexpected error in fetchUserProfile:', error)
      // Return basic user object as ultimate fallback
      return {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        role: 'USER' as const,
        created_at: authUser.created_at
      }
    }
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setUser(null)
        } else if (session?.user) {
          console.log('Found session for user:', session.user.id, session.user.email)
          const userProfile = await fetchUserProfile(session.user)
          setUser(userProfile)
        } else {
          console.log('No active session found')
          setUser(null)
        }
      } catch (error) {
        console.error('Error in getSession:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user)
          setUser(userProfile)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        return { error: error.message }
      }

      console.log('Sign in successful for:', data.user?.id, data.user?.email)
      return {}
    } catch (error) {
      console.error('Unexpected sign in error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting to sign up:', email, name)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })

      if (error) {
        console.error('Sign up error:', error)
        return { error: error.message }
      }

      console.log('Sign up successful for:', data.user?.id, data.user?.email)
      
      // Ensure profile is created immediately
      if (data.user) {
        const profile = await fetchUserProfile(data.user)
        if (profile) {
          console.log('Profile created/verified for new user')
        }
      }

      return {}
    } catch (error) {
      console.error('Unexpected sign up error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    console.log('Signing out...')
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within an AuthProvider')
  }
  return context
}
'''
## src/lib/supabase/database.types.ts:-
'''
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'USER' | 'ADMIN'
          email_verified: string | null
          image: string | null
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'USER' | 'ADMIN'
          email_verified?: string | null
          image?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'USER' | 'ADMIN'
          email_verified?: string | null
          image?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: string
          stock: number
          sku: string | null
          category: string
          brand: string | null
          images: string[]
          featured: boolean
          slug: string
          meta_title: string | null
          meta_description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: string
          stock?: number
          sku?: string | null
          category: string
          brand?: string | null
          images?: string[]
          featured?: boolean
          slug: string
          meta_title?: string | null
          meta_description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: string
          stock?: number
          sku?: string | null
          category?: string
          brand?: string | null
          images?: string[]
          featured?: boolean
          slug?: string
          meta_title?: string | null
          meta_description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
          total_amount: string
          payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          payment_method: string | null
          payment_id: string | null
          shipping_address: string
          shipping_city: string
          shipping_postal: string
          shipping_country: string
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
          total_amount: string
          payment_status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          payment_method?: string | null
          payment_id?: string | null
          shipping_address: string
          shipping_city: string
          shipping_postal: string
          shipping_country: string
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
          total_amount?: string
          payment_status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          payment_method?: string | null
          payment_id?: string | null
          shipping_address?: string
          shipping_city?: string
          shipping_postal?: string
          shipping_country?: string
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: 'USER' | 'ADMIN'
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      get_cart_total: {
        Args: { user_id: string }
        Returns: string
      }
      get_cart_count: {
        Args: { user_id: string }
        Returns: number
      }
      get_product_rating: {
        Args: { product_id: string }
        Returns: string
      }
      get_product_review_count: {
        Args: { product_id: string }
        Returns: number
      }
    }
    Enums: {
      user_role: 'USER' | 'ADMIN'
      order_status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
      payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
    }
  }
}
'''
## :-
'''

'''
