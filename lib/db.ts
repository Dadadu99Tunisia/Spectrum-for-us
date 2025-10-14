import { supabase, isSupabaseConfigured } from "./supabaseClient"

// Mock data pour le développement local
const mockProducts = [
  {
    id: "1",
    name: "T-Shirt Pride Arc-en-ciel",
    description: "T-shirt confortable aux couleurs de la fierté",
    price: 2999,
    image: "/placeholder.svg?height=400&width=400",
    category: "vetements",
    sellerId: "1",
    stock: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockSellers = [
  {
    id: "1",
    name: "Rainbow Creations",
    description: "Créateur de vêtements inclusifs",
    image: "/placeholder.svg?height=200&width=200",
    userId: "1",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockUsers = [
  {
    id: "1",
    email: "user@example.com",
    name: "User Example",
    image: null,
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Wrapper Prisma-like pour Supabase
export const db = {
  product: {
    findMany: async (options?: any) => {
      if (!isSupabaseConfigured()) return mockProducts

      try {
        let query = supabase.from("products").select("*")

        if (options?.where?.category) {
          query = query.eq("category", options.where.category)
        }
        if (options?.where?.sellerId) {
          query = query.eq("sellerId", options.where.sellerId)
        }
        if (options?.take) {
          query = query.limit(options.take)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error fetching products:", error)
          return mockProducts
        }

        return data || mockProducts
      } catch (error) {
        console.error("Error in product.findMany:", error)
        return mockProducts
      }
    },

    findUnique: async (options: any) => {
      if (!isSupabaseConfigured()) return mockProducts[0]

      try {
        const { data, error } = await supabase.from("products").select("*").eq("id", options.where.id).single()

        if (error) {
          console.error("Error fetching product:", error)
          return null
        }

        return data
      } catch (error) {
        console.error("Error in product.findUnique:", error)
        return null
      }
    },

    create: async (options: any) => {
      if (!isSupabaseConfigured()) return mockProducts[0]

      try {
        const { data, error } = await supabase.from("products").insert(options.data).select().single()

        if (error) {
          console.error("Error creating product:", error)
          throw error
        }

        return data
      } catch (error) {
        console.error("Error in product.create:", error)
        throw error
      }
    },

    update: async (options: any) => {
      if (!isSupabaseConfigured()) return mockProducts[0]

      try {
        const { data, error } = await supabase
          .from("products")
          .update(options.data)
          .eq("id", options.where.id)
          .select()
          .single()

        if (error) {
          console.error("Error updating product:", error)
          throw error
        }

        return data
      } catch (error) {
        console.error("Error in product.update:", error)
        throw error
      }
    },

    delete: async (options: any) => {
      if (!isSupabaseConfigured()) return mockProducts[0]

      try {
        const { error } = await supabase.from("products").delete().eq("id", options.where.id)

        if (error) {
          console.error("Error deleting product:", error)
          throw error
        }

        return { success: true }
      } catch (error) {
        console.error("Error in product.delete:", error)
        throw error
      }
    },
  },

  seller: {
    findMany: async (options?: any) => {
      if (!isSupabaseConfigured()) return mockSellers

      try {
        let query = supabase.from("sellers").select("*")

        if (options?.take) {
          query = query.limit(options.take)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error fetching sellers:", error)
          return mockSellers
        }

        return data || mockSellers
      } catch (error) {
        console.error("Error in seller.findMany:", error)
        return mockSellers
      }
    },

    findUnique: async (options: any) => {
      if (!isSupabaseConfigured()) return mockSellers[0]

      try {
        const { data, error } = await supabase.from("sellers").select("*").eq("id", options.where.id).single()

        if (error) {
          console.error("Error fetching seller:", error)
          return null
        }

        return data
      } catch (error) {
        console.error("Error in seller.findUnique:", error)
        return null
      }
    },

    create: async (options: any) => {
      if (!isSupabaseConfigured()) return mockSellers[0]

      try {
        const { data, error } = await supabase.from("sellers").insert(options.data).select().single()

        if (error) {
          console.error("Error creating seller:", error)
          throw error
        }

        return data
      } catch (error) {
        console.error("Error in seller.create:", error)
        throw error
      }
    },
  },

  user: {
    findUnique: async (options: any) => {
      if (!isSupabaseConfigured()) return mockUsers[0]

      try {
        const { data, error } = await supabase.from("users").select("*").eq("id", options.where.id).single()

        if (error) {
          console.error("Error fetching user:", error)
          return null
        }

        return data
      } catch (error) {
        console.error("Error in user.findUnique:", error)
        return null
      }
    },

    create: async (options: any) => {
      if (!isSupabaseConfigured()) return mockUsers[0]

      try {
        const { data, error } = await supabase.from("users").insert(options.data).select().single()

        if (error) {
          console.error("Error creating user:", error)
          throw error
        }

        return data
      } catch (error) {
        console.error("Error in user.create:", error)
        throw error
      }
    },

    update: async (options: any) => {
      if (!isSupabaseConfigured()) return mockUsers[0]

      try {
        const { data, error } = await supabase
          .from("users")
          .update(options.data)
          .eq("id", options.where.id)
          .select()
          .single()

        if (error) {
          console.error("Error updating user:", error)
          throw error
        }

        return data
      } catch (error) {
        console.error("Error in user.update:", error)
        throw error
      }
    },
  },

  cartItem: {
    findMany: async (options?: any) => {
      if (!isSupabaseConfigured()) return []

      try {
        let query = supabase.from("cart_items").select("*")

        if (options?.where?.userId) {
          query = query.eq("userId", options.where.userId)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error fetching cart items:", error)
          return []
        }

        return data || []
      } catch (error) {
        console.error("Error in cartItem.findMany:", error)
        return []
      }
    },

    create: async (options: any) => {
      if (!isSupabaseConfigured()) return null

      try {
        const { data, error } = await supabase.from("cart_items").insert(options.data).select().single()

        if (error) {
          console.error("Error creating cart item:", error)
          throw error
        }

        return data
      } catch (error) {
        console.error("Error in cartItem.create:", error)
        throw error
      }
    },

    delete: async (options: any) => {
      if (!isSupabaseConfigured()) return null

      try {
        const { error } = await supabase.from("cart_items").delete().eq("id", options.where.id)

        if (error) {
          console.error("Error deleting cart item:", error)
          throw error
        }

        return { success: true }
      } catch (error) {
        console.error("Error in cartItem.delete:", error)
        throw error
      }
    },
  },

  order: {
    findMany: async (options?: any) => {
      if (!isSupabaseConfigured()) return []

      try {
        let query = supabase.from("orders").select("*")

        if (options?.where?.userId) {
          query = query.eq("userId", options.where.userId)
        }
        if (options?.where?.sellerId) {
          query = query.eq("sellerId", options.where.sellerId)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error fetching orders:", error)
          return []
        }

        return data || []
      } catch (error) {
        console.error("Error in order.findMany:", error)
        return []
      }
    },

    findUnique: async (options: any) => {
      if (!isSupabaseConfigured()) return null

      try {
        const { data, error } = await supabase.from("orders").select("*").eq("id", options.where.id).single()

        if (error) {
          console.error("Error fetching order:", error)
          return null
        }

        return data
      } catch (error) {
        console.error("Error in order.findUnique:", error)
        return null
      }
    },

    create: async (options: any) => {
      if (!isSupabaseConfigured()) return null

      try {
        const { data, error } = await supabase.from("orders").insert(options.data).select().single()

        if (error) {
          console.error("Error creating order:", error)
          throw error
        }

        return data
      } catch (error) {
        console.error("Error in order.create:", error)
        throw error
      }
    },
  },
}

export default db
