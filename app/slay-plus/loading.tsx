import { Skeleton } from "@/components/ui/skeleton"

export default function SlayPlusLoading() {
  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Hero Banner Skeleton */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <Skeleton className="h-12 w-48 bg-gray-800 mb-4" />
          <Skeleton className="h-8 w-full max-w-2xl bg-gray-800 mb-2" />
          <Skeleton className="h-8 w-3/4 max-w-xl bg-gray-800 mb-8" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-48 bg-gray-800" />
            <Skeleton className="h-12 w-40 bg-gray-800" />
          </div>
        </div>
      </div>

      {/* Content Tabs Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-72 bg-gray-800 mb-8" />
        <Skeleton className="h-8 w-48 bg-gray-800 mb-6" />

        {/* Media Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-gray-900/50 rounded-lg overflow-hidden">
                <Skeleton className="w-full aspect-[2/3] bg-gray-800" />
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-16 bg-gray-800" />
                    <Skeleton className="h-4 w-12 bg-gray-800" />
                  </div>
                  <Skeleton className="h-6 w-full bg-gray-800 mb-2" />
                  <Skeleton className="h-4 w-3/4 bg-gray-800 mb-2" />
                  <Skeleton className="h-8 w-full bg-gray-800 mt-2" />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 bg-gray-800 mb-6" />
        <div className="flex flex-wrap gap-3">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 bg-gray-800 rounded-full" />
            ))}
        </div>
      </div>

      {/* Subscription Banner Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-xl p-8">
          <Skeleton className="h-10 w-72 bg-gray-800 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-xl bg-gray-800 mx-auto mb-2" />
          <Skeleton className="h-6 w-3/4 max-w-lg bg-gray-800 mx-auto mb-6" />
          <Skeleton className="h-12 w-48 bg-gray-800 mx-auto" />
        </div>
      </div>
    </div>
  )
}
