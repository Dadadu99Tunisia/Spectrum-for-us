import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Désinscription prospection (lien public dans l'email). Marque le contact opt-out. */
export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  const page = (msg: string) => new NextResponse(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Désinscription · Spectrum For Us</title></head>
     <body style="margin:0;font-family:system-ui,sans-serif;background:#FBFAF8;color:#101014;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:24px;">
     <div><div style="font-size:40px;margin-bottom:12px;">🏳️‍🌈</div><h1 style="font-size:22px;font-weight:600;margin:0 0 8px;">${msg}</h1>
     <p style="color:#6B6258;font-size:15px;">Tu ne recevras plus de messages de prospection de Spectrum For Us.</p>
     <a href="https://spectrumforus.com" style="display:inline-block;margin-top:16px;color:#FF2DA0;text-decoration:none;font-weight:600;">spectrumforus.com</a></div>
     </body></html>`,
    { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
  );

  if (!id) return page("Lien invalide");
  try {
    const admin = createAdminClient();
    await admin.from("vendor_outreach").update({ unsubscribed: true, outreach_status: "unsubscribed" }).eq("id", id);
  } catch { /* on confirme quand même côté UX */ }
  return page("C'est noté, désinscription effectuée.");
}
