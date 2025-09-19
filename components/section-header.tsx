"use client"

import { motion } from "framer-motion"

interface SectionHeaderProps {
  badge: string
  title: string
  description: string
  badgeClass?: string
  titleClass?: string
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export function SectionHeader({ badge, title, description, badgeClass, titleClass }: SectionHeaderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="flex flex-col items-center text-center mb-12"
    >
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${badgeClass || "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"}`}
      >
        {badge}
      </span>
      <h2
        className={`text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent ${titleClass || "bg-gradient-to-r from-indigo-600 to-purple-600"}`}
      >
        {title}
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
    </motion.div>
  )
}
