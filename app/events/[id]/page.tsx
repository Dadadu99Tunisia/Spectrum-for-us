"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockEvent = {
      id: params.id,
      title: "Exposition : Identités Fluides",
      date: "15 Mars 2025",
      time: "18h00 - 22h00",
      location: "Galerie Spectrum, Paris 11e",
      type: "Exposition",
      price: 12,
      description: "Une exposition collective célébrant la fluidité des identités à travers l'art contemporain queer.",
      long_description:
        "Identités Fluides réunit 15 artistes queer qui explorent les notions de genre, d'identité et d'appartenance. À travers la peinture, la photographie, la sculpture et l'installation, cette exposition invite à repenser nos catégories et à célébrer la multiplicité des expériences queer.",
      image: "/queer-art-gallery-colorful-exhibition.jpg",
      capacity: 80,
      remaining: 23,
      artists: ["Maya Chen", "Alex Dubois", "Sam Rivera"],
      tags: ["Art", "Exposition", "Paris"],
    }

    setEvent(mockEvent)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Événement non trouvé</h1>
        <Link href="/events">
          <Button>Retour aux événements</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux événements
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <Badge className="mb-3">{event.type}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-balance">{event.title}</h1>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Horaires</p>
                    <p className="font-medium">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Lieu</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Places restantes</p>
                    <p className="font-medium">
                      {event.remaining} / {event.capacity}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">{event.long_description}</p>

              <div>
                <h3 className="font-semibold mb-3">Artistes présent·es :</h3>
                <div className="flex flex-wrap gap-2">
                  {event.artists.map((artist: string) => (
                    <Badge key={artist} variant="secondary">
                      {artist}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-lg border bg-card space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tarif</p>
                  <p className="text-3xl font-bold text-primary">{event.price}€</p>
                </div>

                <Button className="w-full" size="lg">
                  <Ticket className="h-5 w-5 mr-2" />
                  Réserver ma place
                </Button>

                <p className="text-xs text-center text-muted-foreground">Paiement sécurisé • Confirmation immédiate</p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-semibold text-sm">Informations pratiques</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Accessible PMR</li>
                  <li>• Vestiaire gratuit</li>
                  <li>• Bar sur place</li>
                  <li>• Espace safe</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
