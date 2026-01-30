"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/data/products"

interface AddToCartButtonProps {
  product: Product
  selectedColor?: string
  selectedSize?: string
}

export default function AddToCartButton({ product, selectedColor, selectedSize }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCartStore()
  const { toast } = useToast()

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

    setTimeout(() => {
      addItem({
        productId: product.id,
        variantId: selectedColor && selectedSize ? `${selectedColor}-${selectedSize}` : undefined,
        name: product.name,
        price: product.discount ? product.price * (1 - product.discount / 100) : product.price,
        image: product.images?.[0] || "/placeholder.svg?height=100&width=100",
        quantity,
        vendorId: product.sellerId || "default",
        vendorName: product.sellerName || "Spectrum",
        size: selectedSize,
        color: selectedColor,
      })

      setIsAdding(false)
      setIsAdded(true)

      toast({
        title: "Produit ajouté",
        description: `${product.name} a été ajouté à votre panier`,
      })

      // Reset after 2 seconds
      setTimeout(() => {
        setIsAdded(false)
        setQuantity(1)
      }, 2000)
    }, 500)
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
          <div className="w-12 text-center font-medium">{quantity}</div>
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
          className={`flex-1 h-10 gap-2 transition-all ${
            isAdded ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"
          }`}
          onClick={handleAddToCart}
          disabled={isAdding || product.stock <= 0}
        >
          {isAdding ? (
            "Ajout en cours..."
          ) : isAdded ? (
            <>
              <Check className="h-4 w-4" />
              Ajouté au panier
            </>
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
