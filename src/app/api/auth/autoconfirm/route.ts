import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Auto-confirme un compte tout juste créé (lancement sans friction e-mail).
 * Sécurité : ne confirme QUE des comptes créés dans les 2 dernières minutes
 * et encore non confirmés. À retirer/sécuriser après le lancement.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data.user) return NextResponse.json({ ok: false });

    const u = data.user;
    if (u.email_confirmed_at) return NextResponse.json({ ok: true }); // déjà confirmé

    const createdMs = u.created_at ? Date.now() - new Date(u.created_at).getTime() : Infinity;
    if (createdMs > 120_000) return NextResponse.json({ ok: false }); // trop ancien → refus

    await admin.auth.admin.updateUserById(userId, { email_confirm: true });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
