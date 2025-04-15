"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { CategoryIcon } from "./category-icons"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
// Importez le hook de détection mobile
import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface CategoryCardProps {
  id: string
  name: string
  parentId?: string
  count?: number
  isSubcategory?: boolean
}

export function CategoryCard({ id, name, parentId, count, isSubcategory = false }: CategoryCardProps) {
  const href = parentId ? `/categorie/${parentId}/${id}` : `/categorie/${id}`

  // Dans la fonction CategoryCard, ajoutez cette ligne après les autres hooks
  const { isMobile } = useMobileDetection()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link href={href}>
        <Card
          className={`h-full transition-all hover:shadow-lg group relative overflow-hidden ${
            isSubcategory ? "border-primary/20" : "border-primary/40"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:opacity-100 opacity-0 transition-opacity z-0"></div>

          <CardContent className="flex flex-col items-center justify-center p-4 text-center relative z-10">
            {/* Modifiez la taille des icônes et du texte pour mobile */}
            {/* Remplacez la div de l'icône par ceci: */}
            <div
              className={cn(
                "mb-3 text-primary group-hover:text-primary transition-colors",
                isSubcategory ? (isMobile ? "w-6 h-6" : "w-8 h-8") : isMobile ? "w-10 h-10" : "w-12 h-12",
              )}
            >
              <CategoryIcon
                category={id}
                className={cn(
                  isSubcategory ? (isMobile ? "w-6 h-6" : "w-8 h-8") : isMobile ? "w-10 h-10" : "w-12 h-12",
                )}
              />
            </div>

            {/* Modifiez la taille du texte pour mobile */}
            {/* Remplacez le h3 par ceci: */}
            <h3
              className={cn(
                "font-semibold mb-1 group-hover:text-foreground transition-colors",
                isMobile ? "text-xs" : "text-sm",
              )}
            >
              {name}
            </h3>

            {/* Modifiez la taille du texte du compteur pour mobile */}
            {/* Remplacez le p par ceci: */}
            {count !== undefined && (
              <p
                className={cn(
                  "group-hover:text-foreground/80 transition-colors",
                  isMobile ? "text-[10px]" : "text-xs",
                  "text-muted-foreground",
                )}
              >
                {count} {isSubcategory ? "produits" : "sous-catégories"}
              </p>
            )}

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
