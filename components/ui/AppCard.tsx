"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, Download, Crown } from "lucide-react"
import { motion } from "framer-motion"
import { App } from "@/types"
import { truncateText } from "@/lib/utils"

interface AppCardProps {
  app: App
  index?: number
}

export function AppCard({ app, index = 0 }: AppCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/app/${app.slug}`}>
        <div className="neo-card neo-card-hover bg-white dark:bg-neo-gray-dark p-4 flex items-start gap-4 cursor-pointer group">
          {/* Icon */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="w-16 h-16 bg-neo-cyan/20 dark:bg-neo-purple/20 border-2 border-neo-black rounded-xl flex items-center justify-center overflow-hidden">
              {app.icon_url && !imgError ? (
                <img
                  src={app.icon_url}
                  alt={app.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-2xl font-bold text-neo-cyan dark:text-neo-purple">
                  {app.name.charAt(0)}
                </span>
              )}
            </div>
            {app.vip_url && (
              <div className="absolute -top-2 -right-2 bg-neo-yellow border-2 border-neo-black rounded-full p-1">
                <Crown className="w-3 h-3 text-neo-black" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-neo-black dark:text-white truncate group-hover:text-neo-cyan dark:group-hover:text-neo-purple transition-colors">
              {truncateText(app.name, 25)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {app.developer}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold bg-neo-cyan/10 dark:bg-neo-purple/20 text-neo-cyan dark:text-neo-purple px-2 py-0.5 rounded-full border border-neo-black">
                v{app.version}
              </span>
              {app.mod_feature && (
                <span className="text-xs font-bold bg-neo-yellow/20 text-neo-yellow-dark px-2 py-0.5 rounded-full border border-neo-black truncate">
                  {truncateText(app.mod_feature, 20)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
              {app.rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-neo-yellow text-neo-yellow" />
                  {app.rating}
                </span>
              )}
              {app.download_count && (
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {app.download_count.toLocaleString()}
                </span>
              )}
              <span>{app.size}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
