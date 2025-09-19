"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Pride Market 2024",
    date: "15 Juin 2024",
    location: "Paris, Place de la République",
    attendees: "500+",
    category: "Marché",
    image: "/placeholder.svg?height=200&width=300&text=Pride+Market",
    description: "Le plus grand marché queer de France avec nos créateur·rice·s.",
  },
  {
    id: 2,
    title: "Atelier Créatif Inclusif",
    date: "22 Juin 2024",
    location: "Lyon, Centre LGBTI+",
    attendees: "50",
    category: "Atelier",
    image: "/placeholder.svg?height=200&width=300&text=Atelier+Créatif",
    description: "Apprenez de nouvelles techniques avec nos artistes.",
  },
  {
    id: 3,
    title: "Soirée Networking Queer",
    date: "30 Juin 2024",
    location: "Marseille, Le Dock",
    attendees: "200+",
    category: "Networking",
    image: "/placeholder.svg?height=200&width=300&text=Networking",
    description: "Rencontrez d'autres entrepreneur·e·s de la communauté.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function FeaturedEvents() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {events.map((event) => (
        <motion.div key={event.id} variants={itemVariants}>
          <Link href={`/events/${event.id}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white font-semibold">{event.title}</span>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">{event.category}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {event.attendees}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
