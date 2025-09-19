"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: "vetements",
    name: "Vêtements",
    description: "Mode inclusive et expressive",
    image: "/placeholder.svg?height=200&width=200&text=Vêtements",
    count: 150,
  },
  {
    id: "bijoux",
    name: "Bijoux",
    description: "Accessoires uniques",
    image: "/placeholder.svg?height=200&width=200&text=Bijoux",
    count: 89,
  },
  {
    id: "art",
    name: "Art",
    description: "Créations artistiques",
    image: "/placeholder.svg?height=200&width=200&text=Art",
    count: 67,
  },
  {
    id: "maison",
    name: "Maison",
    description: "Décoration inclusive",
    image: "/placeholder.svg?height=200&width=200&text=Maison",
    count: 45,
  },
]

export default function FeaturedCategories() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Card key={category.id} className="group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={200}
                height={200}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-muted-foreground mb-3">{category.description}</p>
            <p className="text-sm text-primary mb-4">{category.count} produits</p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href={`/categorie/${category.id}`}>Explorer</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
