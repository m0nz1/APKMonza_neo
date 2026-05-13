"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { User, Crown, Download, LogOut, Edit3, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [downloads, setDownloads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push("/auth/login")
        return
      }
      setUser(authUser)

      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single()

      setProfile(profileData)
      setUsername(profileData?.username || "")

      const { data: downloadData } = await supabase
        .from("downloads")
        .select("*, apps(name, icon_url)")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(10)

      setDownloads(downloadData || [])
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const handleUpdateProfile = async () => {
    if (!user) return
    const { error } = await supabase
      .from("users")
      .update({ username })
      .eq("id", user.id)

    if (error) {
      toast.error("Gagal update profile")
      return
    }

    setProfile({ ...profile, username })
    setIsEditing(false)
    toast.success("Profile diperbarui!")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neo-gray-light dark:bg-neo-black pb-24 md:pb-0">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="neo-card bg-white dark:bg-neo-gray-dark p-8 animate-pulse">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-neo-black mx-auto mb-4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto" />
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neo-gray-light dark:bg-neo-black pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-card bg-white dark:bg-neo-gray-dark p-6 md:p-8"
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-neo-cyan/20 dark:bg-neo-purple/20 border-3 border-neo-black rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-neo-cyan dark:text-neo-purple" />
                )}
              </div>
              {profile?.is_vip && (
                <div className="absolute -bottom-1 -right-1 bg-neo-yellow border-2 border-neo-black rounded-full p-1.5">
                  <Crown className="w-4 h-4 text-neo-black" />
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="w-full max-w-sm space-y-3">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="neo-input w-full px-4 py-2 text-center"
                  placeholder="Username"
                />
                <div className="flex gap-2 justify-center">
                  <button onClick={handleUpdateProfile} className="neo-button px-4 py-2 bg-neo-cyan dark:bg-neo-purple text-white text-sm">
                    Simpan
                  </button>
                  <button onClick={() => setIsEditing(false)} className="neo-button px-4 py-2 bg-gray-200 text-sm">
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-black mb-1">
                  {profile?.username || user?.email?.split("@")[0]}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{user?.email}</p>

                <div className="flex items-center gap-3 mb-4">
                  {profile?.is_vip ? (
                    <span className="neo-badge bg-neo-yellow text-neo-black flex items-center gap-1">
                      <Crown className="w-3 h-3" /> VIP Active
                    </span>
                  ) : (
                    <span className="neo-badge bg-gray-200 text-gray-600">Free User</span>
                  )}
                  {profile?.role === "admin" && (
                    <span className="neo-badge bg-neo-purple text-white">Admin</span>
                  )}
                </div>

                {profile?.vip_expires_at && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-4">
                    <Calendar className="w-3 h-3" />
                    VIP expires: {formatDate(profile.vip_expires_at)}
                  </p>
                )}

                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="neo-button px-4 py-2 bg-white dark:bg-neo-gray-dark text-sm flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="neo-button px-4 py-2 bg-red-500 text-white text-sm flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Download History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="neo-card bg-white dark:bg-neo-gray-dark p-6"
        >
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-neo-cyan dark:text-neo-purple" />
            Riwayat Download
          </h2>

          {downloads.length > 0 ? (
            <div className="space-y-3">
              {downloads.map((dl) => (
                <div key={dl.id} className="flex items-center gap-3 p-3 border-2 border-neo-black rounded-lg bg-neo-gray-light dark:bg-neo-gray-dark">
                  <div className="w-10 h-10 bg-neo-cyan/20 dark:bg-neo-purple/20 rounded-lg border border-neo-black flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{dl.app_name}</p>
                    <p className="text-xs text-gray-500">{formatDate(dl.created_at)}</p>
                  </div>
                  {dl.is_vip && (
                    <span className="neo-badge bg-neo-yellow text-xs">VIP</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Belum ada riwayat download</p>
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}
