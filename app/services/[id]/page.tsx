"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ServiceDetailPage() {
  const params = useParams()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockService = {
      id: params.id,
      name: "Consultation en Communication Inclusive",
      price: 150,
      duration: "2 heures",
      description:
        "Accompagnement personnalisé pour adopter une communication inclusive et authentique dans votre entreprise.",
      long_description:
        "Notre service de consultation vous aide à transformer votre communication pour qu'elle soit véritablement inclusive. Nous analysons vos supports existants, formons vos équipes, et créons ensemble une stratégie de communication qui respecte et célèbre la diversité.",
      category: "Consulting",
      vendor: "Qtalkbot Agency",
      image: "/queer-entrepreneur-workspace-creative.jpg",
      rating: 4.9,
      reviews: 18,
      features: [
        "Audit de communication existante",
        "Formation des équipes",
        "Guide de style inclusif personnalisé",
        "Suivi sur 3 mois",
      ],
    }

    setService(mockService)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Service non trouvé</h1>
        <Link href="/services">
          <Button>Retour aux services</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux services
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{service.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {service.duration}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(service.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-1">
                    {service.rating} ({service.reviews})
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{service.long_description}</p>

              <div className="space-y-3">
                <h3 className="font-semibold">Ce qui est inclus :</h3>
                <ul className="space-y-2">
                  {service.features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-lg border bg-card space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">À partir de</p>
                  <p className="text-3xl font-bold text-primary">{service.price}€</p>
                </div>

                <Button className="w-full" size="lg">
                  Réserver une consultation
                </Button>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{service.vendor[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Proposé par</p>
                      <p className="font-semibold">{service.vendor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
