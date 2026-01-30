"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSuccess(true)
    setIsLoading(false)
    ;(e.target as HTMLFormElement).reset()

    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Contactez-nous</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Une question ? Une suggestion ? Envie de collaborer ? Nous sommes là pour vous écouter.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">contact@spectrumforus.com</p>
                <p className="text-sm text-muted-foreground mt-2">Réponse sous 24-48h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Téléphone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                <p className="text-sm text-muted-foreground mt-2">Lun-Ven 9h-18h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Montreuil, France</p>
                <p className="text-sm text-muted-foreground mt-2">100% remote</p>
              </CardContent>
            </Card>

            {/* Press & Partnerships */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>Presse & Partenariats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a href="mailto:presse@spectrumforus.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Kit Presse
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a href="mailto:partenariats@spectrumforus.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Partenariats
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom *</Label>
                      <Input id="name" name="name" required placeholder="Votre nom" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required placeholder="votre@email.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pronouns">Pronoms (optionnel)</Label>
                    <Select name="pronouns">
                      <SelectTrigger id="pronouns">
                        <SelectValue placeholder="Sélectionnez vos pronoms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="il">Il/Lui</SelectItem>
                        <SelectItem value="elle">Elle</SelectItem>
                        <SelectItem value="iel">Iel/Ielle</SelectItem>
                        <SelectItem value="they">They/Them</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                        <SelectItem value="none">Préfère ne pas préciser</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Select name="subject" required>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Choisissez un sujet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Question générale</SelectItem>
                        <SelectItem value="vendor">Devenir vendeur·euse</SelectItem>
                        <SelectItem value="partnership">Partenariat</SelectItem>
                        <SelectItem value="press">Demande presse</SelectItem>
                        <SelectItem value="support">Support technique</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Votre message..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {success && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        ✓ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                      </p>
                    </div>
                  )}

                  <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                    {isLoading ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    En envoyant ce formulaire, vous acceptez notre politique de confidentialité.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Questions Fréquentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Comment devenir vendeur·euse sur Spectrum For Us ?",
                  a: "Rendez-vous sur notre page d'abonnement vendeur·euse et choisissez le plan qui vous convient. Vous pourrez ensuite créer votre boutique et commencer à vendre vos créations.",
                },
                {
                  q: "Quels sont les frais de commission ?",
                  a: "Nous prenons une commission de 10-15% selon votre plan d'abonnement, plus des frais de transaction de 0,30€ par vente.",
                },
                {
                  q: "Comment proposer un partenariat ?",
                  a: "Contactez-nous via le formulaire ci-dessus en sélectionnant 'Partenariat' comme sujet, ou écrivez directement à partenariats@spectrumforus.com",
                },
              ].map((faq, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
