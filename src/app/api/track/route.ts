import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * /api/track · capture d'événements analytics first-party (table
 * analytics_events). Insertion en service-role (fiable, jamais bloquée par RLS).
 * Aucune donnée sensible : event_type + metadata (path, anon_id, props).
 */
export async function POST(req: Request) {
  try {
    const { event, props = {} } = await req.json();
    if (!event || typeof event !== "string") {
      return NextResponse.json({ error: "event required" }, { status: 400 });
    }

    // user_id si session présente (sinon anonyme)
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
    } catch { /* anonyme */ }

    const admin = createAdminClient();
    await admin.from("analytics_events").insert({
      event_type: event.slice(0, 64),
      user_id: userId,
      metadata: typeof props === "object" && props ? props : {},
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Le tracking ne doit jamais casser l'UX
    return NextResponse.json({ ok: false });
  }
}
