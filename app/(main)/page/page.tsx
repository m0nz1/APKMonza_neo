import { Suspense } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { SearchBar } from "@/components/ui/SearchBar"
import { CategoryList } from "@/components/ui/CategoryList"
import { AppCard } from "@/components/ui/AppCard"
import { SkeletonGrid } from "@/components/ui/SkeletonCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { createClient } from "@/lib/supabase/server"
import { App, Category } from "@/types"

async function getCategories(): Promise<Category[]> {
  const supabase = createClient()
  const { data } = await supabase.from("categories").select("*").order("name")
  return data || []
}

async function getRecommendedApps(): Promise<App[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("apps")
    .select("*")
    .order("rating", { ascending: false })
    .limit(6)
  return data || []
}

async function getLatestApps(): Promise<App[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("apps")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(12)
  return data || []
}

export default async function HomePage() {
  const [categories, recommendedApps, latestApps] = await Promise.all([
    getCategories(),
    getRecommendedApps(),
    getLatestApps(),
  ])

  return (
    <div className="min-h-screen bg-neo-gray-light dark:bg-neo-black pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Search Section */}
        <section>
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            <span className="text-neo-cyan dark:text-neo-purple">Temukan</span>{" "}
            <span className="text-neo-yellow">APK & Game</span>{" "}
            <span className="text-neo-black dark:text-white">Terbaik</span>
          </h1>
          <SearchBar />
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-neo-cyan dark:bg-neo-purple rounded-full" />
            Kategori
          </h2>
          {categories.length > 0 ? (
            <CategoryList categories={categories} />
          ) : (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              <SkeletonGrid count={4} />
            </div>
          )}
        </section>

        {/* Recommended */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-neo-yellow rounded-full" />
            Rekomendasi
          </h2>
          <Suspense fallback={<SkeletonGrid count={6} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedApps.length > 0 ? (
                recommendedApps.map((app, i) => (
                  <AppCard key={app.id} app={app} index={i} />
                ))
              ) : (
                <EmptyState title="Belum ada rekomendasi" />
              )}
            </div>
          </Suspense>
        </section>

        {/* Latest */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-neo-purple dark:bg-neo-cyan rounded-full" />
            Terbaru Diupload
          </h2>
          <Suspense fallback={<SkeletonGrid count={6} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestApps.length > 0 ? (
                latestApps.map((app, i) => (
                  <AppCard key={app.id} app={app} index={i} />
                ))
              ) : (
                <EmptyState title="Belum ada aplikasi" />
              )}
            </div>
          </Suspense>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
