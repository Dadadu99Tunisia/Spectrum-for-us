// Configuration de l'API
const API_BASE_URL = "https://backendspectrumforus.vercel.app"

// Types pour l'API
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  seller: Seller
  rating: number
  reviews: number
  inStock: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Seller {
  id: string
  name: string
  avatar: string
  rating: number
  verified: boolean
  description: string
  location: string
  joinedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  icon: string
  productCount: number
}

export interface Order {
  id: string
  userId: string
  products: OrderProduct[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface OrderProduct {
  productId: string
  quantity: number
  price: number
}

// Classe d'erreur personnalisée
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Fonction utilitaire pour les appels API
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Network error", 0)
  }
}

// API des produits
export const productsApi = {
  getAll: (params?: {
    category?: string
    search?: string
    limit?: number
    offset?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set("category", params.category)
    if (params?.search) searchParams.set("search", params.search)
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.offset) searchParams.set("offset", params.offset.toString())

    const query = searchParams.toString()
    return apiRequest<Product[]>(`/api/products${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => apiRequest<Product>(`/api/products/${id}`),

  getFeatured: () => apiRequest<Product[]>("/api/products/featured"),

  getByCategory: (categoryId: string) => apiRequest<Product[]>(`/api/products/category/${categoryId}`),

  create: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
    apiRequest<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  update: (id: string, product: Partial<Product>) =>
    apiRequest<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/api/products/${id}`, {
      method: "DELETE",
    }),
}

// API des catégories
export const categoriesApi = {
  getAll: () => apiRequest<Category[]>("/api/categories"),

  getById: (id: string) => apiRequest<Category>(`/api/categories/${id}`),

  getFeatured: () => apiRequest<Category[]>("/api/categories/featured"),
}

// API des vendeurs
export const sellersApi = {
  getAll: (params?: { limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.offset) searchParams.set("offset", params.offset.toString())

    const query = searchParams.toString()
    return apiRequest<Seller[]>(`/api/sellers${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => apiRequest<Seller>(`/api/sellers/${id}`),

  getFeatured: () => apiRequest<Seller[]>("/api/sellers/featured"),

  getProducts: (sellerId: string) => apiRequest<Product[]>(`/api/sellers/${sellerId}/products`),
}

// API du panier
export const cartApi = {
  get: () => apiRequest<{ items: OrderProduct[]; total: number }>("/api/cart"),

  add: (productId: string, quantity = 1) =>
    apiRequest<void>("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),

  update: (productId: string, quantity: number) =>
    apiRequest<void>(`/api/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  remove: (productId: string) =>
    apiRequest<void>(`/api/cart/${productId}`, {
      method: "DELETE",
    }),

  clear: () =>
    apiRequest<void>("/api/cart", {
      method: "DELETE",
    }),
}

// API des favoris
export const favoritesApi = {
  get: () => apiRequest<Product[]>("/api/favorites"),

  add: (productId: string) =>
    apiRequest<void>("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),

  remove: (productId: string) =>
    apiRequest<void>(`/api/favorites/${productId}`, {
      method: "DELETE",
    }),

  toggle: (productId: string) =>
    apiRequest<{ added: boolean }>(`/api/favorites/${productId}/toggle`, {
      method: "POST",
    }),
}

// API des commandes
export const ordersApi = {
  getAll: () => apiRequest<Order[]>("/api/orders"),

  getById: (id: string) => apiRequest<Order>(`/api/orders/${id}`),

  create: (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) =>
    apiRequest<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  updateStatus: (id: string, status: Order["status"]) =>
    apiRequest<Order>(`/api/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
}

// API de recherche
export const searchApi = {
  global: (query: string) =>
    apiRequest<{
      products: Product[]
      sellers: Seller[]
      categories: Category[]
    }>(`/api/search?q=${encodeURIComponent(query)}`),

  products: (
    query: string,
    filters?: {
      category?: string
      minPrice?: number
      maxPrice?: number
      inStock?: boolean
    },
  ) => {
    const searchParams = new URLSearchParams({ q: query })
    if (filters?.category) searchParams.set("category", filters.category)
    if (filters?.minPrice) searchParams.set("minPrice", filters.minPrice.toString())
    if (filters?.maxPrice) searchParams.set("maxPrice", filters.maxPrice.toString())
    if (filters?.inStock !== undefined) searchParams.set("inStock", filters.inStock.toString())

    return apiRequest<Product[]>(`/api/search/products?${searchParams.toString()}`)
  },
}

// API d'authentification
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: any; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: {
    email: string
    password: string
    name: string
    phone?: string
  }) =>
    apiRequest<{ user: any; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: () =>
    apiRequest<void>("/api/auth/logout", {
      method: "POST",
    }),

  me: () => apiRequest<any>("/api/auth/me"),
}

// API générique
export const api = {
  // Products
  getProducts: (params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest(`/api/products?${searchParams.toString()}`)
  },

  getProduct: (id: string) => apiRequest(`/api/products/${id}`),

  // Categories
  getCategories: () => apiRequest("/api/categories"),

  // Sellers
  getSellers: (params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest(`/api/sellers?${searchParams.toString()}`)
  },

  getSeller: (id: string) => apiRequest(`/api/sellers/${id}`),
}

// Export par défaut
export default {
  products: productsApi,
  categories: categoriesApi,
  sellers: sellersApi,
  cart: cartApi,
  favorites: favoritesApi,
  orders: ordersApi,
  search: searchApi,
  auth: authApi,
  api: api,
}
