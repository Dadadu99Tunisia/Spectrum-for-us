import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNewMessageNotification, trySend } from "@/lib/email";

/**
 * Notifie le destinataire d'un nouveau message par e-mail (Resend).
 * Anti-abus : on n'envoie que si un message réel sender->recipient existe dans
 * les 2 dernières minutes. Ne bloque jamais l'UX (fire-and-forget côté client).
 */
export async function POST(req: Request) {
  try {
    const { recipientId } = await req.json();
    if (!recipientId) return NextResponse.json({ error: "recipientId required" }, { status: 400 });

    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const sender = auth.user;
    if (!sender) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (sender.id === recipientId) return NextResponse.json({ ok: true });

    const admin = createAdminClient();

    // Vérifie qu'un message récent sender->recipient existe (garde anti-spam)
    const since = new Date(Date.now() - 120_000).toISOString();
    const { data: recent } = await admin
      .from("messages")
      .select("body, created_at")
      .eq("sender_id", sender.id)
      .eq("recipient_id", recipientId)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!recent) return NextResponse.json({ ok: true }); // rien à notifier

    // E-mail du destinataire (auth.users via service-role)
    const { data: userRes } = await admin.auth.admin.getUserById(recipientId);
    const to = userRes?.user?.email;
    if (!to) return NextResponse.json({ ok: true });

    const fromName =
      (sender.user_metadata?.pseudo as string) ||
      (sender.user_metadata?.full_name as string) ||
      sender.email?.split("@")[0] ||
      "Un membre";

    await trySend(() => sendNewMessageNotification({ to, fromName, preview: recent.body }));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
