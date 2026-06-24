import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo","cfo","moderation","commercial"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit  = Math.min(100, Number(searchParams.get("limit") ?? 20));
  const offset = (page - 1) * limit;

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";

  const supabase = createAdminClient();

  // Si filtre KYC status: récupérer les shop_ids éligibles d'abord
  let allowedShopIds: string[] | null = null;
  if (status) {
    const kycQuery = supabase.from("vendor_kyc").select("shop_id");
    const resolvedStatus = status === "pending"
      // shops sans kyc row OU kyc_status = pending
      ? null // traité en post-filter
      : status;
    if (resolvedStatus) {
      const { data: kycRows } = await kycQuery.eq("kyc_status", resolvedStatus);
      allowedShopIds = (kycRows ?? []).map(r => r.shop_id);
      if (allowedShopIds.length === 0) {
        return apiResponse([], { total: 0, page, limit });
      }
    }
  }

  let query = supabase
    .from("shops")
    .select("id, name, slug, is_active, created_at, city, owner_id", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) query = query.ilike("name", `%${search}%`);
  if (allowedShopIds) query = query.in("id", allowedShopIds);

  const { data: shops, error, count } = await query;
  if (error) return apiError(error.message);

  const shopIds = (shops ?? []).map(s => s.id);

  // Fetch KYC for these shops
  type KycRow = { shop_id: string; kyc_status: string | null; legal_name: string | null; siret: string | null; kyc_submitted_at: string | null };
  let kycRows: KycRow[] = [];
  if (shopIds.length > 0) {
    const { data } = await supabase.from("vendor_kyc").select("shop_id, kyc_status, legal_name, siret, kyc_submitted_at").in("shop_id", shopIds);
    kycRows = (data ?? []) as KycRow[];
  }
  const kycMap: Record<string, KycRow> = {};
  for (const k of kycRows) kycMap[k.shop_id] = k;

  // Fetch owner profiles
  const ownerIds = [...new Set((shops ?? []).map(s => s.owner_id).filter(Boolean))];
  const profileMap: Record<string, { full_name: string | null }> = {};
  if (ownerIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", ownerIds);
    for (const p of profiles ?? []) profileMap[p.id] = p;
  }

  let enriched = (shops ?? []).map(s => ({
    ...s,
    vendor_kyc: kycMap[s.id] ?? null,
    profiles: profileMap[s.owner_id] ?? null,
  }));

  // Post-filter for "pending" (shops sans entrée KYC OU kyc_status = pending)
  if (status === "pending") {
    enriched = enriched.filter(s => {
      const k = s.vendor_kyc as { kyc_status?: string } | null;
      return !k || (k.kyc_status ?? "pending") === "pending";
    });
  }

  return apiResponse(enriched, { total: count ?? 0, page, limit });
}
