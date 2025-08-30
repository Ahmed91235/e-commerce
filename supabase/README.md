# Supabase Database Migration

This directory contains the database migration files for migrating from Prisma to Supabase.

## Migration Files

1. `001_initial_schema.sql` - Creates all tables, indexes, and triggers
2. `002_row_level_security.sql` - Sets up RLS policies for data security
3. `003_auth_functions.sql` - Creates utility functions for user management

## Schema Overview

### Tables Created:
- `users` - User profiles (extends auth.users)
- `products` - Product catalog
- `orders` - Customer orders  
- `order_items` - Items within orders
- `cart_items` - Shopping cart items
- `reviews` - Product reviews

### Security Features:
- Row Level Security (RLS) enabled on all tables
- User-specific access policies
- Admin role permissions
- Automatic user profile creation

### Functions Created:
- `handle_new_user()` - Auto-creates user profile on signup
- `get_user_role()` - Returns user role
- `is_admin()` - Checks if user is admin
- `get_cart_total()` - Calculates cart total
- `get_cart_count()` - Calculates cart item count
- `get_product_rating()` - Calculates average product rating
- `get_product_review_count()` - Returns review count

## Running Migrations

These migration files should be applied to your Supabase database in order:

1. Copy the SQL content from each migration file
2. Run them in the Supabase SQL Editor in sequential order
3. Verify all tables and policies are created successfully

## Data Types

The database uses TypeScript types defined in `../src/lib/supabase/database.types.ts` for full type safety.

## Notes

- UUIDs are used for all primary keys (compatible with Supabase auth)
- All price fields use DECIMAL(10,2) for precision
- Updated_at triggers automatically update timestamps
- Foreign key relationships match the original Prisma schema