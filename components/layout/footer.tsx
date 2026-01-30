import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold">Spectrum</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              An inclusive multi-vendor marketplace celebrating diversity. Unique products from LGBTQ+, disabled, and marginalized creators worldwide.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/categories/fashion-apparel" className="hover:text-foreground">
                  Fashion & Apparel
                </Link>
              </li>
              <li>
                <Link href="/categories/beauty-grooming" className="hover:text-foreground">
                  Beauty & Grooming
                </Link>
              </li>
              <li>
                <Link href="/categories/adaptive-mobility" className="hover:text-foreground">
                  Adaptive & Mobility
                </Link>
              </li>
              <li>
                <Link href="/categories/home-sanctuary" className="hover:text-foreground">
                  Home & Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/categories/intimacy-wellness" className="hover:text-foreground">
                  Intimacy & Wellness
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground font-medium">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h3 className="font-semibold mb-4">Sell</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/become-vendor" className="hover:text-foreground">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link href="/vendor-guide" className="hover:text-foreground">
                  Seller Guide
                </Link>
              </li>
              <li>
                <Link href="/vendor-code-of-conduct" className="hover:text-foreground">
                  Vendor Code of Conduct
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="hover:text-foreground">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/community-guidelines" className="hover:text-foreground">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-foreground">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link href="/diversity-commitment" className="hover:text-foreground">
                  Diversity Commitment
                </Link>
              </li>
              <li>
                <Link href="/report-concern" className="hover:text-foreground">
                  Report a Concern
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-foreground">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Spectrum Marketplace. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/accessibility" className="hover:text-foreground">
              Accessibility
            </Link>
            <Link href="/vendor-code-of-conduct" className="hover:text-foreground">
              Vendor Code of Conduct
            </Link>
            <Link href="/community-guidelines" className="hover:text-foreground">
              Community Guidelines
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
