import HeroCarousel from '@/components/amazon/HeroCarousel'
import CategoryGrid from '@/components/amazon/CategoryGrid'
import ProductCarousel from '@/components/amazon/ProductCarousel'

// Category data
const fashionCategories = [
  {
    name: 'Dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    link: '/products?category=dresses'
  },
  {
    name: 'Handbags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    link: '/products?category=handbags'
  },
  {
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
    link: '/products?category=shoes'
  },
  {
    name: 'Tops',
    image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&h=400&fit=crop',
    link: '/products?category=tops'
  }
]

const homeCategories = [
  {
    name: 'Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    link: '/products?category=furniture'
  },
  {
    name: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop',
    link: '/products?category=kitchen'
  },
  {
    name: 'Bedding',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop',
    link: '/products?category=bedding'
  },
  {
    name: 'Decor',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop',
    link: '/products?category=decor'
  }
]

const electronicsCategories = [
  {
    name: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    link: '/products?category=laptops'
  },
  {
    name: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    link: '/products?category=headphones'
  },
  {
    name: 'Cameras',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    link: '/products?category=cameras'
  },
  {
    name: 'Smart Watches',
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
    link: '/products?category=smartwatches'
  }
]

const toyCategories = [
  {
    name: 'Action Figures',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=400&fit=crop',
    link: '/products?category=action-figures'
  },
  {
    name: 'Educational',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
    link: '/products?category=educational-toys'
  },
  {
    name: 'Board Games',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=400&fit=crop',
    link: '/products?category=board-games'
  },
  {
    name: 'Outdoor Play',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop',
    link: '/products?category=outdoor-toys'
  }
]

// Product data for carousels
const electronicsProducts = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones with Noise Cancellation',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 1247
  },
  {
    id: '2',
    title: 'Smart Fitness Watch with Heart Rate Monitor',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=300&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 2156
  },
  {
    id: '3',
    title: 'Wireless Gaming Mouse RGB',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 892
  },
  {
    id: '4',
    title: 'Portable Bluetooth Speaker Waterproof',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 1567
  },
  {
    id: '5',
    title: '4K Webcam for Streaming and Video Calls',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=300&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 634
  },
  {
    id: '6',
    title: 'Mechanical Gaming Keyboard RGB Backlit',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 2341
  }
]

const homeProducts = [
  {
    id: '7',
    title: 'Ceramic Plant Pot Set of 3',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop',
    rating: 4.2,
    reviewCount: 567
  },
  {
    id: '8',
    title: 'LED Desk Lamp Adjustable',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 654
  },
  {
    id: '9',
    title: 'Stainless Steel Water Bottle 32oz',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 1892
  },
  {
    id: '10',
    title: 'Memory Foam Pillow Set of 2',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 1234
  },
  {
    id: '11',
    title: 'Luxury Bath Towel Set 6 Piece',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=300&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 987
  },
  {
    id: '12',
    title: 'Non-Stick Cookware Set 10 Piece',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 756
  }
]

const clothingProducts = [
  {
    id: '13',
    title: 'Premium Cotton T-Shirt Pack of 3',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 834
  },
  {
    id: '14',
    title: 'Stylish Denim Jacket',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882be2?w=300&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 312
  },
  {
    id: '15',
    title: 'Running Shoes Lightweight',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 1456
  },
  {
    id: '16',
    title: 'Leather Crossbody Bag',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 623
  },
  {
    id: '17',
    title: 'Winter Wool Scarf',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=300&fit=crop',
    rating: 4.2,
    reviewCount: 445
  },
  {
    id: '18',
    title: 'Classic Sunglasses UV Protection',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 1123
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Carousel */}
      <div className="relative -mt-16">
        <HeroCarousel />
      </div>

      {/* Category Grids Section */}
      <div className="max-w-[1500px] mx-auto px-4 -mt-64 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <CategoryGrid
            title="Premium fall fashion"
            categories={fashionCategories}
            footerLink={{ text: 'Shop now', href: '/products?category=fashion' }}
          />
          <CategoryGrid
            title="Home essentials"
            categories={homeCategories}
            footerLink={{ text: 'Discover more', href: '/products?category=home' }}
          />
          <CategoryGrid
            title="Electronics deals"
            categories={electronicsCategories}
            footerLink={{ text: 'See all electronics', href: '/products?category=electronics' }}
          />
          <CategoryGrid
            title="Toys & Games"
            categories={toyCategories}
            footerLink={{ text: 'Shop toys', href: '/products?category=toys' }}
          />
        </div>

        {/* Product Carousels */}
        <div className="space-y-6">
          <ProductCarousel
            title="Best Sellers in Electronics"
            products={electronicsProducts}
            viewAllLink="/products?category=electronics&sort=bestselling"
          />
          
          <ProductCarousel
            title="Best Sellers in Home & Kitchen"
            products={homeProducts}
            viewAllLink="/products?category=home&sort=bestselling"
          />
          
          <ProductCarousel
            title="Best Sellers in Clothing, Shoes & Jewelry"
            products={clothingProducts}
            viewAllLink="/products?category=clothing&sort=bestselling"
          />
        </div>
      </div>

      {/* Extra spacing */}
      <div className="h-12"></div>
    </div>
  )
}
