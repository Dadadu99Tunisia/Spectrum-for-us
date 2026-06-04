-- Table CMS contenu du site
create table if not exists public.site_content (
  id           uuid primary key default gen_random_uuid(),
  key          text not null,
  locale       text not null default 'fr',  -- 'fr' | 'en' | 'ar'
  section      text not null,
  type         text not null default 'text', -- 'text' | 'html' | 'boolean' | 'color' | 'image' | 'url' | 'number'
  label        text not null,
  description  text,
  value        text,
  default_value text,
  updated_at   timestamptz default now(),
  updated_by   uuid references auth.users(id),
  unique(key, locale)
);

alter table public.site_content enable row level security;
create policy "admins_manage_site_content" on public.site_content
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "public_read_site_content" on public.site_content for select using (true);

-- Index
create index if not exists idx_site_content_key_locale on public.site_content(key, locale);
create index if not exists idx_site_content_section on public.site_content(section);

-- Seed default FR values
insert into public.site_content (key, locale, section, type, label, description, default_value, value) values
-- Hero
('hero_description',   'fr', 'hero', 'text', 'Description hero',     'Texte sous le titre principal',  'Parce que nos mains créent, nos voix existent, et nos histoires ont une valeur. Un espace construit par et pour la communauté queer.', null),
('hero_description',   'en', 'hero', 'text', 'Hero description',      'Text below main title',          'Because our hands create, our voices exist, and our stories have value. A space built by and for the queer community.', null),
('hero_description',   'ar', 'hero', 'text', 'وصف الرئيسية',          '',                               'لأن أيدينا تبدع، وأصواتنا موجودة، وقصصنا لها قيمة. فضاء بُني من أجل مجتمع الكويرية وبواسطته.', null),
('hero_btn1_label',    'fr', 'hero', 'text', 'Bouton 1 — label',      '',                               'Découvrir les créations', null),
('hero_btn1_label',    'en', 'hero', 'text', 'Button 1 — label',      '',                               'Discover creations', null),
('hero_btn1_label',    'ar', 'hero', 'text', 'زر 1 — النص',           '',                               'اكتشاف الإبداعات', null),
('hero_btn1_url',      'fr', 'hero', 'url',  'Bouton 1 — URL',        '',                               '/decouvrir', null),
('hero_btn1_url',      'en', 'hero', 'url',  'Button 1 — URL',        '',                               '/decouvrir', null),
('hero_btn1_url',      'ar', 'hero', 'url',  'زر 1 — رابط',           '',                               '/decouvrir', null),
('hero_btn2_label',    'fr', 'hero', 'text', 'Bouton 2 — label',      '',                               'Rejoindre le mouvement', null),
('hero_btn2_label',    'en', 'hero', 'text', 'Button 2 — label',      '',                               'Join the movement', null),
('hero_btn2_label',    'ar', 'hero', 'text', 'زر 2 — النص',           '',                               'انضم إلى الحركة', null),
('hero_btn2_url',      'fr', 'hero', 'url',  'Bouton 2 — URL',        '',                               '/rejoindre', null),
('hero_btn2_url',      'en', 'hero', 'url',  'Button 2 — URL',        '',                               '/rejoindre', null),
('hero_btn2_url',      'ar', 'hero', 'url',  'زر 2 — رابط',           '',                               '/rejoindre', null),
-- Banners
('banner_active',      'fr', 'banners', 'boolean', 'Bannière active', 'Afficher/cacher la bannière top', 'true', null),
('banner_text',        'fr', 'banners', 'text',    'Texte bannière',  'Texte de la bannière promotionnelle', '🌈 Lancement Pride — 26 juin · Inscrivez-vous maintenant', null),
('banner_text',        'en', 'banners', 'text',    'Banner text',     '',                               '🌈 Pride Launch — June 26 · Sign up now', null),
('banner_url',         'fr', 'banners', 'url',     'Lien bannière',   '',                               '/rejoindre', null),
-- SEO
('seo_title',          'fr', 'seo', 'text', 'Titre SEO',             '',                               'Spectrum For Us — La marketplace queer', null),
('seo_title',          'en', 'seo', 'text', 'SEO title',             '',                               'Spectrum For Us — The queer marketplace', null),
('seo_description',    'fr', 'seo', 'text', 'Meta description',      '',                               'Créations, services et événements par et pour la communauté LGBTQIA+. Mode non-genrée, art, beauté, bien-être.', null),
('seo_description',    'en', 'seo', 'text', 'Meta description',      '',                               'Creations, services and events by and for the LGBTQIA+ community. Gender-free fashion, art, beauty, wellness.', null)
on conflict (key, locale) do nothing;
