"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Shirt, Coffee, Music, Camera, Sparkles } from "lucide-react"

const categories = [
  {
    name: "Art & Design",
    slug: "art-design",
    icon: Palette,
    count: "1,200+ produits",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Mode & Style",
    slug: "mode-style",
    icon: Shirt,
    count: "800+ produits",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    icon: Coffee,
    count: "600+ produits",
    color: "from-green-500 to-teal-500",
  },
  {
    name: "Musique",
    slug: "musique",
    icon: Music,
    count: "400+ produits",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Photographie",
    slug: "photographie",
    icon: Camera,
    count: "300+ produits",
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "Beauté",
    slug: "beaute",
    icon: Sparkles,
    count: "500+ produits",
    color: "from-pink-500 to-rose-500",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

export default function FeaturedCategories() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {categories.map((category) => (
        <motion.div key={category.slug} variants={itemVariants}>
          <Link href={`/categorie/${category.slug}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
              <CardContent className="p-6">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{category.count}</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
