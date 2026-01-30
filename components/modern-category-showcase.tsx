"use client"

import { useCategories } from "@/hooks/use-api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiErrorHandler } from "@/components/api-error-handler"
import Link from "next/link"
import { motion } from "framer-motion"

const categoryIcons: { [key: string]: string } = {
  clothing: "👕",
  jewelry: "💍",
  art: "🎨",
  beauty: "💄",
  home: "🏠",
  books: "📚",
  accessories: "👜",
  craft: "🧶",
  tech: "📱",
  wellness: "🧘",
  food: "🍽️",
  music: "🎵",
  events: "🎪",
  services: "🛠️",
}

function CategorySkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <Skeleton className="h-12 w-12 rounded-full mb-3" />
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-3 w-16" />
      </CardContent>
    </Card>
  )
}

export default function ModernCategoryShowcase() {
  const { data: categories, loading, error } = useCategories()

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explorez Nos Univers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos catégories les plus populaires et trouvez des produits qui correspondent à votre style.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ApiErrorHandler error={error} title="Impossible de charger les catégories" />
        </div>
      </section>
    )
  }

  const displayCategories = categories?.slice(0, 12) || []

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
            Catégories Populaires
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Explorez Nos Univers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos catégories les plus populaires et trouvez des produits qui correspondent à votre style.
          </p>
        </div>

        {displayCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayCategories.map((category: any, index: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/categorie/${category.id}`}>
                  <Card className="h-full transition-all hover:shadow-md hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white group">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-4xl mb-3">{categoryIcons[category.id] || "🛍️"}</span>
                      <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                      <p className="text-xs text-muted-foreground group-hover:text-white/80">
                        {category.subcategories?.length || 0} sous-catégories
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune catégorie disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
