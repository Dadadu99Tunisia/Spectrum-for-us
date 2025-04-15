"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, X } from "lucide-react"
import { getProductARModel, type ARModel } from "@/lib/services/ar-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ARViewer from "@/components/ar-viewer"
import ARInstructions from "@/components/ar-instructions"

interface ARExperienceProps {
  productId: string
  onClose: () => void
}

export default function ARExperience({ productId, onClose }: ARExperienceProps) {
  const [arModel, setArModel] = useState<ARModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [arStarted, setArStarted] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)

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

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop()) // Arrêter le stream après vérification
      setCameraPermission(true)
      setArStarted(true)
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err)
      setCameraPermission(false)
      setError("Veuillez autoriser l'accès à la caméra pour utiliser la réalité augmentée")
    }
  }

  const resetExperience = () => {
    setArStarted(false)
    setCameraPermission(null)
    setError(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6">
        <Skeleton className="h-[300px] w-full max-w-md rounded-lg mb-4" />
        <Skeleton className="h-8 w-64 rounded-md" />
        <p className="mt-4 text-muted-foreground">Chargement de l'expérience AR...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={onClose}>Fermer</Button>
      </div>
    )
  }

  if (!arModel) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6">
        <Alert className="mb-4">
          <AlertDescription>Ce produit n'est pas encore disponible en réalité augmentée</AlertDescription>
        </Alert>
        <Button onClick={onClose}>Fermer</Button>
      </div>
    )
  }

  if (!arStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6">
        <div className="relative w-full max-w-md h-[300px] mb-6 rounded-lg overflow-hidden">
          <img
            src={arModel.previewImageUrl || "/placeholder.svg"}
            alt="Aperçu AR"
            className="w-full h-full object-cover"
          />
        </div>

        <ARInstructions modelType={arModel.type} />

        <div className="flex gap-4 mt-6">
          <Button onClick={requestCameraPermission} className="gap-2">
            <Camera className="h-4 w-4" />
            Démarrer l'expérience AR
          </Button>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-16 right-4 z-20 flex gap-2">
        <Button size="icon" variant="secondary" onClick={resetExperience}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ARViewer model={arModel} />
    </div>
  )
}
