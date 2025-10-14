import { supabase, createServerSupabaseClient } from "./supabaseClient"

// Client-side database operations
export const db = {
  // Products
  async getProducts() {
    const { data, error } = await supabase.from("products").select("*")
    if (error) throw error
    return data
  },

  async getProduct(id: string) {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()
    if (error) throw error
    return data
  },

  // Users
  async getUser(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()
    if (error) throw error
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()
    if (error) throw error
    return data
  },

  // Cart
  async getCartItems(userId: string) {
    const { data, error } = await supabase.from("cart_items").select("*").eq("user_id", userId)
    if (error) throw error
    return data
  },

  async addToCart(userId: string, productId: string, quantity: number) {
    const { data, error } = await supabase
      .from("cart_items")
      .insert({ user_id: userId, product_id: productId, quantity })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Favorites
  async getFavorites(userId: string) {
    const { data, error } = await supabase.from("favorites").select("*").eq("user_id", userId)
    if (error) throw error
    return data
  },

  async addFavorite(userId: string, productId: string) {
    const { data, error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, product_id: productId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async removeFavorite(userId: string, productId: string) {
    const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("product_id", productId)
    if (error) throw error
  },

  // Orders
  async getOrders(userId: string) {
    const { data, error } = await supabase.from("orders").select("*").eq("user_id", userId)
    if (error) throw error
    return data
  },

  async getOrder(id: string) {
    const { data, error } = await supabase.from("orders").select("*").eq("id", id).single()
    if (error) throw error
    return data
  },

  async createOrder(orderData: any) {
    const { data, error } = await supabase.from("orders").insert(orderData).select().single()
    if (error) throw error
    return data
  },

  // Sellers
  async getSellers() {
    const { data, error } = await supabase.from("sellers").select("*")
    if (error) throw error
    return data
  },

  async getSeller(id: string) {
    const { data, error } = await supabase.from("sellers").select("*").eq("id", id).single()
    if (error) throw error
    return data
  },
}

// Server-side database operations (use in API routes and server components)
export const serverDb = {
  async getProducts() {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("products").select("*")
    if (error) throw error
    return data
  },

  async getProduct(id: string) {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()
    if (error) throw error
    return data
  },

  async createProduct(productData: any) {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("products").insert(productData).select().single()
    if (error) throw error
    return data
  },

  async updateProduct(id: string, productData: any) {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("products").update(productData).eq("id", id).select().single()
    if (error) throw error
    return data
  },

  async deleteProduct(id: string) {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) throw error
  },
}

export default db
