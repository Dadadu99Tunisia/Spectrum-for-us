import { Users, ShoppingBag, Store, Heart } from "lucide-react"

export default function KeyStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white dark:bg-background shadow-sm">
        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
          <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-3xl font-bold mb-1">15K+</h3>
        <p className="text-sm text-muted-foreground">Utilisateur·rice·s actif·ve·s</p>
      </div>

      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white dark:bg-background shadow-sm">
        <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-3">
          <Store className="h-6 w-6 text-pink-600 dark:text-pink-400" />
        </div>
        <h3 className="text-3xl font-bold mb-1">500+</h3>
        <p className="text-sm text-muted-foreground">Vendeur·euse·s queer</p>
      </div>

      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white dark:bg-background shadow-sm">
        <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
          <ShoppingBag className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-3xl font-bold mb-1">8K+</h3>
        <p className="text-sm text-muted-foreground">Produits uniques</p>
      </div>

      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white dark:bg-background shadow-sm">
        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
          <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-3xl font-bold mb-1">95%</h3>
        <p className="text-sm text-muted-foreground">Satisfaction client·e·s</p>
      </div>
    </div>
  )
}

