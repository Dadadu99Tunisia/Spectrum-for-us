import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Users, AlertTriangle, MessageCircle, Accessibility } from "lucide-react"

export const metadata = {
  title: "Community Guidelines | Spectrum Marketplace",
  description: "Our commitment to creating an inclusive, safe space for all members of the Spectrum community.",
}

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Community Guidelines</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Spectrum is committed to being a safe, inclusive marketplace where LGBTQ+, disabled, and marginalized 
              creators and shoppers can thrive. These guidelines help us maintain that community.
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-primary" />
                  Respect and Dignity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Every member of our community deserves to be treated with respect and dignity, regardless of their 
                  gender identity, sexual orientation, disability status, race, ethnicity, religion, or any other aspect 
                  of their identity.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Use people&apos;s correct names and pronouns</li>
                  <li>Respect boundaries and consent in all interactions</li>
                  <li>Celebrate diversity rather than tolerating it</li>
                  <li>Assume good intent while addressing harmful impact</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  Zero Tolerance Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We have zero tolerance for hate speech, discrimination, harassment, or any behavior that makes 
                  our community members feel unsafe or unwelcome.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>No slurs, hate speech, or discriminatory language</li>
                  <li>No deadnaming or intentional misgendering</li>
                  <li>No harassment, bullying, or targeted abuse</li>
                  <li>No doxxing or sharing private information</li>
                  <li>No promotion of conversion therapy or anti-LGBTQ+ ideologies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Accessibility className="h-6 w-6 text-primary" />
                  Accessibility Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We are committed to making Spectrum accessible to all users. We actively work to remove barriers 
                  and ensure equal access to our platform.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>All product images should include descriptive alt text</li>
                  <li>Vendors should provide detailed product descriptions</li>
                  <li>We welcome feedback on accessibility improvements</li>
                  <li>Content should be understandable and navigable</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Authentic Representation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We prioritize authentic representation and discourage performative allyship. Vendors should be 
                  transparent about their ownership and community connections.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Be transparent about your business ownership and identity</li>
                  <li>Don&apos;t claim community membership you don&apos;t have</li>
                  <li>Allies are welcome but should not center themselves</li>
                  <li>Contributions to community causes should be transparent</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  Communication Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Whether you&apos;re a vendor or customer, communication should be respectful, professional, and constructive.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Be patient and understanding in customer service interactions</li>
                  <li>Leave honest, constructive reviews</li>
                  <li>Address concerns directly and privately before public complaints</li>
                  <li>Respond to inquiries in a timely manner</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Reporting Violations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you witness or experience a violation of these guidelines, please report it. We take all reports 
                  seriously and will investigate thoroughly.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Use the &ldquo;Report a Concern&rdquo; feature to file reports</li>
                  <li>Include as much detail as possible in your report</li>
                  <li>Reports are confidential and will be handled with care</li>
                  <li>Retaliation against reporters will result in immediate action</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Our Promise</h3>
                <p className="text-muted-foreground">
                  Spectrum is more than a marketplace &mdash; it&apos;s a community. We promise to continuously listen, 
                  learn, and improve. These guidelines will evolve as our community grows, and we welcome your 
                  feedback in shaping them. Together, we can create a space where everyone belongs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
