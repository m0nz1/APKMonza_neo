import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neo-gray-light dark:bg-neo-black pb-24 md:pb-0">
      <Navbar />
      {children}
      <BottomNav />
    </div>
  )
}
