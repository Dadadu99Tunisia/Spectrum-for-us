"use client"

import Link from "next/link"
import { SocialLinks } from "@/components/social-links"
import { useI18n } from "@/lib/i18n/context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-primary">
              Spectrum<span className="text-accent">.</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("footer.tagline")}</p>
            <div>
              <p className="text-sm font-semibold mb-2">{t("footer.followUs")}</p>
              <SocialLinks />
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t("footer.shop")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.products")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.creators")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t("footer.support")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t("footer.newsletter")}</h3>
            <p className="text-sm text-muted-foreground">Stay updated with our latest products and stories</p>
            <div className="flex gap-2">
              <Input type="email" placeholder={t("footer.emailPlaceholder")} className="flex-1" />
              <Button>{t("footer.subscribe")}</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Spectrum for Us. Founded by Dada Azouz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
