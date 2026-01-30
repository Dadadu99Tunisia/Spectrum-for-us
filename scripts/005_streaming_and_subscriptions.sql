-- Create streaming content tables

-- Videos table (films, series, documentaries)
create table if not exists public.videos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  thumbnail_url text,
  video_url text not null,
  duration integer, -- in seconds
  category text not null check (category in ('film', 'series', 'documentary', 'short')),
  tags text[] default '{}',
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  views integer default 0,
  likes integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Music table (albums, singles)
create table if not exists public.music (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  artist text not null,
  album text,
  cover_url text,
  audio_url text not null,
  duration integer, -- in seconds
  genre text,
  tags text[] default '{}',
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  plays integer default 0,
  likes integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Podcasts table
create table if not exists public.podcasts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  cover_url text,
  audio_url text not null,
  duration integer, -- in seconds
  episode_number integer,
  season_number integer,
  tags text[] default '{}',
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  plays integer default 0,
  likes integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Vendor subscriptions table
create table if not exists public.vendor_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  plan_type text not null default 'basic' check (plan_type in ('basic', 'premium', 'enterprise')),
  price numeric(10, 2) not null default 35.00,
  currency text not null default 'EUR',
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  stripe_subscription_id text,
  current_period_start timestamp with time zone default now(),
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Events table (for ticketing)
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  location text not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  ticket_price numeric(10, 2) not null,
  currency text not null default 'EUR',
  available_tickets integer not null,
  category text not null check (category in ('gala', 'charity', 'wedding', 'party', 'conference', 'workshop')),
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Event tickets table
create table if not exists public.event_tickets (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  quantity integer not null default 1,
  total_price numeric(10, 2) not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'used')),
  created_at timestamp with time zone default now()
);

-- Travel packages table
create table if not exists public.travel_packages (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  destination text not null,
  duration_days integer not null,
  price numeric(10, 2) not null,
  currency text not null default 'EUR',
  includes text[] default '{}',
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on all new tables
alter table public.videos enable row level security;
alter table public.music enable row level security;
alter table public.podcasts enable row level security;
alter table public.vendor_subscriptions enable row level security;
alter table public.events enable row level security;
alter table public.event_tickets enable row level security;
alter table public.travel_packages enable row level security;

-- Videos policies
create policy "videos_select_all" on public.videos for select using (true);
create policy "videos_insert_vendor" on public.videos for insert with check (auth.uid() = vendor_id);
create policy "videos_update_vendor" on public.videos for update using (auth.uid() = vendor_id);
create policy "videos_delete_vendor" on public.videos for delete using (auth.uid() = vendor_id);

-- Music policies
create policy "music_select_all" on public.music for select using (true);
create policy "music_insert_vendor" on public.music for insert with check (auth.uid() = vendor_id);
create policy "music_update_vendor" on public.music for update using (auth.uid() = vendor_id);
create policy "music_delete_vendor" on public.music for delete using (auth.uid() = vendor_id);

-- Podcasts policies
create policy "podcasts_select_all" on public.podcasts for select using (true);
create policy "podcasts_insert_vendor" on public.podcasts for insert with check (auth.uid() = vendor_id);
create policy "podcasts_update_vendor" on public.podcasts for update using (auth.uid() = vendor_id);
create policy "podcasts_delete_vendor" on public.podcasts for delete using (auth.uid() = vendor_id);

-- Vendor subscriptions policies
create policy "vendor_subscriptions_select_own" on public.vendor_subscriptions for select using (auth.uid() = vendor_id);
create policy "vendor_subscriptions_insert_own" on public.vendor_subscriptions for insert with check (auth.uid() = vendor_id);
create policy "vendor_subscriptions_update_own" on public.vendor_subscriptions for update using (auth.uid() = vendor_id);

-- Events policies
create policy "events_select_all" on public.events for select using (true);
create policy "events_insert_vendor" on public.events for insert with check (auth.uid() = vendor_id);
create policy "events_update_vendor" on public.events for update using (auth.uid() = vendor_id);
create policy "events_delete_vendor" on public.events for delete using (auth.uid() = vendor_id);

-- Event tickets policies
create policy "event_tickets_select_own" on public.event_tickets for select using (auth.uid() = user_id);
create policy "event_tickets_insert_own" on public.event_tickets for insert with check (auth.uid() = user_id);

-- Travel packages policies
create policy "travel_packages_select_all" on public.travel_packages for select using (true);
create policy "travel_packages_insert_vendor" on public.travel_packages for insert with check (auth.uid() = vendor_id);
create policy "travel_packages_update_vendor" on public.travel_packages for update using (auth.uid() = vendor_id);
create policy "travel_packages_delete_vendor" on public.travel_packages for delete using (auth.uid() = vendor_id);
