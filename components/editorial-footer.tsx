"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Youtube, ArrowRight } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "All Products", href: "/boutique" },
    { name: "Categories", href: "/categories" },
    { name: "New Arrivals", href: "/nouveautes" },
    { name: "Best Sellers", href: "/boutique?sort=popular" },
  ],
  creators: [
    { name: "All Creators", href: "/vendeurs" },
    { name: "Become a Creator", href: "/devenir-vendeur" },
    { name: "Creator Resources", href: "/resources" },
    { name: "Success Stories", href: "/stories" },
  ],
  company: [
    { name: "About Us", href: "/a-propos" },
    { name: "Our Mission", href: "/a-propos#mission" },
    { name: "Contact", href: "/support" },
    { name: "Events", href: "/events" },
  ],
  support: [
    { name: "Help Center", href: "/aide" },
    { name: "Shipping Info", href: "/aide#shipping" },
    { name: "Returns", href: "/aide#returns" },
    { name: "FAQs", href: "/aide#faq" },
  ],
}

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com", icon: Youtube },
]

export default function EditorialFooter() {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter section */}
        <div className="py-12 lg:py-16 border-b border-border">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                Join Our Community
              </h3>
              <p className="mt-2 text-muted-foreground">
                Get updates on new creators, exclusive drops, and community events.
              </p>
            </div>
            <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full bg-background"
              />
              <Button type="submit" className="rounded-full px-6 pill-btn-gradient">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Links grid */}
        <div className="py-12 lg:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
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
          <div>
            <h4 className="font-semibold text-foreground mb-4">Creators</h4>
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
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
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
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
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

        {/* Bottom bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Spectrum</span>
            <span className="text-muted-foreground">For Us</span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.name}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span>2024 Spectrum For Us</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
