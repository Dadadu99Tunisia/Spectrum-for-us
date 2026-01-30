"use client"

import Link from "next/link"
import { SocialLinks } from "@/components/social-links"
import { useI18n } from "@/lib/i18n/context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t-4 border-electric-blue/20 bg-white mt-auto">
      {/* Colorful top stripe */}
      <div className="h-1 bg-gradient-to-r from-electric-blue via-zesty-orange via-sunshine-yellow via-fresh-teal to-poppy-red" aria-hidden="true" />
      
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-electric-blue">Spec</span>
                <span className="text-zesty-orange">trum</span>
              </span>
            </Link>
            <p className="text-sm text-charcoal/70 leading-relaxed">{t("footer.tagline")}</p>
            <div>
              <p className="text-sm font-bold text-charcoal mb-3">{t("footer.followUs")}</p>
              <SocialLinks />
            </div>
          </div>

          {/* Shop by Vibe */}
          <div className="space-y-4">
            <h3 className="font-black text-charcoal text-lg">Shop by Vibe</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products?category=wear" className="text-charcoal/70 hover:text-electric-blue font-medium transition-colors flex items-center gap-2">
                  <span>👕</span> Wear
                </Link>
              </li>
              <li>
                <Link href="/products?category=decorate" className="text-charcoal/70 hover:text-zesty-orange font-medium transition-colors flex items-center gap-2">
                  <span>🎨</span> Decorate
                </Link>
              </li>
              <li>
                <Link href="/products?category=read" className="text-charcoal/70 hover:text-fresh-teal font-medium transition-colors flex items-center gap-2">
                  <span>📚</span> Read
                </Link>
              </li>
              <li>
                <Link href="/products?category=play" className="text-charcoal/70 hover:text-poppy-red font-medium transition-colors flex items-center gap-2">
                  <span>🎮</span> Play
                </Link>
              </li>
              <li>
                <Link href="/products?category=care" className="text-charcoal/70 hover:text-sunshine-yellow font-medium transition-colors flex items-center gap-2">
                  <span>💆</span> Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-black text-charcoal text-lg">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-charcoal/70 hover:text-electric-blue font-medium transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-charcoal/70 hover:text-zesty-orange font-medium transition-colors">
                  {t("nav.creators")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-charcoal/70 hover:text-fresh-teal font-medium transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link href="/vendor-subscription" className="text-charcoal/70 hover:text-poppy-red font-medium transition-colors">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-charcoal/70 hover:text-charcoal font-medium transition-colors">
                  Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-black text-charcoal text-lg">{t("footer.newsletter")}</h3>
            <p className="text-sm text-charcoal/70">Get the latest drops, creator spotlights, and community vibes.</p>
            <div className="flex flex-col gap-3">
              <Input 
                type="email" 
                placeholder={t("footer.emailPlaceholder")} 
                className="rounded-full border-2 border-zesty-orange/40 focus:border-electric-blue bg-white"
                aria-label="Email address for newsletter"
              />
              <Button className="bg-zesty-orange hover:bg-zesty-orange/90 text-white font-bold rounded-full">
                {t("footer.subscribe")}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-charcoal/10 text-center">
          <p className="text-sm text-charcoal/60">
            &copy; {new Date().getFullYear()} Spectrum. Founded by Dada Azouz. Made with joy for our community.
          </p>
        </div>
      </div>
    </footer>
  )
}
