"use client"

import { motion } from "framer-motion"
import { Heart, Users, Shield, Leaf } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Inclusivité",
    description: "Nous célébrons la diversité et créons un espace sûr pour tous·tes.",
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Nous soutenons les créateur·rice·s et favorisons les connexions authentiques.",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Shield,
    title: "Sécurité",
    description: "Nous garantissons des transactions sécurisées et protégeons vos données.",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: Leaf,
    title: "Durabilité",
    description: "Nous promouvons une consommation responsable et des pratiques éthiques.",
    color: "text-teal-600",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function BrandValues() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {values.map((value, index) => (
        <motion.div key={index} variants={itemVariants} className="text-center group">
          <div
            className={`w-16 h-16 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <value.icon className={`h-8 w-8 ${value.color}`} />
          </div>
          <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
