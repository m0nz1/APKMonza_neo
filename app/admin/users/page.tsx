"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Crown, Search, UserCheck, UserX } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  const toggleVip = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("users")
      .update({ is_vip: !currentStatus, vip_expires_at: !currentStatus ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null })
      .eq("id", id)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(`VIP ${!currentStatus ? "activated" : "deactivated"}!`)
    fetchUsers()
  }

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Manage Users</h1>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="neo-input w-full pl-12 pr-4 py-3"
        />
      </div>

      <div className="neo-card bg-white dark:bg-neo-gray-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neo-black bg-neo-gray-light dark:bg-neo-gray-dark">
                <th className="text-left px-4 py-3 font-black text-sm">User</th>
                <th className="text-left px-4 py-3 font-black text-sm">Role</th>
                <th className="text-left px-4 py-3 font-black text-sm">VIP</th>
                <th className="text-left px-4 py-3 font-black text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-neo-cyan/5 dark:hover:bg-neo-purple/10">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-sm">{user.username || "-"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`neo-badge text-xs ${user.role === "admin" ? "bg-neo-purple text-white" : "bg-gray-200"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.is_vip ? (
                      <span className="neo-badge bg-neo-yellow text-neo-black text-xs flex items-center gap-1">
                        <Crown className="w-3 h-3" /> VIP
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Free</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleVip(user.id, user.is_vip)}
                      className={`neo-button px-3 py-1.5 text-xs font-bold flex items-center gap-1 ${
                        user.is_vip ? "bg-red-500 text-white" : "bg-neo-yellow text-neo-black"
                      }`}
                    >
                      {user.is_vip ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      {user.is_vip ? "Remove VIP" : "Make VIP"}
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
