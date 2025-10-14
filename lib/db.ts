// Supabase-only database implementation
// NO Neon, NO Postgres, NO Prisma
import { supabase, supabaseAdmin } from "./supabaseClient"

// Product operations using Supabase
export const productsDB = {
  async getAll(filters?: {
    categoryId?: string
    subcategoryId?: string
    featured?: boolean
    limit?: number
  }) {
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
      throw error
    }

    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      throw error
    }

    return data
  },

  async create(productData: any) {
    const { data, error } = await supabaseAdmin.from("products").insert(productData).select().single()

    if (error) {
      console.error("Error creating product:", error)
      throw error
    }

    return data
  },

  async update(id: string, productData: any) {
    const { data, error } = await supabaseAdmin.from("products").update(productData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating product:", error)
      throw error
    }

    return data
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      throw error
    }

    return true
  },
}

// Seller operations using Supabase
export const sellersDB = {
  async getAll(filters?: { featured?: boolean }) {
    let query = supabase.from("sellers").select("*")

    if (filters?.featured) {
      query = query.eq("featured", true)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching sellers:", error)
      throw error
    }

    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("sellers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching seller:", error)
      throw error
    }

    return data
  },
}

// Order operations using Supabase
export const ordersDB = {
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      throw error
    }

    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("orders").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching order:", error)
      throw error
    }

    return data
  },

  async create(orderData: any) {
    const { data, error } = await supabaseAdmin.from("orders").insert(orderData).select().single()

    if (error) {
      console.error("Error creating order:", error)
      throw error
    }

    return data
  },
}

// Category operations using Supabase
export const categoriesDB = {
  async getAll() {
    const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      throw error
    }

    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching category:", error)
      throw error
    }

    return data
  },
}

// Export default object with all DB operations
export default {
  products: productsDB,
  sellers: sellersDB,
  orders: ordersDB,
  categories: categoriesDB,
}
