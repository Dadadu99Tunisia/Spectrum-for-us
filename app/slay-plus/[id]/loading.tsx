import { Skeleton } from "@/components/ui/skeleton"

export default function MediaDetailLoading() {
  return (
    <main className="min-h-screen bg-black text-white pb-16">
      {/* Hero Banner Skeleton */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        <div className="absolute inset-0 bg-gray-900"></div>

        <div className="relative container mx-auto px-4 py-24 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Back Button Skeleton */}
          <div className="absolute top-8 left-4 md:left-8">
            <Skeleton className="h-9 w-24 bg-gray-800" />
          </div>

          {/* Media Poster Skeleton */}
          <Skeleton className="w-64 md:w-80 aspect-[2/3] rounded-lg bg-gray-800 flex-shrink-0" />

          {/* Media Info Skeleton */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full bg-gray-800" />
              ))}
            </div>

            <Skeleton className="h-12 w-3/4 bg-gray-800 mb-2" />

            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-5 w-12 bg-gray-800" />
              <Skeleton className="h-5 w-16 bg-gray-800" />
              <Skeleton className="h-5 w-20 bg-gray-800" />
            </div>

            <Skeleton className="h-6 w-full max-w-2xl bg-gray-800 mb-2" />
            <Skeleton className="h-6 w-5/6 max-w-xl bg-gray-800 mb-2" />
            <Skeleton className="h-6 w-4/5 max-w-lg bg-gray-800 mb-6" />

            {/* Cast & Crew Skeleton */}
            <Skeleton className="h-5 w-64 bg-gray-800 mb-2" />
            <Skeleton className="h-5 w-96 bg-gray-800 mb-6" />

            {/* Action Buttons Skeleton */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-11 w-48 bg-gray-800" />
              <Skeleton className="h-11 w-48 bg-gray-800" />
              <Skeleton className="h-11 w-32 bg-gray-800" />
              <Skeleton className="h-11 w-32 bg-gray-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Similar Content Skeleton */}
      <section className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-64 bg-gray-800 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
                <Skeleton className="w-full aspect-[2/3] bg-gray-800" />
                <div className="p-4">
                  <Skeleton className="h-6 w-full bg-gray-800 mb-2" />
                  <Skeleton className="h-4 w-2/3 bg-gray-800" />
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  )
}
