'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export default function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const { user, loading } = useSupabaseAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Electronics', href: '/products?category=Electronics' },
    { name: 'Clothing', href: '/products?category=Clothing' },
    { name: 'Home & Garden', href: '/products?category=Home & Garden' },
    { name: 'Sports', href: '/products?category=Sports' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search parameter
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="hidden sm:block font-bold text-xl text-slate-900">EStore</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-slate-700 hover:text-sky-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="p-2 text-slate-700 hover:text-sky-600"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Cart Icon */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              animate={cartItemCount > 0 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
              onClick={onCartClick}
              className="relative p-2 text-slate-700 hover:text-sky-600"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </motion.span>
              )}
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 text-slate-700 hover:text-sky-600 px-3 py-2 text-sm font-medium"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="hidden lg:inline">{user.name || 'Profile'}</span>
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    href="/auth/signin"
                    className="text-slate-700 hover:text-sky-600 px-3 py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-sky-600"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-200"
            >
              <div className="p-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 md:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold text-slate-900">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-slate-500 hover:text-slate-700"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Categories</h3>
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-slate-700 hover:text-sky-600 py-2 text-base font-medium"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                {/* Auth Links */}
                <div className="border-t border-slate-200 pt-6">
                  {user ? (
                    <div className="space-y-4">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-slate-700 hover:text-sky-600 py-2 text-base font-medium"
                      >
                        <UserIcon className="w-5 h-5" />
                        <span>My Account</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/auth/signin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-lg text-base font-medium transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center border border-sky-500 text-sky-500 hover:bg-sky-50 px-4 py-3 rounded-lg text-base font-medium transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}