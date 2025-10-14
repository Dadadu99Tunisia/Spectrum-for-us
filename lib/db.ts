import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabaseClient"

// Helper to handle unconfigured Supabase
function checkSupabaseConfig() {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Returning empty data.")
    return false
  }
  return true
}

// Product operations using Supabase
export const productsDB = {
  async getAll(filters?: {
    categoryId?: string
    subcategoryId?: string
    featured?: boolean
    limit?: number
  }) {
    if (!checkSupabaseConfig()) return []

    try {
      let query = supabase.from("products").select("*")

      if (filters?.categoryId) {
        query = query.eq("categoryId", filters.categoryId)
      }

      if (filters?.subcategoryId) {
        query = query.eq("subcategoryId", filters.subcategoryId)
      }

      if (filters?.featured) {
        query = query.eq("featured", true)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching products:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getAll:", error)
      return []
    }
  },

  async getById(id: string) {
    if (!checkSupabaseConfig()) return null

    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching product:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getById:", error)
      return null
    }
  },

  async create(productData: any) {
    if (!checkSupabaseConfig()) throw new Error("Supabase not configured")

    try {
      const { data, error } = await supabaseAdmin.from("products").insert(productData).select().single()

      if (error) {
        console.error("Error creating product:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in create:", error)
      throw error
    }
  },

  async update(id: string, productData: any) {
    if (!checkSupabaseConfig()) throw new Error("Supabase not configured")

    try {
      const { data, error } = await supabaseAdmin.from("products").update(productData).eq("id", id).select().single()

      if (error) {
        console.error("Error updating product:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in update:", error)
      throw error
    }
  },

  async delete(id: string) {
    if (!checkSupabaseConfig()) throw new Error("Supabase not configured")

    try {
      const { error } = await supabaseAdmin.from("products").delete().eq("id", id)

      if (error) {
        console.error("Error deleting product:", error)
        throw error
      }

      return true
    } catch (error) {
      console.error("Error in delete:", error)
      throw error
    }
  },
}

// Seller operations using Supabase
export const sellersDB = {
  async getAll(filters?: { featured?: boolean }) {
    if (!checkSupabaseConfig()) return []

    try {
      let query = supabase.from("sellers").select("*")

      if (filters?.featured) {
        query = query.eq("featured", true)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching sellers:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in sellers getAll:", error)
      return []
    }
  },

  async getById(id: string) {
    if (!checkSupabaseConfig()) return null

    try {
      const { data, error } = await supabase.from("sellers").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching seller:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in seller getById:", error)
      return null
    }
  },
}

// Order operations using Supabase
export const ordersDB = {
  async getByUserId(userId: string) {
    if (!checkSupabaseConfig()) return []

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })

      if (error) {
        console.error("Error fetching orders:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in orders getByUserId:", error)
      return []
    }
  },

  async getById(id: string) {
    if (!checkSupabaseConfig()) return null

    try {
      const { data, error } = await supabase.from("orders").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching order:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in order getById:", error)
      return null
    }
  },

  async create(orderData: any) {
    if (!checkSupabaseConfig()) throw new Error("Supabase not configured")

    try {
      const { data, error } = await supabaseAdmin.from("orders").insert(orderData).select().single()

      if (error) {
        console.error("Error creating order:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in order create:", error)
      throw error
    }
  },
}

// Category operations using Supabase
export const categoriesDB = {
  async getAll() {
    if (!checkSupabaseConfig()) return []

    try {
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

      if (error) {
        console.error("Error fetching categories:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in categories getAll:", error)
      return []
    }
  },

  async getById(id: string) {
    if (!checkSupabaseConfig()) return null

    try {
      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching category:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in category getById:", error)
      return null
    }
  },
}

// Export default object with all DB operations
export default {
  products: productsDB,
  sellers: sellersDB,
  orders: ordersDB,
  categories: categoriesDB,
}
