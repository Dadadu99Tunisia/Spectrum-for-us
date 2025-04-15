import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Lock, CreditCard, Bell, Globe } from "lucide-react"

export default function ParametresLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-96 mb-6" />

        <Tabs defaultValue="compte" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="compte" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Compte</span>
            </TabsTrigger>
            <TabsTrigger value="securite" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="paiement" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Paiement</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Préférences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compte">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-72" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-48" />
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
