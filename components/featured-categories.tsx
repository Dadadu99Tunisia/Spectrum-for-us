"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const categories = [
  {
    id: "vetements",
    name: "Vêtements",
    description: "Mode inclusive et expressive",
    image: "/images/categories/calvin-klein-pride.jpg",
    count: 156,
    color: "from-pink-500 to-purple-600",
  },
  {
    id: "bijoux",
    name: "Bijoux",
    description: "Accessoires qui racontent votre histoire",
    image: "/placeholder.svg?height=300&width=300&text=Bijoux",
    count: 89,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "art",
    name: "Art",
    description: "Créations artistiques authentiques",
    image: "/placeholder.svg?height=300&width=300&text=Art",
    count: 234,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "maison",
    name: "Maison",
    description: "Décorez votre espace avec fierté",
    image: "/placeholder.svg?height=300&width=300&text=Maison",
    count: 67,
    color: "from-orange-500 to-red-600",
  },
  {
    id: "beaute",
    name: "Beauté",
    description: "Produits de beauté inclusifs",
    image: "/placeholder.svg?height=300&width=300&text=Beauté",
    count: 123,
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "accessoires",
    name: "Accessoires",
    description: "Complétez votre look unique",
    image: "/placeholder.svg?height=300&width=300&text=Accessoires",
    count: 78,
    color: "from-indigo-500 to-blue-600",
  },
]

export default function FeaturedCategories() {
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explorez nos catégories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez une sélection unique de produits créés par et pour la communauté LGBTQ+
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div key={category.id} variants={item}>
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20`} />
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                    {category.count} produits
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <Button asChild className="w-full">
                    <Link href={`/categorie/${category.id}`}>Explorer</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/categories">Voir toutes les catégories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
