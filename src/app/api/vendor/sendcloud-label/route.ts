import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendShippingNotification, trySend } from "@/lib/email";

const API = "https://panel.sendcloud.sc/api/v2";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  let body: { shipment_id?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Requête invalide" }, { status: 400 }); }
  if (!body.shipment_id) return NextResponse.json({ error: "shipment_id manquant" }, { status: 400 });

  const admin = createAdminClient();

  // Colis + vérif propriété boutique
  const { data: ship } = await admin.from("order_shipments")
    .select("id, order_id, shop_id, method_type, relay_point").eq("id", body.shipment_id).maybeSingle();
  if (!ship) return NextResponse.json({ error: "Colis introuvable" }, { status: 404 });
  const { data: shop } = await admin.from("shops").select("owner_id, name").eq("id", ship.shop_id).maybeSingle();
  if (shop?.owner_id !== user.id) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  // Identifiants Sendcloud du·de la vendeur·se
  const { data: cred } = await admin.from("vendor_shipping_credentials").select("*").eq("shop_id", ship.shop_id).maybeSingle();
  if (!cred?.public_key || !cred?.secret_key)
    return NextResponse.json({ error: "Connecte d'abord ton compte Sendcloud dans Livraison." }, { status: 400 });

  // Destinataire (commande)
  const { data: order } = await admin.from("orders")
    .select("shipping_name, shipping_address, shipping_zip, shipping_city, shipping_country, shipping_email").eq("id", ship.order_id).maybeSingle();
  if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  const auth = "Basic " + Buffer.from(`${cred.public_key}:${cred.secret_key}`).toString("base64");
  const toCountry = (order.shipping_country || "FR").slice(0, 2).toUpperCase() === "FR" ? "FR" : (order.shipping_country || "FR");

  try {
    // 1) Choisir une méthode d'expédition disponible
    const mRes = await fetch(`${API}/shipping_methods?to_country=${encodeURIComponent(toCountry)}`, { headers: { Authorization: auth } });
    const mJson = await mRes.json();
    if (!mRes.ok) return NextResponse.json({ error: "Sendcloud (méthodes) : " + (mJson?.error?.message ?? mRes.status) }, { status: 502 });
    const methods: Array<{ id: number; name: string }> = mJson?.shipping_methods ?? [];
    if (!methods.length) return NextResponse.json({ error: "Aucune méthode d'expédition Sendcloud disponible pour cette destination." }, { status: 400 });
    const relay = ship.method_type === "relay";
    const chosen = methods.find(m => relay ? /relais|mondial/i.test(m.name) : !/relais/i.test(m.name)) ?? methods[0];

    // 2) Créer le colis + demander l'étiquette
    const parcel: Record<string, unknown> = {
      name: order.shipping_name || "Client", address: order.shipping_address || "", house_number: "",
      city: order.shipping_city || "", postal_code: order.shipping_zip || "", country: toCountry,
      email: order.shipping_email || "", telephone: "", weight: "1.000",
      request_label: true, shipment: { id: chosen.id },
      from_name: cred.sender_name || shop?.name, from_address_1: cred.sender_address || "",
      from_city: cred.sender_city || "", from_postal_code: cred.sender_zip || "", from_country: cred.sender_country || "FR",
    };
    if (relay && (ship.relay_point as { id?: string } | null)?.id) parcel.to_service_point = (ship.relay_point as { id?: string }).id;

    const pRes = await fetch(`${API}/parcels`, {
      method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ parcel }),
    });
    const pJson = await pRes.json();
    if (!pRes.ok) return NextResponse.json({ error: "Sendcloud (colis) : " + (pJson?.error?.message ?? JSON.stringify(pJson).slice(0, 200)) }, { status: 502 });

    const p = pJson.parcel;
    const tracking = p?.tracking_number ?? null;
    const labelUrl = p?.label?.normal_printer?.[0] ?? p?.label?.label_printer ?? null;

    await admin.from("order_shipments").update({
      carrier: "Sendcloud", tracking_number: tracking, status: "shipped",
      shipped_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }).eq("id", ship.id);

    // E-mail acheteur·se
    try {
      let to = order.shipping_email as string | null;
      if (to) await trySend(() => sendShippingNotification({ to, orderRef: ship.order_id, trackingNumber: tracking ?? undefined, carrier: "Sendcloud" }));
    } catch {}

    return NextResponse.json({ ok: true, tracking, label_url: labelUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur Sendcloud";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
