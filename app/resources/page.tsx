import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Search, Download, ExternalLink, BookOpen, FileText, Video, Headphones } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Données fictives pour les ressources
const resources = [
  {
    id: "1",
    title: "Guide de l'entrepreneuriat queer",
    description: "Un guide complet pour les entrepreneurs queer souhaitant lancer leur entreprise.",
    image: "/placeholder.svg?height=400&width=600",
    type: "Guide",
    format: "PDF",
    author: "Alex Dubois",
    date: "15 juin 2023",
    downloadable: true,
  },
  {
    id: "2",
    title: "Bibliographie LGBTQ+ essentielle",
    description: "Une liste de livres incontournables pour comprendre l'histoire et la culture LGBTQ+.",
    image: "/placeholder.svg?height=400&width=600",
    type: "Liste",
    format: "PDF",
    author: "Sophie Martin",
    date: "28 mai 2023",
    downloadable: true,
  },
  {
    id: "3",
    title: "Webinaire : Marketing inclusif",
    description: "Un webinaire sur les stratégies de marketing inclusif pour les entreprises queer.",
    image: "/placeholder.svg?height=400&width=600",
    type: "Webinaire",
    format: "Vidéo",
    author: "Léo Garcia",
    date: "10 avril 2023",
    downloadable: false,
  },
  {
    id: "4",
    title: "Podcast : Histoires d'entrepreneurs queer",
    description: "Une série de podcasts présentant des entrepreneurs queer inspirants.",
    image: "/placeholder.svg?height=400&width=600",
    type: "Podcast",
    format: "Audio",
    author: "Emma Petit",
    date: "22 mars 2023",
    downloadable: false,
  },
  {
    id: "5",
    title: "Modèles de business plan inclusifs",
    description: "Des modèles de business plan adaptés aux entreprises queer et inclusives.",
    image: "/placeholder.svg?height=400&width=600",
    type: "Template",
    format: "DOCX",
    author: "Thomas Leroy",
    date: "5 février 2023",
    downloadable: true,
  },
  {
    id: "6",
    title: "Infographie : Statistiques sur les entreprises LGBTQ+",
    description: "Une infographie présentant des statistiques clés sur les entreprises LGBTQ+.",
    image: "/placeholder.svg?height=400&width=600",
    type: "Infographie",
    format: "PNG",
    author: "Julie Moreau",
    date: "17 janvier 2023",
    downloadable: true,
  },
]

// Types de ressources
const resourceTypes = [
  { name: "Tous", icon: FileText, count: resources.length },
  { name: "Guides", icon: BookOpen, count: 2 },
  { name: "Vidéos", icon: Video, count: 1 },
  { name: "Podcasts", icon: Headphones, count: 1 },
  { name: "Templates", icon: FileText, count: 1 },
  { name: "Infographies", icon: FileText, count: 1 },
]

export default function ResourcesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Ressources</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Ressources</h1>
      <p className="text-muted-foreground mb-8">
        Accédez à des guides, des templates et d'autres ressources utiles pour la communauté.
      </p>

      {/* Recherche */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Rechercher des ressources..." className="pl-10 py-6 text-lg" />
      </div>

      {/* Filtres par type */}
      <Tabs defaultValue="Tous" className="mb-8">
        <TabsList className="w-full flex justify-start overflow-x-auto">
          {resourceTypes.map((type) => (
            <TabsTrigger key={type.name} value={type.name} className="flex items-center gap-2">
              <type.icon className="h-4 w-4" />
              {type.name}
              <Badge variant="outline" className="ml-1">
                {type.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Liste des ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <Link href={`/resources/${resource.id}`} className="block">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={resource.image || "/placeholder.svg"}
                  alt={resource.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-blue-500 hover:bg-blue-600">{resource.type}</Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-background/80">
                    {resource.format}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-muted-foreground mb-4">{resource.description}</p>
                <div className="text-sm text-muted-foreground">
                  {resource.date} • Par {resource.author}
                </div>
              </CardContent>
            </Link>
            <CardFooter className="p-6 pt-0 border-t border-border mt-4">
              <Button className="w-full" variant={resource.downloadable ? "default" : "outline"}>
                {resource.downloadable ? (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir la ressource
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}
