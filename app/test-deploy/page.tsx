import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function TestDeployPage() {
  const currentTime = new Date().toISOString()

  // Tests basiques
  const tests = [
    {
      name: "Next.js App Router",
      status: "success",
      description: "Cette page utilise le App Router",
    },
    {
      name: "Composants Shadcn/ui",
      status: "success",
      description: "Card et Badge fonctionnent",
    },
    {
      name: "Icônes Lucide",
      status: "success",
      description: "Les icônes se chargent correctement",
    },
    {
      name: "Tailwind CSS",
      status: "success",
      description: "Les styles sont appliqués",
    },
    {
      name: "TypeScript",
      status: "success",
      description: "Compilation TypeScript OK",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      error: "destructive",
      warning: "secondary",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status.toUpperCase()}</Badge>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🚀 Test de Déploiement</h1>
          <p className="text-muted-foreground">Vérification que tous les composants fonctionnent correctement</p>
          <p className="text-sm text-muted-foreground mt-2">Déployé le: {currentTime}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Tests Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <p className="font-medium">{test.name}</p>
                      <p className="text-sm text-muted-foreground">{test.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-blue-500" />
                Informations Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p>
                  <strong>Node.js:</strong> {process.version}
                </p>
                <p>
                  <strong>Environnement:</strong> {process.env.NODE_ENV}
                </p>
                <p>
                  <strong>Plateforme:</strong> {process.platform}
                </p>
                <p>
                  <strong>Timezone:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Variables d'environnement détectées:</h4>
                <div className="space-y-1 text-sm">
                  <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? "✅ Configuré" : "❌ Manquant"}</p>
                  <p>STRIPE_SECRET_KEY: {process.env.STRIPE_SECRET_KEY ? "✅ Configuré" : "❌ Manquant"}</p>
                  <p>OPENAI_API_KEY: {process.env.OPENAI_API_KEY ? "✅ Configuré" : "❌ Manquant"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🎯 Si cette page s'affiche, votre déploiement fonctionne !</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                ✅ <strong>Succès!</strong> Votre application Spectrum Marketplace est correctement déployée. Tous les
                composants de base fonctionnent normalement.
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Prochaines étapes:</h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Vérifiez que toutes vos pages se chargent correctement</li>
                <li>• Testez les fonctionnalités de paiement Stripe</li>
                <li>• Configurez les variables d'environnement manquantes</li>
                <li>• Testez le chat IA si configuré</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
