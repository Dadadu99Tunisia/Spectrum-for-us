import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendShippingNotification, trySend } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  let body: { shipment_id?: string; carrier?: string; tracking_number?: string; status?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Requête invalide" }, { status: 400 }); }

  const { shipment_id, carrier, tracking_number, status } = body;
  if (!shipment_id) return NextResponse.json({ error: "shipment_id manquant" }, { status: 400 });

  const newStatus = status === "delivered" ? "delivered" : "shipped";

  // Mise à jour sous RLS : seul·e le·la propriétaire de la boutique peut modifier ce colis
  const { data: updated, error } = await supabase
    .from("order_shipments")
    .update({
      carrier: carrier?.trim() || null,
      tracking_number: tracking_number?.trim() || null,
      status: newStatus,
      shipped_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", shipment_id)
    .select("id, order_id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!updated) return NextResponse.json({ error: "Colis introuvable ou non autorisé" }, { status: 403 });

  // E-mail acheteur·se (best-effort, non bloquant)
  try {
    const admin = createAdminClient();
    const { data: order } = await admin
      .from("orders")
      .select("id, shipping_email, user_id")
      .eq("id", updated.order_id)
      .maybeSingle();
    let to = order?.shipping_email as string | null;
    if (!to && order?.user_id) {
      const { data: prof } = await admin.from("profiles").select("email").eq("id", order.user_id).maybeSingle();
      to = (prof?.email as string) ?? null;
    }
    if (to && newStatus === "shipped") {
      await trySend(() => sendShippingNotification({
        to,
        orderRef: updated.order_id,
        trackingNumber: tracking_number?.trim() || undefined,
        carrier: carrier?.trim() || undefined,
      }));
    }
  } catch (e) {
    console.error("[shipment] email non bloquant", e);
  }

  return NextResponse.json({ ok: true, status: newStatus });
}
