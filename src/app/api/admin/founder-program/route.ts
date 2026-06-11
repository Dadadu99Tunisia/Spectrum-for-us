import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/rbac";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status") ?? "";
  const search       = searchParams.get("search") ?? "";
  const page         = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit        = 50;
  const from         = (page - 1) * limit;

  // ── Step 1: fetch founder members ──────────────────────────────────────────
  let query = supabase
    .from("founder_program_members")
    .select(
      "id, rank, status, subscription_free_until, commission_free_until, " +
      "commission_rate_override, is_founder, is_early_adopter, notes, " +
      "created_at, updated_at, user_id, shop_id",
      { count: "exact" }
    )
    .order("rank", { ascending: true })
    .range(from, from + limit - 1);

  if (statusFilter) query = query.eq("status", statusFilter);

  const { data: members, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  type MemberRow = {
    id: string; rank: number; status: string;
    subscription_free_until: string | null; commission_free_until: string | null;
    commission_rate_override: number | null; is_founder: boolean; is_early_adopter: boolean;
    notes: string | null; created_at: string; updated_at: string;
    user_id: string; shop_id: string;
  };
  const rows = (members ?? []) as unknown as MemberRow[];

  // ── Step 2: batch-fetch profiles + shops ───────────────────────────────────
  const userIds = [...new Set(rows.map(r => r.user_id))];
  const shopIds = [...new Set(rows.map(r => r.shop_id))];

  const [profilesRes, shopsRes, countsRes] = await Promise.all([
    userIds.length > 0
      ? supabase.from("profiles").select("id, full_name, pseudo").in("id", userIds)
      : { data: [] },
    shopIds.length > 0
      ? supabase.from("shops").select("id, name, slug, is_active").in("id", shopIds)
      : { data: [] },
    supabase.from("founder_program_counts").select("*").single(),
  ]);

  const profileMap = Object.fromEntries(
    (profilesRes.data ?? []).map((p: { id: string; full_name: string | null; pseudo: string | null }) => [p.id, p])
  );
  const shopMap = Object.fromEntries(
    (shopsRes.data ?? []).map((s: { id: string; name: string | null; slug: string | null; is_active: boolean }) => [s.id, s])
  );

  // ── Step 3: enrich rows ────────────────────────────────────────────────────
  let enriched = rows.map(r => ({
    ...r,
    profiles: profileMap[r.user_id] ?? null,
    shops:    shopMap[r.shop_id]    ?? null,
  }));

  // Client-side search filter
  if (search) {
    const q = search.toLowerCase();
    enriched = enriched.filter(r => {
      const p = r.profiles as { full_name?: string | null; pseudo?: string | null } | null;
      const s = r.shops    as { name?: string | null; slug?: string | null }        | null;
      return (
        p?.full_name?.toLowerCase().includes(q) ||
        p?.pseudo?.toLowerCase().includes(q)    ||
        s?.name?.toLowerCase().includes(q)
      );
    });
  }

  return NextResponse.json({
    data:   enriched,
    meta:   { total: count ?? 0, page, limit },
    counts: countsRes.data ?? null,
  });
}
