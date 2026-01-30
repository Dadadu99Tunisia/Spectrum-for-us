import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get user and create profile if it doesn't exist
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

        if (!existingProfile) {
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || null,
            role: "customer",
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
