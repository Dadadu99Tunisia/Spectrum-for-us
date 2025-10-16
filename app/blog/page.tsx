"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, ArrowRight, Search, Clock } from "lucide-react"
import Link from "next/link"

const mockArticles = [
  {
    id: "1",
    title: "Mode Non-Genrée : Au-delà des Étiquettes",
    excerpt:
      "Comment la mode queer redéfinit les codes vestimentaires et crée de nouveaux espaces d'expression personnelle.",
    content: "La mode non-genrée n'est pas une tendance, c'est une révolution...",
    category: "Culture",
    author: { name: "Alex Moreau", avatar: "/queer-entrepreneur-workspace-creative.jpg" },
    published_at: "2025-03-15",
    featured_image: "/gender-neutral-fashion-editorial.jpg",
    reading_time: 8,
    slug: "mode-non-genree-au-dela-des-etiquettes",
  },
  {
    id: "2",
    title: "Créer un Espace Safe : Guide pour les Entrepreneur·es",
    excerpt: "Les clés pour construire un business inclusif et bienveillant qui respecte toutes les identités.",
    content: "Créer un espace safe ne se limite pas à afficher un drapeau arc-en-ciel...",
    category: "Société",
    author: { name: "Sam Rivera", avatar: "/queer-art-poster-belonging-illustration.jpg" },
    published_at: "2025-03-10",
    featured_image: "/queer-entrepreneur-workspace-creative.jpg",
    reading_time: 12,
    slug: "creer-espace-safe-guide-entrepreneurs",
  },
  {
    id: "3",
    title: "L'Art Queer Contemporain : Nouvelles Voix, Nouveaux Récits",
    excerpt:
      "Rencontre avec les artistes qui transforment le paysage culturel et revendiquent leur place dans l'histoire de l'art.",
    content: "L'art queer a toujours existé, mais aujourd'hui il se revendique...",
    category: "Design",
    author: { name: "Jordan Chen", avatar: "/fluid-artisan-jewelry-queer.jpg" },
    published_at: "2025-03-05",
    featured_image: "/queer-art-gallery-colorful-exhibition.jpg",
    reading_time: 10,
    slug: "art-queer-contemporain-nouvelles-voix",
  },
  {
    id: "4",
    title: "Intimité et Consentement : Repenser les Relations",
    excerpt: "Comment la communauté queer redéfinit les normes relationnelles et crée de nouveaux modèles d'intimité.",
    content: "Les relations queers nous invitent à questionner les scripts traditionnels...",
    category: "Intimité",
    author: { name: "Morgan Dubois", avatar: "/queer-voices-book-cover-diverse.jpg" },
    published_at: "2025-02-28",
    featured_image: "/diverse-queer-people-celebrating-authentic-fashion.jpg",
    reading_time: 15,
    slug: "intimite-consentement-repenser-relations",
  },
]

const categories = ["Tous", "Culture", "Société", "Intimité", "Design", "Soin"]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Tous" || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Journal</h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Histoires, réflexions et actualités de la communauté queer. Des voix authentiques, des récits qui
              comptent.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b bg-background/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {filteredArticles.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] md:aspect-auto bg-muted overflow-hidden">
                <img
                  src={filteredArticles[0].featured_image || "/placeholder.svg"}
                  alt={filteredArticles[0].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4">{filteredArticles[0].category}</Badge>
                <h2 className="text-3xl font-bold mb-4 text-balance">{filteredArticles[0].title}</h2>
                <p className="text-muted-foreground mb-6 text-lg">{filteredArticles[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                      <img
                        src={filteredArticles[0].author.avatar || "/placeholder.svg"}
                        alt={filteredArticles[0].author.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{filteredArticles[0].author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(filteredArticles[0].published_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{filteredArticles[0].reading_time} min</span>
                  </div>
                </div>
                <Button asChild size="lg">
                  <Link href={`/blog/${filteredArticles[0].slug}`}>
                    Lire l'article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Articles Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-8">Tous les articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.slice(1).map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                <img
                  src={article.featured_image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-4 left-4">{article.category}</Badge>
              </div>
              <CardHeader className="flex-1">
                <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
                      <img
                        src={article.author.avatar || "/placeholder.svg"}
                        alt={article.author.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs">{article.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{article.reading_time} min</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <Link href={`/blog/${article.slug}`}>
                    Lire l'article
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Aucun article ne correspond à votre recherche</p>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Restez informé·e</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Recevez nos derniers articles et actualités directement dans votre boîte mail
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="votre@email.com" className="bg-white text-gray-900" />
            <Button size="lg" variant="secondary">
              S'abonner
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
