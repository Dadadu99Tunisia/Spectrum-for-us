"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

const manifestoWords = [
  { text: "We believe in", highlight: false },
  { text: "authenticity", highlight: true },
  { text: "over aesthetics.", highlight: false },
  { text: "In", highlight: false },
  { text: "raw", highlight: true },
  { text: "expression over polished perfection.", highlight: false },
  { text: "This is a space where", highlight: false },
  { text: "queer creativity", highlight: true },
  { text: "thrives without compromise.", highlight: false },
  { text: "Where every purchase supports", highlight: false },
  { text: "real artists", highlight: true },
  { text: "and", highlight: false },
  { text: "independent creators", highlight: true },
  { text: "from our community.", highlight: false },
  { text: "We are not a marketplace.", highlight: false },
  { text: "We are a", highlight: false },
  { text: "movement", highlight: true },
  { text: ".", highlight: false },
]

const keywords = ["Inclusivity", "Authenticity", "Raw", "Unapologetic", "Creative", "Community"]

export default function CommunityManifesto() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Horizontal scroll effect for keywords
  const keywordsX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])

  return (
    <section 
      ref={containerRef}
      className="relative py-32 md:py-48 bg-foreground text-background overflow-hidden"
    >
      {/* Subtle grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scrolling keywords banner - top */}
      <div className="absolute top-0 left-0 right-0 border-b border-background/10 py-3 overflow-hidden">
        <motion.div 
          style={{ x: keywordsX }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...keywords, ...keywords, ...keywords, ...keywords].map((word, i) => (
            <span 
              key={i} 
              className="font-mono text-xs tracking-[0.3em] uppercase text-background/30"
            >
              {word}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Main manifesto content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          {/* Section label */}
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-background/50 block mb-12">
            Our Manifesto
          </span>

          {/* Manifesto text with highlighted words */}
          <p className="font-serif text-3xl md:text-4xl lg:text-5xl leading-relaxed md:leading-relaxed lg:leading-relaxed tracking-tight">
            {manifestoWords.map((item, index) => (
              <span key={index}>
                {item.highlight ? (
                  <motion.span
                    initial={{ backgroundSize: "0% 100%" }}
                    whileInView={{ backgroundSize: "100% 100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                    className={cn(
                      "relative inline",
                      "bg-gradient-to-r from-neon-green/40 to-neon-green/40",
                      "bg-no-repeat bg-left-bottom",
                    )}
                    style={{
                      backgroundPosition: "0 85%",
                    }}
                  >
                    {item.text}
                  </motion.span>
                ) : (
                  item.text
                )}
                {" "}
              </span>
            ))}
          </p>
        </motion.div>

        {/* Signature/Attribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-background/10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="font-mono text-xs tracking-[0.15em] uppercase text-background/50">
              For Us, By Us - Since 2024
            </p>
            <p className="font-mono text-xs tracking-[0.15em] uppercase text-background/50">
              Spectrum For Us
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scrolling keywords banner - bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-background/10 py-3 overflow-hidden">
        <motion.div 
          style={{ x: useTransform(scrollYProgress, [0, 1], ["-25%", "0%"]) }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...keywords, ...keywords, ...keywords, ...keywords].map((word, i) => (
            <span 
              key={i} 
              className="font-mono text-xs tracking-[0.3em] uppercase text-background/30"
            >
              {word}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-background/20" />
      <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-background/20" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-background/20" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-background/20" />
    </section>
  )
}
