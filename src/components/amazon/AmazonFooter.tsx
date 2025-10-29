import Link from 'next/link'

export default function AmazonFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-white">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-white text-sm py-3"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="bg-[#232F3E] text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Get to Know Us */}
            <div>
              <h3 className="font-bold mb-3">Get to Know Us</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:underline">Careers</Link></li>
                <li><Link href="#" className="hover:underline">Amazon Newsletter</Link></li>
                <li><Link href="#" className="hover:underline">About Amazon</Link></li>
                <li><Link href="#" className="hover:underline">Accessibility</Link></li>
                <li><Link href="#" className="hover:underline">Sustainability</Link></li>
                <li><Link href="#" className="hover:underline">Press Center</Link></li>
                <li><Link href="#" className="hover:underline">Investor Relations</Link></li>
                <li><Link href="#" className="hover:underline">Amazon Devices</Link></li>
                <li><Link href="#" className="hover:underline">Amazon Science</Link></li>
              </ul>
            </div>

            {/* Make Money with Us */}
            <div>
              <h3 className="font-bold mb-3">Make Money with Us</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:underline">Sell on Amazon</Link></li>
                <li><Link href="#" className="hover:underline">Sell apps on Amazon</Link></li>
                <li><Link href="#" className="hover:underline">Supply to Amazon</Link></li>
                <li><Link href="#" className="hover:underline">Protect & Build Your Brand</Link></li>
                <li><Link href="#" className="hover:underline">Become an Affiliate</Link></li>
                <li><Link href="#" className="hover:underline">Become a Delivery Driver</Link></li>
                <li><Link href="#" className="hover:underline">Start a Package Delivery Business</Link></li>
                <li><Link href="#" className="hover:underline">Advertise Your Products</Link></li>
                <li><Link href="#" className="hover:underline">Self-Publish with Us</Link></li>
              </ul>
            </div>

            {/* Amazon Payment Products */}
            <div>
              <h3 className="font-bold mb-3">Amazon Payment Products</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:underline">Amazon Visa</Link></li>
                <li><Link href="#" className="hover:underline">Amazon Store Card</Link></li>
                <li><Link href="#" className="hover:underline">Amazon Secured Card</Link></li>
                <li><Link href="#" className="hover:underline">Amazon Business Card</Link></li>
                <li><Link href="#" className="hover:underline">Shop with Points</Link></li>
                <li><Link href="#" className="hover:underline">Credit Card Marketplace</Link></li>
                <li><Link href="#" className="hover:underline">Reload Your Balance</Link></li>
                <li><Link href="#" className="hover:underline">Gift Cards</Link></li>
                <li><Link href="#" className="hover:underline">Amazon Currency Converter</Link></li>
              </ul>
            </div>

            {/* Let Us Help You */}
            <div>
              <h3 className="font-bold mb-3">Let Us Help You</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:underline">Your Account</Link></li>
                <li><Link href="#" className="hover:underline">Your Orders</Link></li>
                <li><Link href="#" className="hover:underline">Shipping Rates & Policies</Link></li>
                <li><Link href="#" className="hover:underline">Amazon Prime</Link></li>
                <li><Link href="#" className="hover:underline">Returns & Replacements</Link></li>
                <li><Link href="#" className="hover:underline">Manage Your Content and Devices</Link></li>
                <li><Link href="#" className="hover:underline">Recalls and Product Safety Alerts</Link></li>
                <li><Link href="#" className="hover:underline">Registry & Gift List</Link></li>
                <li><Link href="#" className="hover:underline">Help</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#131A22] text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold">
              <span className="text-white">amazon</span>
              <span className="text-[#FF9900] text-sm">.com</span>
            </Link>

            {/* Language */}
            <button className="flex items-center gap-2 border border-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-800">
              <span>🌐</span>
              <span>English</span>
            </button>

            {/* Currency */}
            <button className="flex items-center gap-2 border border-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-800">
              <span>$</span>
              <span>USD - U.S. Dollar</span>
            </button>

            {/* Country */}
            <button className="flex items-center gap-2 border border-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-800">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg" alt="US" className="w-5 h-3" />
              <span>United States</span>
            </button>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-400 mt-6">
            <p>© 1996-2025, Amazon.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
