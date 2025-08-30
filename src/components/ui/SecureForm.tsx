'use client'

import { ReactNode, FormEvent } from 'react'
import { sanitizeInput, generateCSRFToken } from '@/lib/security'

interface SecureFormProps {
  children: ReactNode
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  className?: string
}

/**
 * Secure form component with built-in CSRF protection and input sanitization
 */
export function SecureForm({ children, onSubmit, className = '' }: SecureFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Get form data
    const formData = new FormData(event.currentTarget)
    const sanitizedData = new FormData()
    
    // Sanitize all form inputs
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        sanitizedData.append(key, sanitizeInput(value))
      } else {
        sanitizedData.append(key, value)
      }
    }
    
    // Add CSRF token
    sanitizedData.append('_csrf', generateCSRFToken())
    
    onSubmit(event)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  )
}

interface SecureInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  name: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  className?: string
  disabled?: boolean
}

/**
 * Secure input component with automatic validation and sanitization
 */
export function SecureInput({ 
  type = 'text', 
  name, 
  value = '', 
  onChange, 
  placeholder, 
  required = false,
  minLength,
  maxLength = 1000,
  className = '',
  disabled = false
}: SecureInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(event.target.value)
    onChange?.(sanitized)
  }

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      disabled={disabled}
      className={`${className} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
    />
  )
}

interface SecureTextareaProps {
  name: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  rows?: number
  className?: string
  disabled?: boolean
}

/**
 * Secure textarea component with automatic validation and sanitization
 */
export function SecureTextarea({ 
  name, 
  value = '', 
  onChange, 
  placeholder, 
  required = false,
  minLength,
  maxLength = 5000,
  rows = 4,
  className = '',
  disabled = false
}: SecureTextareaProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitized = sanitizeInput(event.target.value)
    onChange?.(sanitized)
  }

  return (
    <textarea
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      rows={rows}
      disabled={disabled}
      className={`${className} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
    />
  )
}