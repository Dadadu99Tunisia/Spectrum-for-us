"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Users, Heart, Star, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const mockTravels = [
  {
    id: "1",
    title: "Retraite Queer à Marseille",
    description:
      "Une semaine de ressourcement, yoga, ateliers créatifs et rencontres dans un cadre bienveillant et safe.",
    location: "Marseille, France",
    duration: "7 jours",
    price: 890,
    image_url: "/mediterranean-retreat-yoga.jpg",
    type: "Retraite",
    capacity: 15,
    rating: 4.9,
    organizer: "Collectif Bien-Être",
  },
  {
    id: "2",
    title: "Festival Chouftouhonna - Tunis",
    description: "Participez au festival international du film LGBTQIA+ de Tunis. Projections, débats et rencontres.",
    location: "Tunis, Tunisie",
    duration: "5 jours",
    price: 650,
    image_url: "/film-festival-tunisia.jpg",
    type: "Festival",
    capacity: 30,
    rating: 5.0,
    organizer: "Chouftouhonna",
  },
  {
    id: "3",
    title: "Roadtrip Inclusive Lisbonne",
    description: "Découvrez Lisbonne et ses environs avec un groupe queer. Visites culturelles, soirées et plages.",
    location: "Lisbonne, Portugal",
    duration: "10 jours",
    price: 1200,
    image_url: "/lisbon-colorful-streets.png",
    type: "Roadtrip",
    capacity: 12,
    rating: 4.8,
    organizer: "Queer Voyages",
  },
]

export default function TravelPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const travelTypes = ["Tous", "Retraite", "Festival", "Roadtrip", "Croisière", "Aventure"]

  const filteredTravels = mockTravels.filter((travel) => {
    const matchesSearch =
      travel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      travel.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || travel.type === selectedType

    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950/20 dark:via-cyan-950/20 dark:to-blue-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Voyage+</h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed">
              Des expériences de voyage queer et safe. Retraites, festivals, roadtrips et aventures avec des personnes
              qui vous ressemblent.
            </p>
            <Button size="lg" asChild>
              <Link href="/vendor-subscription">Proposer une expérience</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Type d'expérience" />
            </SelectTrigger>
            <SelectContent>
              {travelTypes.map((type) => (
                <SelectItem key={type} value={type === "Tous" ? "all" : type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Travel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTravels.map((travel) => (
            <Card
              key={travel.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <img
                  src={travel.image_url || "/placeholder.svg"}
                  alt={travel.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-4 left-4">{travel.type}</Badge>
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{travel.rating}</span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{travel.title}</CardTitle>
                <CardDescription className="line-clamp-2">{travel.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{travel.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{travel.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>Groupe de {travel.capacity} personnes max</span>
                </div>
                <p className="text-xs text-muted-foreground">Organisé par {travel.organizer}</p>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl font-bold">{travel.price}€</span>
                  <span className="text-sm text-muted-foreground">par personne</span>
                </div>
                <div className="flex gap-2 w-full">
                  <Button asChild className="flex-1">
                    <Link href={`/travel/${travel.id}`}>Découvrir</Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredTravels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Aucune expérience ne correspond à vos critères</p>
          </div>
        )}
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🏳️‍🌈</div>
              <h3 className="font-semibold mb-2">Safe & Inclusif</h3>
              <p className="text-sm text-muted-foreground">
                Tous nos voyages sont pensés pour être des espaces sûrs et bienveillants
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-semibold mb-2">Responsable</h3>
              <p className="text-sm text-muted-foreground">
                Voyages éco-responsables et respectueux des communautés locales
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-semibold mb-2">Communautaire</h3>
              <p className="text-sm text-muted-foreground">
                Créez des liens authentiques avec d'autres personnes queers
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
