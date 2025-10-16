"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Ticket, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const mockEvents = [
  {
    id: "1",
    title: "Gala de Charité Pride 2025",
    description:
      "Soirée caritative au profit des associations LGBTQIA+ locales. Dîner, spectacles et vente aux enchères.",
    start_date: "2025-06-15T19:00:00",
    location: "Paris, Le Trianon",
    ticket_price: 75,
    available_tickets: 150,
    type: "Gala",
    image_url: "/queer-art-gallery-colorful-exhibition.jpg",
    organizer: "Spectrum Events",
  },
  {
    id: "2",
    title: "Atelier: Déconstruction des Normes de Genre",
    description: "Formation interactive sur les identités de genre et l'inclusivité en entreprise.",
    start_date: "2025-05-20T14:00:00",
    location: "Lyon, Espace Culturel",
    ticket_price: 35,
    available_tickets: 40,
    type: "Formation",
    image_url: "/queer-entrepreneur-workspace-creative.jpg",
    organizer: "Collectif Fluide",
  },
  {
    id: "3",
    title: "Exposition: Corps & Identités",
    description: "Vernissage d'une exposition photo célébrant la diversité des corps et identités queers.",
    start_date: "2025-06-01T18:00:00",
    location: "Marseille, Galerie du Port",
    ticket_price: 0,
    available_tickets: 200,
    type: "Exposition",
    image_url: "/diverse-queer-people-celebrating-authentic-fashion.jpg",
    organizer: "Collectif Prisme",
  },
]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const eventTypes = ["Tous", "Gala", "Formation", "Exposition", "Concert", "Atelier", "Team Building"]
  const locations = ["Tous", "Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "En ligne"]

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || event.type === selectedType
    const matchesLocation = selectedLocation === "all" || event.location.includes(selectedLocation)

    return matchesSearch && matchesType && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Événements Queer</h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed">
              Découvrez et participez aux événements de la communauté : galas, mariages inclusifs, formations, team
              building et bien plus encore.
            </p>
            <Button size="lg" asChild>
              <Link href="/vendor-subscription">Organiser un événement</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: "🎭", label: "Galas & Soirées" },
              { icon: "💍", label: "Mariages" },
              { icon: "🎓", label: "Formations" },
              { icon: "🤝", label: "Team Building" },
            ].map((cat) => (
              <Card key={cat.label} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <p className="font-medium text-sm">{cat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type === "Tous" ? "all" : type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Lieu" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc === "Tous" ? "all" : loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={event.image_url || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-4 left-4">{event.type}</Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>
                    {new Date(event.start_date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Ticket className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>
                    {event.ticket_price === 0 ? "Gratuit" : `${event.ticket_price}€`} • {event.available_tickets} places
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Organisé par {event.organizer}</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/events/${event.id}`}>Réserver</Link>
                </Button>
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Aucun événement ne correspond à vos critères</p>
          </div>
        )}
      </section>
    </div>
  )
}
