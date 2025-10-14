import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, Mail, Phone, MessageSquare, HelpCircle, FileText, Users } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Données fictives pour les FAQ
const faqs = [
  {
    question: "Comment puis-je devenir vendeur sur Spectrum ?",
    answer:
      "Pour devenir vendeur sur Spectrum, vous devez créer un compte, puis cliquer sur 'Devenir Vendeur' dans votre profil. Vous serez guidé à travers le processus d'inscription qui comprend la fourniture d'informations sur votre entreprise et vos produits.",
  },
  {
    question: "Quels types de produits puis-je vendre sur Spectrum ?",
    answer:
      "Spectrum accueille une large gamme de produits inclusifs et diversifiés. Cela inclut les vêtements, accessoires, art, beauté, décoration, livres et bien plus encore, tant qu'ils respectent nos valeurs d'inclusivité et de diversité.",
  },
  {
    question: "Comment fonctionne le processus de commande ?",
    answer:
      "Lorsqu'un client passe une commande, vous recevez une notification. Vous devez ensuite préparer la commande et l'expédier dans les délais indiqués. Une fois la commande expédiée, vous devez mettre à jour son statut sur la plateforme.",
  },
  {
    question: "Quels sont les frais de commission ?",
    answer:
      "Spectrum prélève une commission de 10% sur chaque vente. Cette commission nous permet de maintenir et d'améliorer la plateforme, ainsi que de promouvoir votre boutique auprès de notre communauté.",
  },
  {
    question: "Comment puis-je contacter le support ?",
    answer:
      "Vous pouvez contacter notre équipe de support via le formulaire de contact sur cette page, par email à support@spectrum.com, ou par téléphone au +33 1 23 45 67 89 pendant les heures d'ouverture.",
  },
]

export default function SupportPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Support</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Support & Aide</h1>
      <p className="text-muted-foreground mb-8">Besoin d'aide ? Nous sommes là pour vous accompagner.</p>

      {/* Options de support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="text-center">
            <Mail className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Envoyez-nous un email et nous vous répondrons dans les 24 heures.
            </p>
            <p className="font-medium">support@spectrum.com</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Phone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <CardTitle>Téléphone</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">Appelez-nous du lundi au vendredi, de 9h à 18h.</p>
            <p className="font-medium">+33 1 23 45 67 89</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <CardTitle>Chat en direct</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">Discutez avec un membre de notre équipe en temps réel.</p>
            <Button>Démarrer un chat</Button>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire de contact et FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contactez-nous</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nom
                  </label>
                  <Input id="name" placeholder="Votre nom" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="votre@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Sujet
                </label>
                <Input id="subject" placeholder="Sujet de votre message" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea id="message" placeholder="Votre message..." className="min-h-[150px]" />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Envoyer le message</Button>
          </CardFooter>
        </Card>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Questions fréquentes</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Ressources supplémentaires</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Guide du vendeur
              </Button>
              <Button variant="outline" className="justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                Centre d'aide
              </Button>
              <Button variant="outline" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                Communauté
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Conditions d'utilisation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
