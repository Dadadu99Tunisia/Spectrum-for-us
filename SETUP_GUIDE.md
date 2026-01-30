# Database Setup Guide

This guide will help you set up the Supabase database for Spectrum for Us.

## Prerequisites

- A Supabase project (already connected to your v0 workspace)
- Access to the Supabase SQL Editor

## Step-by-Step Setup

### Step 1: Access Supabase SQL Editor

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project
4. Click on "SQL Editor" in the left sidebar

### Step 2: Run Database Scripts

Execute the following scripts **in order**. Copy the entire content of each file and run it in the SQL Editor.

#### Script 1: Create Tables (001_create_tables.sql)

This script creates:
- `profiles` table (user profiles)
- `products` table (marketplace products)
- `services` table (marketplace services)
- `orders` and `order_items` tables (order management)
- `contact_messages` table (contact form submissions)
- Row Level Security (RLS) policies for all tables

**To run:**
1. Open `scripts/001_create_tables.sql`
2. Copy all content
3. Paste into Supabase SQL Editor
4. Click "Run"
5. Wait for "Success" message

#### Script 2: Profile Trigger (002_profile_trigger.sql)

This script creates a trigger that automatically creates a profile when a user signs up.

**To run:**
1. Open `scripts/002_profile_trigger.sql`
2. Copy all content
3. Paste into Supabase SQL Editor
4. Click "Run"

#### Script 3: Seed Data (003_seed_data.sql) - OPTIONAL

This script adds sample data for testing. You can skip this if you want to start with an empty database.

**To run:**
1. Open `scripts/003_seed_data.sql`
2. Copy all content
3. Paste into Supabase SQL Editor
4. Click "Run"

#### Script 4: Blog Tables (004_blog_tables.sql)

This script creates the blog system tables:
- `blog_posts` table
- `blog_comments` table
- RLS policies for blog functionality

**To run:**
1. Open `scripts/004_blog_tables.sql`
2. Copy all content
3. Paste into Supabase SQL Editor
4. Click "Run"

### Step 3: Verify Setup

After running all scripts, verify the setup:

1. Go to "Table Editor" in Supabase
2. You should see these tables:
   - profiles
   - products
   - services
   - orders
   - order_items
   - contact_messages
   - blog_posts
   - blog_comments

### Step 4: Test the Application

1. Visit your deployed application
2. Try signing up for an account
3. Navigate to the Products and Services pages
4. They should now load without errors

## Troubleshooting

### Error: "Could not find the table 'public.services'"

**Solution**: You haven't run the database scripts yet. Follow Step 2 above.

### Error: "Could not find a relationship between 'products' and 'profiles'"

**Solution**: The foreign key relationships weren't created. Make sure you ran `001_create_tables.sql` completely.

### Error: "permission denied for table profiles"

**Solution**: RLS policies might not be set up correctly. Re-run `001_create_tables.sql`.

### Profile not created after signup

**Solution**: The trigger might not be set up. Run `002_profile_trigger.sql`.

## Need Help?

If you encounter any issues:
1. Check the Supabase logs in the "Logs" section
2. Verify all scripts ran successfully
3. Make sure your environment variables are set correctly
4. Contact support through the app's Contact page

## Security Notes

- All tables use Row Level Security (RLS)
- Users can only modify their own data
- Vendors can only manage their own listings
- Admin role has special permissions
- Never share your `SUPABASE_SERVICE_ROLE_KEY`
