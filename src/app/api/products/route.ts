import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limiter'
import type { Database } from '@/lib/supabase/database.types'

// Type definitions
type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type Review = Database['public']['Tables']['reviews']['Row']

// Validation schemas
const productCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().min(0).default(0),
  sku: z.string().optional(),
  category: z.string().min(1),
  brand: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  slug: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean().default(true)
})

const productQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  category: z.string().optional(),
  brand: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().default(true),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 'general')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(req.url)
    const query = productQuerySchema.parse(Object.fromEntries(searchParams))
    
    const supabase = await createClient()
    
    // Build query
    let productQuery = supabase
      .from('products')
      .select(`
        *,
        reviews!inner(rating)
      `)
      .eq('is_active', query.isActive)
    
    // Apply filters
    if (query.category) {
      productQuery = productQuery.eq('category', query.category)
    }
    if (query.brand) {
      productQuery = productQuery.eq('brand', query.brand)
    }
    if (query.featured !== undefined) {
      productQuery = productQuery.eq('featured', query.featured)
    }
    if (query.search) {
      productQuery = productQuery.or(`name.ilike.%${query.search}%,description.ilike.%${query.search}%,category.ilike.%${query.search}%`)
    }
    
    // Apply sorting
    const sortColumn = query.sortBy === 'createdAt' ? 'created_at' : query.sortBy
    productQuery = productQuery.order(sortColumn, { ascending: query.sortOrder === 'asc' })
    
    // Apply pagination
    const from = (query.page - 1) * query.limit
    const to = from + query.limit - 1
    productQuery = productQuery.range(from, to)
    
    const { data: products, error: productsError, count } = await productQuery
    
    if (productsError) {
      console.error('Products query error:', productsError)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }
    
    // Type the products with reviews
    type ProductWithReviews = Product & { reviews?: { rating: number }[] }
    const typedProducts = products as ProductWithReviews[] | null
    
    // Calculate average rating for each product
    const productsWithRating = (typedProducts || []).map((product: ProductWithReviews) => {
      const ratings = product.reviews?.map((r: { rating: number }) => r.rating) || []
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
        : 0
      
      return {
        ...product,
        averageRating,
        reviewCount: ratings.length,
        reviews: undefined // Remove reviews from response
      }
    })
    
    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / query.limit)
      }
    })
    
  } catch (error) {
    console.error('Products GET error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting for product creation
    const rateLimitResult = await checkRateLimit(req, 'general')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Check admin authentication
    await requireAdmin()

    const body = await req.json()
    const validated = productCreateSchema.parse(body)
    
    const supabase = await createClient()
    
    // Check if slug already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('slug', validated.slug)
      .single()
    
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }
    
    // Map camelCase to snake_case for database
    const productData: ProductInsert = {
      name: validated.name,
      description: validated.description,
      price: validated.price.toString(),
      stock: validated.stock,
      sku: validated.sku,
      category: validated.category,
      brand: validated.brand,
      images: validated.images,
      featured: validated.featured,
      slug: validated.slug,
      meta_title: validated.metaTitle,
      meta_description: validated.metaDescription,
      is_active: validated.isActive
    }
    
    // Create product
    
    const { data: product, error: createError } = await supabase
      .from('products')
      // @ts-expect-error - Known Supabase TypeScript issue with insert operations
      .insert([productData])
      .select()
      .single()
    
    if (createError) {
      console.error('Product creation error:', createError)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(product, { status: 201 })
    
  } catch (error) {
    console.error('Products POST error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}