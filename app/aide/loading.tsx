import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, FileText, MessageCircle } from "lucide-react"

export default function AideLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-96 mb-6" />

        {/* Barre de recherche */}
        <Skeleton className="h-14 w-full mb-8" />

        {/* Onglets d'aide */}
        <Tabs defaultValue="faq" className="w-full mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Guides</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Contact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Section populaire */}
        <div className="mt-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
