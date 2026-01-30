"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ApiErrorHandlerProps {
  error: Error | null
  onRetry?: () => void
  title?: string
  description?: string
  showRetry?: boolean
}

export function ApiErrorHandler({
  error,
  onRetry,
  title = "Une erreur s'est produite",
  description,
  showRetry = true,
}: ApiErrorHandlerProps) {
  if (!error) return null

  const errorMessage = description || error.message || "Une erreur inattendue s'est produite"

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {errorMessage}
        {showRetry && onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-2 ml-0 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export default ApiErrorHandler
