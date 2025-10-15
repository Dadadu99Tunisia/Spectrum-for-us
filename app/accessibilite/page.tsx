import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Type, Volume2, Palette, Accessibility } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessibilité | Spectrum",
  description: "Options d'accessibilité pour rendre Spectrum inclusif pour tous",
}

export default function AccessibilityPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Accessibilité</h1>
          <p className="text-xl text-muted-foreground">
            Chez Spectrum, nous nous engageons à rendre notre plateforme accessible à tous
          </p>
        </div>

        <div className="mb-12">
          <p className="mb-4">
            Notre site est conçu pour être inclusif et accessible à tous, y compris les personnes queer, les personnes
            daltoniennes et les personnes malvoyantes. Nous avons mis en place plusieurs fonctionnalités pour vous
            permettre de personnaliser votre expérience selon vos besoins.
          </p>
          <p className="mb-4">
            Pour accéder aux options d'accessibilité, cliquez sur l'icône <Accessibility className="inline h-4 w-4" />{" "}
            dans la barre de navigation en haut de chaque page.
          </p>
        </div>

        <Tabs defaultValue="vision" className="mb-12">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="vision" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Vision</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span>Texte</span>
            </TabsTrigger>
            <TabsTrigger value="motion" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>Mouvement</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Thème</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vision">
            <Card>
              <CardHeader>
                <CardTitle>Options de vision</CardTitle>
                <CardDescription>
                  Adaptez l'affichage du site pour les personnes daltoniennes ou ayant des difficultés visuelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Mode daltonien</h3>
                  <p className="text-muted-foreground mb-4">
                    Nous proposons plusieurs modes pour adapter les couleurs du site selon différents types de
                    daltonisme :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Protanopie (difficulté à percevoir le rouge)</li>
                    <li>Deutéranopie (difficulté à percevoir le vert)</li>
                    <li>Tritanopie (difficulté à percevoir le bleu)</li>
                    <li>Achromatopsie (vision en noir et blanc)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Contraste élevé</h3>
                  <p className="text-muted-foreground">
                    Cette option augmente le contraste des couleurs pour améliorer la lisibilité du contenu pour les
                    personnes ayant une vision réduite.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Options de texte</CardTitle>
                <CardDescription>Personnalisez l'affichage du texte pour une meilleure lisibilité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Taille du texte</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous pouvez augmenter la taille du texte sur l'ensemble du site pour faciliter la lecture :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Normal : taille par défaut</li>
                    <li>Grand : texte 25% plus grand</li>
                    <li>Très grand : texte 50% plus grand</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Police de caractères</h3>
                  <p className="text-muted-foreground mb-4">
                    Nous proposons différentes polices pour améliorer la lisibilité :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Police par défaut</li>
                    <li>Police pour dyslexie (OpenDyslexic)</li>
                    <li>Police sans-serif (plus simple et plus lisible)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="motion">
            <Card>
              <CardHeader>
                <CardTitle>Options de mouvement</CardTitle>
                <CardDescription>
                  Contrôlez les animations et améliorez la compatibilité avec les technologies d'assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Réduire les animations</h3>
                  <p className="text-muted-foreground">
                    Cette option désactive ou réduit les animations et transitions pour limiter les distractions
                    visuelles, particulièrement utile pour les personnes sensibles aux mouvements ou souffrant de
                    troubles vestibulaires.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Support lecteur d'écran</h3>
                  <p className="text-muted-foreground">
                    Cette option optimise le site pour une meilleure compatibilité avec les lecteurs d'écran, en
                    ajoutant des attributs ARIA supplémentaires et en améliorant la navigation au clavier.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Thèmes inclusifs</CardTitle>
                <CardDescription>
                  Personnalisez les couleurs du site avec des thèmes représentant différentes identités
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Nous proposons plusieurs thèmes de couleurs représentant différentes identités de la communauté LGBTQ+
                  :
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <h3 className="font-medium mb-1">Pride</h3>
                    <p className="text-sm opacity-90">Couleurs arc-en-ciel représentant la fierté LGBTQ+</p>
                  </div>
                  <div className="p-4 rounded-md bg-gradient-to-r from-pink-400 via-white to-blue-400 text-black">
                    <h3 className="font-medium mb-1">Trans</h3>
                    <p className="text-sm opacity-90">Couleurs du drapeau transgenre</p>
                  </div>
                  <div className="p-4 rounded-md bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-white">
                    <h3 className="font-medium mb-1">Lesbien</h3>
                    <p className="text-sm opacity-90">Couleurs du drapeau lesbien</p>
                  </div>
                  <div className="p-4 rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                    <h3 className="font-medium mb-1">Bisexuel</h3>
                    <p className="text-sm opacity-90">Couleurs du drapeau bisexuel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <p className="mb-6 text-muted-foreground">
            Si vous avez des suggestions pour améliorer l'accessibilité de notre site, n'hésitez pas à nous contacter.
          </p>
          <Button asChild>
            <Link href="/support">Contacter le support</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
