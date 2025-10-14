import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/app/api/categories/route"

// Icônes pour les catégories principales
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

// Couleurs de fond pour les catégories
const categoryColors: { [key: string]: string } = {
  clothing: "from-purple-500 to-pink-500",
  jewelry: "from-pink-500 to-rose-500",
  art: "from-blue-500 to-indigo-500",
  beauty: "from-indigo-500 to-purple-500",
  home: "from-teal-500 to-green-500",
  books: "from-amber-500 to-orange-500",
  accessories: "from-rose-500 to-red-500",
  craft: "from-green-500 to-emerald-500",
  tech: "from-sky-500 to-blue-500",
  wellness: "from-violet-500 to-purple-500",
  food: "from-orange-500 to-amber-500",
  music: "from-fuchsia-500 to-pink-500",
  events: "from-lime-500 to-green-500",
  services: "from-cyan-500 to-sky-500",
}

export default function CategoryShowcase() {
  // Prendre les 12 premières catégories pour l'affichage (au lieu de 8)
  const displayCategories = categories.slice(0, 12)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {displayCategories.map((category) => (
        <Link href={`/categorie/${category.id}`} key={category.id}>
          <Card className="h-full transition-all hover:shadow-md hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white group">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <span className="text-4xl mb-3">{categoryIcons[category.id] || "🛍️"}</span>
              <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-muted-foreground group-hover:text-white/80">
                {category.subcategories.length} sous-catégories
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

