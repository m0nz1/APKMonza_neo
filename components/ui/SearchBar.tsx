"use client"

import { Search, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  initialQuery?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ initialQuery = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query)
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for apps or games..."
          className="neo-input w-full pl-12 pr-10 py-3 text-sm font-medium"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              if (onSearch) onSearch("")
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-neo-black" />
          </button>
        )}
      </div>
    </form>
  )
}
