'use client'

import { Bars3Icon } from '@heroicons/react/24/outline'

export default function AmazonNavBar() {
  const navItems = [
    'Amazon Haul',
    'Medical Care',
    'Luxury',
    'Best Sellers',
    'Amazon Basics',
    'New Releases',
    'Registry',
    "Today's Deals",
    'Gift Cards',
    'Smart Home',
    'Prime',
    'Groceries',
    'Customer Service',
    'Sports & Outdoors',
    'Music',
    'Pharmacy',
    'Shop By Interest',
    'Amazon Home',
    'Fashion',
    'Sell',
  ]

  return (
    <nav className="bg-[#232F3E] text-white px-4 py-2">
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
        {/* All Menu Button */}
        <button className="flex items-center gap-1 hover:border border-white px-2 py-1 whitespace-nowrap font-bold">
          <Bars3Icon className="h-5 w-5" />
          <span>All</span>
        </button>

        {/* Nav Links */}
        {navItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className="hover:border border-white px-2 py-1 whitespace-nowrap text-sm"
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  )
}
