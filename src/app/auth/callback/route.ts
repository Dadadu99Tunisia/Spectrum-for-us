import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail, trySend } from "@/lib/email";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/compte";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const user = data.user;

      // Vérifier si le profil existe déjà (= pas un nouveau compte)
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, created_at")
        .eq("id", user.id)
        .maybeSingle();

      const isNewAccount = !profile;

      // Créer ou récupérer le profil
      if (isNewAccount) {
        const pseudo = user.user_metadata?.full_name
          || user.user_metadata?.name
          || user.email?.split("@")[0]
          || "ami·e";

        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          full_name: pseudo,
          created_at: new Date().toISOString(),
        }, { onConflict: "id" });

        // Welcome email
        if (user.email) {
          await trySend(() => sendWelcomeEmail({
            to: user.email!,
            pseudo,
          }));
        }
      }

      // Vendeur·se (inscription via « Ouvrir ma boutique ») sans boutique → onboarding
      let dest = next;
      if (user.user_metadata?.wants_vendor) {
        const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user.id).maybeSingle();
        if (!shop) dest = "/vendeur/onboarding";
      }
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }
  return NextResponse.redirect(`${origin}/auth?error=callback`);
}
