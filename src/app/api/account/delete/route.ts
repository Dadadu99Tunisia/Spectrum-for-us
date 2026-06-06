import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * RGPD Art. 17 · Droit à l'effacement
 * DELETE /api/account/delete
 * Supprime le compte, le profil, les commandes et toutes données personnelles.
 */
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const userId = user.id;

  // Client service-role requis pour supprimer le compte auth de façon fiable.
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Suppression indisponible : SUPABASE_SERVICE_ROLE_KEY non configurée." },
      { status: 503 }
    );
  }

  // 1. Anonymiser les commandes (conserver les données comptables légales, effacer l'identité)
  await admin
    .from("orders")
    .update({
      shipping_name: "[supprimé]",
      shipping_email: "[supprimé]",
      shipping_address: null,
      shipping_city: null,
      shipping_zip: null,
    })
    .eq("user_id", userId);

  // 2. Supprimer le profil
  await admin.from("profiles").delete().eq("id", userId);

  // 3. Supprimer le compte auth (service_role) · empêche toute reconnexion
  const { error: delErr } = await admin.auth.admin.deleteUser(userId);
  if (delErr) {
    console.error("[account/delete] échec suppression auth", delErr);
    return NextResponse.json({ error: "Échec de la suppression du compte" }, { status: 500 });
  }

  // Forcer le sign out de la session courante
  await supabase.auth.signOut();

  return NextResponse.json({ success: true, message: "Compte supprimé conformément au RGPD Art. 17" });
}
