"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Shirt, Palette, Home, Sparkles, Heart, Gift } from "lucide-react"

const categories = [
  {
    id: "mode",
    name: "Mode",
    icon: Shirt,
    count: 156,
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "art",
    name: "Art & Culture",
    icon: Palette,
    count: 89,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "maison",
    name: "Maison & Déco",
    icon: Home,
    count: 123,
    color: "from-pink-500 to-red-500",
  },
  {
    id: "beaute",
    name: "Beauté",
    icon: Sparkles,
    count: 67,
    color: "from-red-500 to-orange-500",
  },
  {
    id: "bien-etre",
    name: "Bien-être",
    icon: Heart,
    count: 45,
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "cadeaux",
    name: "Cadeaux",
    icon: Gift,
    count: 78,
    color: "from-yellow-500 to-green-500",
  },
]

export default function Categories() {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Catégories</h2>
        <p className="text-muted-foreground">Explorez nos différentes catégories de produits</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link key={category.id} href={`/categorie/${category.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} produits</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
