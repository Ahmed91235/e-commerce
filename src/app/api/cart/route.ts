import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limiter'

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
    const supabase = supabaseAdmin
    
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        user_id,
        product_id,
        quantity,
        created_at,
        updated_at,
        products!inner (
          id,
          name,
          price,
          images,
          stock,
          is_active
        )
      `)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Cart query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cart items' },
        { status: 500 }
      )
    }
    
    // Calculate cart totals
    const subtotal = (cartItems || []).reduce((total, item) => {
      return total + (Number(item.products.price) * item.quantity)
    }, 0)
    
    const itemCount = (cartItems || []).reduce((total, item) => total + item.quantity, 0)
    
    return NextResponse.json({
      items: cartItems || [],
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
    const supabase = supabaseAdmin
    
    const body = await req.json()
    const validated = cartItemSchema.parse(body)
    
    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, stock, is_active')
      .eq('id', validated.productId)
      .single()
    
    if (productError || !product || !product.is_active) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      )
    }
    
    if (product.stock < validated.quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }
    
    // Check if item already exists in cart
    const { data: existingCartItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', validated.productId)
      .single()
    
    let cartItem
    
    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + validated.quantity
      
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: 'Total quantity exceeds available stock' },
          { status: 400 }
        )
      }
      
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingCartItem.id)
        .select(`
          *,
          products (
            id,
            name,
            price,
            images,
            stock
          )
        `)
        .single()
      
      if (updateError) {
        console.error('Cart update error:', updateError)
        return NextResponse.json(
          { error: 'Failed to update cart item' },
          { status: 500 }
        )
      }
      
      cartItem = updatedItem
    } else {
      // Create new cart item
      const { data: newItem, error: createError } = await supabase
        .from('cart_items')
        .insert([{
          user_id: user.id,
          product_id: validated.productId,
          quantity: validated.quantity
        }])
        .select(`
          *,
          products (
            id,
            name,
            price,
            images,
            stock
          )
        `)
        .single()
      
      if (createError) {
        console.error('Cart creation error:', createError)
        return NextResponse.json(
          { error: 'Failed to add item to cart' },
          { status: 500 }
        )
      }
      
      cartItem = newItem
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
    const supabase = supabaseAdmin
    
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