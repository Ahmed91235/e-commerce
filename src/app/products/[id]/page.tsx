import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import { Metadata } from 'next'

interface ProductData {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: string
  rating: number
  reviews: number
  stock: number
  discount?: number
  brand: string
  specifications: Array<{ label: string; value: string }>
  features: string[]
  featured?: boolean
  inStock: boolean
  stockCount: number
}

// Mock product data - would come from API/database
const mockProductData: Record<string, ProductData> = {
  '1': {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 89.99,
    originalPrice: 129.99,
    description: 'Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort padding for all-day listening.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&crop=center',
    ],
    category: 'Electronics',
    rating: 4.5,
    reviews: 1247,
    featured: true,
    discount: 31,
    inStock: true,
    stock: 15,
    stockCount: 15,
    brand: 'AudioTech',
    specifications: [
      { label: 'Brand', value: 'AudioTech' },
      { label: 'Connectivity', value: 'Bluetooth 5.2' },
      { label: 'Battery Life', value: '30 hours' },
      { label: 'Noise Cancellation', value: 'Active ANC' },
      { label: 'Weight', value: '250g' },
      { label: 'Warranty', value: '2 years' },
    ],
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Quick charge (15 min = 3 hours)',
      'Premium comfort padding',
      'Touch controls',
      'Voice assistant support',
    ]
  },
  '2': {
    id: '2',
    name: 'Premium Cotton T-Shirt',
    price: 24.99,
    description: 'Made from 100% organic cotton, this premium t-shirt offers exceptional comfort and durability. Perfect for casual wear with a modern fit.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop&crop=center',
    ],
    category: 'Clothing',
    rating: 4.3,
    reviews: 834,
    featured: true,
    inStock: true,
    stock: 42,
    stockCount: 42,
    brand: 'EcoFashion',
    specifications: [
      { label: 'Material', value: '100% Organic Cotton' },
      { label: 'Fit', value: 'Modern Slim' },
      { label: 'Care', value: 'Machine washable' },
      { label: 'Origin', value: 'Made in Portugal' },
    ],
    features: [
      '100% organic cotton',
      'Pre-shrunk fabric',
      'Reinforced seams',
      'Tagless comfort',
      'Modern slim fit',
    ]
  },
  '3': {
    id: '3',
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life. Perfect for serious athletes and fitness enthusiasts.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop&crop=center',
    ],
    category: 'Electronics',
    rating: 4.7,
    reviews: 2156,
    featured: true,
    discount: 20,
    inStock: true,
    stock: 8,
    stockCount: 8,
    brand: 'FitTech',
    specifications: [
      { label: 'Display', value: '1.4" AMOLED' },
      { label: 'Battery', value: '7 days typical use' },
      { label: 'Water Resistance', value: '5ATM' },
      { label: 'GPS', value: 'Built-in GPS/GLONASS' },
      { label: 'Sensors', value: 'Heart rate, SpO2, Accelerometer' },
    ],
    features: [
      'Built-in GPS tracking',
      'Heart rate monitoring',
      'Sleep tracking',
      'Waterproof design',
      '100+ sport modes',
      'Smart notifications',
    ]
  }
}

interface ProductPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = mockProductData[params.id]
  
  if (!product) {
    return {
      title: 'Product Not Found - EStore'
    }
  }

  return {
    title: `${product.name} - EStore`,
    description: product.description,
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProductData[params.id]

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}