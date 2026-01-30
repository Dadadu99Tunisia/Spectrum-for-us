import { Loader2 } from "lucide-react"

export default function CheckoutSuccessLoading() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold">Chargement des détails de votre commande...</h2>
      </div>
    </div>
  )
}
