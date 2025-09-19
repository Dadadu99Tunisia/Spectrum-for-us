"use client"

import { motion } from "framer-motion"
import { Leaf, Recycle, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EcoBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-green-500 to-teal-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center items-center gap-4 mb-6">
            <Leaf className="h-8 w-8" />
            <Recycle className="h-8 w-8" />
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Consommation Responsable</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Chaque achat sur Spectrum soutient des créateur·rice·s locaux·ales et des pratiques durables. Ensemble,
            construisons un avenir plus éthique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-white/90">
              Découvrir nos Engagements
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Devenir Partenaire Éco
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
