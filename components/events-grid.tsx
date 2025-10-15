import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Users } from "lucide-react"

const events = [
  {
    id: "1",
    title: "Festival des Fiertés",
    date: "15 Juin 2025",
    location: "Paris, France",
    image: "/placeholder.svg?height=300&width=500",
    category: "Célébration",
    attendees: 1200,
  },
  {
    id: "2",
    title: "Exposition d'Art Queer",
    date: "22 Juillet 2025",
    location: "Lyon, France",
    image: "/placeholder.svg?height=300&width=500",
    category: "Art",
    attendees: 450,
  },
  {
    id: "3",
    title: "Atelier d'Écriture Inclusive",
    date: "5 Août 2025",
    location: "Marseille, France",
    image: "/placeholder.svg?height=300&width=500",
    category: "Atelier",
    attendees: 80,
  },
  {
    id: "4",
    title: "Soirée Drag Show",
    date: "18 Septembre 2025",
    location: "Bordeaux, France",
    image: "/placeholder.svg?height=300&width=500",
    category: "Spectacle",
    attendees: 350,
  },
]

export default function EventsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <Link href={`/events/${event.id}`} key={event.id}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2">
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
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {event.title}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <CalendarDays className="h-4 w-4 mr-2" />
                {event.date}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t border-border mt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {event.attendees} participant{event.attendees > 1 ? "s" : ""}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
