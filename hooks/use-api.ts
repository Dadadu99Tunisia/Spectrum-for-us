"use client"

import { useState, useEffect, useCallback } from "react"
import { ApiError, type ApiResponse } from "@/lib/api"

// Hook générique pour les appels API
export function useApi<T>(apiCall: () => Promise<ApiResponse<T>>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall()
      setData(response.data)
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError("Unknown error", 0))
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

// Hook pour les produits
export function useProducts(params?: {
  category?: string
  search?: string
  limit?: number
  offset?: number
}) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simuler un appel API pour le moment
        const mockProducts = [
          {
            id: "1",
            name: "Produit Inclusif 1",
            price: 29.99,
            image: "/placeholder.svg?height=300&width=300",
            seller: { name: "Vendeur Inclusif", verified: true },
            rating: 4.8,
            reviews: 124,
          },
          {
            id: "2",
            name: "Produit Diversité 2",
            price: 45.5,
            image: "/placeholder.svg?height=300&width=300",
            seller: { name: "Créateur LGBTQ+", verified: true },
            rating: 4.9,
            reviews: 89,
          },
        ]

        setProducts(mockProducts)
      } catch (err) {
        setError("Erreur lors du chargement des produits")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [params?.category, params?.search, params?.limit, params?.offset])

  return { products, loading, error }
}

// Hook pour les vendeurs
export function useSellers(params?: { limit?: number; offset?: number }) {
  const [sellers, setSellers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simuler un appel API pour le moment
        const mockSellers = [
          {
            id: "1",
            name: "Atelier Inclusif",
            avatar: "/placeholder.svg?height=100&width=100",
            rating: 4.9,
            verified: true,
            description: "Créations artisanales inclusives",
            location: "Paris, France",
            productCount: 45,
          },
          {
            id: "2",
            name: "Pride Creations",
            avatar: "/placeholder.svg?height=100&width=100",
            rating: 4.8,
            verified: true,
            description: "Produits LGBTQ+ authentiques",
            location: "Lyon, France",
            productCount: 32,
          },
        ]

        setSellers(mockSellers)
      } catch (err) {
        setError("Erreur lors du chargement des vendeurs")
      } finally {
        setLoading(false)
      }
    }

    fetchSellers()
  }, [params?.limit, params?.offset])

  return { sellers, loading, error }
}

// Hook pour les catégories
export function useCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simuler un appel API pour le moment
        const mockCategories = [
          {
            id: "1",
            name: "Mode Inclusive",
            slug: "mode-inclusive",
            description: "Vêtements pour tous les corps",
            image: "/placeholder.svg?height=200&width=200",
            icon: "Shirt",
            productCount: 156,
          },
          {
            id: "2",
            name: "Art & Culture",
            slug: "art-culture",
            description: "Œuvres d'art diversifiées",
            image: "/placeholder.svg?height=200&width=200",
            icon: "Palette",
            productCount: 89,
          },
        ]

        setCategories(mockCategories)
      } catch (err) {
        setError("Erreur lors du chargement des catégories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// Hook pour le panier
export function useCart() {
  const [cart, setCart] = useState<any>({ items: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    try {
      setLoading(true)
      setError(null)

      // Simuler l'ajout au panier
      console.log(`Ajout au panier: ${productId} x${quantity}`)

      // Mettre à jour le state local
      setCart((prev) => ({
        ...prev,
        items: [...prev.items, { productId, quantity }],
        total: prev.total + 29.99 * quantity, // Prix simulé
      }))
    } catch (err) {
      setError("Erreur lors de l'ajout au panier")
    } finally {
      setLoading(false)
    }
  }, [])

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Simuler la suppression du panier
      console.log(`Suppression du panier: ${productId}`)

      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item: any) => item.productId !== productId),
      }))
    } catch (err) {
      setError("Erreur lors de la suppression du panier")
    } finally {
      setLoading(false)
    }
  }, [])

  return { cart, loading, error, addToCart, removeFromCart }
}

// Hook pour les favoris
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleFavorite = useCallback(async (productId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Simuler le toggle des favoris
      setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
    } catch (err) {
      setError("Erreur lors de la gestion des favoris")
    } finally {
      setLoading(false)
    }
  }, [])

  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.includes(productId)
    },
    [favorites],
  )

  return { favorites, loading, error, toggleFavorite, isFavorite }
}
