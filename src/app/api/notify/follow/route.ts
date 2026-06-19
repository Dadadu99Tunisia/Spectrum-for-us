import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNewFollower, trySend } from "@/lib/email";

/** Notifie le·la créateur·ice quand quelqu'un suit sa boutique. Appelé après un follow réussi. */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  let shopId: string | null = null;
  try { shopId = (await req.json())?.shopId ?? null; } catch {}
  if (!shopId) return NextResponse.json({ ok: false }, { status: 400 });

  const admin = createAdminClient();
  const { data: shop } = await admin.from("shops").select("name, owner_id").eq("id", shopId).maybeSingle();
  if (!shop?.owner_id || shop.owner_id === user.id) return NextResponse.json({ ok: true }); // pas d'auto-notif

  try {
    const { data: owner } = await admin.auth.admin.getUserById(shop.owner_id as string);
    const email = owner?.user?.email;
    const followerName = (user.user_metadata?.full_name as string) || undefined;
    if (email) await trySend(() => sendNewFollower({ to: email, shopName: shop.name as string, followerName }));
  } catch (e) { console.error("[notify] follow", e); }

  return NextResponse.json({ ok: true });
}
