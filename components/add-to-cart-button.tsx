"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    currency: string
    image?: string
  }
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)

    // Get current cart from localStorage
    const cartJson = localStorage.getItem("spectrum_cart")
    const cart = cartJson ? JSON.parse(cartJson) : []

    // Check if product already in cart
    const existingIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingIndex >= 0) {
      // Increase quantity
      cart[existingIndex].quantity += 1
    } else {
      // Add new item
      cart.push({
        ...product,
        quantity: 1,
      })
    }

    // Save to localStorage
    localStorage.setItem("spectrum_cart", JSON.stringify(cart))

    // Show feedback
    setTimeout(() => {
      setIsAdding(false)
      // Trigger a custom event to update cart count
      window.dispatchEvent(new Event("cart-updated"))
    }, 500)
  }

  return (
    <Button onClick={handleAddToCart} disabled={isAdding} className={className}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isAdding ? "Ajouté !" : "Ajouter au panier"}
    </Button>
  )
}
