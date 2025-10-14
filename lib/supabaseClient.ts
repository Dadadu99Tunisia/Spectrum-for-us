import { createClient } from "@supabase/supabase-js"

// Récupérer les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Vérifier si Supabase est configuré
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== "")
}

// Mock client pour le développement sans Supabase
const mockClient = {
  from: (table: string) => ({
    select: (query?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
      }),
      match: (query: any) => ({
        single: async () => ({ data: null, error: null }),
      }),
      limit: (count: number) => Promise.resolve({ data: [], error: null }),
      range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
      order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      match: (query: any) => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signIn: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    signUp: async () => ({ data: null, error: null }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: async () => ({ data: null, error: null }),
      download: async () => ({ data: null, error: null }),
      remove: async () => ({ data: null, error: null }),
    }),
  },
} as any

// Client Supabase pour le côté client
export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : mockClient

// Client Supabase pour le côté serveur avec service role key
export const supabaseAdmin =
  isSupabaseConfigured() && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : supabase

// Fonction helper pour créer un client Supabase serveur
export function createServerSupabaseClient() {
  return supabaseAdmin
}

// Log pour le développement
if (process.env.NODE_ENV === "development") {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase n'est pas configuré. Utilisation du client mock.")
    console.warn("📝 Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local")
  } else {
    console.log("✅ Supabase configuré avec succès")
    console.log("🔗 URL:", supabaseUrl)
  }
}
