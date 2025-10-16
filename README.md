# Spectrum for Us - Queer-Owned Marketplace

**B(u)y us, for us — Spectrum of possibilities**

A vibrant multi-vendor marketplace platform created by and for the LGBTQIA+ community, offering both products and services from queer creators worldwide.

## Features

- **Multi-Vendor Marketplace**: Products and services from queer creators
- **Full Authentication**: Secure login with Supabase Auth
- **Vendor Dashboard**: Manage products, services, and blog posts
- **Blog System**: Share stories and connect with the community
- **Shopping Cart & Checkout**: Integrated Stripe payments
- **Internationalization**: Support for English, French, and Arabic (with RTL)
- **Multi-Currency**: EUR, USD, and TND support
- **Accessibility**: Built-in accessibility widget with font size, contrast, and dyslexia-friendly options
- **Social Media Integration**: Connect with the community across platforms

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Analytics**: Vercel Analytics

## Getting Started

### 1. Database Setup

**IMPORTANT**: You must run the SQL scripts to set up your database before the app will work properly.

Execute the scripts in order from the `scripts/` folder in your Supabase SQL Editor:

1. `001_create_tables.sql` - Creates all database tables and RLS policies
2. `002_profile_trigger.sql` - Sets up automatic profile creation
3. `003_seed_data.sql` - (Optional) Adds sample data
4. `004_blog_tables.sql` - Creates blog and comments tables

**To run the scripts:**
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each script
4. Click "Run" to execute

### 2. Environment Variables

The following environment variables are already configured in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret

### 3. Deploy

Click the "Publish" button in v0 to deploy to Vercel, or push to GitHub and connect your repository.

## Project Structure

\`\`\`
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication pages
│   ├── blog/                # Blog pages
│   ├── cart/                # Shopping cart
│   ├── creators/            # Creator profiles
│   ├── dashboard/           # Vendor dashboard
│   ├── products/            # Product listings
│   ├── services/            # Service listings
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── navigation.tsx       # Main navigation
│   ├── footer.tsx           # Footer with social links
│   └── accessibility-widget.tsx
├── lib/                     # Utility functions
│   ├── supabase/           # Supabase clients
│   ├── i18n/               # Internationalization
│   └── stripe.ts           # Stripe configuration
└── scripts/                # Database setup scripts
\`\`\`

## Key Features Explained

### Accessibility Widget

The floating accessibility button provides:
- Font size adjustment (small, medium, large)
- High contrast mode toggle
- Dyslexia-friendly font option
- Keyboard navigation support throughout

### Internationalization

Switch between English, French, and Arabic with automatic RTL support for Arabic. Currency automatically adjusts based on language selection.

### Vendor Dashboard

Vendors can:
- Add and manage products
- Offer services
- Write blog posts
- View orders (coming soon)
- Update profile information

### Row Level Security (RLS)

All database tables use RLS policies to ensure:
- Users can only edit their own data
- Vendors can only manage their own listings
- Public data is readable by everyone
- Sensitive operations require authentication

## Support

For issues or questions, visit the Contact page or reach out through our social media channels.

## License

Created with ❤️ for the LGBTQIA+ community.
