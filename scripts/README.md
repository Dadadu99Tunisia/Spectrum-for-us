# Database Setup Scripts

These SQL scripts set up the complete database schema for Spectrum For Us marketplace.

## Execution Order

Run these scripts in your Supabase SQL Editor in the following order:

1. **001_create_tables.sql** - Creates all database tables and indexes
2. **002_rls_policies.sql** - Sets up Row Level Security policies
3. **003_functions.sql** - Creates database functions and triggers

## How to Run

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each script in order
4. Click "Run" to execute

## After Setup

Once the scripts are executed, you can:
- Import the product catalog using the admin import tool at `/admin/import-catalog`
- Start adding products and services through the vendor dashboard
- The database will automatically handle user profiles, orders, and reviews

## Tables Created

- **profiles** - User profiles (extends auth.users)
- **products** - Physical and digital products
- **services** - Professional services
- **streaming_content** - Videos, music, and podcasts
- **events** - Event listings and ticketing
- **orders** - Customer orders
- **order_items** - Individual items in orders
- **reviews** - Product and service reviews
- **blog_posts** - Blog content

## Security

All tables have Row Level Security (RLS) enabled with appropriate policies to ensure:
- Users can only modify their own data
- Vendors can only manage their own products/services
- Public content is viewable by everyone
- Private data is protected
