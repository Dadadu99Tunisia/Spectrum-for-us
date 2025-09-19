import Link from "next/link"
import { categories } from "@/app/api/categories/route"
import { ArrowRight } from "lucide-react"

// Sélection des catégories à mettre en avant
const featuredCategoryIds = ["clothing", "art", "jewelry", "beauty", "accessories", "craft", "tech", "wellness"]

// Images de fond pour les catégories
const categoryBackgrounds: { [key: string]: string } = {
  clothing: "/placeholder.svg?height=600&width=800",
  jewelry: "/placeholder.svg?height=600&width=800",
  art: "/placeholder.svg?height=600&width=800",
  beauty: "/placeholder.svg?height=600&width=800",
  accessories: "/placeholder.svg?height=600&width=800",
  craft: "/placeholder.svg?height=600&width=800",
  tech: "/placeholder.svg?height=600&width=800",
  wellness: "/placeholder.svg?height=600&width=800",
}

// Icônes pour les catégories
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

export default function FeaturedCategories() {
  // Filtrer les catégories à mettre en avant
  const featuredCategories = categories.filter((cat) => featuredCategoryIds.includes(cat.id))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredCategories.map((category) => (
        <Link
          href={`/categorie/${category.id}`}
          key={category.id}
          className="group relative overflow-hidden rounded-xl aspect-square"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{
              backgroundImage: `url(${categoryBackgrounds[category.id] || "/placeholder.svg?height=600&width=800"})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl mb-2 inline-block">{categoryIcons[category.id] || "🛍️"}</span>
                <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                <p className="text-sm text-white/80">{category.subcategories.length} sous-catégories</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
