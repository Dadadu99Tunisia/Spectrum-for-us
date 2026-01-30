"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Share2, View } from "lucide-react"

interface ProductActionsProps {
  productId: string
  productName: string
}

export default function ProductActions({ productId, productName }: ProductActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    console.log(`${isFavorite ? "Retiré des" : "Ajouté aux"} favoris: ${productName}`)
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator
        .share({
          title: productName,
          url: window.location.href,
        })
        .catch((err) => {
          console.log("Erreur lors du partage:", err)
        })
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(window.location.href)
      console.log("URL copiée dans le presse-papier")
      // Ici vous pourriez afficher une notification
    }
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-10"
        onClick={() => (window.location.href = `/ar/${productId}`)}
      >
        <View className="h-4 w-4" />
        Voir en 3D
      </Button>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2 h-10"
          onClick={toggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          {isFavorite ? "Ajouté aux favoris" : "Ajouter aux favoris"}
        </Button>

        <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 h-10" onClick={shareProduct}>
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      </div>
    </div>
  )
}
