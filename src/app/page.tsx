import HeroBanner from '@/components/home/HeroBanner'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import ProductSection from '@/components/home/ProductSection'
import Newsletter from '@/components/home/Newsletter'

// Mock data for products - in real app, this would come from API/database
const bestSellingProducts = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviewCount: 1247,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center',
    category: 'Electronics'
  },
  {
    id: '2',
    title: 'Premium Cotton T-Shirt',
    price: 24.99,
    rating: 4.3,
    reviewCount: 834,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center',
    category: 'Clothing'
  },
  {
    id: '3',
    title: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviewCount: 2156,
    imageUrl: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=500&fit=crop&crop=center',
    category: 'Electronics'
  },
  {
    id: '4',
    title: 'Ceramic Plant Pot Set',
    price: 34.99,
    rating: 4.2,
    reviewCount: 567,
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop&crop=center',
    category: 'Home & Garden'
  }
]

const newArrivals = [
  {
    id: '5',
    title: 'Wireless Gaming Mouse',
    price: 79.99,
    rating: 4.6,
    reviewCount: 423,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&crop=center',
    category: 'Electronics'
  },
  {
    id: '6',
    title: 'Stylish Denim Jacket',
    price: 69.99,
    originalPrice: 89.99,
    rating: 4.4,
    reviewCount: 312,
    imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882be2?w=500&h=500&fit=crop&crop=center',
    category: 'Clothing'
  },
  {
    id: '7',
    title: 'Yoga Mat with Carrying Strap',
    price: 29.99,
    rating: 4.5,
    reviewCount: 789,
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop&crop=center',
    category: 'Sports'
  },
  {
    id: '8',
    title: 'LED Desk Lamp',
    price: 49.99,
    rating: 4.3,
    reviewCount: 654,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop&crop=center',
    category: 'Home & Garden'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <FeaturedCategories />
      <ProductSection
        title="Best Selling Products"
        description="Discover our most popular items loved by customers worldwide"
        products={bestSellingProducts}
        viewAllLink="/products?sort=bestselling"
        isFeatured={true}
        className="bg-white"
      />
      <ProductSection
        title="New Arrivals"
        description="Check out the latest additions to our collection"
        products={newArrivals}
        viewAllLink="/products?sort=newest"
        className="bg-neutral-50"
      />
      <Newsletter />
    </div>
  )
}
