import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-8">
        <Image src="/images/logo.png" alt="Spectrum Logo" width={600} height={180} className="h-32 w-auto" priority />
      </div>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page non trouvée</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/boutique">Explorer la boutique</Link>
        </Button>
      </div>
    </main>
  )
}

