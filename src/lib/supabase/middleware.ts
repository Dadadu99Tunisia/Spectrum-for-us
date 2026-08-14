import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keep in sync with rbac.ts · server-side only, never exposed to client
const ADMIN_EMAILS_SERVER = ["hedibenazouz@gmail.com", "chennaoui.aicha@gmail.com"];
const ADMIN_ROLES_SERVER  = ["super_admin","ceo","cfo","marketing","commercial","support","moderation","hr"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(toSet) {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // ── /vendeur & /compte : PAS de redirection serveur ──────────────────
  // Ces pages redirigent déjà les visiteur·euses anonymes côté client (router.push
  // vers /auth), et leurs données sont protégées par la RLS. Rediriger ici en plus
  // provoquait une BOUCLE sur iOS Safari : après login, le cookie de session n'est
  // pas relu à temps par le middleware → redirect /auth → /auth revoit la session
  // → /vendeur → … → « This page couldn't load ». On laisse donc passer.

  // ── Admin routes · require auth + admin role ─────────────────────────
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    if (!user) {
      // API routes get 401, page routes get redirect
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/auth?redirect=/admin", request.url));
    }

    // Fast path: hardcoded admin emails
    const isAdminEmail = ADMIN_EMAILS_SERVER.includes(user.email ?? "");
    if (!isAdminEmail) {
      // Check DB role · only for page routes to avoid extra latency on every API call
      // API routes are also protected by requireAdmin() individually
      if (!path.startsWith("/api/")) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (!profile || !ADMIN_ROLES_SERVER.includes(profile.role as string)) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    }
  }

  return supabaseResponse;
}
