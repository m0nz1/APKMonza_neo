import { createClient } from "@/lib/supabase/server"
import { Package, Users, Download, Crown } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = createClient()

  const { count: appsCount } = await supabase.from("apps").select("*", { count: "exact", head: true })
  const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })
  const { count: downloadsCount } = await supabase.from("downloads").select("*", { count: "exact", head: true })
  const { count: vipCount } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("is_vip", true)

  const stats = [
    { label: "Total Apps", value: appsCount || 0, icon: Package, color: "bg-neo-cyan" },
    { label: "Total Users", value: usersCount || 0, icon: Users, color: "bg-neo-purple" },
    { label: "Downloads", value: downloadsCount || 0, icon: Download, color: "bg-neo-yellow" },
    { label: "VIP Users", value: vipCount || 0, icon: Crown, color: "bg-green-500" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="neo-card bg-white dark:bg-neo-gray-dark p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                  <p className="text-3xl font-black mt-1">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} border-2 border-neo-black rounded-xl flex items-center justify-center shadow-neo`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
