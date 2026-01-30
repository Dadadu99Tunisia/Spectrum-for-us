import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-muted-foreground mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/support">
              <ArrowLeft className="h-4 w-4" />
              Contacter le support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
