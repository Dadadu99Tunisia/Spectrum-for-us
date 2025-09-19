"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Palette, Music, Code, Scissors, Coffee } from "lucide-react"

const services = [
  {
    icon: Camera,
    title: "Photographie",
    description: "Portraits, événements, shooting produits",
    providers: "45+ photographes",
    priceRange: "À partir de 80€",
    color: "from-blue-500 to-cyan-500",
    category: "Créatif",
  },
  {
    icon: Palette,
    title: "Design Graphique",
    description: "Logos, identité visuelle, illustrations",
    providers: "60+ designers",
    priceRange: "À partir de 50€",
    color: "from-purple-500 to-pink-500",
    category: "Design",
  },
  {
    icon: Music,
    title: "Production Musicale",
    description: "Composition, mixage, mastering",
    providers: "25+ producteur·rice·s",
    priceRange: "À partir de 100€",
    color: "from-orange-500 to-red-500",
    category: "Audio",
  },
  {
    icon: Code,
    title: "Développement Web",
    description: "Sites web, applications, e-commerce",
    providers: "30+ développeur·euse·s",
    priceRange: "À partir de 200€",
    color: "from-green-500 to-teal-500",
    category: "Tech",
  },
  {
    icon: Scissors,
    title: "Couture & Mode",
    description: "Créations sur mesure, retouches",
    providers: "35+ couturier·ère·s",
    priceRange: "À partir de 60€",
    color: "from-indigo-500 to-purple-500",
    category: "Mode",
  },
  {
    icon: Coffee,
    title: "Conseil & Coaching",
    description: "Business, personnel, créatif",
    providers: "40+ coachs",
    priceRange: "À partir de 70€",
    color: "from-yellow-500 to-orange-500",
    category: "Conseil",
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

export default function ServicesShowcase() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {services.map((service, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Link href={`/services/${service.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline">{service.category}</Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prestataires:</span>
                    <span className="font-medium">{service.providers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prix:</span>
                    <span className="font-medium text-green-600">{service.priceRange}</span>
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
