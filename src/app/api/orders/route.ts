import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limiter'

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().min(1)
  })).min(1),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingPostal: z.string().min(1),
  shippingCountry: z.string().min(1),
  paymentMethod: z.string().min(1)
})

const orderQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional()
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
    
    const { searchParams } = new URL(req.url)
    const query = orderQuerySchema.parse(Object.fromEntries(searchParams))
    
    // Build query
    let ordersQuery = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          name,
          products (
            id,
            name,
            images
          )
        )
      `)
      .eq('user_id', user.id)
    
    if (query.status) {
      ordersQuery = ordersQuery.eq('status', query.status)
    }
    
    // Get total count (for pagination)
    let countQuery = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
    
    if (query.status) {
      countQuery = countQuery.eq('status', query.status)
    }
    
    // Calculate pagination
    const from = (query.page - 1) * query.limit
    const to = from + query.limit - 1
    
    // Execute queries
    const [ordersResult, countResult] = await Promise.all([
      ordersQuery
        .order('created_at', { ascending: false })
        .range(from, to),
      countQuery
    ])
    
    if (ordersResult.error) {
      console.error('Orders query error:', ordersResult.error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }
    
    if (countResult.error) {
      console.error('Orders count error:', countResult.error)
      return NextResponse.json(
        { error: 'Failed to count orders' },
        { status: 500 }
      )
    }
    
    const total = countResult.count || 0
    
    return NextResponse.json({
      orders: ordersResult.data || [],
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    })
    
  } catch (error) {
    console.error('Orders GET error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
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
    // Rate limiting for order creation
    const rateLimitResult = await checkRateLimit(req, 'auth') // Use stricter auth rate limit
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
    const validated = createOrderSchema.parse(body)
    
    // Verify all products exist and calculate total
    let totalAmount = 0
    const orderItems: Array<{
      product_id: string;
      quantity: number;
      price: number;
      name: string;
    }> = []
    
    for (const item of validated.items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, price, stock, is_active')
        .eq('id', item.productId)
        .single()
      
      if (productError || !product || !product.is_active) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found or inactive` },
          { status: 404 }
        )
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${product.name}` },
          { status: 400 }
        )
      }
      
      const itemTotal = Number(product.price) * item.quantity
      totalAmount += itemTotal
      
      orderItems.push({
        product_id: item.productId,
        quantity: item.quantity,
        price: Number(product.price),
        name: product.name
      })
    }
    
    // Create order (Supabase doesn't have transactions like Prisma, so we'll do operations sequentially)
    try {
      // Create the order
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          total_amount: totalAmount,
          shipping_address: validated.shippingAddress,
          shipping_city: validated.shippingCity,
          shipping_postal: validated.shippingPostal,
          shipping_country: validated.shippingCountry,
          payment_method: validated.paymentMethod
        }])
        .select()
        .single()
      
      if (orderError || !newOrder) {
        throw new Error('Failed to create order')
      }
      
      // Create order items
      const orderItemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: newOrder.id
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsWithOrderId)
      
      if (itemsError) {
        // Rollback: delete the order if items creation failed
        await supabase.from('orders').delete().eq('id', newOrder.id)
        throw new Error('Failed to create order items')
      }
      
      // Update product stock
      for (const item of validated.items) {
        const { data: currentProduct } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .single()
        
        if (currentProduct) {
          const { error: stockError } = await supabase
            .from('products')
            .update({ stock: currentProduct.stock - item.quantity })
            .eq('id', item.productId)
          
          if (stockError) {
            console.error('Failed to update stock for product:', item.productId, stockError)
            // Continue with other products even if one fails
          }
        }
      }
      
      // Clear user's cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
      
      // Fetch the complete order with items for response
      const { data: completeOrder } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            name,
            products (
              id,
              name,
              images
            )
          )
        `)
        .eq('id', newOrder.id)
        .single()
      
      const order = completeOrder || newOrder
      
      return NextResponse.json(order, { status: 201 })
      
    } catch (orderCreationError) {
      console.error('Order creation failed:', orderCreationError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Orders POST error:', error)
    
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