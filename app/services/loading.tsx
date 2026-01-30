import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-8 w-32 mb-4" />

      <div className="flex flex-col items-center text-center mb-12">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-12 w-full max-w-xl mb-4" />
        <Skeleton className="h-6 w-full max-w-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-64">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          ))}
      </div>

      <Skeleton className="h-40 w-full rounded-xl mb-16" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  )
}
