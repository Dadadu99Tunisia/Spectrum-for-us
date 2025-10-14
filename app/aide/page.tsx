import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageCircle, FileText, HelpCircle, Phone, Mail, ArrowRight } from "lucide-react"

export default function AidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Centre d'aide</h1>
        <p className="text-muted-foreground mb-6">Trouvez des réponses à vos questions et obtenez de l'aide</p>

        {/* Barre de recherche */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input type="text" placeholder="Rechercher dans le centre d'aide..." className="pl-10 py-6 text-base" />
        </div>

        {/* Onglets d'aide */}
        <Tabs defaultValue="faq" className="w-full mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Guides</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Contact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment créer un compte sur Spectrum ?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Pour créer un compte sur Spectrum, suivez ces étapes simples :</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Cliquez sur "S'inscrire" dans le menu en haut à droite</li>
                    <li>Remplissez le formulaire avec vos informations personnelles</li>
                    <li>Vérifiez votre adresse email en cliquant sur le lien que nous vous envoyons</li>
                    <li>Complétez votre profil avec vos préférences</li>
                  </ol>
                  <p className="mt-2">Une fois ces étapes terminées, vous pourrez profiter pleinement de Spectrum !</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Comment devenir vendeur·euse sur la plateforme ?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Pour devenir vendeur·euse sur Spectrum :</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Connectez-vous à votre compte (ou créez-en un si vous n'en avez pas)</li>
                    <li>Cliquez sur "Devenir vendeur·euse" dans le menu principal</li>
                    <li>Remplissez le formulaire avec les informations sur votre boutique</li>
                    <li>Soumettez vos documents d'identité et informations fiscales</li>
                    <li>Attendez la validation de votre compte (généralement sous 48h)</li>
                  </ol>
                  <p className="mt-2">Une fois approuvé·e, vous pourrez commencer à mettre en vente vos créations !</p>
                  <Button className="mt-4" asChild>
                    <a href="/devenir-vendeur">Devenir vendeur·euse</a>
                  </Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Comment passer une commande ?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Pour passer une commande sur Spectrum :</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Parcourez notre catalogue et ajoutez les produits souhaités à votre panier</li>
                    <li>Cliquez sur l'icône du panier pour voir votre sélection</li>
                    <li>Vérifiez votre commande et cliquez sur "Passer à la caisse"</li>
                    <li>Renseignez votre adresse de livraison et choisissez un mode de livraison</li>
                    <li>Sélectionnez votre méthode de paiement et finalisez la commande</li>
                  </ol>
                  <p className="mt-2">Vous recevrez un email de confirmation avec les détails de votre commande.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Quels sont les délais de livraison ?</AccordionTrigger>
                <AccordionContent>
                  <p>Les délais de livraison varient selon le vendeur et votre localisation :</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Produits numériques : accès immédiat après paiement</li>
                    <li>Produits physiques en France métropolitaine : 2-5 jours ouvrés</li>
                    <li>Europe : 5-10 jours ouvrés</li>
                    <li>International : 10-20 jours ouvrés</li>
                  </ul>
                  <p className="mt-2">
                    Certains produits sont fabriqués sur commande et peuvent avoir des délais plus longs, toujours
                    indiqués sur la page du produit.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Comment retourner un produit ?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Pour retourner un produit :</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Connectez-vous à votre compte et accédez à "Mes commandes"</li>
                    <li>Sélectionnez la commande concernée</li>
                    <li>Cliquez sur "Demander un retour" pour le produit à retourner</li>
                    <li>Sélectionnez le motif du retour et suivez les instructions</li>
                    <li>Imprimez l'étiquette de retour et renvoyez le produit</li>
                  </ol>
                  <p className="mt-2">
                    Vous avez 14 jours à compter de la réception pour initier un retour. Le remboursement sera effectué
                    une fois le produit reçu et vérifié par le vendeur.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Guide du débutant</CardTitle>
                  <CardDescription>Tout ce que vous devez savoir pour commencer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Découvrez comment naviguer sur Spectrum, créer un compte et faire vos premiers achats.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="#" className="flex justify-between items-center">
                      <span>Lire le guide</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Guide du vendeur</CardTitle>
                  <CardDescription>Comment vendre vos créations sur Spectrum</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Apprenez à configurer votre boutique, ajouter des produits et gérer vos commandes.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="#" className="flex justify-between items-center">
                      <span>Lire le guide</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Paiements et facturation</CardTitle>
                  <CardDescription>Tout sur les méthodes de paiement</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Informations sur les moyens de paiement acceptés, la facturation et les taxes.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="#" className="flex justify-between items-center">
                      <span>Lire le guide</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Livraison et retours</CardTitle>
                  <CardDescription>Politique de livraison et de retour</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tout ce que vous devez savoir sur les options de livraison et la procédure de retour.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="#" className="flex justify-between items-center">
                      <span>Lire le guide</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contactez-nous</CardTitle>
                <CardDescription>
                  Nous sommes là pour vous aider. Choisissez la méthode qui vous convient le mieux.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-sm text-muted-foreground mb-1">Nous répondons généralement sous 24h.</p>
                        <a href="mailto:support@spectrum.fr" className="text-purple-600 hover:underline">
                          support@spectrum.fr
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Téléphone</h3>
                        <p className="text-sm text-muted-foreground mb-1">Disponible du lundi au vendredi, 9h-18h.</p>
                        <a href="tel:+33123456789" className="text-purple-600 hover:underline">
                          +33 1 23 45 67 89
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Chat en direct</h3>
                        <p className="text-sm text-muted-foreground mb-1">Disponible 7j/7, de 9h à 22h.</p>
                        <Button variant="link" className="p-0 h-auto text-purple-600">
                          Démarrer un chat
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Envoyez-nous un message</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Prénom" />
                        <Input placeholder="Nom" />
                      </div>
                      <Input placeholder="Email" type="email" />
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="" disabled selected>
                          Sujet de votre message
                        </option>
                        <option value="commande">Question sur une commande</option>
                        <option value="compte">Problème de compte</option>
                        <option value="produit">Question sur un produit</option>
                        <option value="autre">Autre</option>
                      </select>
                      <textarea
                        placeholder="Votre message"
                        className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      <Button className="w-full">Envoyer le message</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Section populaire */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Questions fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="text-left">
                <p className="font-medium">Comment suivre ma commande ?</p>
                <p className="text-sm text-muted-foreground">Suivez l'état de votre livraison</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="text-left">
                <p className="font-medium">Comment modifier mon adresse ?</p>
                <p className="text-sm text-muted-foreground">Gérez vos informations personnelles</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="text-left">
                <p className="font-medium">Comment annuler une commande ?</p>
                <p className="text-sm text-muted-foreground">Procédure d'annulation</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
