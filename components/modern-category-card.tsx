"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type ModernCategoryCardProps = {
  id: string
  name: string
  subcategories: number
  icon: React.ReactNode
  color: string
}

export function ModernCategoryCard({ id, name, subcategories, icon, color }: ModernCategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Définir les couleurs de fond et de texte en fonction de la couleur passée
  const bgColor = `bg-${color}-100 dark:bg-${color}-900/20`
  const borderColor = `border-${color}-200 dark:border-${color}-800/30`
  const hoverBgColor = `hover:bg-${color}-200 dark:hover:bg-${color}-800/30`
  const textColor = `text-${color}-600 dark:text-${color}-400`
  const iconBgColor = `bg-${color}-500/10`

  return (
    <Link href={`/categorie/${id}`}>
      <motion.div
        className={cn(
          "relative h-full rounded-xl overflow-hidden border p-6 transition-all duration-300",
          "flex flex-col items-center text-center gap-3",
          bgColor,
          borderColor,
          hoverBgColor,
          "shadow-sm hover:shadow-md",
        )}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Cercle décoratif */}
        <motion.div
          className={cn("absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-20", `bg-${color}-500`)}
          animate={{
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Icône */}
        <motion.div
          className={cn("relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-2", iconBgColor)}
          animate={{
            rotate: isHovered ? 5 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
        >
          <div className={cn("text-3xl", textColor)}>{icon}</div>
        </motion.div>

        {/* Texte */}
        <h3 className={cn("font-semibold text-base relative z-10", textColor)}>{name}</h3>

        <p className="text-xs text-muted-foreground relative z-10">{subcategories} sous-catégories</p>

        {/* Ligne décorative */}
        <motion.div
          className={cn("absolute bottom-0 left-0 h-1 bg-gradient-to-r", `from-${color}-500 to-${color}-300`)}
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </Link>
  )
}
