"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useState } from "react"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    currency?: string
    image?: string
    images?: string[]
  }
  className?: string
  variant?: "default" | "outline" | "secondary"
}

export function AddToCartButton({ product, className, variant = "default" }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)

    // Get current cart from localStorage
    const cartJson = localStorage.getItem("spectrum_cart")
    const cart = cartJson ? JSON.parse(cartJson) : []

    // Get image from product
    const productImage = product.image || 
      (product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg")

    // Check if product already in cart
    const existingIndex = cart.findIndex((item: { id: string }) => item.id === product.id)

    if (existingIndex >= 0) {
      // Increase quantity
      cart[existingIndex].quantity += 1
    } else {
      // Add new item
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency || "EUR",
        image: productImage,
        quantity: 1,
      })
    }

    // Save to localStorage
    localStorage.setItem("spectrum_cart", JSON.stringify(cart))

    console.log("[v0] Added to cart:", product.name, "Cart now has", cart.length, "items")

    // Show feedback
    setTimeout(() => {
      setIsAdding(false)
      setAdded(true)
      // Trigger a custom event to update cart count
      window.dispatchEvent(new Event("cart-updated"))
      
      // Reset after 2 seconds
      setTimeout(() => setAdded(false), 2000)
    }, 300)
  }

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isAdding} 
      className={className}
      variant={variant}
    >
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Ajoute !
        </>
      ) : isAdding ? (
        "Ajout..."
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ajouter au panier
        </>
      )}
    </Button>
  )
}
