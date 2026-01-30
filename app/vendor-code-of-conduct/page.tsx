import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Store, Heart, Shield, CheckCircle, AlertTriangle, Handshake } from "lucide-react"

export const metadata = {
  title: "Vendor Code of Conduct | Spectrum Marketplace",
  description: "Standards and expectations for sellers on Spectrum Marketplace.",
}

export default function VendorCodeOfConductPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Vendor Code of Conduct</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              As a Spectrum vendor, you&apos;re part of a community committed to inclusivity, quality, and ethical business practices.
              These standards help us maintain trust with our customers.
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-primary" />
                  Inclusive Values
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Spectrum vendors must actively support and embody our inclusive values. This is not optional &mdash; 
                  it&apos;s fundamental to being part of our community.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Respect all customers regardless of identity, including gender, orientation, disability, race, and religion</li>
                  <li>Use inclusive language in all product listings and communications</li>
                  <li>Provide products and services without discrimination</li>
                  <li>Actively work to make your products accessible where possible</li>
                  <li>Never engage in or support hate speech or discriminatory practices</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Store className="h-6 w-6 text-primary" />
                  Authentic Representation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Transparency builds trust. Be honest about who you are and what you&apos;re selling.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Accurately represent your business ownership and identity</li>
                  <li>Don&apos;t claim to be LGBTQ+, disabled, or minority-owned if you&apos;re not</li>
                  <li>Be transparent about where products are made and by whom</li>
                  <li>Disclose if you&apos;re reselling products from other manufacturers</li>
                  <li>Clearly state any charitable contributions or community partnerships</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  Product Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Quality and accuracy in your listings protect both you and your customers.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide accurate, detailed product descriptions</li>
                  <li>Use high-quality images that accurately represent your products</li>
                  <li>Include all relevant sizing, materials, and care information</li>
                  <li>Clearly state shipping times and policies</li>
                  <li>Honor all advertised prices and promotions</li>
                  <li>Ensure products meet safety standards where applicable</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Handshake className="h-6 w-6 text-primary" />
                  Customer Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Excellent customer service builds loyalty and strengthens our community.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Respond to customer inquiries within 48 hours</li>
                  <li>Handle complaints professionally and respectfully</li>
                  <li>Process refunds and returns according to your stated policy</li>
                  <li>Ship orders within your stated timeframe</li>
                  <li>Communicate proactively about any delays or issues</li>
                  <li>Never retaliate against customers who leave honest reviews</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  Prohibited Items & Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Certain items and practices are not permitted on Spectrum.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Products that promote hate, discrimination, or violence</li>
                  <li>Counterfeit or stolen goods</li>
                  <li>Products that infringe on intellectual property rights</li>
                  <li>Items that exploit or appropriate marginalized cultures without permission</li>
                  <li>Unsafe or recalled products</li>
                  <li>Manipulating reviews or ratings</li>
                  <li>Price gouging or deceptive pricing practices</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Enforcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Violations of this code may result in actions including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Warning and required corrective action</li>
                  <li>Temporary suspension of selling privileges</li>
                  <li>Removal of specific product listings</li>
                  <li>Permanent account termination</li>
                  <li>Withholding of pending payouts in cases of fraud</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  We investigate all reports thoroughly and fairly. Vendors will have the opportunity to respond to 
                  concerns before any action is taken, except in cases of severe violations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Questions or Concerns?</h3>
                <p className="text-muted-foreground mb-4">
                  If you have questions about this code of conduct or need to report a concern, we&apos;re here to help.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/become-vendor">Become a Vendor</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
