import { v4 as uuidv4 } from "uuid"
import { products, type Product } from "../data/products"
import { sellers } from "../data/sellers"
import { users } from "../data/users"
import { orders } from "../data/orders"
import { categories } from "../data/categories"

// Fonctions utilitaires pour les produits
export const getProducts = (limit?: number, offset?: number, filters?: any) => {
  let filteredProducts = [...products]

  // Appliquer les filtres si fournis
  if (filters) {
    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter((p) => p.categoryId === filters.categoryId)
    }
    if (filters.subcategoryId) {
      filteredProducts = filteredProducts.filter((p) => p.subcategoryId === filters.subcategoryId)
    }
    if (filters.sellerId) {
      filteredProducts = filteredProducts.filter((p) => p.sellerId === filters.sellerId)
    }
    if (filters.featured) {
      filteredProducts = filteredProducts.filter((p) => p.featured)
    }
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price >= filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price <= filters.maxPrice)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }
  }

  // Appliquer la pagination
  if (limit !== undefined) {
    const startIndex = offset || 0
    return filteredProducts.slice(startIndex, startIndex + limit)
  }

  return filteredProducts
}

export const getProductById = (id: string) => {
  return products.find((p) => p.id === id)
}

export const createProduct = (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
  const newProduct: Product = {
    ...productData,
    id: `prod-${uuidv4()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [],
  }

  products.push(newProduct)
  return newProduct
}

export const updateProduct = (id: string, productData: Partial<Product>) => {
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return null

  products[index] = {
    ...products[index],
    ...productData,
    updatedAt: new Date().toISOString(),
  }

  return products[index]
}

export const deleteProduct = (id: string) => {
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return false

  products.splice(index, 1)
  return true
}

// Fonctions utilitaires pour les vendeurs
export const getSellers = (limit?: number, offset?: number, filters?: any) => {
  let filteredSellers = [...sellers]

  // Appliquer les filtres si fournis
  if (filters) {
    if (filters.featured) {
      filteredSellers = filteredSellers.filter((s) => s.featured)
    }
    if (filters.verified) {
      filteredSellers = filteredSellers.filter((s) => s.verified)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredSellers = filteredSellers.filter(
        (s) => s.shopName.toLowerCase().includes(searchLower) || s.description.toLowerCase().includes(searchLower),
      )
    }
  }

  // Appliquer la pagination
  if (limit !== undefined) {
    const startIndex = offset || 0
    return filteredSellers.slice(startIndex, startIndex + limit)
  }

  return filteredSellers
}

export const getSellerById = (id: string) => {
  return sellers.find((s) => s.id === id)
}

export const getSellerByUserId = (userId: string) => {
  return sellers.find((s) => s.userId === userId)
}

// Fonctions utilitaires pour les utilisateurs
export const getUserById = (id: string) => {
  return users.find((u) => u.id === id)
}

export const getUserByEmail = (email: string) => {
  return users.find((u) => u.email === email)
}

// Fonctions utilitaires pour les commandes
export const getOrdersByUserId = (userId: string) => {
  return orders.filter((o) => o.userId === userId)
}

export const getOrderById = (id: string) => {
  return orders.find((o) => o.id === id)
}

export const getOrdersBySellerId = (sellerId: string) => {
  return orders.filter((o) => o.items.some((item) => item.sellerId === sellerId))
}

// Fonctions utilitaires pour les catégories
export const getAllCategories = () => {
  return categories
}

export const getCategoryById = (id: string) => {
  return categories.find((c) => c.id === id)
}

export const getSubcategoryById = (categoryId: string, subcategoryId: string) => {
  const category = getCategoryById(categoryId)
  if (!category) return null

  return category.subcategories.find((s) => s.id === subcategoryId)
}
