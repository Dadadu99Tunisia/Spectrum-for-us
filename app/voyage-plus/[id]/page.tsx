import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, MapPin, Star, Calendar, Tag, Heart, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types pour les destinations
interface Destination {
  id: string
  title: string
  country: string
  continent: string
  image: string
  rating: number
  description: string
  lgbtqFriendly: number // Score sur 10
  bestTimeToVisit: string
  priceRange: string
  featured?: boolean
  new?: boolean
  tags: string[]
  // Données supplémentaires pour la page détaillée
  longDescription?: string
  lgbtqVenues?: string[]
  safetyTips?: string[]
  events?: {
    name: string
    date: string
    description: string
  }[]
  photos?: string[]
}

// Données des destinations (version simplifiée - normalement on récupérerait depuis une API)
const destinations: Destination[] = [
  {
    id: "barcelona",
    title: "Barcelone",
    country: "Espagne",
    continent: "Europe",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.8,
    description: "Ville cosmopolite avec une scène LGBTQ+ vibrante, des plages et une architecture unique.",
    longDescription:
      "Barcelone est l'une des destinations LGBTQ+ les plus populaires d'Europe. La ville offre un mélange parfait de plages magnifiques, d'architecture étonnante, de cuisine délicieuse et d'une vie nocturne animée. Le quartier de l'Eixample, surnommé 'Gayxample', est le cœur de la communauté LGBTQ+ avec de nombreux bars, clubs et boutiques. La ville accueille également l'une des plus grandes Pride d'Europe chaque été.",
    lgbtqFriendly: 9,
    bestTimeToVisit: "Mai à Septembre",
    priceRange: "€€",
    featured: true,
    tags: ["Plage", "Nightlife", "Culture", "Pride"],
    lgbtqVenues: ["Axel Hotel", "Arena Classic", "Moeem", "La Chapelle"],
    safetyTips: [
      "Barcelone est généralement très sûre pour les voyageurs LGBTQ+",
      "Comme dans toute grande ville, restez vigilant dans les zones touristiques",
      "Le quartier de l'Eixample (Gayxample) est particulièrement accueillant",
    ],
    events: [
      {
        name: "Pride Barcelona",
        date: "Juin",
        description: "L'une des plus grandes célébrations Pride de la Méditerranée",
      },
      {
        name: "Circuit Festival",
        date: "Août",
        description: "Festival international LGBTQ+ avec des événements et des fêtes",
      },
    ],
    photos: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
  {
    id: "berlin",
    title: "Berlin",
    country: "Allemagne",
    continent: "Europe",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.9,
    description: "Capitale de la liberté et de la tolérance, avec une scène queer historique et avant-gardiste.",
    longDescription:
      "Berlin est considérée comme l'une des capitales queer les plus importantes au monde. Avec son histoire riche et sa culture alternative, la ville offre un espace de liberté incomparable pour la communauté LGBTQ+. Des quartiers comme Schöneberg, Kreuzberg et Neukölln abritent une multitude de bars, clubs, cafés et espaces culturels queer. Berlin est également connue pour ses clubs légendaires et sa vie nocturne sans égal.",
    lgbtqFriendly: 10,
    bestTimeToVisit: "Mai à Septembre",
    priceRange: "€€",
    featured: true,
    tags: ["Nightlife", "Histoire", "Art", "Pride"],
    lgbtqVenues: ["Berghain", "SchwuZ", "Möbel Olfe", "Roses Bar"],
    safetyTips: [
      "Berlin est extrêmement ouverte et sûre pour les voyageurs LGBTQ+",
      "La ville a une longue histoire de militantisme et d'acceptation",
      "Les démonstrations d'affection en public sont communes et acceptées",
    ],
    events: [
      {
        name: "Berlin Pride (CSD)",
        date: "Juillet",
        description: "Une célébration massive avec défilé et événements culturels",
      },
      {
        name: "Folsom Europe",
        date: "Septembre",
        description: "Festival fetish et leather avec street fair",
      },
    ],
    photos: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
]

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const destination = destinations.find((d) => d.id === params.id)

  if (!destination) {
    return {
      title: "Destination non trouvée | Voyage+",
      description: "La destination que vous recherchez n'existe pas",
    }
  }

  return {
    title: `${destination.title} | Voyage+`,
    description: destination.description,
  }
}

export default function DestinationPage({ params }: { params: { id: string } }) {
  const destination = destinations.find((d) => d.id === params.id)

  if (!destination) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bouton retour */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/voyage-plus">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux destinations
          </Link>
        </Button>
      </div>

      {/* Hero section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
        <Image
          src={destination.image || "/placeholder.svg"}
          alt={destination.title}
          width={1200}
          height={600}
          className="w-full h-[300px] md:h-[500px] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className="bg-blue-500 hover:bg-blue-600">{destination.continent}</Badge>
            {destination.new && <Badge className="bg-teal-500 hover:bg-teal-600">Nouveau</Badge>}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{destination.title}</h1>
          <div className="flex items-center text-white/90 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{destination.country}</span>
            <div className="mx-3 h-1 w-1 rounded-full bg-white/70"></div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{destination.rating}/5</span>
            </div>
            <div className="mx-3 h-1 w-1 rounded-full bg-white/70"></div>
            <div className="flex items-center bg-gradient-to-r from-blue-500 to-teal-600 text-white px-2 py-1 rounded-full text-xs">
              <span className="font-bold">{destination.lgbtqFriendly}</span>
              <span className="ml-1">/10</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {destination.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700">
          Planifier un voyage
        </Button>
        <Button variant="outline" className="gap-2">
          <Heart className="h-4 w-4" />
          Ajouter aux favoris
        </Button>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="about">À propos</TabsTrigger>
              <TabsTrigger value="lgbtq">LGBTQ+</TabsTrigger>
              <TabsTrigger value="tips">Conseils</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">À propos de {destination.title}</h2>
                <p className="text-muted-foreground">{destination.longDescription}</p>
              </div>

              {destination.events && destination.events.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Événements à ne pas manquer</h3>
                  <div className="space-y-4">
                    {destination.events.map((event, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold">{event.name}</h4>
                          <Badge variant="outline">{event.date}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {destination.photos && destination.photos.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Photos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destination.photos.map((photo, index) => (
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`${destination.title} - Photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="lgbtq" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Scène LGBTQ+ à {destination.title}</h2>
                <div className="flex items-center mb-4">
                  <div className="flex items-center bg-gradient-to-r from-blue-500 to-teal-600 text-white px-3 py-1.5 rounded-full mr-3">
                    <span className="font-bold text-lg">{destination.lgbtqFriendly}</span>
                    <span className="ml-1">/10</span>
                  </div>
                  <p className="text-muted-foreground">
                    Score d'accueil LGBTQ+ basé sur les lois locales, l'acceptation sociale et les infrastructures
                  </p>
                </div>
              </div>

              {destination.lgbtqVenues && destination.lgbtqVenues.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Lieux LGBTQ+ populaires</h3>
                  <ul className="space-y-2">
                    {destination.lgbtqVenues.map((venue, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                        {venue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Conseils pour voyager à {destination.title}</h2>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Meilleure période:</span>
                  </div>
                  <span>{destination.bestTimeToVisit}</span>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center space-x-1">
                    <Tag className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Budget:</span>
                  </div>
                  <span>{destination.priceRange}</span>
                </div>
              </div>

              {destination.safetyTips && destination.safetyTips.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Conseils de sécurité</h3>
                  <ul className="space-y-2">
                    {destination.safetyTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-2"></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-5">
            <h3 className="text-lg font-bold mb-3">Informations pratiques</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Langue</span>
                <span className="font-medium">
                  {destination.country === "Espagne"
                    ? "Espagnol, Catalan"
                    : destination.country === "Allemagne"
                      ? "Allemand"
                      : "Locale"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Devise</span>
                <span className="font-medium">
                  {["Espagne", "Allemagne", "France", "Pays-Bas"].includes(destination.country) ? "Euro (€)" : "Locale"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visa</span>
                <span className="font-medium">
                  {["Espagne", "Allemagne", "France", "Pays-Bas"].includes(destination.country)
                    ? "Non requis (UE)"
                    : "Vérifier les conditions"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Électricité</span>
                <span className="font-medium">
                  {["Espagne", "Allemagne", "France", "Pays-Bas"].includes(destination.country)
                    ? "230V, Type C/F"
                    : "Vérifier"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-lg p-5">
            <h3 className="text-lg font-bold mb-3">Abonnez-vous à Voyage+</h3>
            <p className="mb-4 text-white/90">
              Accédez à des guides détaillés, des réductions exclusives et des conseils personnalisés pour vos voyages
              LGBTQ+.
            </p>
            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">6.99€/mois - 7 jours offerts</Button>
          </div>

          <div className="border rounded-lg p-5">
            <h3 className="text-lg font-bold mb-3">Destinations similaires</h3>
            <div className="space-y-3">
              {destinations
                .filter((d) => d.id !== destination.id && d.continent === destination.continent)
                .slice(0, 3)
                .map((d) => (
                  <Link
                    key={d.id}
                    href={`/voyage-plus/${d.id}`}
                    className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  >
                    <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={d.image || "/placeholder.svg"} alt={d.title} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium">{d.title}</h4>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {d.country}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
