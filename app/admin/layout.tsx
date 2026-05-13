import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { LayoutDashboard, Package, Users, Tags, ArrowLeft } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/apps", icon: Package, label: "Apps" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/categories", icon: Tags, label: "Categories" },
  ]

  return (
    <div className="min-h-screen bg-neo-gray-light dark:bg-neo-black">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-neo-gray-dark border-r-2 border-neo-black min-h-screen p-6 hidden lg:block">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-neo-cyan dark:bg-neo-purple border-2 border-neo-black rounded-lg shadow-neo flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg">NeoStore</span>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-bold hover:bg-neo-cyan/10 dark:hover:bg-neo-purple/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
