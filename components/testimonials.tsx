"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Artiste Digital",
    avatar: "/placeholder.svg?height=60&width=60&text=AR",
    rating: 5,
    content:
      "Spectrum m'a permis de toucher une audience qui apprécie vraiment mon travail. La communauté est incroyable !",
  },
  {
    name: "Sam Chen",
    role: "Designer Mode",
    avatar: "/placeholder.svg?height=60&width=60&text=SC",
    rating: 5,
    content:
      "En tant que créateur·rice non-binaire, je me sens enfin à ma place. Les ventes ont explosé depuis que j'ai rejoint Spectrum.",
  },
  {
    name: "Jordan Martinez",
    role: "Client·e Fidèle",
    avatar: "/placeholder.svg?height=60&width=60&text=JM",
    rating: 5,
    content:
      "J'adore découvrir de nouveaux·elles artistes sur Spectrum. Chaque achat soutient directement la communauté.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
}

export default function Testimonials() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {testimonials.map((testimonial, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
