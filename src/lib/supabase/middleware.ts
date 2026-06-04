import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keep in sync with rbac.ts — server-side only, never exposed to client
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

  // ── Auth-only routes ─────────────────────────────────────────────────
  if (path.startsWith("/vendeur") && !user) {
    return NextResponse.redirect(new URL("/auth?redirect=/vendeur", request.url));
  }
  if (path.startsWith("/compte") && !user) {
    return NextResponse.redirect(new URL("/auth?redirect=/compte", request.url));
  }

  // ── Admin routes — require auth + admin role ─────────────────────────
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
      // Check DB role — only for page routes to avoid extra latency on every API call
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
