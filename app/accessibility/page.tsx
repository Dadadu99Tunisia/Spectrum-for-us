import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accessibility, Eye, Ear, Hand, Brain, MessageCircle } from "lucide-react"

export const metadata = {
  title: "Accessibility Statement | Spectrum Marketplace",
  description: "Our commitment to digital accessibility and inclusive design for all users.",
}

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Accessibility Statement</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Spectrum is committed to ensuring digital accessibility for people with disabilities. 
              We are continually improving the user experience for everyone.
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Accessibility className="h-6 w-6 text-primary" />
                  Our Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We believe that the internet should be accessible to everyone, and we are committed to providing 
                  a website that is accessible to the widest possible audience. Accessibility is not just a feature 
                  for us &mdash; it&apos;s a core value that guides how we build and improve Spectrum.
                </p>
                <p>
                  As a marketplace that celebrates disability-led businesses and adaptive products, we understand 
                  firsthand the importance of removing barriers to digital participation.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Eye className="h-5 w-5 text-primary" />
                    Visual Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>High contrast color combinations</li>
                    <li>Resizable text up to 200%</li>
                    <li>Alt text for all images</li>
                    <li>Clear visual hierarchy</li>
                    <li>Screen reader compatible</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Ear className="h-5 w-5 text-primary" />
                    Auditory Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>No audio-only content</li>
                    <li>Visual indicators for all alerts</li>
                    <li>Captions for video content</li>
                    <li>Text alternatives for media</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Hand className="h-5 w-5 text-primary" />
                    Motor Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Full keyboard navigation</li>
                    <li>Large clickable targets</li>
                    <li>No time-limited actions</li>
                    <li>Skip navigation links</li>
                    <li>Focus indicators</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Brain className="h-5 w-5 text-primary" />
                    Cognitive Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Clear, simple language</li>
                    <li>Consistent navigation</li>
                    <li>Predictable interactions</li>
                    <li>Error prevention and recovery</li>
                    <li>Reduced cognitive load</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Conformance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. 
                  These guidelines explain how to make web content more accessible for people with disabilities.
                </p>
                <p className="text-muted-foreground">
                  While we strive for full compliance, we acknowledge that accessibility is an ongoing journey. 
                  We regularly audit our platform and work to address any issues identified.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assistive Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Spectrum is designed to be compatible with the following assistive technologies:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Screen readers (NVDA, JAWS, VoiceOver, TalkBack)</li>
                  <li>Screen magnification software</li>
                  <li>Speech recognition software</li>
                  <li>Keyboard-only navigation</li>
                  <li>Switch control devices</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  Feedback & Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We welcome your feedback on the accessibility of Spectrum. If you encounter any accessibility 
                  barriers or have suggestions for improvement, please let us know.
                </p>
                <p className="text-muted-foreground">
                  When contacting us about accessibility, please include:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>The page URL where you encountered the issue</li>
                  <li>A description of the problem</li>
                  <li>The assistive technology you were using (if applicable)</li>
                </ul>
                <div className="pt-4">
                  <Button asChild>
                    <Link href="/contact">Contact Us About Accessibility</Link>
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
