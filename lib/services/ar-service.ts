// Types pour les modèles 3D et les expériences AR
export interface ARModel {
  id: string
  productId: string
  modelUrl: string
  previewImageUrl: string
  scale: number
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  type: "wearable" | "furniture" | "accessory" | "other"
}

// Fonction pour vérifier si l'AR est supportée par l'appareil
// Cette fonction est sécurisée côté serveur
export function isARSupported(): boolean {
  // Vérifier si nous sommes côté serveur
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false
  }

  try {
    // Vérifier si WebXR est disponible
    if ("xr" in navigator) {
      return true
    }

    // Vérifier si l'appareil est mobile (pour AR.js)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    return isMobile
  } catch (error) {
    console.error("Erreur lors de la vérification de la compatibilité AR:", error)
    return false
  }
}

// Fonction pour obtenir le modèle 3D d'un produit
export async function getProductARModel(productId: string): Promise<ARModel | null> {
  try {
    // Dans une implémentation réelle, cela viendrait d'une API
    // Pour l'instant, nous utilisons des données statiques
    const models: Record<string, ARModel> = {
      "product-001": {
        id: "model-001",
        productId: "product-001",
        modelUrl: "/models/glasses.glb",
        previewImageUrl: "/images/ar-preview/glasses.jpg",
        scale: 1,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        type: "wearable",
      },
      "product-002": {
        id: "model-002",
        productId: "product-002",
        modelUrl: "/models/chair.glb",
        previewImageUrl: "/images/ar-preview/chair.jpg",
        scale: 1.5,
        position: { x: 0, y: -1, z: -3 },
        rotation: { x: 0, y: 0, z: 0 },
        type: "furniture",
      },
      "product-003": {
        id: "model-003",
        productId: "product-003",
        modelUrl: "/models/watch.glb",
        previewImageUrl: "/images/ar-preview/watch.jpg",
        scale: 0.5,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        type: "wearable",
      },
    }

    return models[productId] || null
  } catch (error) {
    console.error("Erreur lors de la récupération du modèle AR:", error)
    return null
  }
}
