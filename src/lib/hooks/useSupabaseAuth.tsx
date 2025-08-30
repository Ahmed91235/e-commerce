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