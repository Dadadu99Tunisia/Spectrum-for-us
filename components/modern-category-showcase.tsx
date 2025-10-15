"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ModernCategoryCard } from "./modern-category-card"
import { categories } from "@/app/api/categories/route"

// Icônes pour les catégories principales
const categoryIcons: { [key: string]: React.ReactNode } = {
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

// Couleurs pour les catégories
const categoryColors: { [key: string]: string } = {
  clothing: "purple",
  jewelry: "pink",
  art: "blue",
  beauty: "indigo",
  home: "teal",
  books: "amber",
  accessories: "rose",
  craft: "green",
  tech: "sky",
  wellness: "violet",
  food: "orange",
  music: "fuchsia",
  events: "lime",
  services: "cyan",
}

export default function ModernCategoryShowcase() {
  // Prendre les 8 premières catégories pour l'affichage
  const displayCategories = categories.slice(0, 8)

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {displayCategories.map((category) => (
        <motion.div key={category.id} variants={item}>
          <ModernCategoryCard
            id={category.id}
            name={category.name}
            subcategories={category.subcategories.length}
            icon={categoryIcons[category.id] || "🛍️"}
            color={categoryColors[category.id] || "purple"}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
