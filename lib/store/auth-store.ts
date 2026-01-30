import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  display_name?: string
  avatar_url?: string
  role: "customer" | "vendor" | "admin"
}

interface Vendor {
  id: string
  shop_name: string
  slug: string
  description?: string
  logo_url?: string
  is_verified: boolean
  stripe_onboarding_complete: boolean
}

interface AuthState {
  user: User | null
  profile: Profile | null
  vendor: Vendor | null
  isLoading: boolean
  initialize: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  vendor: null,
  isLoading: true,

  initialize: async () => {
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        let vendor = null
        if (profile?.role === "vendor") {
          const { data: vendorData } = await supabase.from("vendors").select("*").eq("user_id", user.id).single()
          vendor = vendorData
        }

        set({ user, profile, vendor, isLoading: false })
      } else {
        set({ user: null, profile: null, vendor: null, isLoading: false })
      }
    } catch (error) {
      console.error("Error initializing auth:", error)
      set({ isLoading: false })
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        get().refreshProfile()
      } else if (event === "SIGNED_OUT") {
        set({ user: null, profile: null, vendor: null })
      }
    })
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, profile: null, vendor: null })
  },

  refreshProfile: async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      let vendor = null
      if (profile?.role === "vendor") {
        const { data: vendorData } = await supabase.from("vendors").select("*").eq("user_id", user.id).single()
        vendor = vendorData
      }

      set({ user, profile, vendor })
    }
  },
}))
