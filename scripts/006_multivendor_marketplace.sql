-- Multi-vendor marketplace with vendor-managed shipping

-- Add vendor shipping settings to profiles
alter table public.profiles
  add column if not exists shipping_policy text,
  add column if not exists processing_time_days integer default 3,
  add column if not exists ships_from_country text default 'France',
  add column if not exists ships_from_city text;

-- Create vendor_shipping_methods table (each vendor defines their own)
create table if not exists public.vendor_shipping_methods (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  currency text not null default 'EUR',
  estimated_days_min integer not null,
  estimated_days_max integer not null,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.vendor_shipping_methods enable row level security;

-- Policies for vendor shipping methods
create policy "vendor_shipping_methods_select_all"
  on public.vendor_shipping_methods for select
  using (is_active = true);

create policy "vendor_shipping_methods_insert_own"
  on public.vendor_shipping_methods for insert
  with check (auth.uid() = vendor_id);

create policy "vendor_shipping_methods_update_own"
  on public.vendor_shipping_methods for update
  using (auth.uid() = vendor_id);

-- Split orders by vendor (each vendor gets their own order)
create table if not exists public.vendor_orders (
  id uuid primary key default uuid_generate_v4(),
  parent_order_id uuid references public.orders(id) on delete cascade,
  vendor_id uuid not null references public.profiles(id),
  user_id uuid not null references public.profiles(id),
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal numeric(10, 2) not null,
  shipping_cost numeric(10, 2) not null default 0,
  platform_fee numeric(10, 2) not null default 0,
  vendor_payout numeric(10, 2) not null,
  shipping_address_id uuid references public.shipping_addresses(id),
  shipping_method_id uuid references public.vendor_shipping_methods(id),
  tracking_number text,
  shipped_at timestamp with time zone,
  delivered_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.vendor_orders enable row level security;

-- Policies for vendor orders
create policy "vendor_orders_select_own_customer"
  on public.vendor_orders for select
  using (auth.uid() = user_id);

create policy "vendor_orders_select_own_vendor"
  on public.vendor_orders for select
  using (auth.uid() = vendor_id);

create policy "vendor_orders_update_own_vendor"
  on public.vendor_orders for update
  using (auth.uid() = vendor_id);

-- Vendor order items
create table if not exists public.vendor_order_items (
  id uuid primary key default uuid_generate_v4(),
  vendor_order_id uuid not null references public.vendor_orders(id) on delete cascade,
  product_id uuid references public.products(id),
  service_id uuid references public.services(id),
  quantity integer not null,
  price numeric(10, 2) not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.vendor_order_items enable row level security;

-- Policies
create policy "vendor_order_items_select_customer"
  on public.vendor_order_items for select
  using (
    exists (
      select 1 from public.vendor_orders vo
      where vo.id = vendor_order_items.vendor_order_id
      and vo.user_id = auth.uid()
    )
  );

create policy "vendor_order_items_select_vendor"
  on public.vendor_order_items for select
  using (
    exists (
      select 1 from public.vendor_orders vo
      where vo.id = vendor_order_items.vendor_order_id
      and vo.vendor_id = auth.uid()
    )
  );

-- Platform commission settings
create table if not exists public.platform_settings (
  id uuid primary key default uuid_generate_v4(),
  commission_rate numeric(5, 2) not null default 15.00, -- 15% commission
  min_commission numeric(10, 2) not null default 0.50, -- Minimum 0.50€
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Insert default platform settings
insert into public.platform_settings (commission_rate, min_commission)
values (15.00, 0.50)
on conflict do nothing;

-- Function to split order by vendors
create or replace function split_order_by_vendors(
  p_order_id uuid,
  p_items jsonb
) returns void as $$
declare
  v_item jsonb;
  v_vendor_id uuid;
  v_vendor_order_id uuid;
  v_subtotal numeric;
  v_platform_fee numeric;
  v_commission_rate numeric;
begin
  -- Get commission rate
  select commission_rate into v_commission_rate
  from public.platform_settings
  limit 1;

  -- Group items by vendor and create vendor orders
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_vendor_id := (v_item->>'vendor_id')::uuid;
    v_subtotal := (v_item->>'price')::numeric * (v_item->>'quantity')::integer;
    v_platform_fee := greatest(v_subtotal * v_commission_rate / 100, 0.50);
    
    -- Check if vendor order already exists for this vendor
    select id into v_vendor_order_id
    from public.vendor_orders
    where parent_order_id = p_order_id
    and vendor_id = v_vendor_id;
    
    -- Create vendor order if doesn't exist
    if v_vendor_order_id is null then
      insert into public.vendor_orders (
        parent_order_id,
        vendor_id,
        user_id,
        subtotal,
        platform_fee,
        vendor_payout,
        shipping_address_id,
        status
      )
      select 
        p_order_id,
        v_vendor_id,
        o.user_id,
        0,
        0,
        0,
        o.shipping_address_id,
        'pending'
      from public.orders o
      where o.id = p_order_id
      returning id into v_vendor_order_id;
    end if;
    
    -- Add item to vendor order
    insert into public.vendor_order_items (
      vendor_order_id,
      product_id,
      quantity,
      price
    ) values (
      v_vendor_order_id,
      (v_item->>'product_id')::uuid,
      (v_item->>'quantity')::integer,
      (v_item->>'price')::numeric
    );
    
    -- Update vendor order totals
    update public.vendor_orders
    set 
      subtotal = subtotal + v_subtotal,
      platform_fee = platform_fee + v_platform_fee,
      vendor_payout = subtotal + v_subtotal - (platform_fee + v_platform_fee)
    where id = v_vendor_order_id;
  end loop;
end;
$$ language plpgsql security definer;

-- Indexes
create index if not exists idx_vendor_shipping_methods_vendor on public.vendor_shipping_methods(vendor_id);
create index if not exists idx_vendor_orders_vendor on public.vendor_orders(vendor_id);
create index if not exists idx_vendor_orders_user on public.vendor_orders(user_id);
create index if not exists idx_vendor_orders_parent on public.vendor_orders(parent_order_id);
create index if not exists idx_vendor_order_items_vendor_order on public.vendor_order_items(vendor_order_id);
