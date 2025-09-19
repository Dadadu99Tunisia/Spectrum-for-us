// Configuration de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backendspectrumforus.vercel.app"

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
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Fonction utilitaire pour les appels API
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })

    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status)
    }

    const data = await response.json()
    return data
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
    return apiCall<Product[]>(`/api/products${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => apiCall<Product>(`/api/products/${id}`),

  getFeatured: () => apiCall<Product[]>("/api/products/featured"),

  getByCategory: (categoryId: string) => apiCall<Product[]>(`/api/products/category/${categoryId}`),

  create: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
    apiCall<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  update: (id: string, product: Partial<Product>) =>
    apiCall<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  delete: (id: string) =>
    apiCall<void>(`/api/products/${id}`, {
      method: "DELETE",
    }),
}

// API des catégories
export const categoriesApi = {
  getAll: () => apiCall<Category[]>("/api/categories"),

  getById: (id: string) => apiCall<Category>(`/api/categories/${id}`),

  getFeatured: () => apiCall<Category[]>("/api/categories/featured"),
}

// API des vendeurs
export const sellersApi = {
  getAll: (params?: { limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.offset) searchParams.set("offset", params.offset.toString())

    const query = searchParams.toString()
    return apiCall<Seller[]>(`/api/sellers${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => apiCall<Seller>(`/api/sellers/${id}`),

  getFeatured: () => apiCall<Seller[]>("/api/sellers/featured"),

  getProducts: (sellerId: string) => apiCall<Product[]>(`/api/sellers/${sellerId}/products`),
}

// API du panier
export const cartApi = {
  get: () => apiCall<{ items: OrderProduct[]; total: number }>("/api/cart"),

  add: (productId: string, quantity = 1) =>
    apiCall<void>("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),

  update: (productId: string, quantity: number) =>
    apiCall<void>(`/api/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  remove: (productId: string) =>
    apiCall<void>(`/api/cart/${productId}`, {
      method: "DELETE",
    }),

  clear: () =>
    apiCall<void>("/api/cart", {
      method: "DELETE",
    }),
}

// API des favoris
export const favoritesApi = {
  get: () => apiCall<Product[]>("/api/favorites"),

  add: (productId: string) =>
    apiCall<void>("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),

  remove: (productId: string) =>
    apiCall<void>(`/api/favorites/${productId}`, {
      method: "DELETE",
    }),

  toggle: (productId: string) =>
    apiCall<{ added: boolean }>(`/api/favorites/${productId}/toggle`, {
      method: "POST",
    }),
}

// API des commandes
export const ordersApi = {
  getAll: () => apiCall<Order[]>("/api/orders"),

  getById: (id: string) => apiCall<Order>(`/api/orders/${id}`),

  create: (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) =>
    apiCall<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  updateStatus: (id: string, status: Order["status"]) =>
    apiCall<Order>(`/api/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
}

// API de recherche
export const searchApi = {
  global: (query: string) =>
    apiCall<{
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

    return apiCall<Product[]>(`/api/search/products?${searchParams.toString()}`)
  },
}

// API d'authentification
export const authApi = {
  login: (email: string, password: string) =>
    apiCall<{ user: any; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: {
    email: string
    password: string
    name: string
    phone?: string
  }) =>
    apiCall<{ user: any; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: () =>
    apiCall<void>("/api/auth/logout", {
      method: "POST",
    }),

  me: () => apiCall<any>("/api/auth/me"),
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
}
