import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";
import { sendOutreachEmail, trySend } from "@/lib/email";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spectrumforus.com";

/** Envoie l'email de prospection à un·e ou plusieurs contacts (B2B + désinscription). */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "commercial"]);
  if ("error" in auth) return auth.error;

  let ids: string[] = [];
  try {
    const b = await req.json();
    ids = Array.isArray(b?.ids) ? b.ids : b?.id ? [b.id] : [];
  } catch { return apiError("ids requis"); }
  if (!ids.length) return apiError("ids requis");

  const admin = createAdminClient();
  const { data: rows } = await admin.from("vendor_outreach")
    .select("id, name, email, category, outreach_status, email_count, unsubscribed")
    .in("id", ids);

  let sent = 0, skipped = 0;
  for (const r of rows ?? []) {
    if (!r.email || r.unsubscribed) { skipped++; continue; }
    await trySend(() => sendOutreachEmail({
      to: r.email as string,
      name: (r.name as string) ?? undefined,
      category: (r.category as string) ?? undefined,
      step: (r.email_count as number) ?? 0,
      unsubscribeUrl: `${BASE}/api/outreach/unsubscribe?id=${r.id}`,
    }));
    await admin.from("vendor_outreach").update({
      outreach_status: r.outreach_status === "replied" ? "replied" : "contacted",
      email_sent_at: new Date().toISOString(),
      email_count: ((r.email_count as number) ?? 0) + 1,
    }).eq("id", r.id);
    sent++;
  }

  return apiResponse({ sent, skipped });
}
