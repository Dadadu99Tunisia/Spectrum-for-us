import { Leaf, Globe, Home } from "lucide-react"

export default function EcoBanner() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-4">
          <div className="flex items-center">
            <Leaf className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            <Home className="h-6 w-6 text-teal-600 dark:text-teal-400 mr-2" />
            <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4" />
          </div>
          <p className="text-sm md:text-base font-medium">
            Spectrum fonctionne à 100% en télétravail : une marketplace queer, flexible et sans bureaux, qui réduit son
            empreinte carbone
          </p>
        </div>
      </div>
    </div>
  )
}
