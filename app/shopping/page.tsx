"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/data/categories"
import { CategoryIcon } from "@/components/category-icons"
import { ShoppingBag, Plus, ArrowRight } from "lucide-react"

// Types pour les produits flottants
interface FloatingProduct {
  id: string
  name: string
  image: string
  price: number
  x: number
  y: number
  rotation: number
  scale: number
  zIndex: number
}

// Données de démonstration pour les produits flottants
const floatingProducts: FloatingProduct[] = [
  {
    id: "floating-1",
    name: "T-shirt Inclusif",
    image: "/placeholder.svg?height=300&width=300",
    price: 29.99,
    x: 10,
    y: 20,
    rotation: -5,
    scale: 1,
    zIndex: 10,
  },
  {
    id: "floating-2",
    name: "Bracelet Pride",
    image: "/placeholder.svg?height=300&width=300",
    price: 19.99,
    x: -20,
    y: -10,
    rotation: 3,
    scale: 0.9,
    zIndex: 20,
  },
  {
    id: "floating-3",
    name: "Accessoire Design",
    image: "/placeholder.svg?height=300&width=300",
    price: 49.99,
    x: 30,
    y: -30,
    rotation: -2,
    scale: 1.1,
    zIndex: 30,
  },
  {
    id: "floating-4",
    name: "Écharpe Colorée",
    image: "/placeholder.svg?height=300&width=300",
    price: 34.99,
    x: -40,
    y: 40,
    rotation: 4,
    scale: 0.95,
    zIndex: 15,
  },
  {
    id: "floating-5",
    name: "Sac Écologique",
    image: "/placeholder.svg?height=300&width=300",
    price: 59.99,
    x: 50,
    y: 10,
    rotation: -3,
    scale: 1.05,
    zIndex: 25,
  },
  {
    id: "floating-6",
    name: "Chapeau Tendance",
    image: "/placeholder.svg?height=300&width=300",
    price: 39.99,
    x: 0,
    y: 50,
    rotation: 2,
    scale: 1,
    zIndex: 35,
  },
]

// Composant pour un produit flottant
function FloatingProductCard({ product, index }: { product: FloatingProduct; index: number }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const constraintsRef = useRef(null)

  // Valeurs de mouvement pour l'animation de lévitation
  const y = useMotionValue(0)
  const x = useMotionValue(0)

  // Animation de lévitation
  const floatY = useAnimation()
  const floatRotation = useAnimation()

  // Effet de ressort pour un mouvement plus naturel
  const springConfig = { damping: 20, stiffness: 100 }
  const scaleSpring = useSpring(1, springConfig)
  const scale = useTransform(scaleSpring, (scale) => scale)

  // Animation de lévitation continue
  useEffect(() => {
    const floatAnimation = async () => {
      while (true) {
        await floatY.start({
          y: [0, -10, 0, 10, 0],
          transition: {
            duration: 5 + (index % 3),
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
        })
      }
    }

    const rotateAnimation = async () => {
      while (true) {
        await floatRotation.start({
          rotate: [product.rotation, product.rotation + 2, product.rotation, product.rotation - 2, product.rotation],
          transition: {
            duration: 7 + (index % 4),
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
        })
      }
    }

    floatAnimation()
    rotateAnimation()
  }, [floatY, floatRotation, index, product.rotation])

  // Effet de survol
  useEffect(() => {
    if (isHovered && !isDragging) {
      scaleSpring.set(1.1)
    } else if (isDragging) {
      scaleSpring.set(1.15)
    } else {
      scaleSpring.set(1)
    }
  }, [isHovered, isDragging, scaleSpring])

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        x,
        y,
        scale,
        zIndex: isDragging ? 50 : product.zIndex,
      }}
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      initial={{
        x: product.x * 10,
        y: product.y * 10,
        rotate: product.rotation,
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        ...floatY.get(),
        ...floatRotation.get(),
      }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        type: "spring",
      }}
      whileTap={{ cursor: "grabbing" }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="w-48 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-4" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm truncate">{product.name}</h3>
          <div className="flex justify-between items-center mt-1">
            <span className="font-bold text-sm">{product.price.toFixed(2)} €</span>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ShoppingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  // Mettre à jour les dimensions du conteneur
  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      })
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero section avec titre et description */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Shopping Interactif
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explorez notre marketplace d'une façon unique. Cliquez et faites glisser les produits pour les découvrir.
            Une expérience de shopping ludique et inclusive.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8"
              asChild
            >
              <Link href="/categories-inclusives">
                Découvrir toutes les catégories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Section interactive avec produits flottants */}
      <section className="py-16 relative overflow-hidden">
        <div ref={containerRef} className="container mx-auto px-4 relative h-[600px]" style={{ touchAction: "none" }}>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {floatingProducts.map((product, index) => (
              <FloatingProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>

          {/* Éléments décoratifs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-200 opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-pink-200 opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.25, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="container mx-auto px-4 text-center mt-8">
          <motion.p
            className="text-lg text-muted-foreground italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Cliquez et faites glisser les produits pour explorer
          </motion.p>
        </div>
      </section>

      {/* Section des catégories */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explorez nos catégories
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.2 },
                }}
              >
                <Link href={`/categorie/${category.id}`}>
                  <Card className="h-full transition-all hover:shadow-lg group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:opacity-100 opacity-0 transition-opacity"></div>
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                      <motion.div
                        className="mb-3 text-primary group-hover:text-primary transition-colors w-12 h-12"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                      >
                        <CategoryIcon category={category.id} className="w-12 h-12" />
                      </motion.div>
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-foreground transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        {category.subcategories.length} sous-catégories
                      </p>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-10 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Prêt à découvrir plus ?</h2>
            <p className="text-lg mb-6 opacity-90">
              Explorez notre collection complète de produits inclusifs et trouvez ce qui vous correspond.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="secondary" className="rounded-full px-8 font-medium" asChild>
                <Link href="/boutique">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Visiter la boutique
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
