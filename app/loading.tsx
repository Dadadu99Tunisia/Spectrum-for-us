import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600 dark:text-purple-400" />
        <p className="text-lg font-medium text-muted-foreground">Chargement en cours...</p>
      </div>
    </div>
  )
}
