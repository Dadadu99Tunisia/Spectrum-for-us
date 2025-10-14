import { createClient } from "@supabase/supabase-js"

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Only throw error at runtime, not during build
let supabase: ReturnType<typeof createClient>
let supabaseAdmin: ReturnType<typeof createClient>

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured. Using mock client for build.")
    // Create a mock client for build time
    supabase = createClient("https://placeholder.supabase.co", "placeholder-key")
    supabaseAdmin = supabase
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey)

    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseServiceKey) {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    } else {
      supabaseAdmin = supabase
    }
  }
} catch (error) {
  console.error("Error initializing Supabase client:", error)
  supabase = createClient("https://placeholder.supabase.co", "placeholder-key")
  supabaseAdmin = supabase
}

export { supabase, supabaseAdmin }

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co",
  )
}
