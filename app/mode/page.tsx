import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ArrowRight } from "lucide-react"

// Données fictives pour les collections de mode
const collections = [
  {
    id: "1",
    title: "Collection Pride 2023",
    description: "Une collection colorée et audacieuse célébrant la fierté et l'expression de soi.",
    image: "/placeholder.svg?height=600&width=800",
    designer: "QueerApparel",
    featured: true,
  },
  {
    id: "2",
    title: "Vêtements Non-Genrés",
    description: "Des vêtements conçus pour tous, sans distinction de genre, favorisant l'inclusivité et le confort.",
    image: "/placeholder.svg?height=600&width=800",
    designer: "GenderFree",
    featured: true,
  },
  {
    id: "3",
    title: "Accessoires Inclusifs",
    description: "Des accessoires qui célèbrent la diversité et permettent à chacun d'exprimer son identité.",
    image: "/placeholder.svg?height=600&width=800",
    designer: "InclusiveStyle",
    featured: true,
  },
]

// Données fictives pour les produits de mode
const products = [
  {
    id: "1",
    name: "T-shirt Pride Collection",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Vêtements",
  },
  {
    id: "2",
    name: "Hoodie Non-Genré",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Vêtements",
  },
  {
    id: "3",
    name: "Bracelet Rainbow",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessoires",
  },
  {
    id: "4",
    name: "Veste Denim Inclusive",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Vêtements",
  },
  {
    id: "5",
    name: "Écharpe Pride",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessoires",
  },
  {
    id: "6",
    name: "Pantalon Cargo Unisexe",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Vêtements",
  },
]

export default function ModePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Mode & Style</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Mode & Style</h1>
      <p className="text-muted-foreground mb-8">
        Explorez des créations audacieuses qui défient les normes et célèbrent l'individualité.
      </p>

      {/* Collections à la une */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Collections à la une</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <Link href={`/mode/collections/${collection.id}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-pink-500 hover:bg-pink-600">Collection</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">Par {collection.designer}</p>
                  <p className="text-muted-foreground">{collection.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Produits populaires */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Produits populaires</h2>
          <Button asChild variant="link" className="group">
            <Link href="/categorie/clothing">
              Voir tous les produits
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all duration-300 group">
              <Link href={`/produit/${product.id}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-bold">{product.price.toFixed(2)} €</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Designers */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Designers à découvrir</h2>
          <Button asChild variant="link" className="group">
            <Link href="/vendeurs">
              Tous les designers
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["QueerApparel", "GenderFree", "InclusiveStyle"].map((designer, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-300">
              <Link href={`/vendeur/designer-${index + 1}`} className="block p-6 text-center">
                <div className="relative h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=200&width=200&text=${designer}`}
                    alt={designer}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1 hover:text-pink-600 dark:hover:text-pink-400">{designer}</h3>
                <p className="text-sm text-muted-foreground">Designer de mode inclusive</p>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
