import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limiter'
import type { Database } from '@/lib/supabase/database.types'

// Type definitions
type Product = Database['public']['Tables']['products']['Row']
type ProductUpdate = Database['public']['Tables']['products']['Update']

const productUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  stock: z.number().min(0).optional(),
  sku: z.string().optional(),
  category: z.string().min(1).optional(),
  brand: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  featured: z.boolean().optional(),
  slug: z.string().min(1).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean().optional()
})

export async function GET(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 'general')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const params = await paramsPromise
    const supabase = await createClient()
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        reviews (
          id,
          rating,
          comment,
          created_at,
          users (
            id,
            name
          )
        )
      `)
      .eq('id', params.id)
      .single()
    
    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Type the product with reviews
    type ProductWithReviews = Product & { 
      reviews?: Array<{ 
        id: string
        rating: number
        comment: string | null
        created_at: string
        users?: { id: string; name: string }
      }> 
    }
    const typedProduct = product as ProductWithReviews
    
    // Calculate average rating
    const averageRating = typedProduct.reviews && typedProduct.reviews.length > 0
      ? typedProduct.reviews.reduce((sum, review) => sum + review.rating, 0) / typedProduct.reviews.length
      : 0
    
    const productWithRating = {
      ...typedProduct,
      averageRating,
      reviewCount: typedProduct.reviews?.length || 0
    }
    
    return NextResponse.json(productWithRating)
    
  } catch (error) {
    console.error('Product GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 'general')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Check admin authentication
    await requireAdmin()

    const params = await paramsPromise
    const body = await req.json()
    const validated = productUpdateSchema.parse(body)
    
    const supabase = await createClient()
    
    // Check if product exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id, slug')
      .eq('id', params.id)
      .single()
    
    const typedExistingProduct = existingProduct as Pick<Product, 'id' | 'slug'> | null
    
    if (!typedExistingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Check if slug is unique (if being updated)
    if (validated.slug && validated.slug !== typedExistingProduct.slug) {
      const { data: slugExists } = await supabase
        .from('products')
        .select('id')
        .eq('slug', validated.slug)
        .single()
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'Product with this slug already exists' },
          { status: 400 }
        )
      }
    }
    
    // Map camelCase to snake_case for database
    const updateData: ProductUpdate = {}
    if (validated.name !== undefined) updateData.name = validated.name
    if (validated.description !== undefined) updateData.description = validated.description
    if (validated.price !== undefined) updateData.price = validated.price.toString()
    if (validated.stock !== undefined) updateData.stock = validated.stock
    if (validated.sku !== undefined) updateData.sku = validated.sku
    if (validated.category !== undefined) updateData.category = validated.category
    if (validated.brand !== undefined) updateData.brand = validated.brand
    if (validated.images !== undefined) updateData.images = validated.images
    if (validated.featured !== undefined) updateData.featured = validated.featured
    if (validated.slug !== undefined) updateData.slug = validated.slug
    if (validated.metaTitle !== undefined) updateData.meta_title = validated.metaTitle
    if (validated.metaDescription !== undefined) updateData.meta_description = validated.metaDescription
    if (validated.isActive !== undefined) updateData.is_active = validated.isActive
    
    // Update product
    
    const { data: product, error: updateError } = await supabase
      .from('products')
      // @ts-expect-error - Known Supabase TypeScript issue with update operations
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Product update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(product)
    
  } catch (error) {
    console.error('Product PUT error:', error)
    
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

export async function DELETE(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 'general')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Check admin authentication
    await requireAdmin()

    const params = await paramsPromise
    const supabase = await createClient()
    
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('id', params.id)
      .single()
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Soft delete by setting is_active to false
    
    const { error: deleteError } = await supabase
      .from('products')
      // @ts-expect-error - Known Supabase TypeScript issue with update operations
      .update({ is_active: false })
      .eq('id', params.id)
    
    if (deleteError) {
      console.error('Product delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' })
    
  } catch (error) {
    console.error('Product DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}