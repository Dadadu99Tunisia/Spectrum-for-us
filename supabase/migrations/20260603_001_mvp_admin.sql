-- ═══════════════════════════════════════════════════════════════
-- SPECTRUM FOR US — MVP ADMIN MIGRATION
-- 20260603_001_mvp_admin.sql
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- MODULE 2 : USERS & ROLES
-- ──────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'super_admin','ceo','cfo','marketing','commercial',
    'support','moderation','hr','vendor','buyer'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'buyer';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_suspended boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_reason text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country text;

CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  metadata jsonb,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ──────────────────────────────────────────────────────────────
-- MODULE 3 : VENDORS KYC
-- ──────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE kyc_status AS ENUM ('pending','submitted','verified','rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS vendor_kyc (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE UNIQUE,
  legal_name text,
  legal_type text,
  siret text,
  vat_number text,
  iban text,
  bic text,
  stripe_account_id text,
  id_document_url text,
  kyc_status kyc_status DEFAULT 'pending',
  kyc_submitted_at timestamptz,
  kyc_verified_at timestamptz,
  kyc_notes text,
  address_line1 text,
  address_city text,
  address_zip text,
  address_country text DEFAULT 'FR',
  instagram_url text,
  website_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vendor_kyc_status ON vendor_kyc(kyc_status);

-- ──────────────────────────────────────────────────────────────
-- MODULE 6 : ORDERS ENRICHI
-- ──────────────────────────────────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispute_status text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispute_opened_at timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_status text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_amount numeric(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier text;

-- ──────────────────────────────────────────────────────────────
-- MODULE 10 : MODÉRATION
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS moderation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reason text,
  mod_status text DEFAULT 'pending',
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_moderation_status ON moderation_queue(mod_status);
CREATE INDEX IF NOT EXISTS idx_moderation_created ON moderation_queue(created_at DESC);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  target_type text,
  target_id uuid,
  reason text,
  details text,
  status text DEFAULT 'open',
  resolved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- MODULE 11 : SUPPORT
-- ──────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE ticket_priority AS ENUM ('low','medium','high','urgent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('open','assigned','in_progress','waiting','resolved','closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  subject text NOT NULL,
  category text,
  priority ticket_priority DEFAULT 'medium',
  ticket_status ticket_status DEFAULT 'open',
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  first_response_at timestamptz,
  resolved_at timestamptz,
  sla_due_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_support_status ON support_tickets(ticket_status);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  is_internal boolean DEFAULT false,
  attachments text[],
  created_at timestamptz DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- MODULE 7 : COMPTABILITÉ (structure de base)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  type text DEFAULT 'invoice',
  vendor_id uuid REFERENCES shops(id) ON DELETE SET NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  amount_ht numeric(10,2),
  vat_rate numeric(5,2) DEFAULT 20.0,
  amount_ttc numeric(10,2),
  commission_amount numeric(10,2),
  stripe_transfer_id text,
  paid_at timestamptz,
  due_at timestamptz,
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- RLS POLICIES
-- ──────────────────────────────────────────────────────────────
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Admin full access (uses service role in API routes, but protect UI reads)
CREATE POLICY "admin_full_activity_logs" ON activity_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin','ceo','cfo','support','moderation','hr'))
  );

CREATE POLICY "admin_full_vendor_kyc" ON vendor_kyc
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin','ceo','cfo','moderation','commercial'))
  );

CREATE POLICY "admin_full_moderation" ON moderation_queue
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin','ceo','moderation','support'))
  );

CREATE POLICY "admin_full_reports" ON reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin','ceo','moderation','support'))
  );

CREATE POLICY "admin_support_tickets" ON support_tickets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin','ceo','support'))
    OR user_id = auth.uid()
  );

CREATE POLICY "admin_ticket_messages" ON ticket_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM support_tickets st
      JOIN profiles p ON p.id = auth.uid()
      WHERE st.id = ticket_id
        AND (p.role IN ('super_admin','ceo','support') OR st.user_id = auth.uid())
    )
  );

CREATE POLICY "admin_invoices" ON invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin','ceo','cfo'))
  );

-- ──────────────────────────────────────────────────────────────
-- RPC : check admin role
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_my_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role IN ('super_admin','ceo','cfo','marketing','commercial','support','moderation','hr')
     FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

-- RPC : admin dashboard KPIs (bypasses RLS)
CREATE OR REPLACE FUNCTION admin_dashboard_kpis()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_today_start timestamptz := date_trunc('day', now());
  v_month_start timestamptz := date_trunc('month', now());
  v_year_start  timestamptz := date_trunc('year', now());
BEGIN
  SELECT jsonb_build_object(
    'revenue_today',    COALESCE((SELECT SUM(total) FROM orders WHERE status='paid' AND created_at >= v_today_start), 0),
    'revenue_month',    COALESCE((SELECT SUM(total) FROM orders WHERE status='paid' AND created_at >= v_month_start), 0),
    'revenue_year',     COALESCE((SELECT SUM(total) FROM orders WHERE status='paid' AND created_at >= v_year_start), 0),
    'orders_today',     COALESCE((SELECT COUNT(*) FROM orders WHERE status='paid' AND created_at >= v_today_start), 0),
    'orders_month',     COALESCE((SELECT COUNT(*) FROM orders WHERE status='paid' AND created_at >= v_month_start), 0),
    'orders_total',     COALESCE((SELECT COUNT(*) FROM orders WHERE status='paid'), 0),
    'vendors_active',   COALESCE((SELECT COUNT(*) FROM shops WHERE is_active=true), 0),
    'buyers_count',     COALESCE((SELECT COUNT(*) FROM profiles WHERE role='buyer'), 0),
    'avg_basket',       COALESCE((SELECT AVG(total) FROM orders WHERE status='paid' AND created_at >= v_year_start), 0),
    'pending_mod',      COALESCE((SELECT COUNT(*) FROM moderation_queue WHERE mod_status='pending'), 0),
    'open_tickets',     COALESCE((SELECT COUNT(*) FROM support_tickets WHERE ticket_status='open'), 0),
    'pending_kyc',      COALESCE((SELECT COUNT(*) FROM vendor_kyc WHERE kyc_status='submitted'), 0)
  ) INTO v_result;
  RETURN v_result;
END;
$$;
