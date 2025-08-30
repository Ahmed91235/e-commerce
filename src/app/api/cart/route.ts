import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limiter'
import type { Database } from '@/lib/supabase/database.types'

// Use the Database types directly
type CartItem = Database['public']['Tables']['cart_items']['Row']
type Product = Database['public']['Tables']['products']['Row']
type CartItemInsert = Database['public']['Tables']['cart_items']['Insert']
type CartItemUpdate = Database['public']['Tables']['cart_items']['Update']

// Type for cart item with joined product
type CartItemWithProduct = CartItem & {
  products: Product
}

const cartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().min(1).max(10)
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

    // Get authenticated user
    const user = await requireAuth()
    const supabase = await createClient()
    
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products!inner (*)
      `)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Cart query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cart items' },
        { status: 500 }
      )
    }
    
    // Type assertion for cart items with products
    const typedCartItems = cartItems as CartItemWithProduct[] | null
    
    // Calculate cart totals
    const subtotal = (typedCartItems || []).reduce((total, item) => {
      return total + (Number(item.products.price) * item.quantity)
    }, 0)
    
    const itemCount = (typedCartItems || []).reduce((total, item) => total + item.quantity, 0)
    
    return NextResponse.json({
      items: typedCartItems || [],
      subtotal,
      itemCount
    })
    
  } catch (error) {
    console.error('Cart GET error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 'general')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Get authenticated user
    const user = await requireAuth()
    const supabase = await createClient()
    
    const body = await req.json()
    const validated = cartItemSchema.parse(body)
    
    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', validated.productId)
      .single()
    
    // Type assertion for product
    const typedProduct = product as Product | null
    
    if (productError || !typedProduct || !typedProduct.is_active) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      )
    }
    
    if (typedProduct.stock < validated.quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }
    
    // Check if item already exists in cart
    const { data: existingCartItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', validated.productId)
      .single()
    
    // Type assertion for existing cart item
    const typedExistingCartItem = existingCartItem as CartItem | null
    
    let cartItem: CartItemWithProduct | null = null
    
    if (typedExistingCartItem) {
      // Update quantity
      const newQuantity = typedExistingCartItem.quantity + validated.quantity
      
      if (newQuantity > typedProduct.stock) {
        return NextResponse.json(
          { error: 'Total quantity exceeds available stock' },
          { status: 400 }
        )
      }
      
      // Create update object with proper typing
      const updateData: CartItemUpdate = { 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      }
      
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        // @ts-expect-error - Known Supabase TypeScript issue with update operations
        .update(updateData)
        .eq('id', typedExistingCartItem.id)
        .select(`
          *,
          products!inner (*)
        `)
        .single()
      
      if (updateError) {
        console.error('Cart update error:', updateError)
        return NextResponse.json(
          { error: 'Failed to update cart item' },
          { status: 500 }
        )
      }
      
      cartItem = updatedItem as CartItemWithProduct
    } else {
      // Create new cart item with proper typing
      const insertData: CartItemInsert = {
        user_id: user.id,
        product_id: validated.productId,
        quantity: validated.quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data: newItem, error: createError } = await supabase
        .from('cart_items')
        // @ts-expect-error - Known Supabase TypeScript issue with insert operations
        .insert([insertData])
        .select(`
          *,
          products!inner (*)
        `)
        .single()
      
      if (createError) {
        console.error('Cart creation error:', createError)
        return NextResponse.json(
          { error: 'Failed to add item to cart' },
          { status: 500 }
        )
      }
      
      cartItem = newItem as CartItemWithProduct
    }
    
    return NextResponse.json(cartItem, { status: 201 })
    
  } catch (error) {
    console.error('Cart POST error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
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

export async function DELETE(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 'general')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Get authenticated user
    const user = await requireAuth()
    const supabase = await createClient()
    
    // Clear entire cart
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Cart clear error:', error)
      return NextResponse.json(
        { error: 'Failed to clear cart' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ message: 'Cart cleared successfully' })
    
  } catch (error) {
    console.error('Cart DELETE error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}