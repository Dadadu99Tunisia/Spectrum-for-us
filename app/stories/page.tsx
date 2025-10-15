import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

// Données fictives pour les histoires
const stories = [
  {
    id: "1",
    title: "Mon parcours en tant qu'entrepreneur queer",
    excerpt:
      "Comment j'ai créé ma marque de vêtements inclusifs et les défis que j'ai dû surmonter en tant qu'entrepreneur queer.",
    image: "/placeholder.svg?height=600&width=800",
    author: "Alex Dubois",
    date: "15 juin 2023",
    category: "Entrepreneuriat",
    featured: true,
  },
  {
    id: "2",
    title: "Trouver ma voix à travers l'art",
    excerpt:
      "Comment l'expression artistique m'a aidé à accepter mon identité et à trouver ma place dans la communauté.",
    image: "/placeholder.svg?height=600&width=800",
    author: "Sophie Martin",
    date: "28 mai 2023",
    category: "Art & Expression",
    featured: true,
  },
  {
    id: "3",
    title: "Créer des espaces inclusifs dans la mode",
    excerpt:
      "Mon expérience en tant que designer cherchant à rendre l'industrie de la mode plus inclusive et accessible à tous.",
    image: "/placeholder.svg?height=600&width=800",
    author: "Léo Garcia",
    date: "10 avril 2023",
    category: "Mode",
    featured: true,
  },
  {
    id: "4",
    title: "Mon voyage vers l'acceptation de soi",
    excerpt: "Comment j'ai appris à m'accepter et à célébrer mon identité malgré les obstacles sociaux et personnels.",
    image: "/placeholder.svg?height=600&width=800",
    author: "Emma Petit",
    date: "22 mars 2023",
    category: "Témoignage",
    featured: false,
  },
  {
    id: "5",
    title: "Construire une communauté en ligne",
    excerpt:
      "Comment j'ai créé un espace numérique sûr pour les personnes queer et les leçons que j'ai apprises en cours de route.",
    image: "/placeholder.svg?height=600&width=800",
    author: "Thomas Leroy",
    date: "5 février 2023",
    category: "Communauté",
    featured: false,
  },
  {
    id: "6",
    title: "L'art comme forme de résistance",
    excerpt: "Comment j'utilise mon art pour défier les normes et créer de la visibilité pour la communauté queer.",
    image: "/placeholder.svg?height=600&width=800",
    author: "Julie Moreau",
    date: "17 janvier 2023",
    category: "Activisme",
    featured: false,
  },
]

export default function StoriesPage() {
  const featuredStories = stories.filter((story) => story.featured)
  const otherStories = stories.filter((story) => !story.featured)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Histoires</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Histoires de la Communauté</h1>
      <p className="text-muted-foreground mb-8">
        Découvrez des témoignages inspirants et des parcours personnels de membres de la communauté.
      </p>

      {/* Histoires à la une */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Histoires à la une</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStories.map((story) => (
            <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <Link href={`/stories/${story.id}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-pink-500 hover:bg-pink-600">{story.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">
                    {story.date} • Par {story.author}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-muted-foreground">{story.excerpt}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Toutes les histoires */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Toutes les histoires</h2>
          <div className="flex gap-2">
            <Button variant="outline">Filtrer par catégorie</Button>
            <Button>Partager votre histoire</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherStories.map((story) => (
            <Card key={story.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
              <Link href={`/stories/${story.id}`} className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
                  <Image src={story.image || "/placeholder.svg"} alt={story.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6 md:w-2/3">
                  <Badge className="mb-2">{story.category}</Badge>
                  <h3 className="text-xl font-bold mb-2 hover:text-pink-600 dark:hover:text-pink-400">{story.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{story.excerpt}</p>
                  <div className="text-sm text-muted-foreground">
                    {story.date} • Par {story.author}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
