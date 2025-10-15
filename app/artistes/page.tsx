import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

// Données fictives pour les artistes
const artists = [
  {
    id: "1",
    name: "Alex Dubois",
    role: "Artiste & Activiste",
    description:
      "L'art est mon moyen d'expression et de résistance. À travers mes créations, je célèbre la diversité des identités queer.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Peinture", "Sculpture", "Activisme"],
    featured: true,
  },
  {
    id: "2",
    name: "Sophie Martin",
    role: "Designer de Mode",
    description:
      "Je crée des vêtements qui permettent à chacun d'exprimer sa véritable identité, au-delà des normes de genre traditionnelles.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Mode", "Design", "Inclusivité"],
    featured: true,
  },
  {
    id: "3",
    name: "Léo Garcia",
    role: "Écrivain & Poète",
    description:
      "Les mots ont le pouvoir de transformer notre perception du monde. J'écris pour donner une voix à ceux qui sont souvent réduits au silence.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Littérature", "Poésie", "Activisme"],
    featured: true,
  },
  {
    id: "4",
    name: "Emma Petit",
    role: "Photographe",
    description:
      "À travers mon objectif, je capture la beauté et la force de la communauté queer dans toute sa diversité.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Photographie", "Portrait", "Documentaire"],
    featured: false,
  },
  {
    id: "5",
    name: "Thomas Leroy",
    role: "Artiste Digital",
    description:
      "J'explore les possibilités infinies de l'art numérique pour créer des œuvres qui questionnent les normes et célèbrent la différence.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Art numérique", "Animation", "NFT"],
    featured: false,
  },
  {
    id: "6",
    name: "Julie Moreau",
    role: "Céramiste",
    description:
      "Je façonne l'argile pour créer des pièces uniques qui racontent des histoires d'identité, d'appartenance et de transformation.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Céramique", "Artisanat", "Design"],
    featured: false,
  },
]

export default function ArtistesPage() {
  const featuredArtists = artists.filter((artist) => artist.featured)
  const otherArtists = artists.filter((artist) => !artist.featured)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Artistes</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Artistes Queer</h1>
      <p className="text-muted-foreground mb-8">
        Découvrez des artistes talentueux de la communauté qui expriment leur identité à travers l'art.
      </p>

      {/* Artistes à la une */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Artistes à la une</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArtists.map((artist) => (
            <Card key={artist.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <Link href={`/artistes/${artist.id}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">{artist.role}</p>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{artist.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {artist.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Tous les artistes */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Tous les artistes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherArtists.map((artist) => (
            <Card key={artist.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
              <Link href={`/artistes/${artist.id}`} className="flex p-4 gap-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={artist.image || "/placeholder.svg"} alt={artist.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold hover:text-purple-600 dark:hover:text-purple-400">{artist.name}</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">{artist.role}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{artist.description}</p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
