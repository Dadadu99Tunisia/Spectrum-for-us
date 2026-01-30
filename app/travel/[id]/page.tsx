"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Users, Heart, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TravelDetailPage() {
  const params = useParams()
  const [travel, setTravel] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockTravel = {
      id: params.id,
      title: "Retraite Queer Méditerranée",
      duration: "7 jours",
      location: "Marseille, France",
      price: 890,
      description: "Une semaine de ressourcement, yoga et connexion dans un cadre safe et bienveillant.",
      long_description:
        "Rejoignez-nous pour une semaine transformative au bord de la Méditerranée. Cette retraite combine yoga quotidien, ateliers de développement personnel, temps de connexion communautaire et moments de détente. Un espace entièrement safe où vous pouvez être pleinement vous-même.",
      image: "/mediterranean-retreat-yoga.jpg",
      dates: ["15-22 Juin 2025", "20-27 Juillet 2025", "10-17 Août 2025"],
      maxParticipants: 15,
      rating: 4.9,
      reviews: 32,
      included: [
        "Hébergement en chambre partagée",
        "Tous les repas (végétariens)",
        "2 sessions de yoga par jour",
        "Ateliers et cercles de parole",
        "Accès à la plage privée",
        "Transferts depuis Marseille",
      ],
      organizer: "Collective Queer Wellness",
    }

    setTravel(mockTravel)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!travel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Expérience non trouvée</h1>
        <Link href="/travel">
          <Button>Retour aux voyages</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link
          href="/travel"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux voyages
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img src={travel.image || "/placeholder.svg"} alt={travel.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-balance">{travel.title}</h1>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{travel.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{travel.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(travel.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="text-sm ml-1">
                    {travel.rating} ({travel.reviews})
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">{travel.long_description}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Ce qui est inclus :</h3>
                  <ul className="space-y-2">
                    {travel.included.map((item: string) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Dates disponibles :</h3>
                  <div className="flex flex-wrap gap-2">
                    {travel.dates.map((date: string) => (
                      <Badge key={date} variant="secondary">
                        {date}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-lg border bg-card space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">À partir de</p>
                  <p className="text-3xl font-bold text-primary">{travel.price}€</p>
                  <p className="text-sm text-muted-foreground">par personne</p>
                </div>

                <Button className="w-full" size="lg">
                  Réserver maintenant
                </Button>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Organisé par</p>
                      <p className="font-semibold">{travel.organizer}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Max {travel.maxParticipants} participant·es</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-semibold text-sm">Espace 100% safe</h4>
                <p className="text-sm text-muted-foreground">
                  Cette retraite est un espace bienveillant et inclusif pour toutes les personnes LGBTQIA+.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
