"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Category } from "@/types"
import { Gamepad2, Wrench, Palette, Music, Camera, BookOpen, Heart, Zap } from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  gamepad2: Gamepad2,
  wrench: Wrench,
  palette: Palette,
  music: Music,
  camera: Camera,
  bookopen: BookOpen,
  heart: Heart,
  zap: Zap,
}

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
      {categories.map((category, index) => {
        const Icon = iconMap[category.icon] || Zap
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0"
          >
            <Link href={`/search?category=${category.slug}`}>
              <div
                className="neo-card neo-card-hover px-4 py-3 flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: category.color + "20" }}
              >
                <div
                  className="w-8 h-8 rounded-lg border-2 border-neo-black flex items-center justify-center"
                  style={{ backgroundColor: category.color }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm whitespace-nowrap">{category.name}</span>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
