import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/rbac";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("founder_program_members")
    .select(`
      rank, status, subscription_free_until, commission_free_until,
      commission_rate_override, created_at,
      profiles:user_id ( full_name ),
      shops:shop_id ( name, slug )
    `)
    .order("rank", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const header = "Rank,Statut,Nom,Pseudo,Boutique,Slug,Abonnement gratuit jusqu'au,Commission 0%% jusqu'au,Taux commission,Inscrit le\n";
  const csv = rows.map((r) => {
    const p = r.profiles as { full_name?: string } | null;
    const s = r.shops    as { name?: string; slug?: string }        | null;
    const commRate = r.commission_rate_override != null
      ? `${(Number(r.commission_rate_override) * 100).toFixed(1)}%`
      : "défaut";
    return [
      r.rank,
      r.status,
      p?.full_name ?? "",
      "",
      s?.name ?? "",
      s?.slug ?? "",
      r.subscription_free_until ?? "",
      r.commission_free_until ?? "",
      commRate,
      r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR") : "",
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
  }).join("\n");

  return new NextResponse(header + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="founder-program-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  });
}
