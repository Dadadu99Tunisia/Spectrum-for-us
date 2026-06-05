-- ═══════════════════════════════════════════════════════════════
-- SPECTRUM FOR US — MIGRATION COMPLÈTE (002 + 003 + 004)
-- À exécuter en une seule fois dans Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- HELPER : is_admin()
-- Vérifie rôle admin — correspond à ADMIN_ROLES dans rbac.ts
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role::text = ANY(ARRAY[
        'super_admin','ceo','cfo','marketing',
        'commercial','support','moderation','hr'
      ])
  )
  OR (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ) = ANY(ARRAY['hedibenazouz@gmail.com','chennaoui.aicha@gmail.com'])
$$;

-- ──────────────────────────────────────────────────────────────
-- 1. SITE CONTENT (CMS)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_content (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key           text NOT NULL,
  locale        text NOT NULL DEFAULT 'fr',
  section       text NOT NULL,
  type          text NOT NULL DEFAULT 'text',
  label         text NOT NULL,
  description   text,
  value         text,
  default_value text,
  updated_at    timestamptz DEFAULT now(),
  updated_by    uuid REFERENCES auth.users(id),
  UNIQUE(key, locale)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_site_content"  ON public.site_content;
DROP POLICY IF EXISTS "public_read_site_content"    ON public.site_content;

CREATE POLICY "admins_manage_site_content" ON public.site_content
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_read_site_content" ON public.site_content
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_site_content_key_locale ON public.site_content(key, locale);
CREATE INDEX IF NOT EXISTS idx_site_content_section    ON public.site_content(section);

INSERT INTO public.site_content (key, locale, section, type, label, default_value) VALUES
('hero_description','fr','hero','text','Description hero','Parce que nos mains créent, nos voix existent, et nos histoires ont une valeur. Un espace construit par et pour la communauté queer.'),
('hero_description','en','hero','text','Hero description','Because our hands create, our voices exist, and our stories have value. A space built by and for the queer community.'),
('hero_description','ar','hero','text','وصف الرئيسية','لأن أيدينا تبدع، وأصواتنا موجودة، وقصصنا لها قيمة. فضاء بُني من أجل مجتمع الكويرية وبواسطته.'),
('hero_btn1_label','fr','hero','text','Bouton 1 — label','Découvrir les créations'),
('hero_btn1_label','en','hero','text','Button 1 — label','Discover creations'),
('hero_btn1_label','ar','hero','text','زر 1 — النص','اكتشاف الإبداعات'),
('hero_btn1_url','fr','hero','url','Bouton 1 — URL','/decouvrir'),
('hero_btn1_url','en','hero','url','Button 1 — URL','/decouvrir'),
('hero_btn1_url','ar','hero','url','زر 1 — رابط','/decouvrir'),
('hero_btn2_label','fr','hero','text','Bouton 2 — label','Rejoindre le mouvement'),
('hero_btn2_label','en','hero','text','Button 2 — label','Join the movement'),
('hero_btn2_label','ar','hero','text','زر 2 — النص','انضم إلى الحركة'),
('hero_btn2_url','fr','hero','url','Bouton 2 — URL','/rejoindre'),
('hero_btn2_url','en','hero','url','Button 2 — URL','/rejoindre'),
('hero_btn2_url','ar','hero','url','زر 2 — رابط','/rejoindre'),
('banner_active','fr','banners','boolean','Bannière active','true'),
('banner_text','fr','banners','text','Texte bannière','🌈 Lancement Pride — 26 juin · Inscrivez-vous maintenant'),
('banner_text','en','banners','text','Banner text','🌈 Pride Launch — June 26 · Sign up now'),
('banner_url','fr','banners','url','Lien bannière','/rejoindre'),
('seo_title','fr','seo','text','Titre SEO','Spectrum For Us — La marketplace queer'),
('seo_title','en','seo','text','SEO title','Spectrum For Us — The queer marketplace'),
('seo_description','fr','seo','text','Meta description','Créations, services et événements par et pour la communauté LGBTQIA+.'),
('seo_description','en','seo','text','Meta description','Creations, services and events by and for the LGBTQIA+ community.')
ON CONFLICT (key, locale) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- 2. ANNUAIRE OVERRIDES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.annuaire_overrides (
  org_id        text PRIMARY KEY,
  logo_url      text,
  custom_name   text,
  custom_desc   text,
  website       text,
  phone         text,
  email         text,
  accent        text,
  is_featured   boolean DEFAULT false,
  is_hidden     boolean DEFAULT false,
  updated_at    timestamptz DEFAULT now(),
  updated_by    uuid REFERENCES auth.users(id)
);

ALTER TABLE public.annuaire_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_annuaire_overrides" ON public.annuaire_overrides;
DROP POLICY IF EXISTS "public_read_annuaire_overrides"   ON public.annuaire_overrides;

CREATE POLICY "admins_manage_annuaire_overrides" ON public.annuaire_overrides
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_read_annuaire_overrides" ON public.annuaire_overrides
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_annuaire_overrides_featured ON public.annuaire_overrides(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_annuaire_overrides_hidden   ON public.annuaire_overrides(is_hidden)   WHERE is_hidden   = true;

-- Bucket storage pour logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('annuaire-logos','annuaire-logos',true,2097152,
  ARRAY['image/png','image/jpeg','image/webp','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_annuaire_logos"   ON storage.objects;
DROP POLICY IF EXISTS "admins_upload_annuaire_logos"  ON storage.objects;
DROP POLICY IF EXISTS "admins_update_annuaire_logos"  ON storage.objects;
DROP POLICY IF EXISTS "admins_delete_annuaire_logos"  ON storage.objects;

CREATE POLICY "public_read_annuaire_logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'annuaire-logos');
CREATE POLICY "admins_upload_annuaire_logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'annuaire-logos' AND public.is_admin());
CREATE POLICY "admins_update_annuaire_logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'annuaire-logos' AND public.is_admin());
CREATE POLICY "admins_delete_annuaire_logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'annuaire-logos' AND public.is_admin());

-- ──────────────────────────────────────────────────────────────
-- 3. ARTICLES (blog)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  title_fr     text,
  title_en     text,
  title_ar     text,
  excerpt_fr   text,
  excerpt_en   text,
  excerpt_ar   text,
  body_fr      text,
  body_en      text,
  body_ar      text,
  cover_url    text,
  category     text,
  tags         text[],
  author_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published    boolean DEFAULT false,
  published_at timestamptz,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_articles"           ON public.articles;
DROP POLICY IF EXISTS "public_read_published_articles"   ON public.articles;

CREATE POLICY "admins_manage_articles" ON public.articles
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_read_published_articles" ON public.articles
  FOR SELECT USING (published = true);

CREATE INDEX IF NOT EXISTS idx_articles_slug      ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category  ON public.articles(category);

-- ──────────────────────────────────────────────────────────────
-- 4. CRM
-- ──────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE crm_stage AS ENUM (
    'identified','contacted','replied','meeting_scheduled',
    'proposal_sent','negotiation','won','lost','on_hold'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE crm_contact_type AS ENUM (
    'prospect_vendor','prospect_service','ambassador',
    'partner','media','investor','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.crm_contacts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  email             text,
  company           text,
  contact_type      crm_contact_type DEFAULT 'prospect_vendor',
  stage             crm_stage DEFAULT 'identified',
  source            text,
  tags              text[],
  notes             text,
  assigned_to       uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  next_followup_at  timestamptz,
  ai_score          smallint,
  ai_recommendation text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_crm_contacts" ON public.crm_contacts;
CREATE POLICY "admins_manage_crm_contacts" ON public.crm_contacts
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_crm_contacts_stage   ON public.crm_contacts(stage);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_type    ON public.crm_contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_updated ON public.crm_contacts(updated_at DESC);

CREATE TABLE IF NOT EXISTS public.crm_interactions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  type       text NOT NULL DEFAULT 'note',
  content    text,
  direction  text DEFAULT 'outbound',
  author_id  uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_crm_interactions" ON public.crm_interactions;
CREATE POLICY "admins_manage_crm_interactions" ON public.crm_interactions
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_crm_interactions_contact ON public.crm_interactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_interactions_created ON public.crm_interactions(created_at DESC);

-- ──────────────────────────────────────────────────────────────
-- 5. JOIN REQUESTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.join_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  profile     text,
  description text,
  instagram   text,
  website     text,
  status      text DEFAULT 'pending',
  notes       text,
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_join_requests"  ON public.join_requests;
DROP POLICY IF EXISTS "public_insert_join_requests"  ON public.join_requests;

CREATE POLICY "admins_manage_join_requests" ON public.join_requests
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_insert_join_requests" ON public.join_requests
  FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_join_requests_status  ON public.join_requests(status);
CREATE INDEX IF NOT EXISTS idx_join_requests_created ON public.join_requests(created_at DESC);

-- ──────────────────────────────────────────────────────────────
-- 6. QUEER EVENTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.queer_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  description  text,
  date_start   timestamptz NOT NULL,
  date_end     timestamptz,
  city         text,
  country_code text DEFAULT 'FR',
  venue        text,
  address      text,
  url          text,
  image_url    text,
  price        numeric(8,2),
  is_free      boolean DEFAULT false,
  category     text,
  organizer    text,
  source       text DEFAULT 'manual',
  moderation   text DEFAULT 'pending',
  is_featured  boolean DEFAULT false,
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.queer_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_events"        ON public.queer_events;
DROP POLICY IF EXISTS "public_read_approved_events" ON public.queer_events;
DROP POLICY IF EXISTS "public_insert_events"        ON public.queer_events;

CREATE POLICY "admins_manage_events" ON public.queer_events
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_read_approved_events" ON public.queer_events
  FOR SELECT USING (moderation = 'approved');
CREATE POLICY "public_insert_events" ON public.queer_events
  FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_queer_events_date       ON public.queer_events(date_start);
CREATE INDEX IF NOT EXISTS idx_queer_events_moderation ON public.queer_events(moderation);
CREATE INDEX IF NOT EXISTS idx_queer_events_city       ON public.queer_events(city);

-- ──────────────────────────────────────────────────────────────
-- 7. WORKSHOPS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workshops (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id        uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title            text,
  name             text,
  description      text,
  price            numeric(8,2),
  duration_minutes int,
  location_address text,
  city             text,
  country_code     text DEFAULT 'FR',
  category         text,
  max_participants int,
  is_online        boolean DEFAULT false,
  is_active        boolean DEFAULT true,
  listing_status   text DEFAULT 'pending',
  is_featured      boolean DEFAULT false,
  cover_url        text,
  tags             text[],
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_workshops"       ON public.workshops;
DROP POLICY IF EXISTS "vendors_manage_own_workshops"  ON public.workshops;
DROP POLICY IF EXISTS "public_read_active_workshops"  ON public.workshops;

CREATE POLICY "admins_manage_workshops" ON public.workshops
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "vendors_manage_own_workshops" ON public.workshops
  USING (vendor_id = auth.uid()) WITH CHECK (vendor_id = auth.uid());
CREATE POLICY "public_read_active_workshops" ON public.workshops
  FOR SELECT USING (is_active = true AND listing_status = 'active');

CREATE INDEX IF NOT EXISTS idx_workshops_status ON public.workshops(listing_status);
CREATE INDEX IF NOT EXISTS idx_workshops_vendor ON public.workshops(vendor_id);
CREATE INDEX IF NOT EXISTS idx_workshops_city   ON public.workshops(city);

-- ──────────────────────────────────────────────────────────────
-- 8. AMBASSADORS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ambassadors (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  email            text,
  instagram_handle text,
  profile_url      text,
  platform         text DEFAULT 'instagram',
  category         text,
  followers_count  int,
  description      text,
  outreach_status  text DEFAULT 'pending',
  email_sent_at    timestamptz,
  notes            text,
  user_id          uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE public.ambassadors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_ambassadors" ON public.ambassadors;
CREATE POLICY "admins_manage_ambassadors" ON public.ambassadors
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_ambassadors_status    ON public.ambassadors(outreach_status);
CREATE INDEX IF NOT EXISTS idx_ambassadors_followers ON public.ambassadors(followers_count DESC);

-- ──────────────────────────────────────────────────────────────
-- 9. VENDOR OUTREACH
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vendor_outreach (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  email            text,
  instagram_handle text,
  profile_url      text,
  platform         text DEFAULT 'instagram',
  category         text,
  followers_count  int,
  description      text,
  outreach_status  text DEFAULT 'pending',
  email_sent_at    timestamptz,
  notes            text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE public.vendor_outreach ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_vendor_outreach" ON public.vendor_outreach;
CREATE POLICY "admins_manage_vendor_outreach" ON public.vendor_outreach
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_vendor_outreach_status ON public.vendor_outreach(outreach_status);

-- ──────────────────────────────────────────────────────────────
-- 10. NEWSLETTER SUBSCRIBERS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text UNIQUE NOT NULL,
  locale          text DEFAULT 'fr',
  source          text DEFAULT 'homepage',
  confirmed       boolean DEFAULT false,
  confirm_token   text,
  confirmed_at    timestamptz,
  unsubscribed    boolean DEFAULT false,
  unsubscribed_at timestamptz,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_newsletter"  ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "public_insert_newsletter"  ON public.newsletter_subscribers;

CREATE POLICY "admins_manage_newsletter" ON public.newsletter_subscribers
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_insert_newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_newsletter_email     ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_confirmed ON public.newsletter_subscribers(confirmed);

-- ──────────────────────────────────────────────────────────────
-- 11. ADMIN SETTINGS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key        text PRIMARY KEY,
  value      text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_settings" ON public.admin_settings;
CREATE POLICY "admins_manage_settings" ON public.admin_settings
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ──────────────────────────────────────────────────────────────
-- 12. AI MESSAGES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent      text NOT NULL,
  role       text NOT NULL,
  content    text NOT NULL,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_ai_messages" ON public.ai_messages;
CREATE POLICY "admins_manage_ai_messages" ON public.ai_messages
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_ai_messages_agent   ON public.ai_messages(agent);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user    ON public.ai_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_session ON public.ai_messages(session_id);

-- ──────────────────────────────────────────────────────────────
-- 13. SITE CMS — PAGES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_pages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  title        text NOT NULL,
  description  text,
  is_published boolean DEFAULT true,
  sort_order   int DEFAULT 0,
  meta_title   text,
  meta_desc    text,
  og_image     text,
  updated_by   uuid REFERENCES auth.users(id),
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_site_pages" ON public.site_pages;
DROP POLICY IF EXISTS "public_read_site_pages"   ON public.site_pages;

CREATE POLICY "admins_manage_site_pages" ON public.site_pages
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_read_site_pages" ON public.site_pages
  FOR SELECT USING (is_published = true);

-- ──────────────────────────────────────────────────────────────
-- 14. SITE CMS — NAVIGATION
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_navigation (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location   text NOT NULL DEFAULT 'main',
  label      text NOT NULL,
  href       text NOT NULL,
  icon       text,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  parent_id  uuid REFERENCES public.site_navigation(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_navigation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_site_navigation" ON public.site_navigation;
DROP POLICY IF EXISTS "public_read_site_navigation"   ON public.site_navigation;

CREATE POLICY "admins_manage_site_navigation" ON public.site_navigation
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_read_site_navigation" ON public.site_navigation
  FOR SELECT USING (is_visible = true);

-- ──────────────────────────────────────────────────────────────
-- 15. SITE CMS — POPUPS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_popups (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  title      text,
  body       text,
  cta_label  text,
  cta_url    text,
  image_url  text,
  trigger    text DEFAULT 'exit_intent',
  delay_ms   int DEFAULT 3000,
  is_active  boolean DEFAULT false,
  locales    text[] DEFAULT ARRAY['fr'],
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_popups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_site_popups"  ON public.site_popups;
DROP POLICY IF EXISTS "public_read_active_popups"  ON public.site_popups;

CREATE POLICY "admins_manage_site_popups" ON public.site_popups
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_read_active_popups" ON public.site_popups
  FOR SELECT USING (is_active = true);

-- ──────────────────────────────────────────────────────────────
-- 16. SITE CMS — TESTIMONIALS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_testimonials (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  role         text,
  location     text,
  quote        text NOT NULL,
  avatar_url   text,
  rating       smallint DEFAULT 5,
  is_featured  boolean DEFAULT false,
  is_published boolean DEFAULT true,
  sort_order   int DEFAULT 0,
  updated_by   uuid REFERENCES auth.users(id),
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.site_testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_testimonials"            ON public.site_testimonials;
DROP POLICY IF EXISTS "public_read_published_testimonials"    ON public.site_testimonials;

CREATE POLICY "admins_manage_testimonials" ON public.site_testimonials
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_read_published_testimonials" ON public.site_testimonials
  FOR SELECT USING (is_published = true);

CREATE INDEX IF NOT EXISTS idx_site_testimonials_featured
  ON public.site_testimonials(is_featured) WHERE is_featured = true;
