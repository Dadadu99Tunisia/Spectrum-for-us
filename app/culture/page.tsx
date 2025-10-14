import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ArrowRight } from "lucide-react"

// Données fictives pour les articles culturels
const articles = [
  {
    id: "1",
    title: "L'histoire du mouvement Pride",
    description: "Découvrez l'histoire riche et complexe du mouvement Pride, de Stonewall à aujourd'hui.",
    image: "/placeholder.svg?height=600&width=800",
    category: "Histoire",
    date: "15 juin 2023",
    author: "Alex Dubois",
  },
  {
    id: "2",
    title: "Représentation queer dans les médias",
    description: "Comment la représentation des personnes LGBTQ+ a évolué dans les films, séries et autres médias.",
    image: "/placeholder.svg?height=600&width=800",
    category: "Médias",
    date: "28 mai 2023",
    author: "Sophie Martin",
  },
  {
    id: "3",
    title: "Art queer contemporain",
    description: "Exploration des tendances actuelles dans l'art queer et de son impact sur la culture mainstream.",
    image: "/placeholder.svg?height=600&width=800",
    category: "Art",
    date: "10 avril 2023",
    author: "Léo Garcia",
  },
  {
    id: "4",
    title: "Littérature LGBTQ+ essentielle",
    description: "Une sélection de livres incontournables qui ont marqué la littérature LGBTQ+.",
    image: "/placeholder.svg?height=600&width=800",
    category: "Littérature",
    date: "22 mars 2023",
    author: "Emma Petit",
  },
  {
    id: "5",
    title: "Musique et identité queer",
    description: "Comment la musique a servi d'outil d'expression et de résistance pour la communauté LGBTQ+.",
    image: "/placeholder.svg?height=600&width=800",
    category: "Musique",
    date: "5 février 2023",
    author: "Thomas Leroy",
  },
  {
    id: "6",
    title: "Mode et expression de genre",
    description: "L'évolution de la mode comme moyen d'expression de l'identité de genre à travers les époques.",
    image: "/placeholder.svg?height=600&width=800",
    category: "Mode",
    date: "17 janvier 2023",
    author: "Julie Moreau",
  },
]

// Catégories culturelles
const categories = [
  { name: "Histoire", count: 12 },
  { name: "Médias", count: 18 },
  { name: "Art", count: 15 },
  { name: "Littérature", count: 20 },
  { name: "Musique", count: 14 },
  { name: "Mode", count: 10 },
  { name: "Politique", count: 8 },
  { name: "Santé", count: 6 },
]

export default function CulturePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Culture Queer</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Culture Queer</h1>
      <p className="text-muted-foreground mb-8">
        Plongez dans l'histoire, les médias et les mouvements qui façonnent la culture queer.
      </p>

      {/* Articles à la une */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Articles à la une</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <Link href={`/culture/articles/${article.id}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-blue-500 hover:bg-blue-600">{article.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">
                    {article.date} • Par {article.author}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground">{article.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Articles récents */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Articles récents</h2>
            <Button asChild variant="link" className="group">
              <Link href="/culture/articles">
                Tous les articles
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {articles.slice(3).map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
                <Link href={`/culture/articles/${article.id}`} className="flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6 md:w-2/3">
                    <Badge className="mb-2">{article.category}</Badge>
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{article.description}</p>
                    <div className="text-sm text-muted-foreground">
                      {article.date} • Par {article.author}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Catégories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex justify-between items-center">
                    <Link
                      href={`/culture/categories/${category.name.toLowerCase()}`}
                      className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {category.name}
                    </Link>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Ressources</h3>
              <div className="space-y-2">
                <Link
                  href="/resources"
                  className="block text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Bibliothèque LGBTQ+
                </Link>
                <Link
                  href="/resources"
                  className="block text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Archives historiques
                </Link>
                <Link
                  href="/resources"
                  className="block text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Guides éducatifs
                </Link>
                <Link
                  href="/resources"
                  className="block text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Podcasts recommandés
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

