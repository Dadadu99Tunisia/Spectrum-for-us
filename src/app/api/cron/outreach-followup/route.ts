import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOutreachEmail, trySend } from "@/lib/email";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spectrumforus.com";

/**
 * Relance automatique de prospection email.
 * Cible : contactés il y a ≥3 j, jamais répondu, non désinscrits, moins de 3 emails envoyés.
 * Cap de 40 envois/run (déliverabilité). Idempotent (la date d'envoi + le compteur bornent).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const admin = createAdminClient();
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();

  const { data: rows } = await admin.from("vendor_outreach")
    .select("id, name, email, category, email_count")
    .eq("outreach_status", "contacted")
    .eq("unsubscribed", false)
    .is("replied_at", null)
    .lt("email_sent_at", threeDaysAgo)
    .gte("email_count", 1).lt("email_count", 3)
    .not("email", "is", null)
    .limit(40);

  let sent = 0;
  for (const r of rows ?? []) {
    try {
      await trySend(() => sendOutreachEmail({
        to: r.email as string,
        name: (r.name as string) ?? undefined,
        category: (r.category as string) ?? undefined,
        step: (r.email_count as number) ?? 1,
        unsubscribeUrl: `${BASE}/api/outreach/unsubscribe?id=${r.id}`,
      }));
      await admin.from("vendor_outreach").update({
        email_sent_at: new Date().toISOString(),
        email_count: ((r.email_count as number) ?? 1) + 1,
      }).eq("id", r.id);
      sent++;
    } catch (e) { console.error("[cron] outreach-followup", e); }
  }

  return NextResponse.json({ ok: true, sent });
}
