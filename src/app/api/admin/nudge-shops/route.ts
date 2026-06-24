import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";
import { sendActivatePayments, sendAddFirstProduct } from "@/lib/email";

// Relance manuelle (déclenchée par l'admin) :
//  - boutiques sans paiement activé → email « active tes paiements »
//  - boutiques sans aucun produit → email « ajoute ta 1ʳᵉ création »
// GET = aperçu (dry-run, n'envoie rien) · POST = envoie réellement.
async function buildTargets() {
  const admin = createAdminClient();
  const { data: shops } = await admin.from("shops")
    .select("id, name, owner_id, stripe_charges_enabled, payout_mode");
  const ids = (shops ?? []).map(s => s.id);
  const { data: prods } = await admin.from("products").select("shop_id").in("shop_id", ids);
  const prodCount: Record<string, number> = {};
  for (const p of (prods ?? []) as { shop_id: string }[]) prodCount[p.shop_id] = (prodCount[p.shop_id] ?? 0) + 1;

  const noPay: { name: string; owner_id: string }[] = [];
  const noProduct: { name: string; owner_id: string }[] = [];
  for (const s of (shops ?? []) as { id: string; name: string; owner_id: string; stripe_charges_enabled: boolean; payout_mode: string }[]) {
    const ready = s.stripe_charges_enabled === true || s.payout_mode === "manual";
    if (!ready) noPay.push({ name: s.name, owner_id: s.owner_id });
    else if ((prodCount[s.id] ?? 0) === 0) noProduct.push({ name: s.name, owner_id: s.owner_id });
  }
  return { admin, noPay, noProduct };
}

async function emailOf(admin: ReturnType<typeof createAdminClient>, ownerId: string) {
  try { const { data } = await admin.auth.admin.getUserById(ownerId); return data?.user?.email ?? null; }
  catch { return null; }
}

export async function GET() {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing"]);
  if ("error" in auth) return auth.error;
  const { admin, noPay, noProduct } = await buildTargets();
  const withEmail = async (l: { name: string; owner_id: string }[]) =>
    Promise.all(l.map(async x => ({ name: x.name, email: await emailOf(admin, x.owner_id) })));
  return apiResponse({ activate_payment: await withEmail(noPay), add_product: await withEmail(noProduct) });
}

export async function POST() {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing"]);
  if ("error" in auth) return auth.error;
  if (!process.env.RESEND_API_KEY) return apiError("RESEND_API_KEY manquant — emails non envoyés.", 503);

  const { admin, noPay, noProduct } = await buildTargets();
  const sent = { activate_payment: [] as string[], add_product: [] as string[] };
  const failed: string[] = [];

  for (const s of noPay) {
    const email = await emailOf(admin, s.owner_id);
    if (!email) continue;
    try { await sendActivatePayments({ to: email, pseudo: s.name }); sent.activate_payment.push(email); }
    catch { failed.push(email); }
  }
  for (const s of noProduct) {
    const email = await emailOf(admin, s.owner_id);
    if (!email) continue;
    try { await sendAddFirstProduct({ to: email, shopName: s.name }); sent.add_product.push(email); }
    catch { failed.push(email); }
  }

  return apiResponse({ sent, failed, count: sent.activate_payment.length + sent.add_product.length });
}
