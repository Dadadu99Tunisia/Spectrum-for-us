-- Overrides logo + champs éditables pour l'annuaire LGBTQ+
create table if not exists public.annuaire_overrides (
  org_id        text primary key,          -- correspond à OrgEntry.id
  logo_url      text,                       -- URL absolue du logo (stockage Supabase ou externe)
  custom_name   text,                       -- nom personnalisé (surcharge le nom statique)
  custom_desc   text,                       -- description personnalisée
  website       text,                       -- site web (surcharge)
  phone         text,                       -- téléphone (surcharge)
  email         text,                       -- email (surcharge)
  accent        text,                       -- couleur accent hex (surcharge)
  is_featured   boolean default false,      -- mise en avant
  is_hidden     boolean default false,      -- masquer de l'annuaire
  updated_at    timestamptz default now(),
  updated_by    uuid references auth.users(id)
);

-- RLS
alter table public.annuaire_overrides enable row level security;

create policy "admins_manage_annuaire_overrides" on public.annuaire_overrides
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "public_read_annuaire_overrides" on public.annuaire_overrides
  for select using (true);

-- Index
create index if not exists idx_annuaire_overrides_featured on public.annuaire_overrides(is_featured) where is_featured = true;
create index if not exists idx_annuaire_overrides_hidden on public.annuaire_overrides(is_hidden) where is_hidden = true;

-- Bucket storage pour logos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'annuaire-logos',
  'annuaire-logos',
  true,
  2097152,  -- 2 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "public_read_annuaire_logos" on storage.objects
  for select using (bucket_id = 'annuaire-logos');

create policy "admins_upload_annuaire_logos" on storage.objects
  for insert with check (
    bucket_id = 'annuaire-logos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_update_annuaire_logos" on storage.objects
  for update using (
    bucket_id = 'annuaire-logos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_delete_annuaire_logos" on storage.objects
  for delete using (
    bucket_id = 'annuaire-logos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
