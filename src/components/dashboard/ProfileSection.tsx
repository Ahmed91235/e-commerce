'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User } from '@/lib/auth'
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CameraIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'

interface ProfileSectionProps {
  user?: User
}

interface ProfileData {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  bio: string
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    bio: ''
  })

  const [originalData, setOriginalData] = useState<ProfileData>(profileData)

  useEffect(() => {
    // Initialize with user data
    const initialData = {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      dateOfBirth: '',
      bio: ''
    }
    setProfileData(initialData)
    setOriginalData(initialData)
  }, [user])

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - restore original data
      setProfileData(originalData)
    }
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update original data to current data
      setOriginalData(profileData)
      setIsEditing(false)
      
      // You would make an actual API call here:
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // })
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalData)

  return (
    <div className="p-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <motion.div
            className="p-3 bg-blue-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            <UserCircleIcon className="h-6 w-6 text-blue-600" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            <p className="text-gray-600">Update your personal details and information</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {isEditing && (
            <Button
              variant="outline"
              onClick={handleEditToggle}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          
          {isEditing ? (
            <Button
              onClick={handleSave}
              disabled={!hasChanges || loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          ) : (
            <Button onClick={handleEditToggle}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-6">
          <div className="relative">
            <motion.div
              className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </motion.div>
            
            {isEditing && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-md"
              >
                <CameraIcon className="h-4 w-4" />
              </motion.button>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {profileData.name || 'User'}
            </h3>
            <p className="text-gray-600">{profileData.email}</p>
            {isEditing && (
              <p className="text-sm text-blue-600 mt-1">
                Click the camera icon to change your profile picture
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Left Column */}
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserCircleIcon className="h-4 w-4 inline mr-1" />
              Full Name
            </label>
            <Input
              type="text"
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your full name"
              className={clsx(
                !isEditing && 'bg-gray-50 cursor-not-allowed'
              )}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <EnvelopeIcon className="h-4 w-4 inline mr-1" />
              Email Address
            </label>
            <Input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your email"
              className={clsx(
                !isEditing && 'bg-gray-50 cursor-not-allowed'
              )}
            />
            {!isEditing && (
              <p className="text-xs text-gray-500 mt-1">
                Email changes require verification
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <PhoneIcon className="h-4 w-4 inline mr-1" />
              Phone Number
            </label>
            <Input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your phone number"
              className={clsx(
                !isEditing && 'bg-gray-50 cursor-not-allowed'
              )}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Date of Birth Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Date of Birth
            </label>
            <Input
              type="date"
              value={profileData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              disabled={!isEditing}
              className={clsx(
                !isEditing && 'bg-gray-50 cursor-not-allowed'
              )}
            />
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              rows={4}
              className={clsx(
                'w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'disabled:bg-gray-50 disabled:cursor-not-allowed',
                !isEditing && 'bg-gray-50 cursor-not-allowed'
              )}
            />
          </div>
        </div>
      </motion.div>

      {/* Account Stats */}
      {!isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 pt-8 border-t border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700">Total Orders</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">$2,450</div>
              <div className="text-sm text-green-700">Total Spent</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-purple-700">Wishlist Items</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}