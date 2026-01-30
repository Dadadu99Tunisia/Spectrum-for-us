import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero skeleton */}
      <Skeleton className="w-full h-[300px] md:h-[400px] rounded-xl mb-12" />

      {/* Offre d'abonnement skeleton */}
      <Skeleton className="w-full h-32 rounded-xl mb-12" />

      {/* Featured destinations skeleton */}
      <div className="space-y-6 mb-12">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mt-16">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="flex gap-2 mb-6">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 flex-1" />
            ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Conseils skeleton */}
      <div className="mt-16 mb-12">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-6 border rounded-lg space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
        </div>
      </div>

      {/* CTA skeleton */}
      <Skeleton className="w-full h-64 rounded-xl" />
    </div>
  )
}
