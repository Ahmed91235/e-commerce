import { createClient } from './supabase/server'
import { createClient as createBrowserClient } from './supabase/client'
import { z } from 'zod'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import type { Database } from './supabase/database.types'

// Type for the user row from database
type UserRow = Database['public']['Tables']['users']['Row']

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
  const supabase = await createClient()
  
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

    // Type the profile properly
    const typedProfile = profile as UserRow

    return {
      id: typedProfile.id,
      email: typedProfile.email,
      name: typedProfile.name,
      role: typedProfile.role,
      created_at: typedProfile.created_at
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
      return { error: error.issues[0].message }
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
      return { error: error.issues[0].message }
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