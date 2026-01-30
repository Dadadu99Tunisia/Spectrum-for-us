-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users profile table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique not null,
  avatar_url text,
  role text not null default 'buyer' check (role in ('buyer', 'vendor', 'admin')),
  bio text,
  social_links jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create products table
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  currency text not null default 'USD' check (currency in ('USD', 'EUR', 'TND')),
  image_url text,
  category text not null,
  stock integer not null default 0,
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on products
alter table public.products enable row level security;

-- Products policies
create policy "products_select_all"
  on public.products for select
  using (true);

create policy "products_insert_vendor"
  on public.products for insert
  with check (auth.uid() = vendor_id);

create policy "products_update_vendor"
  on public.products for update
  using (auth.uid() = vendor_id);

create policy "products_delete_vendor"
  on public.products for delete
  using (auth.uid() = vendor_id);

-- Create services table
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  currency text not null default 'USD' check (currency in ('USD', 'EUR', 'TND')),
  image_url text,
  category text not null,
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on services
alter table public.services enable row level security;

-- Services policies
create policy "services_select_all"
  on public.services for select
  using (true);

create policy "services_insert_vendor"
  on public.services for insert
  with check (auth.uid() = vendor_id);

create policy "services_update_vendor"
  on public.services for update
  using (auth.uid() = vendor_id);

create policy "services_delete_vendor"
  on public.services for delete
  using (auth.uid() = vendor_id);

-- Create orders table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  total_price numeric(10, 2) not null,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Orders policies
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Create order_items table
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  quantity integer not null default 1,
  subtotal numeric(10, 2) not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS on order_items
alter table public.order_items enable row level security;

-- Order items policies
create policy "order_items_select_own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Create contact_messages table
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS on contact_messages
alter table public.contact_messages enable row level security;

-- Contact messages policies (anyone can insert)
create policy "contact_messages_insert_all"
  on public.contact_messages for insert
  with check (true);

-- Admin can view all messages
create policy "contact_messages_select_admin"
  on public.contact_messages for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Adding streaming content, events, reviews, and blog posts tables

-- Create streaming_content table
create table if not exists public.streaming_content (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  content_type text not null check (content_type in ('video', 'music', 'podcast')),
  url text not null,
  thumbnail_url text,
  duration integer, -- in seconds
  category text not null,
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  views integer default 0,
  is_premium boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on streaming_content
alter table public.streaming_content enable row level security;

-- Streaming content policies
create policy "streaming_content_select_all"
  on public.streaming_content for select
  using (true);

create policy "streaming_content_insert_vendor"
  on public.streaming_content for insert
  with check (auth.uid() = vendor_id);

create policy "streaming_content_update_vendor"
  on public.streaming_content for update
  using (auth.uid() = vendor_id);

-- Create events table
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  event_type text not null check (event_type in ('online', 'in-person', 'hybrid')),
  location text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  price numeric(10, 2) not null default 0,
  currency text not null default 'EUR',
  image_url text,
  max_attendees integer,
  organizer_id uuid not null references public.profiles(id) on delete cascade,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on events
alter table public.events enable row level security;

-- Events policies
create policy "events_select_active"
  on public.events for select
  using (is_active = true or organizer_id = auth.uid());

create policy "events_insert_organizer"
  on public.events for insert
  with check (auth.uid() = organizer_id);

create policy "events_update_organizer"
  on public.events for update
  using (auth.uid() = organizer_id);

-- Create reviews table
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint review_target check (
    (product_id is not null and service_id is null) or
    (product_id is null and service_id is not null)
  )
);

-- Enable RLS on reviews
alter table public.reviews enable row level security;

-- Reviews policies
create policy "reviews_select_all"
  on public.reviews for select
  using (true);

create policy "reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews_update_own"
  on public.reviews for update
  using (auth.uid() = user_id);

-- Create blog_posts table
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  cover_image text,
  author_id uuid not null references public.profiles(id) on delete cascade,
  is_published boolean default false,
  published_at timestamp with time zone,
  tags text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on blog_posts
alter table public.blog_posts enable row level security;

-- Blog posts policies
create policy "blog_posts_select_published"
  on public.blog_posts for select
  using (is_published = true or author_id = auth.uid());

create policy "blog_posts_insert_author"
  on public.blog_posts for insert
  with check (auth.uid() = author_id);

create policy "blog_posts_update_author"
  on public.blog_posts for update
  using (auth.uid() = author_id);

-- Create indexes for better performance
create index if not exists idx_products_vendor on public.products(vendor_id);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_services_vendor on public.services(vendor_id);
create index if not exists idx_services_category on public.services(category);
create index if not exists idx_streaming_vendor on public.streaming_content(vendor_id);
create index if not exists idx_streaming_type on public.streaming_content(content_type);
create index if not exists idx_events_organizer on public.events(organizer_id);
create index if not exists idx_events_dates on public.events(start_date, end_date);
create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_reviews_service on public.reviews(service_id);
create index if not exists idx_blog_slug on public.blog_posts(slug);
create index if not exists idx_blog_author on public.blog_posts(author_id);
