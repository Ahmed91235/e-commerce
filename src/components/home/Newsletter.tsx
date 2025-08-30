'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { EnvelopeIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      // TODO: Implement actual newsletter subscription
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubscribed(true)
      setEmail('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubscribed) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Thank you for subscribing!
            </h2>
            <p className="text-lg text-neutral-600">
              You&apos;ll receive exclusive offers and updates in your inbox soon.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <EnvelopeIcon className="w-8 h-8 text-primary-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Subscribe to our newsletter
          </h2>
          
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new products, exclusive offers, and upcoming sales. 
            Join thousands of satisfied customers who never miss a deal.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-2 whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </form>

          <p className="text-xs text-neutral-500 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </motion.div>
      </div>
    </section>
  )
}