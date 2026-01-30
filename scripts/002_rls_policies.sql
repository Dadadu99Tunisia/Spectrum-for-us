-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.services enable row level security;
alter table public.streaming_content enable row level security;
alter table public.events enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.blog_posts enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Products policies
create policy "Products are viewable by everyone"
  on public.products for select
  using (is_active = true or vendor_id = auth.uid());

create policy "Vendors can insert own products"
  on public.products for insert
  with check (auth.uid() = vendor_id);

create policy "Vendors can update own products"
  on public.products for update
  using (auth.uid() = vendor_id);

create policy "Vendors can delete own products"
  on public.products for delete
  using (auth.uid() = vendor_id);

-- Services policies
create policy "Services are viewable by everyone"
  on public.services for select
  using (is_active = true or vendor_id = auth.uid());

create policy "Vendors can insert own services"
  on public.services for insert
  with check (auth.uid() = vendor_id);

create policy "Vendors can update own services"
  on public.services for update
  using (auth.uid() = vendor_id);

create policy "Vendors can delete own services"
  on public.services for delete
  using (auth.uid() = vendor_id);

-- Streaming content policies
create policy "Streaming content is viewable by everyone"
  on public.streaming_content for select
  using (true);

create policy "Vendors can insert own streaming content"
  on public.streaming_content for insert
  with check (auth.uid() = vendor_id);

create policy "Vendors can update own streaming content"
  on public.streaming_content for update
  using (auth.uid() = vendor_id);

-- Events policies
create policy "Events are viewable by everyone"
  on public.events for select
  using (is_active = true or organizer_id = auth.uid());

create policy "Organizers can insert own events"
  on public.events for insert
  with check (auth.uid() = organizer_id);

create policy "Organizers can update own events"
  on public.events for update
  using (auth.uid() = organizer_id);

-- Orders policies
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Order items policies
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Reviews policies
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Users can insert own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

-- Blog posts policies
create policy "Published blog posts are viewable by everyone"
  on public.blog_posts for select
  using (is_published = true or author_id = auth.uid());

create policy "Authors can insert own blog posts"
  on public.blog_posts for insert
  with check (auth.uid() = author_id);

create policy "Authors can update own blog posts"
  on public.blog_posts for update
  using (auth.uid() = author_id);
