import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 to-pink-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenue sur{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Spectrum</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            La première marketplace inclusive où la diversité rencontre l'authenticité. Découvrez des produits uniques
            créés par et pour notre communauté.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              asChild
            >
              <Link href="/categories">Explorer les produits</Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/devenir-vendeur">Devenir vendeur</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
