"use client"

import { motion } from "framer-motion"
import { Users, ShoppingBag, Heart, Star } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "2,500+",
    label: "Créateur·rice·s",
    color: "text-blue-600",
  },
  {
    icon: ShoppingBag,
    value: "15,000+",
    label: "Produits Uniques",
    color: "text-green-600",
  },
  {
    icon: Heart,
    value: "98%",
    label: "Satisfaction Client",
    color: "text-pink-600",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Note Moyenne",
    color: "text-yellow-600",
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

export default function KeyStats() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid grid-cols-2 md:grid-cols-4 gap-8"
    >
      {stats.map((stat, index) => (
        <motion.div key={index} variants={itemVariants} className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
          <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}
