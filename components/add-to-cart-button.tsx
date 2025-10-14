"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/data/products"

interface AddToCartButtonProps {
  product: Product
  selectedColor?: string
  selectedSize?: string
}

export default function AddToCartButton({ product, selectedColor, selectedSize }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    setIsAdding(true)

    // Simuler l'ajout au panier
    setTimeout(() => {
      console.log(
        `Ajout au panier: ${product.name}, couleur: ${selectedColor}, taille: ${selectedSize}, quantité: ${quantity}`,
      )
      setIsAdding(false)

      // Afficher une notification de succès (à implémenter)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none rounded-l-md"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            aria-label="Diminuer la quantité"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="w-12 text-center">{quantity}</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none rounded-r-md"
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
            aria-label="Augmenter la quantité"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="flex-1 h-10 gap-2 bg-purple-600 hover:bg-purple-700"
          onClick={handleAddToCart}
          disabled={isAdding || product.stock <= 0}
        >
          {isAdding ? (
            "Ajout en cours..."
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Ajouter au panier
            </>
          )}
        </Button>
      </div>

      {product.stock <= 5 && product.stock > 0 && (
        <p className="text-sm text-amber-600">Plus que {product.stock} en stock !</p>
      )}

      {product.stock <= 0 && <p className="text-sm text-red-500">Produit temporairement indisponible</p>}
    </div>
  )
}
