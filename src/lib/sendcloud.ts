// Helpers Sendcloud partagés (annonce auto du colis au paiement + génération
// d'étiquette à la demande). Utilise les clés PLATEFORME (Vercel env).

const API = "https://panel.sendcloud.sc/api/v2";

export interface SendcloudConfig {
  auth: string;
  sender: { name: string; address: string; zip: string; city: string; country: string };
}

/** Config plateforme depuis l'env. null si non configuré → l'appelant skip proprement. */
export function sendcloudConfig(): SendcloudConfig | null {
  const pub = process.env.SENDCLOUD_PUBLIC_KEY;
  const sec = process.env.SENDCLOUD_SECRET_KEY;
  if (!pub || !sec) return null;
  return {
    auth: "Basic " + Buffer.from(`${pub}:${sec}`).toString("base64"),
    sender: {
      name: process.env.SENDCLOUD_SENDER_NAME || "Spectrum For Us",
      address: process.env.SENDCLOUD_SENDER_ADDRESS || "",
      zip: process.env.SENDCLOUD_SENDER_ZIP || "",
      city: process.env.SENDCLOUD_SENDER_CITY || "",
      country: process.env.SENDCLOUD_SENDER_COUNTRY || "FR",
    },
  };
}

type SCM = { id: number; name: string; countries?: Array<{ iso_2: string; price: number }> };

/** Méthode d'expédition la moins chère pour la destination (relais vs domicile). */
export async function pickCheapestMethod(auth: string, toCountry: string, relay: boolean): Promise<{ id: number; name: string; price: number } | null> {
  const res = await fetch(`${API}/shipping_methods?to_country=${encodeURIComponent(toCountry)}`, { headers: { Authorization: auth } });
  const json = await res.json();
  if (!res.ok) return null;
  const methods: SCM[] = json?.shipping_methods ?? [];
  if (!methods.length) return null;
  const priceFor = (m: SCM) => { const c = m.countries?.find(x => x.iso_2 === toCountry); return c ? Number(c.price) : Infinity; };
  const candidates = methods.filter(m => relay ? /relais|mondial|point|service.?point/i.test(m.name) : !/relais|point.?relais/i.test(m.name));
  const pool = candidates.length ? candidates : methods;
  const chosen = [...pool].sort((a, b) => priceFor(a) - priceFor(b))[0];
  return chosen ? { id: chosen.id, name: chosen.name, price: priceFor(chosen) } : null;
}

export interface ParcelInput {
  recipient: { name: string; address: string; city: string; zip: string; country: string; email: string };
  weightKg: string;             // "0.250"
  methodId: number;
  servicePointId?: string | null;
  requestLabel: boolean;        // false = annonce seule ; true = achète l'étiquette
}

export interface ParcelResult { parcelId: string | null; tracking: string | null; labelUrl: string | null }

/** Crée (annonce ou achète) un colis Sendcloud. */
export async function createParcel(cfg: SendcloudConfig, input: ParcelInput): Promise<ParcelResult> {
  const toCountry = (input.recipient.country || "FR").slice(0, 2).toUpperCase() === "FR" ? "FR" : input.recipient.country;
  const parcel: Record<string, unknown> = {
    name: input.recipient.name || "Client", address: input.recipient.address || "", house_number: "",
    city: input.recipient.city || "", postal_code: input.recipient.zip || "", country: toCountry,
    email: input.recipient.email || "", telephone: "", weight: input.weightKg,
    request_label: input.requestLabel, shipment: { id: input.methodId },
    from_name: cfg.sender.name, from_address_1: cfg.sender.address,
    from_city: cfg.sender.city, from_postal_code: cfg.sender.zip, from_country: cfg.sender.country,
  };
  if (input.servicePointId) parcel.to_service_point = input.servicePointId;

  const res = await fetch(`${API}/parcels`, {
    method: "POST", headers: { Authorization: cfg.auth, "Content-Type": "application/json" },
    body: JSON.stringify({ parcel }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error("Sendcloud (colis) : " + (json?.error?.message ?? JSON.stringify(json).slice(0, 200)));
  const p = json.parcel;
  return {
    parcelId: p?.id != null ? String(p.id) : null,
    tracking: p?.tracking_number ?? null,
    labelUrl: p?.label?.normal_printer?.[0] ?? p?.label?.label_printer ?? null,
  };
}

/** Achète l'étiquette sur un colis déjà annoncé (évite les doublons). */
export async function buyLabelOnParcel(auth: string, parcelId: string): Promise<ParcelResult> {
  const res = await fetch(`${API}/parcels`, {
    method: "PUT", headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({ parcel: { id: Number(parcelId), request_label: true } }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error("Sendcloud (étiquette) : " + (json?.error?.message ?? JSON.stringify(json).slice(0, 200)));
  const p = json.parcel;
  return {
    parcelId: String(p?.id ?? parcelId),
    tracking: p?.tracking_number ?? null,
    labelUrl: p?.label?.normal_printer?.[0] ?? p?.label?.label_printer ?? null,
  };
}
