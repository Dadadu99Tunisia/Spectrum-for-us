"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Camera, Smartphone, RotateCcw } from "lucide-react"
import { getProductARModel, type ARModel, isARSupported } from "@/lib/services/ar-service"
import ARViewer from "@/components/ar-viewer"
import ARFallback from "@/components/ar-fallback"
import ARInstructions from "@/components/ar-instructions"
import { getProductById } from "@/lib/data/products"
import Link from "next/link"

interface ARFullExperienceProps {
  productId: string
}

export default function ARFullExperience({ productId }: ARFullExperienceProps) {
  const [arModel, setArModel] = useState<ARModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [arStarted, setArStarted] = useState(false)
  const arSupported = isARSupported()
  const product = getProductById(productId)

  useEffect(() => {
    async function loadModel() {
      try {
        setLoading(true)
        const model = await getProductARModel(productId)
        setArModel(model)

        if (!model) {
          setError("Modèle 3D non disponible pour ce produit")
        }
      } catch (err) {
        console.error("Erreur lors du chargement du modèle AR:", err)
        setError("Impossible de charger l'expérience AR")
      } finally {
        setLoading(false)
      }
    }

    loadModel()
  }, [productId])

  if (loading) {
    return <Skeleton className="h-[70vh] w-full rounded-lg" />
  }

  if (error || !arModel) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <Alert className="mb-6">
          <AlertDescription>{error || "Ce produit n'est pas encore disponible en réalité augmentée"}</AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Link href={`/produit/${productId}`}>
            <Button>Retour au produit</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Tabs defaultValue="preview">
        <div className="border-b px-6 pt-4">
          <TabsList>
            <TabsTrigger value="preview" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Aperçu 3D
            </TabsTrigger>
            {arSupported && (
              <TabsTrigger value="ar" className="gap-2">
                <Smartphone className="h-4 w-4" />
                Réalité Augmentée
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="preview" className="p-0">
          <div className="h-[70vh] w-full">
            <ARFallback model={arModel} />
          </div>
        </TabsContent>

        <TabsContent value="ar" className="p-0">
          {!arStarted ? (
            <div className="flex flex-col items-center justify-center h-[70vh] p-6">
              <div className="max-w-md text-center mb-8">
                <h3 className="text-xl font-semibold mb-4">Prêt à essayer {product?.name} ?</h3>
                <ARInstructions modelType={arModel.type} />
              </div>

              <Button onClick={() => setArStarted(true)} size="lg" className="gap-2">
                <Camera className="h-4 w-4" />
                Lancer l'expérience AR
              </Button>
            </div>
          ) : (
            <div className="h-[70vh] w-full relative">
              <Button className="absolute top-4 right-4 z-10" variant="secondary" onClick={() => setArStarted(false)}>
                Quitter
              </Button>
              <ARViewer model={arModel} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
