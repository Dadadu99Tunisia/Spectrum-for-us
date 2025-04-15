"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Enregistrer l'erreur dans un service de suivi des erreurs
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Une erreur est survenue</h1>
        <p className="text-muted-foreground mb-8">
          Nous sommes désolés pour ce désagrément. Notre équipe a été informée et travaille à résoudre le problème.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
