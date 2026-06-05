-- ═══════════════════════════════════════════════════════════════════════════
-- Spectrum — Founder Program
-- Migration: 20260605_001_founder_program
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Status enum ──────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE founder_status AS ENUM ('FOUNDER', 'EARLY_ADOPTER', 'STANDARD');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── 2. Sequence for immutable rank attribution ───────────────────────────────
-- Using a dedicated sequence guarantees no gaps / no reorders under concurrency
CREATE SEQUENCE IF NOT EXISTS founder_rank_seq START 1 INCREMENT 1 NO CYCLE;

-- ─── 3. Main table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.founder_program_members (
  id                      uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid          NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  shop_id                 uuid          NOT NULL REFERENCES public.shops(id) ON DELETE RESTRICT,
  rank                    int           NOT NULL UNIQUE DEFAULT nextval('founder_rank_seq'),
  status                  founder_status NOT NULL DEFAULT 'STANDARD',
  subscription_free_until date          NULL,
  commission_free_until   date          NULL,       -- distinct from subscription
  commission_rate_override numeric(5,4)  NULL,       -- e.g. 0.0000 = 0 %, 0.0800 = 8 %
  is_founder              boolean       NOT NULL GENERATED ALWAYS AS (status = 'FOUNDER') STORED,
  is_early_adopter        boolean       NOT NULL GENERATED ALWAYS AS (status = 'EARLY_ADOPTER') STORED,
  notes                   text          NULL,        -- admin override note
  created_at              timestamptz   NOT NULL DEFAULT now(),
  updated_at              timestamptz   NOT NULL DEFAULT now()
);

-- Prevent a user from having more than one entry (they keep their slot forever)
CREATE UNIQUE INDEX IF NOT EXISTS founder_program_members_user_id_idx
  ON public.founder_program_members(user_id);

-- Fast lookup by shop
CREATE INDEX IF NOT EXISTS founder_program_members_shop_id_idx
  ON public.founder_program_members(shop_id);

-- ─── 4. updated_at trigger ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_founder_program_updated_at ON public.founder_program_members;
CREATE TRIGGER trg_founder_program_updated_at
  BEFORE UPDATE ON public.founder_program_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 5. Auto-enroll trigger ───────────────────────────────────────────────────
-- Fires after INSERT on shops.
-- Uses nextval() which is MVCC-safe → no rank collision under concurrent inserts.
CREATE OR REPLACE FUNCTION public.enroll_founder_program()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_rank    int;
  v_status  founder_status;
  v_sub_until   date;
  v_comm_until  date;
  v_comm_rate   numeric(5,4);
BEGIN
  -- Only enroll once per user (handles vendor re-creation edge case)
  IF EXISTS (
    SELECT 1 FROM public.founder_program_members WHERE user_id = NEW.user_id
  ) THEN
    RETURN NEW;
  END IF;

  -- Claim the next immutable rank
  v_rank := nextval('founder_rank_seq');

  -- Determine status & benefits
  IF v_rank <= 20 THEN
    v_status     := 'FOUNDER';
    v_sub_until  := (CURRENT_DATE + INTERVAL '3 years')::date;
    v_comm_until := (CURRENT_DATE + INTERVAL '12 months')::date;
    v_comm_rate  := 0.0000;
  ELSIF v_rank <= 100 THEN
    v_status     := 'EARLY_ADOPTER';
    v_sub_until  := (CURRENT_DATE + INTERVAL '6 months')::date;
    v_comm_until := (CURRENT_DATE + INTERVAL '6 months')::date;
    v_comm_rate  := 0.0000;
  ELSE
    v_status     := 'STANDARD';
    v_sub_until  := NULL;
    v_comm_until := NULL;
    v_comm_rate  := NULL;  -- use platform default
  END IF;

  INSERT INTO public.founder_program_members
    (user_id, shop_id, rank, status, subscription_free_until, commission_free_until, commission_rate_override)
  VALUES
    (NEW.user_id, NEW.id, v_rank, v_status, v_sub_until, v_comm_until, v_comm_rate);

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_enroll_founder_program ON public.shops;
CREATE TRIGGER trg_enroll_founder_program
  AFTER INSERT ON public.shops
  FOR EACH ROW EXECUTE FUNCTION public.enroll_founder_program();

-- ─── 6. Helper view (for public banner counts) ────────────────────────────────
CREATE OR REPLACE VIEW public.founder_program_counts AS
SELECT
  COUNT(*) FILTER (WHERE status = 'FOUNDER')        AS founder_count,
  COUNT(*) FILTER (WHERE status = 'EARLY_ADOPTER')  AS early_adopter_count,
  20  AS founder_slots,
  100 AS early_adopter_slots,
  GREATEST(0, 20  - COUNT(*) FILTER (WHERE status = 'FOUNDER'))       AS founder_remaining,
  GREATEST(0, 100 - COUNT(*) FILTER (WHERE status = 'EARLY_ADOPTER')) AS early_remaining
FROM public.founder_program_members;

-- ─── 7. RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE public.founder_program_members ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read own row + basic fields (for badge display)
DROP POLICY IF EXISTS "founder_public_read" ON public.founder_program_members;
CREATE POLICY "founder_public_read"
  ON public.founder_program_members FOR SELECT
  USING (true);  -- all rows readable (status/badge is public info)

-- Write: only service_role / admins via SECURITY DEFINER trigger
DROP POLICY IF EXISTS "founder_admin_write" ON public.founder_program_members;
CREATE POLICY "founder_admin_write"
  ON public.founder_program_members FOR ALL
  USING (is_admin());

-- View is public (used by banner component — no auth needed)
GRANT SELECT ON public.founder_program_counts TO anon, authenticated;
GRANT SELECT ON public.founder_program_members TO anon, authenticated;
