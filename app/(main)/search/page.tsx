"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { SearchBar } from "@/components/ui/SearchBar"
import { AppCard } from "@/components/ui/AppCard"
import { SkeletonGrid } from "@/components/ui/SkeletonCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { createClient } from "@/lib/supabase/client"
import { App } from "@/types"
import { motion } from "framer-motion"
import { SlidersHorizontal } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialCategory = searchParams.get("category") || ""

  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [apps, setApps] = useState<App[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const supabase = createClient()

  const fetchApps = useCallback(async (searchQuery: string, cat: string, pageNum: number, append: boolean = false) => {
    setLoading(true)
    let dbQuery = supabase
      .from("apps")
      .select("*")
      .order("created_at", { ascending: false })
      .range(pageNum * 12, (pageNum + 1) * 12 - 1)

    if (searchQuery) {
      dbQuery = dbQuery.ilike("name", `%${searchQuery}%`)
    }

    if (cat) {
      const { data: catData } = await supabase.from("categories").select("id").eq("slug", cat).single()
      if (catData) {
        dbQuery = dbQuery.eq("category_id", catData.id)
      }
    }

    const { data, error } = await dbQuery

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    if (append) {
      setApps((prev) => [...prev, ...(data || [])])
    } else {
      setApps(data || [])
    }

    setHasMore((data || []).length === 12)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const getCategories = async () => {
      const { data } = await supabase.from("categories").select("*")
      setCategories(data || [])
    }
    getCategories()
    fetchApps(initialQuery, initialCategory, 0)
  }, [initialQuery, initialCategory])

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    setPage(0)
    fetchApps(newQuery, category, 0)
  }

  const handleCategoryChange = (catSlug: string) => {
    const newCat = catSlug === category ? "" : catSlug
    setCategory(newCat)
    setPage(0)
    fetchApps(query, newCat, 0)
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchApps(query, category, nextPage, true)
  }

  return (
    <div className="min-h-screen bg-neo-gray-light dark:bg-neo-black pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5" />
          <h1 className="text-2xl font-black">Cari Aplikasi</h1>
        </div>

        <SearchBar initialQuery={query} onSearch={handleSearch} />

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleCategoryChange("")}
            className={`neo-button px-3 py-1.5 text-sm font-bold ${
              category === "" 
                ? "bg-neo-cyan dark:bg-neo-purple text-white" 
                : "bg-white dark:bg-neo-gray-dark"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`neo-button px-3 py-1.5 text-sm font-bold ${
                category === cat.slug 
                  ? "bg-neo-cyan dark:bg-neo-purple text-white" 
                  : "bg-white dark:bg-neo-gray-dark"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && page === 0 ? (
            <SkeletonGrid count={6} />
          ) : apps.length > 0 ? (
            apps.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} />
            ))
          ) : (
            <EmptyState 
              title="Tidak ditemukan" 
              description={`Tidak ada aplikasi untuk "${query}"`} 
            />
          )}
        </div>

        {hasMore && apps.length > 0 && (
          <div className="flex justify-center pt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              disabled={loading}
              className="neo-button px-6 py-3 bg-neo-cyan dark:bg-neo-purple text-white font-bold disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More"}
            </motion.button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
