import { Suspense } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { SkeletonGrid } from "@/components/ui/SkeletonCard"
import SearchContent from "./SearchContent"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-neo-gray-light dark:bg-neo-black pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<SkeletonGrid count={6} />}>
          <SearchContent />
        </Suspense>
      </main>

      <BottomNav />
    </div>
  )
}
