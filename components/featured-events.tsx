import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react"

const featuredEvents = [
  {
    id: "1",
    title: "Festival des Fiertés",
    date: "15 Juin 2025",
    location: "Paris, France",
    image: "/placeholder.svg?height=400&width=800",
    category: "Célébration",
    attendees: 1200,
    description:
      "Le plus grand rassemblement annuel célébrant la diversité et la fierté LGBTQIA+ en France. Rejoignez-nous pour une journée de célébration, de solidarité et de visibilité.",
  },
  {
    id: "2",
    title: "Exposition d'Art Queer",
    date: "22 Juillet 2025",
    location: "Lyon, France",
    image: "/placeholder.svg?height=400&width=800",
    category: "Art",
    attendees: 450,
    description:
      "Une exposition mettant en lumière les œuvres d'artistes queer contemporains, explorant les thèmes d'identité, d'expression et de communauté.",
  },
]

export default function FeaturedEvents() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredEvents.map((event) => (
          <div key={event.id} className="group relative overflow-hidden rounded-xl">
            {/* Image avec overlay */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              <div className="absolute top-4 left-4">
                <Badge
                  className={`
                    ${event.category === "Célébration" ? "bg-purple-500 hover:bg-purple-600" : ""}
                    ${event.category === "Art" ? "bg-pink-500 hover:bg-pink-600" : ""}
                    ${event.category === "Atelier" ? "bg-blue-500 hover:bg-blue-600" : ""}
                    ${event.category === "Spectacle" ? "bg-green-500 hover:bg-green-600" : ""}
                  `}
                >
                  {event.category}
                </Badge>
              </div>
            </div>

            {/* Contenu */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">{event.title}</h3>

              <p className="text-white/80 mb-4 line-clamp-2">{event.description}</p>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center text-sm text-white/70">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <Users className="h-4 w-4 mr-2" />
                  {event.attendees} participant{event.attendees > 1 ? "s" : ""}
                </div>
              </div>

              <Button asChild size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                <Link href={`/events/${event.id}`}>En savoir plus</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button asChild variant="outline" size="lg" className="group">
          <Link href="/events">
            Voir tous les événements
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
