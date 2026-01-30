import { Glasses, Sofa, Watch } from "lucide-react"

interface ARInstructionsProps {
  modelType: "wearable" | "furniture" | "accessory" | "other"
}

export default function ARInstructions({ modelType }: ARInstructionsProps) {
  let instructions = []
  let icon = null

  switch (modelType) {
    case "wearable":
      instructions = [
        "Pointez la caméra vers votre visage",
        "Le produit s'ajustera automatiquement",
        "Bougez légèrement pour voir sous différents angles",
      ]
      icon = <Glasses className="h-8 w-8 text-primary mb-2" />
      break
    case "furniture":
      instructions = [
        "Pointez la caméra vers un espace libre",
        "Tapez sur l'écran pour placer le produit",
        "Utilisez deux doigts pour redimensionner ou faire pivoter",
      ]
      icon = <Sofa className="h-8 w-8 text-primary mb-2" />
      break
    case "accessory":
      instructions = [
        "Pointez la caméra vers votre poignet",
        "Le produit s'ajustera automatiquement",
        "Bougez légèrement pour voir sous différents angles",
      ]
      icon = <Watch className="h-8 w-8 text-primary mb-2" />
      break
    default:
      instructions = [
        "Pointez la caméra vers une surface plane",
        "Tapez sur l'écran pour placer le produit",
        "Utilisez deux doigts pour redimensionner ou faire pivoter",
      ]
      icon = null
  }

  return (
    <div className="text-center">
      <h3 className="text-lg font-medium mb-4">Comment utiliser</h3>
      <div className="flex flex-col items-center mb-4">{icon}</div>
      <ol className="space-y-2">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="flex items-center justify-center bg-primary/10 text-primary rounded-full w-6 h-6 text-sm">
              {index + 1}
            </span>
            <span>{instruction}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
