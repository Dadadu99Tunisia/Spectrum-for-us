"use client"

import React from "react"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMobileDetection } from "@/hooks/use-mobile-detection"
import Link from "next/link"

export default function EditorialHero() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useMobileDetection()
  
  // Mouse position for prism effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Smooth spring animation for the prism
  const springConfig = { damping: 25, stiffness: 150 }
  const prismX = useSpring(mouseX, springConfig)
  const prismY = useSpring(mouseY, springConfig)
  
  // Transform for prism gradient position
  const prismGradient = useTransform(
    [prismX, prismY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, 
      hsl(270 100% 65% / 0.15) 0%, 
      hsl(200 100% 60% / 0.1) 25%, 
      hsl(120 100% 50% / 0.05) 50%, 
      transparent 70%)`
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    mouseX.set(x)
    mouseY.set(y)
  }

  if (!mounted) {
    return (
      <section className="relative min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-6xl md:text-9xl font-bold tracking-tight">
            FOR US
          </h1>
        </div>
      </section>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 50, skewY: 5 },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-background overflow-hidden flex flex-col"
    >
      {/* Prism glass overlay - reacts to mouse */}
      {!isMobile && (
        <motion.div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: prismGradient }}
        />
      )}
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                           linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main content */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-20 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-32"
      >
        {/* Editorial tagline */}
        <motion.div 
          variants={textVariants}
          className="mb-8"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Community-Driven Marketplace
          </span>
        </motion.div>

        {/* Main typography - massive, distorted feel */}
        <div className="space-y-2 md:space-y-4">
          <motion.h1 
            variants={textVariants}
            className={cn(
              "font-serif font-bold tracking-tight leading-none",
              isMobile ? "text-[15vw]" : "text-[12vw] md:text-[10vw]"
            )}
          >
            <span className="block">FOR US</span>
          </motion.h1>
          
          <motion.div 
            variants={lineVariants}
            className="h-px bg-border origin-left"
          />
          
          <motion.h1 
            variants={textVariants}
            className={cn(
              "font-serif font-bold tracking-tight leading-none text-muted-foreground",
              isMobile ? "text-[15vw]" : "text-[12vw] md:text-[10vw]"
            )}
          >
            <span className="block">BY US</span>
          </motion.h1>
        </div>

        {/* Subtext and CTA */}
        <motion.div 
          variants={textVariants}
          className="mt-12 md:mt-16 max-w-xl"
        >
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8">
            An avant-garde marketplace celebrating queer creativity, artistry, and authentic expression. 
            Not a niche. A culture.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/boutique">
              <Button 
                variant="outline" 
                className="h-12 px-8 font-mono text-xs tracking-[0.15em] uppercase border-foreground hover:bg-foreground hover:text-background transition-all duration-300 rounded-none bg-transparent"
              >
                Explore the Culture
              </Button>
            </Link>
            <Link href="/devenir-vendeur">
              <Button 
                variant="ghost" 
                className="h-12 px-8 font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-all duration-300 rounded-none"
              >
                Join as Creator
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-6 md:left-12 lg:left-24"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-12 bg-muted-foreground/30"
            />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground rotate-90 origin-left translate-x-2">
              Scroll
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom asymmetrical accent */}
      <motion.div 
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute bottom-0 left-0 right-1/3 h-px bg-gradient-to-r from-neon-uv/50 via-neon-green/30 to-transparent"
      />
    </section>
  )
}
