import { Suspense } from "react"
import { SkeletonGrid } from "@/components/ui/SkeletonCard"
import SearchContent from "./SearchContent"

export default function SearchPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Suspense fallback={<SkeletonGrid count={6} />}>
        <SearchContent />
      </Suspense>
    </main>
  )
}
