"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { CartItem, Product } from "@/lib/types"
import { toast } from "sonner"

interface CartContextType {
  items: (CartItem & { products: Product })[]
  itemCount: number
  total: number
  isLoading: boolean
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  total: 0,
  isLoading: true,
  addItem: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<(CartItem & { products: Product })[]>([])
  const [cartId, setCartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const total = items.reduce((acc, item) => acc + (item.products?.price || 0) * item.quantity, 0)

  const getOrCreateCart = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Get existing cart for user
      const { data: existingCart } = await supabase.from("carts").select("id").eq("user_id", user.id).single()

      if (existingCart) {
        return existingCart.id
      }

      // Create new cart
      const { data: newCart } = await supabase.from("carts").insert({ user_id: user.id }).select("id").single()

      return newCart?.id
    }

    // For anonymous users, use localStorage
    const sessionCartId = localStorage.getItem("cart_id")
    if (sessionCartId) {
      return sessionCartId
    }

    const newId = crypto.randomUUID()
    localStorage.setItem("cart_id", newId)
    return newId
  }

  const fetchCartItems = async (id: string) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from("cart_items")
        .select(`
          *,
          products (
            *,
            vendors (store_name)
          )
        `)
        .eq("cart_id", id)

      setItems(data || [])
    } else {
      // For anonymous users, use localStorage
      const localItems = JSON.parse(localStorage.getItem("cart_items") || "[]")
      setItems(localItems)
    }
  }

  const refreshCart = async () => {
    setIsLoading(true)
    const id = await getOrCreateCart()
    setCartId(id)
    if (id) {
      await fetchCartItems(id)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    refreshCart()
  }, [])

  const addItem = async (productId: string, quantity = 1) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user && cartId) {
      // Check if item already exists
      const existingItem = items.find((item) => item.product_id === productId)

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
        return
      }

      const { error } = await supabase.from("cart_items").insert({
        cart_id: cartId,
        product_id: productId,
        quantity,
      })

      if (error) {
        toast.error("Failed to add item to cart")
        return
      }

      await refreshCart()
      toast.success("Item added to cart")
    } else {
      // For anonymous users
      const { data: product } = await supabase
        .from("products")
        .select("*, vendors (store_name)")
        .eq("id", productId)
        .single()

      if (!product) {
        toast.error("Product not found")
        return
      }

      const localItems = JSON.parse(localStorage.getItem("cart_items") || "[]")
      const existingIndex = localItems.findIndex((i: CartItem) => i.product_id === productId)

      if (existingIndex > -1) {
        localItems[existingIndex].quantity += quantity
      } else {
        localItems.push({
          id: crypto.randomUUID(),
          cart_id: cartId,
          product_id: productId,
          quantity,
          created_at: new Date().toISOString(),
          products: product,
        })
      }

      localStorage.setItem("cart_items", JSON.stringify(localItems))
      setItems(localItems)
      toast.success("Item added to cart")
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (quantity < 1) {
      await removeItem(itemId)
      return
    }

    if (user) {
      await supabase.from("cart_items").update({ quantity }).eq("id", itemId)

      await refreshCart()
    } else {
      const localItems = JSON.parse(localStorage.getItem("cart_items") || "[]")
      const index = localItems.findIndex((i: CartItem) => i.id === itemId)
      if (index > -1) {
        localItems[index].quantity = quantity
        localStorage.setItem("cart_items", JSON.stringify(localItems))
        setItems(localItems)
      }
    }
  }

  const removeItem = async (itemId: string) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from("cart_items").delete().eq("id", itemId)

      await refreshCart()
      toast.success("Item removed from cart")
    } else {
      const localItems = JSON.parse(localStorage.getItem("cart_items") || "[]")
      const filtered = localItems.filter((i: CartItem) => i.id !== itemId)
      localStorage.setItem("cart_items", JSON.stringify(filtered))
      setItems(filtered)
      toast.success("Item removed from cart")
    }
  }

  const clearCart = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user && cartId) {
      await supabase.from("cart_items").delete().eq("cart_id", cartId)

      await refreshCart()
    } else {
      localStorage.setItem("cart_items", "[]")
      setItems([])
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
