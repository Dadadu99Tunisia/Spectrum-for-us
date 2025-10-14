import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://placeholder.supabase.co")
}

// Mock client pour le build
const mockClient = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ error: null }),
    eq: function (this: any) {
      return this
    },
    single: () => Promise.resolve({ data: null, error: null }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signIn: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
} as any

export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : mockClient

export const supabaseAdmin =
  isSupabaseConfigured() && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : supabase

export function createServerSupabaseClient() {
  return supabaseAdmin
}
