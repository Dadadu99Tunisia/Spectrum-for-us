import { supabase, isSupabaseConfigured } from "./supabaseClient"

// Mock data pour le développement
const mockData = {
  users: [] as any[],
  products: [] as any[],
  sellers: [] as any[],
  orders: [] as any[],
  cartItems: [] as any[],
  favorites: [] as any[],
}

// Wrapper Prisma-like pour Supabase
export const prisma = {
  user: {
    findUnique: async ({ where }: any) => {
      if (!isSupabaseConfigured()) {
        return mockData.users.find((u) => (where.id ? u.id === where.id : u.email === where.email))
      }
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq(where.id ? "id" : "email", where.id || where.email)
        .single()
      return data
    },
    create: async ({ data }: any) => {
      if (!isSupabaseConfigured()) {
        const newUser = { ...data, id: Date.now().toString() }
        mockData.users.push(newUser)
        return newUser
      }
      const { data: user } = await supabase.from("users").insert(data).select().single()
      return user
    },
    update: async ({ where, data }: any) => {
      if (!isSupabaseConfigured()) {
        const index = mockData.users.findIndex((u) => u.id === where.id)
        if (index !== -1) {
          mockData.users[index] = { ...mockData.users[index], ...data }
          return mockData.users[index]
        }
        return null
      }
      const { data: user } = await supabase.from("users").update(data).eq("id", where.id).select().single()
      return user
    },
  },
  product: {
    findMany: async ({ where, take, skip }: any = {}) => {
      if (!isSupabaseConfigured()) {
        return mockData.products
      }
      let query = supabase.from("products").select("*")
      if (where?.categoryId) query = query.eq("category_id", where.categoryId)
      if (take) query = query.limit(take)
      if (skip) query = query.range(skip, skip + (take || 10) - 1)
      const { data } = await query
      return data || []
    },
    findUnique: async ({ where }: any) => {
      if (!isSupabaseConfigured()) {
        return mockData.products.find((p) => p.id === where.id)
      }
      const { data } = await supabase.from("products").select("*").eq("id", where.id).single()
      return data
    },
    create: async ({ data }: any) => {
      if (!isSupabaseConfigured()) {
        const newProduct = { ...data, id: Date.now().toString() }
        mockData.products.push(newProduct)
        return newProduct
      }
      const { data: product } = await supabase.from("products").insert(data).select().single()
      return product
    },
  },
  seller: {
    findMany: async () => {
      if (!isSupabaseConfigured()) {
        return mockData.sellers
      }
      const { data } = await supabase.from("sellers").select("*")
      return data || []
    },
    findUnique: async ({ where }: any) => {
      if (!isSupabaseConfigured()) {
        return mockData.sellers.find((s) => s.id === where.id)
      }
      const { data } = await supabase.from("sellers").select("*").eq("id", where.id).single()
      return data
    },
  },
  order: {
    findMany: async ({ where }: any = {}) => {
      if (!isSupabaseConfigured()) {
        return mockData.orders
      }
      let query = supabase.from("orders").select("*")
      if (where?.userId) query = query.eq("user_id", where.userId)
      if (where?.sellerId) query = query.eq("seller_id", where.sellerId)
      const { data } = await query
      return data || []
    },
    findUnique: async ({ where }: any) => {
      if (!isSupabaseConfigured()) {
        return mockData.orders.find((o) => o.id === where.id)
      }
      const { data } = await supabase.from("orders").select("*").eq("id", where.id).single()
      return data
    },
    create: async ({ data }: any) => {
      if (!isSupabaseConfigured()) {
        const newOrder = { ...data, id: Date.now().toString() }
        mockData.orders.push(newOrder)
        return newOrder
      }
      const { data: order } = await supabase.from("orders").insert(data).select().single()
      return order
    },
  },
  cartItem: {
    findMany: async ({ where }: any = {}) => {
      if (!isSupabaseConfigured()) {
        return mockData.cartItems
      }
      let query = supabase.from("cart_items").select("*")
      if (where?.userId) query = query.eq("user_id", where.userId)
      const { data } = await query
      return data || []
    },
    findUnique: async ({ where }: any) => {
      if (!isSupabaseConfigured()) {
        return mockData.cartItems.find((c) => c.id === where.id)
      }
      const { data } = await supabase.from("cart_items").select("*").eq("id", where.id).single()
      return data
    },
    create: async ({ data }: any) => {
      if (!isSupabaseConfigured()) {
        const newItem = { ...data, id: Date.now().toString() }
        mockData.cartItems.push(newItem)
        return newItem
      }
      const { data: item } = await supabase.from("cart_items").insert(data).select().single()
      return item
    },
    delete: async ({ where }: any) => {
      if (!isSupabaseConfigured()) {
        const index = mockData.cartItems.findIndex((c) => c.id === where.id)
        if (index !== -1) {
          mockData.cartItems.splice(index, 1)
        }
        return { id: where.id }
      }
      const { data } = await supabase.from("cart_items").delete().eq("id", where.id).select().single()
      return data
    },
  },
  favorite: {
    findMany: async ({ where }: any = {}) => {
      if (!isSupabaseConfigured()) {
        return mockData.favorites
      }
      let query = supabase.from("favorites").select("*")
      if (where?.userId) query = query.eq("user_id", where.userId)
      const { data } = await query
      return data || []
    },
    create: async ({ data }: any) => {
      if (!isSupabaseConfigured()) {
        const newFav = { ...data, id: Date.now().toString() }
        mockData.favorites.push(newFav)
        return newFav
      }
      const { data: favorite } = await supabase.from("favorites").insert(data).select().single()
      return favorite
    },
    delete: async ({ where }: any) => {
      if (!isSupabaseConfigured()) {
        const index = mockData.favorites.findIndex(
          (f) => f.userId === where.userId_productId.userId && f.productId === where.userId_productId.productId,
        )
        if (index !== -1) {
          mockData.favorites.splice(index, 1)
        }
        return {}
      }
      const { data } = await supabase
        .from("favorites")
        .delete()
        .match({
          user_id: where.userId_productId.userId,
          product_id: where.userId_productId.productId,
        })
        .select()
        .single()
      return data
    },
  },
}
