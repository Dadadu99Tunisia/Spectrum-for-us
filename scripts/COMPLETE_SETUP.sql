-- ================================================
-- SPECTRUM MARKETPLACE - SCRIPT COMPLET DE SETUP
-- Execute ce script dans Supabase SQL Editor
-- ================================================

-- 1. TABLE PROFILES (utilisateurs)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'vendor', 'admin')),
  is_vendor BOOLEAN DEFAULT false,
  vendor_approved BOOLEAN DEFAULT false,
  shop_name TEXT,
  shop_description TEXT,
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  category TEXT,
  category_id UUID REFERENCES public.categories(id),
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER, -- en minutes
  category TEXT,
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 6. TABLE ORDERS (commandes principales)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id),
  order_number TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_address JSONB,
  billing_address JSONB,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLE SUB_ORDERS (commandes par vendeur)
CREATE TABLE IF NOT EXISTS public.sub_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.profiles(id),
  sub_order_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  commission_rate DECIMAL(5,4) DEFAULT 0.12,
  vendor_payout DECIMAL(10,2),
  tracking_number TEXT,
  carrier TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLE ORDER_ITEMS (articles de commande)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  sub_order_id UUID REFERENCES public.sub_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  vendor_id UUID REFERENCES public.profiles(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLE VENDOR_SHIPPING_SETTINGS
CREATE TABLE IF NOT EXISTS public.vendor_shipping_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  shipping_from_country TEXT DEFAULT 'FR',
  shipping_from_city TEXT,
  processing_time_days INTEGER DEFAULT 3,
  domestic_shipping_price DECIMAL(10,2) DEFAULT 5.00,
  domestic_free_shipping_threshold DECIMAL(10,2),
  eu_shipping_price DECIMAL(10,2) DEFAULT 15.00,
  eu_free_shipping_threshold DECIMAL(10,2),
  international_shipping_price DECIMAL(10,2) DEFAULT 25.00,
  international_free_shipping_threshold DECIMAL(10,2),
  ships_internationally BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABLE BLOG_POSTS
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ENABLE RLS ON ALL TABLES
-- ================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_shipping_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ================================================
-- RLS POLICIES
-- ================================================

-- Profiles: lecture publique, modification par proprietaire
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Products: lecture publique, modification par vendeur
DROP POLICY IF EXISTS "products_select_all" ON public.products;
CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "products_insert_vendor" ON public.products;
CREATE POLICY "products_insert_vendor" ON public.products FOR INSERT WITH CHECK (auth.uid() = vendor_id);

DROP POLICY IF EXISTS "products_update_vendor" ON public.products;
CREATE POLICY "products_update_vendor" ON public.products FOR UPDATE USING (auth.uid() = vendor_id);

DROP POLICY IF EXISTS "products_delete_vendor" ON public.products;
CREATE POLICY "products_delete_vendor" ON public.products FOR DELETE USING (auth.uid() = vendor_id);

-- Categories: lecture publique
DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);

-- Services: lecture publique, modification par vendeur
DROP POLICY IF EXISTS "services_select_all" ON public.services;
CREATE POLICY "services_select_all" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "services_insert_vendor" ON public.services;
CREATE POLICY "services_insert_vendor" ON public.services FOR INSERT WITH CHECK (auth.uid() = vendor_id);

DROP POLICY IF EXISTS "services_update_vendor" ON public.services;
CREATE POLICY "services_update_vendor" ON public.services FOR UPDATE USING (auth.uid() = vendor_id);

-- Favorites: lecture/ecriture par proprietaire
DROP POLICY IF EXISTS "favorites_select_own" ON public.favorites;
CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_insert_own" ON public.favorites;
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_delete_own" ON public.favorites;
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Orders: lecture par acheteur
DROP POLICY IF EXISTS "orders_select_buyer" ON public.orders;
CREATE POLICY "orders_select_buyer" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "orders_insert_anon" ON public.orders;
CREATE POLICY "orders_insert_anon" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "orders_update_anon" ON public.orders;
CREATE POLICY "orders_update_anon" ON public.orders FOR UPDATE USING (true);

-- Sub-orders: lecture par vendeur ou acheteur
DROP POLICY IF EXISTS "sub_orders_select" ON public.sub_orders;
CREATE POLICY "sub_orders_select" ON public.sub_orders FOR SELECT USING (
  auth.uid() = vendor_id OR 
  auth.uid() IN (SELECT buyer_id FROM public.orders WHERE id = order_id)
);

DROP POLICY IF EXISTS "sub_orders_insert_anon" ON public.sub_orders;
CREATE POLICY "sub_orders_insert_anon" ON public.sub_orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "sub_orders_update_vendor" ON public.sub_orders;
CREATE POLICY "sub_orders_update_vendor" ON public.sub_orders FOR UPDATE USING (auth.uid() = vendor_id);

-- Order items: lecture par vendeur ou acheteur
DROP POLICY IF EXISTS "order_items_select" ON public.order_items;
CREATE POLICY "order_items_select" ON public.order_items FOR SELECT USING (
  auth.uid() = vendor_id OR 
  auth.uid() IN (SELECT buyer_id FROM public.orders WHERE id = order_id)
);

DROP POLICY IF EXISTS "order_items_insert_anon" ON public.order_items;
CREATE POLICY "order_items_insert_anon" ON public.order_items FOR INSERT WITH CHECK (true);

-- Vendor shipping: lecture publique, modification par vendeur
DROP POLICY IF EXISTS "vendor_shipping_select_all" ON public.vendor_shipping_settings;
CREATE POLICY "vendor_shipping_select_all" ON public.vendor_shipping_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "vendor_shipping_insert_vendor" ON public.vendor_shipping_settings;
CREATE POLICY "vendor_shipping_insert_vendor" ON public.vendor_shipping_settings FOR INSERT WITH CHECK (auth.uid() = vendor_id);

DROP POLICY IF EXISTS "vendor_shipping_update_vendor" ON public.vendor_shipping_settings;
CREATE POLICY "vendor_shipping_update_vendor" ON public.vendor_shipping_settings FOR UPDATE USING (auth.uid() = vendor_id);

-- Blog posts: lecture publique, modification par auteur
DROP POLICY IF EXISTS "blog_posts_select_published" ON public.blog_posts;
CREATE POLICY "blog_posts_select_published" ON public.blog_posts FOR SELECT USING (is_published = true OR auth.uid() = author_id);

DROP POLICY IF EXISTS "blog_posts_insert_author" ON public.blog_posts;
CREATE POLICY "blog_posts_insert_author" ON public.blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "blog_posts_update_author" ON public.blog_posts;
CREATE POLICY "blog_posts_update_author" ON public.blog_posts FOR UPDATE USING (auth.uid() = author_id);

-- ================================================
-- TRIGGER: Auto-create profile on signup
-- ================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- CATEGORIES DE BASE
-- ================================================
INSERT INTO public.categories (name, slug, description) VALUES
  ('Mode', 'mode', 'Vetements et accessoires'),
  ('Beaute', 'beaute', 'Cosmetiques et soins'),
  ('Maison', 'maison', 'Decoration et objets'),
  ('Art', 'art', 'Oeuvres et creations artistiques'),
  ('Livres', 'livres', 'Livres et publications'),
  ('Bien-etre', 'bien-etre', 'Produits de bien-etre'),
  ('Tech', 'tech', 'Gadgets et accessoires tech'),
  ('Food', 'food', 'Alimentation et boissons')
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- DONE!
-- ================================================
SELECT 'Setup complete! All tables created.' as status;
