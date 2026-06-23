import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCommissionRates } from "@/lib/commission";

// Taux de commission publics (non sensibles) · pour l'onboarding et le tableau de
// bord vendeur·se (transparence : « pas d'abonnement, X % prélevés sur tes ventes »).
export const revalidate = 300;

export async function GET() {
  try {
    const admin = createAdminClient();
    const rates = await getCommissionRates(admin);
    const { data: hold } = await admin.from("admin_settings").select("value").eq("key", "manual_payout_hold_days").maybeSingle();
    const holdDays = Number.isFinite(Number(hold?.value)) ? Number(hold?.value) : 7;
    return NextResponse.json({
      defaultRate: rates.defaultRate,
      manualRate: rates.manualRate,
      manualFounderRate: rates.manualFounderRate,
      holdDays,
    });
  } catch {
    return NextResponse.json({ defaultRate: 5, manualRate: 12, manualFounderRate: 6, holdDays: 7 });
  }
}
