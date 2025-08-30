export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'USER' | 'ADMIN'
          email_verified: string | null
          image: string | null
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'USER' | 'ADMIN'
          email_verified?: string | null
          image?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'USER' | 'ADMIN'
          email_verified?: string | null
          image?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: string
          stock: number
          sku: string | null
          category: string
          brand: string | null
          images: string[]
          featured: boolean
          slug: string
          meta_title: string | null
          meta_description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: string
          stock?: number
          sku?: string | null
          category: string
          brand?: string | null
          images?: string[]
          featured?: boolean
          slug: string
          meta_title?: string | null
          meta_description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: string
          stock?: number
          sku?: string | null
          category?: string
          brand?: string | null
          images?: string[]
          featured?: boolean
          slug?: string
          meta_title?: string | null
          meta_description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
          total_amount: string
          payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          payment_method: string | null
          payment_id: string | null
          shipping_address: string
          shipping_city: string
          shipping_postal: string
          shipping_country: string
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
          total_amount: string
          payment_status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          payment_method?: string | null
          payment_id?: string | null
          shipping_address: string
          shipping_city: string
          shipping_postal: string
          shipping_country: string
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
          total_amount?: string
          payment_status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          payment_method?: string | null
          payment_id?: string | null
          shipping_address?: string
          shipping_city?: string
          shipping_postal?: string
          shipping_country?: string
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: 'USER' | 'ADMIN'
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      get_cart_total: {
        Args: { user_id: string }
        Returns: string
      }
      get_cart_count: {
        Args: { user_id: string }
        Returns: number
      }
      get_product_rating: {
        Args: { product_id: string }
        Returns: string
      }
      get_product_review_count: {
        Args: { product_id: string }
        Returns: number
      }
    }
    Enums: {
      user_role: 'USER' | 'ADMIN'
      order_status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
      payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
    }
  }
}