"use client"

import { PackageOpen } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = "Tidak ada data",
  description = "Belum ada aplikasi yang tersedia saat ini.",
}: EmptyStateProps) {
  return (
    <div className="neo-card bg-white dark:bg-neo-gray-dark p-8 text-center">
      <div className="w-16 h-16 bg-neo-cyan/10 dark:bg-neo-purple/20 border-2 border-neo-black rounded-xl flex items-center justify-center mx-auto mb-4">
        <PackageOpen className="w-8 h-8 text-neo-cyan dark:text-neo-purple" />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
    </div>
  )
}
