"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, User } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white dark:bg-neo-gray-dark border-2 border-neo-black rounded-neo shadow-neo-lg p-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNav"
                  className="absolute inset-0 bg-neo-cyan dark:bg-neo-purple rounded-lg border-2 border-neo-black"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-white" : "text-neo-black dark:text-white"}`} />
              <span className={`text-xs font-bold relative z-10 ${isActive ? "text-white" : "text-neo-black dark:text-white"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
