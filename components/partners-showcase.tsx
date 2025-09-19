"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const partners = [
  {
    name: "SOS Homophobie",
    logo: "/placeholder.svg?height=80&width=120&text=SOS",
    description: "Association de lutte contre les discriminations",
  },
  {
    name: "Inter-LGBT",
    logo: "/placeholder.svg?height=80&width=120&text=Inter-LGBT",
    description: "Interassociative lesbienne, gaie, bi et trans",
  },
  {
    name: "Le Refuge",
    logo: "/placeholder.svg?height=80&width=120&text=Refuge",
    description: "Aide aux jeunes LGBT+ rejeté·e·s",
  },
  {
    name: "CONTACT",
    logo: "/placeholder.svg?height=80&width=120&text=CONTACT",
    description: "Dialogue entre parents et enfants LGBT+",
  },
  {
    name: "Acceptess-T",
    logo: "/placeholder.svg?height=80&width=120&text=Acceptess-T",
    description: "Association trans et intersexe",
  },
  {
    name: "AIDES",
    logo: "/placeholder.svg?height=80&width=120&text=AIDES",
    description: "Lutte contre le VIH et les hépatites",
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

export default function PartnersShowcase() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
    >
      {partners.map((partner, index) => (
        <motion.div key={index} variants={itemVariants} className="flex flex-col items-center text-center group">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow duration-300">
            <Image
              src={partner.logo || "/placeholder.svg"}
              alt={partner.name}
              width={80}
              height={60}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <h3 className="font-semibold text-sm mb-2">{partner.name}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">{partner.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
