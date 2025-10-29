'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MagnifyingGlassIcon, ShoppingCartIcon, MapPinIcon, Bars3Icon } from '@heroicons/react/24/outline'

export default function AmazonHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Departments')

  return (
    <header className="bg-[#131921] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:border border-white p-1">
          <div className="text-2xl font-bold">
            <span className="text-white">amazon</span>
            <span className="text-[#FF9900] text-sm">.com</span>
          </div>
        </Link>

        {/* Delivery Location */}
        <div className="hidden md:flex items-center hover:border border-white p-1 cursor-pointer">
          <MapPinIcon className="h-5 w-5 mr-1" />
          <div className="text-xs">
            <div className="text-gray-300">Deliver to</div>
            <div className="font-bold">Phoenix 85036</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl">
          <div className="flex items-center">
            {/* Category Dropdown */}
            <select 
              className="bg-gray-200 text-gray-900 text-sm px-2 py-2 rounded-l-md border-r border-gray-300 focus:outline-none hidden sm:block"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Departments</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Books</option>
              <option>Home & Kitchen</option>
              <option>Beauty</option>
              <option>Sports</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search Amazon"
              className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Search Button */}
            <button className="bg-[#FEBD69] hover:bg-[#FF9900] px-4 py-2 rounded-r-md">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-900" />
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="hidden lg:flex items-center hover:border border-white p-2 cursor-pointer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg" alt="US Flag" className="w-6 h-4 mr-1" />
          <span className="text-sm font-bold">EN</span>
        </div>

        {/* Account & Lists */}
        <div className="hidden md:flex flex-col hover:border border-white p-1 cursor-pointer">
          <div className="text-xs">Hello, sign in</div>
          <div className="text-sm font-bold">Account & Lists</div>
        </div>

        {/* Returns & Orders */}
        <div className="hidden lg:flex flex-col hover:border border-white p-1 cursor-pointer">
          <div className="text-xs">Returns</div>
          <div className="text-sm font-bold">& Orders</div>
        </div>

        {/* Cart */}
        <Link href="/cart" className="flex items-center hover:border border-white p-1 relative">
          <div className="relative">
            <ShoppingCartIcon className="h-8 w-8" />
            <span className="absolute -top-1 left-5 bg-[#FF9900] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </div>
          <span className="ml-1 font-bold hidden sm:inline">Cart</span>
        </Link>
      </div>
    </header>
  )
}
