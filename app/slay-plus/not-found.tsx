import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SlayPlusLogo } from "@/components/slay-plus-logo"

export default function SlayPlusNotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <SlayPlusLogo size="large" />
        </div>

        <h2 className="text-2xl font-bold mb-4">Contenu non trouvé</h2>
        <p className="text-gray-400 mb-8">
          Le film ou la série que vous recherchez n'est pas disponible sur Slay+. Explorez notre catalogue pour
          découvrir d'autres contenus LGBTQ+ passionnants.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/slay-plus">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à Slay+
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white/30 hover:bg-white/10">
            <Link href="/">Accueil Spectrum</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
