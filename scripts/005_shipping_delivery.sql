-- Add shipping and delivery tables

-- Create shipping_addresses table
create table if not exists public.shipping_addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state_province text,
  postal_code text not null,
  country text not null,
  phone text not null,
  is_default boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on shipping_addresses
alter table public.shipping_addresses enable row level security;

-- Shipping addresses policies
create policy "shipping_addresses_select_own"
  on public.shipping_addresses for select
  using (auth.uid() = user_id);

create policy "shipping_addresses_insert_own"
  on public.shipping_addresses for insert
  with check (auth.uid() = user_id);

create policy "shipping_addresses_update_own"
  on public.shipping_addresses for update
  using (auth.uid() = user_id);

create policy "shipping_addresses_delete_own"
  on public.shipping_addresses for delete
  using (auth.uid() = user_id);

-- Create shipping_methods table
create table if not exists public.shipping_methods (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  currency text not null default 'EUR',
  estimated_days_min integer not null,
  estimated_days_max integer not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS on shipping_methods
alter table public.shipping_methods enable row level security;

-- Shipping methods policies (public read)
create policy "shipping_methods_select_all"
  on public.shipping_methods for select
  using (is_active = true);

-- Insert default shipping methods
insert into public.shipping_methods (name, description, price, currency, estimated_days_min, estimated_days_max) values
  ('Standard', 'Livraison standard (5-7 jours ouvrés)', 5.99, 'EUR', 5, 7),
  ('Express', 'Livraison express (2-3 jours ouvrés)', 12.99, 'EUR', 2, 3),
  ('Priority', 'Livraison prioritaire (1-2 jours ouvrés)', 19.99, 'EUR', 1, 2),
  ('Free', 'Livraison gratuite (7-10 jours ouvrés)', 0.00, 'EUR', 7, 10)
on conflict do nothing;

-- Add shipping columns to orders table
alter table public.orders 
  add column if not exists shipping_address_id uuid references public.shipping_addresses(id),
  add column if not exists shipping_method_id uuid references public.shipping_methods(id),
  add column if not exists shipping_cost numeric(10, 2) default 0,
  add column if not exists tracking_number text,
  add column if not exists shipped_at timestamp with time zone,
  add column if not exists delivered_at timestamp with time zone,
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent text;

-- Update orders status check constraint
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check 
  check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));

-- Create order_status_history table for tracking
create table if not exists public.order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on order_status_history
alter table public.order_status_history enable row level security;

-- Order status history policies
create policy "order_status_history_select_own"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_status_history.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Vendors can see status history for their products
create policy "order_status_history_select_vendor"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.order_items oi
      join public.products p on p.id = oi.product_id
      where oi.order_id = order_status_history.order_id
      and p.vendor_id = auth.uid()
    )
  );

-- Create indexes
create index if not exists idx_shipping_addresses_user on public.shipping_addresses(user_id);
create index if not exists idx_orders_shipping_address on public.orders(shipping_address_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_stripe_session on public.orders(stripe_session_id);
create index if not exists idx_order_status_history_order on public.order_status_history(order_id);

-- Function to update order status and create history entry
create or replace function update_order_status(
  p_order_id uuid,
  p_new_status text,
  p_note text default null
) returns void as $$
begin
  update public.orders
  set status = p_new_status,
      updated_at = now(),
      shipped_at = case when p_new_status = 'shipped' then now() else shipped_at end,
      delivered_at = case when p_new_status = 'delivered' then now() else delivered_at end
  where id = p_order_id;
  
  insert into public.order_status_history (order_id, status, note)
  values (p_order_id, p_new_status, p_note);
end;
$$ language plpgsql security definer;
