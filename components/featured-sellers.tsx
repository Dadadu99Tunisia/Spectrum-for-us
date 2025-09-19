"use client"

import { useSellers } from "@/hooks/use-api"
import { ApiErrorHandler } from "@/components/api-error-handler"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Package } from "lucide-react"
import Link from "next/link"

export function FeaturedSellers() {
  const { sellers, loading, error } = useSellers({ limit: 6 })

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Vendeurs en Vedette</h2>
          <ApiErrorHandler
            error={new Error(error)}
            title="Erreur de chargement des vendeurs"
            description="Impossible de charger les vendeurs en vedette"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Vendeurs en Vedette</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rencontrez nos créateurs passionnés qui font de Spectrum une marketplace unique et inclusive
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <Link key={seller.id} href={`/vendeur/${seller.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={seller.avatar || "/placeholder.svg"}
                      alt={seller.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{seller.name}</h3>
                        {seller.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Vérifié
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{seller.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">{seller.description}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{seller.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{seller.productCount} produits</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/vendeurs">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Découvrir tous les vendeurs
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedSellers
