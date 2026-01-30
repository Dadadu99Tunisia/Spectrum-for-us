"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

const footerLinks = {
  shop: [
    { name: "All Products", href: "/boutique" },
    { name: "New Arrivals", href: "/nouveautes" },
    { name: "Bestsellers", href: "/boutique?sort=popular" },
    { name: "Categories", href: "/categories" },
  ],
  creators: [
    { name: "All Creators", href: "/vendeurs" },
    { name: "Become a Creator", href: "/devenir-vendeur" },
    { name: "Creator Stories", href: "/stories" },
    { name: "Live Shopping", href: "/slay-plus" },
  ],
  community: [
    { name: "About Us", href: "/a-propos" },
    { name: "Our Mission", href: "/mission" },
    { name: "Events", href: "/events" },
    { name: "Support", href: "/aide" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Accessibility", href: "/accessibilite" },
  ],
}

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/spectrum.forus/" },
  { name: "TikTok", href: "https://www.tiktok.com/@spectrumforus" },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61565067524779" },
  { name: "Pinterest", href: "https://www.pinterest.com/spectrumforus" },
]

export default function EditorialFooter() {
  return (
    <footer className="bg-background border-t border-border">
      {/* Newsletter section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
                Stay Connected
              </span>
              <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Join the Movement
              </h3>
              <p className="text-muted-foreground max-w-md">
                Get exclusive access to new creators, limited drops, and community events. 
                No spam, just culture.
              </p>
            </div>
            
            <div className="lg:max-w-md lg:ml-auto">
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 h-12 rounded-none border-border bg-transparent font-mono text-sm placeholder:text-muted-foreground/50"
                />
                <Button 
                  type="submit"
                  className="h-12 px-6 rounded-none bg-foreground text-background hover:bg-foreground/90 font-mono text-xs tracking-[0.1em] uppercase"
                >
                  Subscribe
                </Button>
              </form>
              <p className="mt-3 font-mono text-[10px] tracking-wider text-muted-foreground/60">
                By subscribing, you agree to our privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-2xl font-bold tracking-tight">SPECTRUM</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              A community-driven marketplace celebrating queer creativity and authentic expression.
            </p>
            
            {/* Social links */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-mono text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {social.name}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-foreground mb-6">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creators links */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-foreground mb-6">
              Creators
            </h4>
            <ul className="space-y-3">
              {footerLinks.creators.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community links */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-foreground mb-6">
              Community
            </h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-foreground mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
              © {new Date().getFullYear()} Spectrum For Us. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                For Us, By Us
              </span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">
                Made with intention
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
