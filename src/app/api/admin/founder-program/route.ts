import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/rbac";

// GET — full list ordered by rank
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status") ?? "";
  const search       = searchParams.get("search") ?? "";
  const page         = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit        = 50;
  const from         = (page - 1) * limit;

  let query = supabase
    .from("founder_program_members")
    .select(`
      id, rank, status, subscription_free_until, commission_free_until,
      commission_rate_override, is_founder, is_early_adopter, notes,
      created_at, updated_at,
      profiles:user_id ( id, full_name, pseudo, email:id ),
      shops:shop_id ( id, name, slug, is_active )
    `, { count: "exact" })
    .order("rank", { ascending: true })
    .range(from, from + limit - 1);

  if (statusFilter) query = query.eq("status", statusFilter);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enrich with email via auth.users — done via profiles join above
  // Also fetch counts for the header stats
  const { data: counts } = await supabase
    .from("founder_program_counts")
    .select("*")
    .single();

  let rows = data ?? [];

  // Client-side search filter (name / shop)
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((r) => {
      const p = r.profiles as { full_name?: string; pseudo?: string } | null;
      const s = r.shops as { name?: string; slug?: string } | null;
      return (
        p?.full_name?.toLowerCase().includes(q) ||
        p?.pseudo?.toLowerCase().includes(q) ||
        s?.name?.toLowerCase().includes(q)
      );
    });
  }

  return NextResponse.json({ data: rows, meta: { total: count ?? 0, page, limit }, counts });
}
