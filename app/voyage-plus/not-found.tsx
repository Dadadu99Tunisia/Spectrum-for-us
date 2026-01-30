import Link from "next/link"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-6">
        <Globe className="h-16 w-16 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Destination non trouvée</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Désolé, la destination que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/voyage-plus">Explorer toutes les destinations</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  )
}
