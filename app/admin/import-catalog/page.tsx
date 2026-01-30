"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, CheckCircle, XCircle } from "lucide-react"

export default function ImportCatalogPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/import-catalog", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Import failed")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Importer le Catalogue</CardTitle>
          <CardDescription>Importer le catalogue complet Spectrum For Us 2025 dans la base de données</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cette action va importer tous les produits et services du catalogue CSV dans la base de données Supabase.
            </p>

            <Alert>
              <AlertDescription>
                <strong>Note:</strong> Cette opération peut prendre quelques minutes. Les produits et services seront
                associés à votre compte vendeur.
              </AlertDescription>
            </Alert>

            <Button onClick={handleImport} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Import en cours...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Lancer l'import
                </>
              )}
            </Button>
          </div>

          {result && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Import réussi!</strong>
                <ul className="mt-2 space-y-1">
                  <li>✓ {result.imported.products} produits importés</li>
                  <li>✓ {result.imported.services} services importés</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-500 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Erreur:</strong> {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
