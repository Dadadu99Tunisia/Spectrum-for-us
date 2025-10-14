import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

let supabase: ReturnType<typeof createClient>
let supabaseAdmin: ReturnType<typeof createClient>

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables not configured. Using mock client for build.")
  supabase = createClient("https://placeholder.supabase.co", "placeholder-key")
  supabaseAdmin = supabase
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : supabase
}

export { supabase, supabaseAdmin }

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co",
  )
}
