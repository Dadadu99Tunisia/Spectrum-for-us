import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  { id: "vetements", name: "Vêtements", count: 120, icon: "👕" },
  { id: "bijoux", name: "Bijoux", count: 85, icon: "💍" },
  { id: "art", name: "Art", count: 64, icon: "🎨" },
  { id: "beaute", name: "Beauté", count: 42, icon: "💄" },
  { id: "decoration", name: "Décoration", count: 56, icon: "🏠" },
  { id: "livres", name: "Livres", count: 38, icon: "📚" },
  { id: "accessoires", name: "Accessoires", count: 72, icon: "👜" },
  { id: "artisanat", name: "Artisanat", count: 45, icon: "🧶" },
]

export default function CategoryShowcase() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {categories.map((category) => (
        <Link href={`/categorie/${category.id}`} key={category.id}>
          <Card className="h-full transition-all hover:shadow-md hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white group">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <span className="text-4xl mb-3">{category.icon}</span>
              <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-muted-foreground group-hover:text-white/80">{category.count} produits</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

