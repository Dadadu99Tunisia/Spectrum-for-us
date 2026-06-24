import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendShippingNotification, trySend } from "@/lib/email";
import { buyLabelOnParcel } from "@/lib/sendcloud";

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
    .select("id, order_id, shop_id, method_type, relay_point, sendcloud_parcel_id").eq("id", body.shipment_id).maybeSingle();
  if (!ship) return NextResponse.json({ error: "Colis introuvable" }, { status: 404 });
  const { data: shop } = await admin.from("shops").select("owner_id, name").eq("id", ship.shop_id).maybeSingle();
  if (shop?.owner_id !== user.id) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  // Identifiants Sendcloud : compte plateforme (Vercel env) en priorité, sinon compte du·de la vendeur·se
  const { data: cred } = await admin.from("vendor_shipping_credentials").select("*").eq("shop_id", ship.shop_id).maybeSingle();
  const pub = process.env.SENDCLOUD_PUBLIC_KEY || cred?.public_key;
  const sec = process.env.SENDCLOUD_SECRET_KEY || cred?.secret_key;
  if (!pub || !sec)
    return NextResponse.json({ error: "Sendcloud non configuré (clés manquantes)." }, { status: 400 });

  // Destinataire (commande)
  const { data: order } = await admin.from("orders")
    .select("shipping_name, shipping_address, shipping_zip, shipping_city, shipping_country, shipping_email").eq("id", ship.order_id).maybeSingle();
  if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  const auth = "Basic " + Buffer.from(`${pub}:${sec}`).toString("base64");

  // Si le colis a déjà été ANNONCÉ (auto au paiement), on achète l'étiquette
  // dessus au lieu d'en créer un doublon.
  if (ship.sendcloud_parcel_id) {
    try {
      const r = await buyLabelOnParcel(auth, ship.sendcloud_parcel_id as string);
      await admin.from("order_shipments").update({
        carrier: "Sendcloud", tracking_number: r.tracking, status: "shipped",
        shipped_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }).eq("id", ship.id);
      try {
        const { data: o } = await admin.from("orders").select("shipping_email").eq("id", ship.order_id).maybeSingle();
        if (o?.shipping_email) await trySend(() => sendShippingNotification({ to: o.shipping_email as string, orderRef: ship.order_id, trackingNumber: r.tracking ?? undefined, carrier: "Sendcloud" }));
      } catch {}
      return NextResponse.json({ ok: true, tracking: r.tracking, label_url: r.labelUrl, reused: true });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur Sendcloud" }, { status: 502 });
    }
  }
  const senderName = cred?.sender_name || process.env.SENDCLOUD_SENDER_NAME || shop?.name || "Spectrum";
  const senderAddr = cred?.sender_address || process.env.SENDCLOUD_SENDER_ADDRESS || "";
  const senderZip = cred?.sender_zip || process.env.SENDCLOUD_SENDER_ZIP || "";
  const senderCity = cred?.sender_city || process.env.SENDCLOUD_SENDER_CITY || "";
  const senderCountry = cred?.sender_country || process.env.SENDCLOUD_SENDER_COUNTRY || "FR";
  const toCountry = (order.shipping_country || "FR").slice(0, 2).toUpperCase() === "FR" ? "FR" : (order.shipping_country || "FR");

  // Poids réel du colis = somme des poids produits de cette boutique dans la commande
  const { data: oitems } = await admin.from("order_items")
    .select("quantity, products(weight_grams)").eq("order_id", ship.order_id).eq("vendor_id", shop.owner_id);
  const grams = (oitems ?? []).reduce((s, it) => {
    const w = Number((it.products as { weight_grams?: number } | null)?.weight_grams ?? 500);
    return s + (isNaN(w) ? 500 : w) * (it.quantity ?? 1);
  }, 0);
  const weightKg = Math.max(0.05, grams / 1000).toFixed(3); // min 50 g

  try {
    // 1) Choisir une méthode d'expédition disponible
    const mRes = await fetch(`${API}/shipping_methods?to_country=${encodeURIComponent(toCountry)}`, { headers: { Authorization: auth } });
    const mJson = await mRes.json();
    if (!mRes.ok) return NextResponse.json({ error: "Sendcloud (méthodes) : " + (mJson?.error?.message ?? mRes.status) }, { status: 502 });
    type SCM = { id: number; name: string; countries?: Array<{ iso_2: string; price: number }> };
    const methods: SCM[] = mJson?.shipping_methods ?? [];
    if (!methods.length) return NextResponse.json({ error: "Aucune méthode d'expédition Sendcloud disponible pour cette destination." }, { status: 400 });
    const relay = ship.method_type === "relay";
    const priceFor = (m: SCM) => {
      const c = m.countries?.find(x => x.iso_2 === toCountry);
      return c ? Number(c.price) : Infinity;
    };
    // Filtre selon point relais vs domicile, puis prend la MOINS CHÈRE
    const candidates = methods.filter(m => relay ? /relais|mondial|point|service.?point/i.test(m.name) : !/relais|point.?relais/i.test(m.name));
    const pool = candidates.length ? candidates : methods;
    const chosen = [...pool].sort((a, b) => priceFor(a) - priceFor(b))[0];
    const chosenPrice = priceFor(chosen);

    // 2) Créer le colis + demander l'étiquette
    const parcel: Record<string, unknown> = {
      name: order.shipping_name || "Client", address: order.shipping_address || "", house_number: "",
      city: order.shipping_city || "", postal_code: order.shipping_zip || "", country: toCountry,
      email: order.shipping_email || "", telephone: "", weight: weightKg,
      request_label: true, shipment: { id: chosen.id },
      from_name: senderName, from_address_1: senderAddr,
      from_city: senderCity, from_postal_code: senderZip, from_country: senderCountry,
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

    return NextResponse.json({ ok: true, tracking, label_url: labelUrl, method: chosen?.name, price: isFinite(chosenPrice) ? chosenPrice : null });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur Sendcloud";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
