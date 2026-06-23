import { NextResponse } from "next/server";

// Taux de change live (base EUR) · source gratuite sans clé (open.er-api).
// Mis en cache 12 h côté Vercel. Repli silencieux : le contexte garde ses taux statiques.
export const revalidate = 43200;

const WANTED = ["EUR","USD","GBP","CHF","CAD","AUD","TND","MAD","DZD","SAR","AED","EGP","XOF"];

export async function GET() {
  try {
    const r = await fetch("https://open.er-api.com/v6/latest/EUR", { next: { revalidate: 43200 } });
    const j = await r.json();
    if (j?.result !== "success" || !j?.rates) return NextResponse.json({ rates: null }, { status: 200 });
    const rates: Record<string, number> = { EUR: 1 };
    for (const c of WANTED) if (typeof j.rates[c] === "number") rates[c] = j.rates[c];
    return NextResponse.json({ rates, updated: j.time_last_update_utc ?? null });
  } catch {
    return NextResponse.json({ rates: null }, { status: 200 });
  }
}
