"use client"

import { useEffect, useState } from "react"
import { getProductById } from "@/lib/data/products"
import ARViewerSimplified from "@/components/ar-viewer-simplified"
import { Skeleton } from "@/components/ui/skeleton"

export default function ARPage({ params }: { params: { productId: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const product = getProductById(params.productId)

  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <p>Désolé, nous n'avons pas pu trouver le produit que vous recherchez.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <ARViewerSimplified productId={product.id} productName={product.name} productImages={product.images} />
      )}
    </div>
  )
}
