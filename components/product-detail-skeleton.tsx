"use client"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="mb-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          <div className="rounded-lg overflow-hidden mb-8">
            <Skeleton className="w-full h-96" />
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="w-full h-32" />
          </div>

          <div className="mb-8">
            <Skeleton className="h-7 w-32 mb-4" />
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <Skeleton className="w-full h-full" />
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="sticky top-20">
            <div className="mb-6">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-6 w-36" />
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="pt-4 space-y-4">
                  <Skeleton className="h-5 w-48" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <Skeleton className="h-5 w-36" />
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full mr-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}