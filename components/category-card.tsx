"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { CategoryIcon } from "./category-icons"
import { motion } from "framer-motion"

interface CategoryCardProps {
  id: string
  name: string
  parentId?: string
  count?: number
  isSubcategory?: boolean
}

export function CategoryCard({ id, name, parentId, count, isSubcategory = false }: CategoryCardProps) {
  const href = parentId ? `/categorie/${parentId}/${id}` : `/categorie/${id}`

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
            <div
              className={`mb-3 text-primary group-hover:text-primary transition-colors ${
                isSubcategory ? "w-8 h-8" : "w-12 h-12"
              }`}
            >
              <CategoryIcon category={id} className={isSubcategory ? "w-8 h-8" : "w-12 h-12"} />
            </div>

            <h3 className="font-semibold text-sm mb-1 group-hover:text-foreground transition-colors">{name}</h3>

            {count !== undefined && (
              <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
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

