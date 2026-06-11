import { NextRequest, NextResponse } from "next/server";

// Proxy serveur vers l'API Sendcloud "Service Points" (garde la clé secrète côté serveur)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = (searchParams.get("country") || "fr").toLowerCase();
  const postal = searchParams.get("postal_code") || "";
  const carrier = searchParams.get("carrier") || "mondial_relay";
  if (!postal) return NextResponse.json({ error: "Code postal requis" }, { status: 400 });

  const pub = process.env.SENDCLOUD_PUBLIC_KEY;
  const sec = process.env.SENDCLOUD_SECRET_KEY;
  if (!pub || !sec) return NextResponse.json({ error: "Sendcloud non configuré" }, { status: 503 });

  const auth = "Basic " + Buffer.from(`${pub}:${sec}`).toString("base64");
  const url = `https://servicepoints.sendcloud.sc/api/v2/service-points/?country=${encodeURIComponent(country)}&postal_code=${encodeURIComponent(postal)}&carrier=${encodeURIComponent(carrier)}&radius=15000`;

  try {
    const res = await fetch(url, { headers: { Authorization: auth } });
    const data = await res.json();
    if (!res.ok) {
      const msg = Array.isArray(data) ? "Aucun point trouvé" : (data?.error?.message ?? data?.detail ?? `Sendcloud ${res.status}`);
      return NextResponse.json({ error: msg }, { status: 502 });
    }
    const list = (Array.isArray(data) ? data : data?.service_points ?? []).slice(0, 15).map((sp: Record<string, unknown>) => ({
      id: String(sp.id ?? sp.code ?? ""),
      name: sp.name ?? "Point relais",
      street: [sp.street, sp.house_number].filter(Boolean).join(" "),
      postal_code: sp.postal_code ?? "",
      city: sp.city ?? "",
      distance: sp.distance ?? null,
    }));
    return NextResponse.json({ service_points: list });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur réseau Sendcloud" }, { status: 500 });
  }
}
