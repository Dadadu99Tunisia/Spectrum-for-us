import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabaseClient"

// Mock data pour le développement local sans Supabase
const mockProducts = [
  {
    id: "1",
    name: "T-Shirt Pride Arc-en-ciel",
    description: "T-shirt confortable aux couleurs de la fierté LGBTQ+",
    price: 2999,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=400&width=400"],
    category: "vetements",
    categoryId: "vetements",
    sellerId: "1",
    stock: 50,
    inventory: 50,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Bracelet Rainbow",
    description: "Bracelet aux couleurs de l'arc-en-ciel",
    price: 1299,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=400&width=400"],
    category: "accessoires",
    categoryId: "accessoires",
    sellerId: "2",
    stock: 100,
    inventory: 100,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockSellers = [
  {
    id: "1",
    name: "Rainbow Creations",
    storeName: "Rainbow Creations",
    description: "Créateur de vêtements et accessoires inclusifs",
    bio: "Nous créons des produits qui célèbrent la diversité",
    image: "/placeholder.svg?height=200&width=200",
    logo: "/placeholder.svg?height=200&width=200",
    userId: "1",
    verified: true,
    featured: true,
    rating: 4.8,
    reviewCount: 120,
    productCount: 45,
    location: "Paris, France",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Pride & Joy",
    storeName: "Pride & Joy",
    description: "Boutique spécialisée dans les accessoires Pride",
    bio: "Des accessoires pour exprimer votre fierté",
    image: "/placeholder.svg?height=200&width=200",
    logo: "/placeholder.svg?height=200&width=200",
    userId: "2",
    verified: true,
    featured: true,
    rating: 4.6,
    reviewCount: 85,
    productCount: 32,
    location: "Lyon, France",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockUsers = [
  {
    id: "1",
    email: "user@example.com",
    name: "Utilisateur Test",
    image: null,
    role: "USER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockCategories = [
  { id: "vetements", name: "Vêtements", slug: "vetements", description: "Vêtements inclusifs et Pride" },
  { id: "accessoires", name: "Accessoires", slug: "accessoires", description: "Accessoires Pride et inclusifs" },
  { id: "maison", name: "Maison", slug: "maison", description: "Décoration et articles pour la maison" },
  { id: "art", name: "Art & Culture", slug: "art", description: "Art et culture LGBTQ+" },
]

// Wrapper Prisma-like pour Supabase
export const prisma = {
  user: {
    findUnique: async ({ where }: { where: { id?: string; email?: string } }) => {
      if (!isSupabaseConfigured()) {
        return mockUsers.find((u) => (where.id ? u.id === where.id : u.email === where.email)) || null
      }

      try {
        const column = where.id ? "id" : "email"
        const value = where.id || where.email
        const { data, error } = await supabase.from("users").select("*").eq(column, value).single()

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

    findMany: async () => {
      if (!isSupabaseConfigured()) {
        return mockUsers
      }

      try {
        const { data, error } = await supabase.from("users").select("*")

        if (error) {
          console.error("Error fetching users:", error)
          return []
        }

        return data || []
      } catch (error) {
        console.error("Error in user.findMany:", error)
        return []
      }
    },

    create: async ({ data }: { data: any }) => {
      if (!isSupabaseConfigured()) {
        const newUser = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() }
        mockUsers.push(newUser)
        return newUser
      }

      try {
        const { data: user, error } = await supabaseAdmin.from("users").insert(data).select().single()

        if (error) {
          console.error("Error creating user:", error)
          throw error
        }

        return user
      } catch (error) {
        console.error("Error in user.create:", error)
        throw error
      }
    },

    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      if (!isSupabaseConfigured()) {
        const index = mockUsers.findIndex((u) => u.id === where.id)
        if (index !== -1) {
          mockUsers[index] = { ...mockUsers[index], ...data, updatedAt: new Date().toISOString() }
          return mockUsers[index]
        }
        return null
      }

      try {
        const { data: user, error } = await supabaseAdmin
          .from("users")
          .update(data)
          .eq("id", where.id)
          .select()
          .single()

        if (error) {
          console.error("Error updating user:", error)
          throw error
        }

        return user
      } catch (error) {
        console.error("Error in user.update:", error)
        throw error
      }
    },
  },

  product: {
    findMany: async ({ where, take, skip }: { where?: any; take?: number; skip?: number } = {}) => {
      if (!isSupabaseConfigured()) {
        let filtered = [...mockProducts]
        if (where?.categoryId) {
          filtered = filtered.filter((p) => p.categoryId === where.categoryId)
        }
        if (where?.sellerId) {
          filtered = filtered.filter((p) => p.sellerId === where.sellerId)
        }
        if (where?.featured) {
          filtered = filtered.filter((p) => p.featured === true)
        }
        return filtered.slice(skip || 0, (skip || 0) + (take || filtered.length))
      }

      try {
        let query = supabase.from("products").select("*")

        if (where?.categoryId) {
          query = query.eq("category_id", where.categoryId)
        }
        if (where?.sellerId) {
          query = query.eq("seller_id", where.sellerId)
        }
        if (where?.featured !== undefined) {
          query = query.eq("featured", where.featured)
        }
        if (take) {
          query = query.limit(take)
        }
        if (skip) {
          query = query.range(skip, skip + (take || 10) - 1)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error fetching products:", error)
          return mockProducts
        }

        return data || []
      } catch (error) {
        console.error("Error in product.findMany:", error)
        return mockProducts
      }
    },

    findUnique: async ({ where }: { where: { id?: string; slug?: string } }) => {
      if (!isSupabaseConfigured()) {
        return mockProducts.find((p) => (where.id ? p.id === where.id : false)) || null
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq(where.id ? "id" : "slug", where.id || where.slug)
          .single()

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

    count: async () => {
      if (!isSupabaseConfigured()) {
        return mockProducts.length
      }

      try {
        const { count, error } = await supabase.from("products").select("*", { count: "exact", head: true })

        if (error) {
          console.error("Error counting products:", error)
          return 0
        }

        return count || 0
      } catch (error) {
        console.error("Error in product.count:", error)
        return 0
      }
    },

    create: async ({ data }: { data: any }) => {
      if (!isSupabaseConfigured()) {
        const newProduct = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        mockProducts.push(newProduct)
        return newProduct
      }

      try {
        const { data: product, error } = await supabaseAdmin.from("products").insert(data).select().single()

        if (error) {
          console.error("Error creating product:", error)
          throw error
        }

        return product
      } catch (error) {
        console.error("Error in product.create:", error)
        throw error
      }
    },

    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      if (!isSupabaseConfigured()) {
        const index = mockProducts.findIndex((p) => p.id === where.id)
        if (index !== -1) {
          mockProducts[index] = { ...mockProducts[index], ...data, updatedAt: new Date().toISOString() }
          return mockProducts[index]
        }
        return null
      }

      try {
        const { data: product, error } = await supabaseAdmin
          .from("products")
          .update(data)
          .eq("id", where.id)
          .select()
          .single()

        if (error) {
          console.error("Error updating product:", error)
          throw error
        }

        return product
      } catch (error) {
        console.error("Error in product.update:", error)
        throw error
      }
    },

    delete: async ({ where }: { where: { id: string } }) => {
      if (!isSupabaseConfigured()) {
        const index = mockProducts.findIndex((p) => p.id === where.id)
        if (index !== -1) {
          mockProducts.splice(index, 1)
        }
        return { id: where.id }
      }

      try {
        const { error } = await supabaseAdmin.from("products").delete().eq("id", where.id)

        if (error) {
          console.error("Error deleting product:", error)
          throw error
        }

        return { id: where.id }
      } catch (error) {
        console.error("Error in product.delete:", error)
        throw error
      }
    },
  },

  seller: {
    findMany: async ({ where, take }: { where?: any; take?: number } = {}) => {
      if (!isSupabaseConfigured()) {
        let filtered = [...mockSellers]
        if (where?.featured !== undefined) {
          filtered = filtered.filter((s) => s.featured === where.featured)
        }
        return filtered.slice(0, take || filtered.length)
      }

      try {
        let query = supabase.from("sellers").select("*")

        if (where?.featured !== undefined) {
          query = query.eq("featured", where.featured)
        }
        if (take) {
          query = query.limit(take)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error fetching sellers:", error)
          return mockSellers
        }

        return data || []
      } catch (error) {
        console.error("Error in seller.findMany:", error)
        return mockSellers
      }
    },

    findUnique: async ({ where }: { where: { id: string } }) => {
      if (!isSupabaseConfigured()) {
        return mockSellers.find((s) => s.id === where.id) || null
      }

      try {
        const { data, error } = await supabase.from("sellers").select("*").eq("id", where.id).single()

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

    create: async ({ data }: { data: any }) => {
      if (!isSupabaseConfigured()) {
        const newSeller = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        mockSellers.push(newSeller)
        return newSeller
      }

      try {
        const { data: seller, error } = await supabaseAdmin.from("sellers").insert(data).select().single()

        if (error) {
          console.error("Error creating seller:", error)
          throw error
        }

        return seller
      } catch (error) {
        console.error("Error in seller.create:", error)
        throw error
      }
    },

    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      if (!isSupabaseConfigured()) {
        const index = mockSellers.findIndex((s) => s.id === where.id)
        if (index !== -1) {
          mockSellers[index] = { ...mockSellers[index], ...data, updatedAt: new Date().toISOString() }
          return mockSellers[index]
        }
        return null
      }

      try {
        const { data: seller, error } = await supabaseAdmin
          .from("sellers")
          .update(data)
          .eq("id", where.id)
          .select()
          .single()

        if (error) {
          console.error("Error updating seller:", error)
          throw error
        }

        return seller
      } catch (error) {
        console.error("Error in seller.update:", error)
        throw error
      }
    },
  },

  category: {
    findMany: async () => {
      if (!isSupabaseConfigured()) {
        return mockCategories
      }

      try {
        const { data, error } = await supabase.from("categories").select("*")

        if (error) {
          console.error("Error fetching categories:", error)
          return mockCategories
        }

        return data || mockCategories
      } catch (error) {
        console.error("Error in category.findMany:", error)
        return mockCategories
      }
    },
  },

  order: {
    findMany: async ({ where }: { where?: any } = {}) => {
      if (!isSupabaseConfigured()) {
        return []
      }

      try {
        let query = supabase.from("orders").select("*")

        if (where?.userId) {
          query = query.eq("user_id", where.userId)
        }
        if (where?.sellerId) {
          query = query.eq("seller_id", where.sellerId)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

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

    findUnique: async ({ where }: { where: { id: string } }) => {
      if (!isSupabaseConfigured()) {
        return null
      }

      try {
        const { data, error } = await supabase.from("orders").select("*").eq("id", where.id).single()

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

    create: async ({ data }: { data: any }) => {
      if (!isSupabaseConfigured()) {
        return null
      }

      try {
        const { data: order, error } = await supabaseAdmin.from("orders").insert(data).select().single()

        if (error) {
          console.error("Error creating order:", error)
          throw error
        }

        return order
      } catch (error) {
        console.error("Error in order.create:", error)
        throw error
      }
    },
  },

  cartItem: {
    findMany: async ({ where }: { where?: any } = {}) => {
      if (!isSupabaseConfigured()) {
        return []
      }

      try {
        let query = supabase.from("cart_items").select("*")

        if (where?.userId) {
          query = query.eq("user_id", where.userId)
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

    findUnique: async ({ where }: { where: { id: string } }) => {
      if (!isSupabaseConfigured()) {
        return null
      }

      try {
        const { data, error } = await supabase.from("cart_items").select("*").eq("id", where.id).single()

        if (error) {
          console.error("Error fetching cart item:", error)
          return null
        }

        return data
      } catch (error) {
        console.error("Error in cartItem.findUnique:", error)
        return null
      }
    },

    create: async ({ data }: { data: any }) => {
      if (!isSupabaseConfigured()) {
        return null
      }

      try {
        const { data: item, error } = await supabaseAdmin.from("cart_items").insert(data).select().single()

        if (error) {
          console.error("Error creating cart item:", error)
          throw error
        }

        return item
      } catch (error) {
        console.error("Error in cartItem.create:", error)
        throw error
      }
    },

    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      if (!isSupabaseConfigured()) {
        return null
      }

      try {
        const { data: item, error } = await supabaseAdmin
          .from("cart_items")
          .update(data)
          .eq("id", where.id)
          .select()
          .single()

        if (error) {
          console.error("Error updating cart item:", error)
          throw error
        }

        return item
      } catch (error) {
        console.error("Error in cartItem.update:", error)
        throw error
      }
    },

    delete: async ({ where }: { where: { id: string } }) => {
      if (!isSupabaseConfigured()) {
        return null
      }

      try {
        const { error } = await supabaseAdmin.from("cart_items").delete().eq("id", where.id)

        if (error) {
          console.error("Error deleting cart item:", error)
          throw error
        }

        return { id: where.id }
      } catch (error) {
        console.error("Error in cartItem.delete:", error)
        throw error
      }
    },

    deleteMany: async ({ where }: { where: { userId: string } }) => {
      if (!isSupabaseConfigured()) {
        return { count: 0 }
      }

      try {
        const { error, count } = await supabaseAdmin.from("cart_items").delete().eq("user_id", where.userId)

        if (error) {
          console.error("Error deleting cart items:", error)
          return { count: 0 }
        }

        return { count: count || 0 }
      } catch (error) {
        console.error("Error in cartItem.deleteMany:", error)
        return { count: 0 }
      }
    },
  },

  favorite: {
    findUnique: async ({ where }: { where: { userId_productId: { userId: string; productId: string } } }) => {
      if (!isSupabaseConfigured()) {
        return null
      }

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", where.userId_productId.userId)
          .eq("product_id", where.userId_productId.productId)
          .single()

        if (error) {
          return null
        }

        return data
      } catch (error) {
        console.error("Error in favorite.findUnique:", error)
        return null
      }
    },

    findMany: async ({ where }: { where?: any } = {}) => {
      if (!isSupabaseConfigured()) {
        return []
      }

      try {
        let query = supabase.from("favorites").select("*")

        if (where?.userId) {
          query = query.eq("user_id", where.userId)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error fetching favorites:", error)
          return []
        }

        return data || []
      } catch (error) {
        console.error("Error in favorite.findMany:", error)
        return []
      }
    },

    create: async ({ data }: { data: any }) => {
      if (!isSupabaseConfigured()) {
        return null
      }

      try {
        const { data: favorite, error } = await supabaseAdmin.from("favorites").insert(data).select().single()

        if (error) {
          console.error("Error creating favorite:", error)
          throw error
        }

        return favorite
      } catch (error) {
        console.error("Error in favorite.create:", error)
        throw error
      }
    },

    delete: async ({ where }: { where: { userId_productId: { userId: string; productId: string } } }) => {
      if (!isSupabaseConfigured()) {
        return null
      }

      try {
        const { error } = await supabaseAdmin.from("favorites").delete().match({
          user_id: where.userId_productId.userId,
          product_id: where.userId_productId.productId,
        })

        if (error) {
          console.error("Error deleting favorite:", error)
          throw error
        }

        return {}
      } catch (error) {
        console.error("Error in favorite.delete:", error)
        return null
      }
    },
  },
}

export async function query(sql: string, params?: any[]) {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, returning empty result")
    return { rows: [] }
  }

  try {
    const { data, error } = await supabase.rpc("execute_sql", {
      query: sql,
      params: params || [],
    })

    if (error) {
      console.error("Database query error:", error)
      return { rows: [] }
    }

    return { rows: data || [] }
  } catch (error) {
    console.error("Database query exception:", error)
    return { rows: [] }
  }
}

export default {
  prisma,
  query,
}
