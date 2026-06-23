import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiError } from "@/lib/admin/rbac";

// Export DAC7 : agrégat annuel par vendeur·se (entité légale) pour la déclaration
// marketplace UE. Une ligne par propriétaire : identité fiscale + nb transactions
// + montant brut + frais (commission) prélevés.
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  const year = Number(new URL(req.url).searchParams.get("year")) || new Date().getFullYear();
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year + 1}-01-01T00:00:00Z`;

  const admin = createAdminClient();
  const { data: shops } = await admin.from("shops").select("id, owner_id");
  if (!shops?.length) return apiError("Aucune boutique");
  const ownerOfShop: Record<string, string> = Object.fromEntries(shops.map(s => [s.id, s.owner_id]));
  const shopIds = shops.map(s => s.id);

  const [{ data: comm }, { data: kyc }] = await Promise.all([
    admin.from("commissions").select("shop_id, gross_amount, commission_amount, created_at").in("shop_id", shopIds).gte("created_at", from).lt("created_at", to),
    admin.from("vendor_kyc").select("shop_id, legal_name, tax_id, vat_number, address_country, kyc_status"),
  ]);

  // Identité par propriétaire (1re fiche KYC trouvée parmi ses boutiques)
  const kycByOwner: Record<string, { legal_name: string | null; tax_id: string | null; vat_number: string | null; address_country: string | null; kyc_status: string | null }> = {};
  for (const k of (kyc ?? []) as { shop_id: string; legal_name: string | null; tax_id: string | null; vat_number: string | null; address_country: string | null; kyc_status: string | null }[]) {
    const owner = ownerOfShop[k.shop_id]; if (!owner) continue;
    if (!kycByOwner[owner] || k.kyc_status === "verified") kycByOwner[owner] = k;
  }

  // Agrégat par propriétaire
  const agg: Record<string, { count: number; gross: number; commission: number }> = {};
  for (const c of (comm ?? []) as { shop_id: string; gross_amount: number; commission_amount: number }[]) {
    const owner = ownerOfShop[c.shop_id]; if (!owner) continue;
    const a = agg[owner] ?? (agg[owner] = { count: 0, gross: 0, commission: 0 });
    a.count++; a.gross += Number(c.gross_amount || 0); a.commission += Number(c.commission_amount || 0);
  }

  // E-mails (identifiant de repli)
  const owners = Object.keys(agg);
  const emails: Record<string, string> = {};
  await Promise.all(owners.map(async o => { try { const { data } = await admin.auth.admin.getUserById(o); emails[o] = data?.user?.email ?? ""; } catch { emails[o] = ""; } }));

  const head = ["Annee", "Vendeur (nom legal)", "Email", "Pays residence fiscale", "Identifiant fiscal (TIN)", "N TVA", "Nb transactions", "Montant brut EUR", "Frais preleves EUR", "Net verse EUR"];
  const rows = owners.map(o => {
    const k = kycByOwner[o] ?? { legal_name: null, tax_id: null, vat_number: null, address_country: null };
    const a = agg[o];
    return [year, k.legal_name ?? "", emails[o], k.address_country ?? "", k.tax_id ?? "", k.vat_number ?? "",
      a.count, a.gross.toFixed(2), a.commission.toFixed(2), (a.gross - a.commission).toFixed(2)];
  });
  const csv = [head, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");

  return new Response("﻿" + csv, {
    headers: { "Content-Type": "text/csv;charset=utf-8;", "Content-Disposition": `attachment; filename="dac7-${year}.csv"` },
  });
}
