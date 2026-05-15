"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Package, Users, Tags, ArrowLeft, Shield,
  Plus, Pencil, Trash2, Search, Crown, UserCheck, UserX,
  Image as ImageIcon, BarChart3, TrendingUp,
  Download, X, Star
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { App } from "@/types"
import { toast } from "sonner"
import { generateSlug, formatDate } from "@/lib/utils"

type Tab = "dashboard" | "apps" | "users" | "categories"

const tabs = [
  { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
  { id: "apps" as Tab, label: "Apps", icon: Package },
  { id: "users" as Tab, label: "Users", icon: Users },
  { id: "categories" as Tab, label: "Categories", icon: Tags },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        window.location.href = "/auth/login"
        return
      }
      setUser(authUser)

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", authUser.id)
        .single()

      if (profile?.role !== "admin") {
        window.location.href = "/"
        return
      }
      setIsAdmin(true)
      setChecking(false)
    }
    checkAdmin()
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-neo-gray-light dark:bg-neo-black flex items-center justify-center">
        <div className="neo-card bg-white dark:bg-neo-gray-dark p-8 text-center">
          <div className="w-12 h-12 border-4 border-neo-cyan dark:border-neo-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold">Checking admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-neo-gray-light dark:bg-neo-black">
      <div className="flex">
        <aside className="w-64 bg-white dark:bg-neo-gray-dark border-r-2 border-neo-black min-h-screen p-6 hidden lg:block sticky top-0">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-neo-cyan dark:bg-neo-purple border-2 border-neo-black rounded-lg shadow-neo flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg">NeoStore</span>
          </Link>
          <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-neo-yellow/20 border-2 border-neo-black rounded-lg">
            <Shield className="w-4 h-4 text-neo-yellow-dark" />
            <span className="text-xs font-bold text-neo-yellow-dark">ADMIN PANEL</span>
          </div>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all text-left ${
                    isActive ? "bg-neo-cyan dark:bg-neo-purple text-white border-2 border-neo-black shadow-neo"
                      : "hover:bg-neo-cyan/10 dark:hover:bg-neo-purple/20 border-2 border-transparent"
                  }`}>
                  <Icon className="w-5 h-5" /> {tab.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neo-gray-dark border-b-2 border-neo-black p-2 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 neo-button px-3 py-2 text-xs font-bold flex items-center gap-1 ${
                  activeTab === tab.id ? "bg-neo-cyan dark:bg-neo-purple text-white" : "bg-white dark:bg-neo-gray-dark"
                }`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            )
          })}
        </div>

        <main className="flex-1 p-6 lg:p-8 lg:pt-8 pt-20">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === "dashboard" && <DashboardTab />}
              {activeTab === "apps" && <AppsTab />}
              {activeTab === "users" && <UsersTab />}
              {activeTab === "categories" && <CategoriesTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function DashboardTab() {
  const [stats, setStats] = useState({ apps: 0, users: 0, downloads: 0, vip: 0 })
  const [recentDownloads, setRecentDownloads] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const { count: apps } = await supabase.from("apps").select("*", { count: "exact", head: true })
      const { count: users } = await supabase.from("users").select("*", { count: "exact", head: true })
      const { count: downloads } = await supabase.from("downloads").select("*", { count: "exact", head: true })
      const { count: vip } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("is_vip", true)
      setStats({ apps: apps || 0, users: users || 0, downloads: downloads || 0, vip: vip || 0 })
      const { data: recent } = await supabase.from("downloads").select("*").order("created_at", { ascending: false }).limit(10)
      setRecentDownloads(recent || [])
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: "Total Apps", value: stats.apps, icon: Package, color: "bg-neo-cyan" },
    { label: "Total Users", value: stats.users, icon: Users, color: "bg-neo-purple" },
    { label: "Downloads", value: stats.downloads, icon: Download, color: "bg-neo-yellow" },
    { label: "VIP Users", value: stats.vip, icon: Crown, color: "bg-green-500" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black flex items-center gap-2"><BarChart3 className="w-8 h-8 text-neo-cyan dark:text-neo-purple" /> Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="neo-card bg-white dark:bg-neo-gray-dark p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} border-2 border-neo-black rounded-lg flex items-center justify-center shadow-neo`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-black">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          )
        })}
      </div>
      <div className="neo-card bg-white dark:bg-neo-gray-dark p-6">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2"><Download className="w-5 h-5 text-neo-cyan dark:text-neo-purple" /> Recent Downloads</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b-2 border-neo-black"><th className="text-left py-2 text-xs font-black">App</th><th className="text-left py-2 text-xs font-black">Date</th><th className="text-left py-2 text-xs font-black">Type</th></tr></thead>
            <tbody>
              {recentDownloads.map((dl) => (
                <tr key={dl.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 text-sm font-bold">{dl.app_name}</td>
                  <td className="py-2 text-xs text-gray-500">{formatDate(dl.created_at)}</td>
                  <td className="py-2">{dl.is_vip ? <span className="neo-badge bg-neo-yellow text-xs">VIP</span> : <span className="text-xs text-gray-500">Free</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AppsTab() {
  const [apps, setApps] = useState<<App[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingApp, setEditingApp] = useState<<App | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  const emptyApp: Partial<<App> = {
    name: "", slug: "", version: "", developer: "",
    mod_feature: "", mod_feature_full: "", description: "",
    package_name: "", size: "", free_url: "", vip_url: "",
    category_id: "", icon_url: "", screenshots: [], is_recommended: false,
    rating: 4.5, download_count: 0,
  }
  const [formData, setFormData] = useState<<Partial<<App>>(emptyApp)

  useEffect(() => { fetchApps(); fetchCategories() }, [])

  const fetchApps = async () => {
    const { data, error } = await supabase.from("apps").select("*").order("created_at", { ascending: false })
    if (error) { toast.error("Failed to load apps: " + error.message); return }
    setApps(data || [])
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*")
    setCategories(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = formData.slug || generateSlug(formData.name || "")
    const dataToSend = { ...formData, slug }

    if (editingApp) {
      const { error } = await supabase.from("apps").update(dataToSend).eq("id", editingApp.id)
      if (error) { toast.error("Failed to update: " + error.message); return }
      toast.success("App updated!")
    } else {
      const { error } = await supabase.from("apps").insert(dataToSend)
      if (error) { toast.error("Failed to create: " + error.message); return }
      toast.success("App created!")
    }
    setShowModal(false); setEditingApp(null); setFormData(emptyApp); fetchApps()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this app?")) return
    const { error } = await supabase.from("apps").delete().eq("id", id)
    if (error) { toast.error("Failed to delete: " + error.message); return }
    toast.success("App deleted!"); fetchApps()
  }

  const toggleRecommended = async (app: App) => {
    const { error } = await supabase.from("apps").update({ is_recommended: !app.is_recommended }).eq("id", app.id)
    if (error) { toast.error("Failed to update: " + error.message); return }
    toast.success(app.is_recommended ? "Removed from recommendations" : "Added to recommendations!")
    fetchApps()
  }

  const openEdit = (app: App) => { setEditingApp(app); setFormData(app); setShowModal(true) }
  const openCreate = () => { setEditingApp(null); setFormData(emptyApp); setShowModal(true) }
  const filtered = apps.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black flex items-center gap-2"><Package className="w-8 h-8 text-neo-cyan dark:text-neo-purple" /> Manage Apps</h1>
        <motion.button whileTap={{ scale: 0.95 }} onClick={openCreate} className="neo-button px-4 py-2 bg-neo-cyan dark:bg-neo-purple text-white font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add App</motion.button>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search apps..." className="neo-input w-full pl-12 pr-4 py-3" />
      </div>
      <div className="neo-card bg-white dark:bg-neo-gray-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neo-black bg-neo-gray-light dark:bg-neo-gray-dark">
                <th className="text-left px-4 py-3 font-black text-sm">App</th>
                <th className="text-left px-4 py-3 font-black text-sm hidden md:table-cell">Version</th>
                <th className="text-left px-4 py-3 font-black text-sm hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-black text-sm">Rec</th>
                <th className="text-left px-4 py-3 font-black text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-neo-cyan/5 dark:hover:bg-neo-purple/10">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neo-cyan/20 rounded-lg border border-neo-black flex items-center justify-center">
                        {app.icon_url ? <img src={app.icon_url} alt="" className="w-full h-full rounded-lg object-cover" /> : <ImageIcon className="w-4 h-4" />}
                      </div>
                      <div><p className="font-bold text-sm">{app.name}</p><p className="text-xs text-gray-500">{app.developer}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{app.version}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{categories.find((c) => c.id === app.category_id)?.name || "-"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleRecommended(app)} className={`neo-button p-1.5 ${app.is_recommended ? "bg-neo-yellow text-neo-black" : "bg-gray-200 text-gray-500"}`} title={app.is_recommended ? "Remove from recommendation" : "Add to recommendation"}>
                      <Star className={`w-4 h-4 ${app.is_recommended ? "fill-current" : ""}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(app)} className="neo-button p-2 bg-neo-yellow text-neo-black"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(app.id)} className="neo-button p-2 bg-red-500 text-white"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="neo-card bg-white dark:bg-neo-gray-dark p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">{editingApp ? "Edit App" : "Add New App"}</h2>
              <button onClick={() => setShowModal(false)} className="neo-button p-2"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block font-bold text-sm mb-1">Name *</label><input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="App Name" /></div>
                <div><label className="block font-bold text-sm mb-1">Slug</label><input value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="auto-generated" /></div>
                <div><label className="block font-bold text-sm mb-1">Version *</label><input required value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="1.0.0" /></div>
                <div><label className="block font-bold text-sm mb-1">Developer *</label><input required value={formData.developer} onChange={(e) => setFormData({ ...formData, developer: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="Developer Name" /></div>
                <div><label className="block font-bold text-sm mb-1">Category</label><select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="neo-input w-full px-3 py-2"><option value="">Select Category</option>{categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}</select></div>
                <div><label className="block font-bold text-sm mb-1">Package Name</label><input value={formData.package_name || ""} onChange={(e) => setFormData({ ...formData, package_name: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="com.example.app" /></div>
                <div><label className="block font-bold text-sm mb-1">Size</label><input value={formData.size || ""} onChange={(e) => setFormData({ ...formData, size: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="50 MB" /></div>
                <div><label className="block font-bold text-sm mb-1">Icon URL</label><input value={formData.icon_url || ""} onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="https://..." /></div>
                <div>
                  <label className="block font-bold text-sm mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-neo-yellow fill-neo-yellow" /> Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating ?? 4.5}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="4.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1 flex items-center gap-1">
                    <Download className="w-3 h-3 text-neo-cyan" /> Download Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.download_count ?? 0}
                    onChange={(e) => setFormData({ ...formData, download_count: parseInt(e.target.value) })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="0"
                  />
                </div>
              </div>
              <div><label className="block font-bold text-sm mb-1">Mod Feature (Short)</label><input value={formData.mod_feature || ""} onChange={(e) => setFormData({ ...formData, mod_feature: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="Unlimited Money" /></div>
                <div><label className="block font-bold text-sm mb-1">Mod Feature (Full)</label><input value={formData.mod_feature_full || ""} onChange={(e) => setFormData({ ...formData, mod_feature_full: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="Full mod description" /></div>
              <div><label className="block font-bold text-sm mb-1">Description</label><textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="neo-input w-full px-3 py-2" placeholder="App description..." /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block font-bold text-sm mb-1">Free Download URL</label><input value={formData.free_url || ""} onChange={(e) => setFormData({ ...formData, free_url: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="https://..." /></div>
                <div><label className="block font-bold text-sm mb-1">VIP Download URL</label><input value={formData.vip_url || ""} onChange={(e) => setFormData({ ...formData, vip_url: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="https://..." /></div>
              </div>
              <div className="flex items-center gap-3 p-3 border-2 border-neo-black rounded-lg bg-neo-gray-light dark:bg-neo-gray-dark">
                <input type="checkbox" id="is_recommended" checked={formData.is_recommended || false} onChange={(e) => setFormData({ ...formData, is_recommended: e.target.checked })} className="w-5 h-5 border-2 border-neo-black rounded cursor-pointer" />
                <label htmlFor="is_recommended" className="font-bold text-sm cursor-pointer flex items-center gap-2"><Star className="w-4 h-4 text-neo-yellow" /> Show in Recommendations</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="neo-button flex-1 py-2 bg-gray-200 font-bold">Cancel</button>
                <button type="submit" className="neo-button flex-1 py-2 bg-neo-cyan dark:bg-neo-purple text-white font-bold">{editingApp ? "Update" : "Create"}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
    if (error) { toast.error("Failed to load users: " + error.message); return }
    setUsers(data || [])
  }

  const toggleVip = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("users").update({ is_vip: !currentStatus, vip_expires_at: !currentStatus ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null }).eq("id", id)
    if (error) { toast.error("Failed to toggle VIP: " + error.message); return }
    toast.success(`VIP ${!currentStatus ? "activated" : "deactivated"}!`); fetchUsers()
  }

  const toggleAdmin = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin"
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", id)
    if (error) { toast.error("Failed to toggle admin: " + error.message); return }
    toast.success(`Role updated to ${newRole}!`); fetchUsers()
  }

  const filtered = users.filter((u) => u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || u.username?.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black flex items-center gap-2"><Users className="w-8 h-8 text-neo-cyan dark:text-neo-purple" /> Manage Users</h1>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search users..." className="neo-input w-full pl-12 pr-4 py-3" />
      </div>
      <div className="neo-card bg-white dark:bg-neo-gray-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b-2 border-neo-black bg-neo-gray-light dark:bg-neo-gray-dark"><th className="text-left px-4 py-3 font-black text-sm">User</th><th className="text-left px-4 py-3 font-black text-sm">Role</th><th className="text-left px-4 py-3 font-black text-sm">VIP</th><th className="text-left px-4 py-3 font-black text-sm">Actions</th></tr></thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-neo-cyan/5 dark:hover:bg-neo-purple/10">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-neo-cyan/20 rounded-full border-2 border-neo-black flex items-center justify-center"><span className="font-bold text-sm">{user.username?.charAt(0)?.toUpperCase() || "U"}</span></div><div><p className="font-bold text-sm">{user.username || "-"}</p><p className="text-xs text-gray-500">{user.email}</p></div></div></td>
                  <td className="px-4 py-3"><span className={`neo-badge text-xs ${user.role === "admin" ? "bg-neo-purple text-white" : "bg-gray-200"}`}>{user.role}</span></td>
                  <td className="px-4 py-3">{user.is_vip ? <span className="neo-badge bg-neo-yellow text-neo-black text-xs flex items-center gap-1"><Crown className="w-3 h-3" /> VIP</span> : <span className="text-xs text-gray-500">Free</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleVip(user.id, user.is_vip)} className={`neo-button px-3 py-1.5 text-xs font-bold flex items-center gap-1 ${user.is_vip ? "bg-red-500 text-white" : "bg-neo-yellow text-neo-black"}`}>{user.is_vip ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}{user.is_vip ? "Remove VIP" : "Make VIP"}</motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAdmin(user.id, user.role)} className={`neo-button px-3 py-1.5 text-xs font-bold flex items-center gap-1 ${user.role === "admin" ? "bg-orange-500 text-white" : "bg-neo-cyan text-white"}`}><Shield className="w-3 h-3" />{user.role === "admin" ? "Remove Admin" : "Make Admin"}</motion.button>
                    </div>
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

function CategoriesTab() {
  const [categories, setCategories] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCat, setEditingCat] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "", slug: "", icon: "", color: "#06b6d4" })
  const supabase = createClient()

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("name")
    if (error) { toast.error("Failed to load categories: " + error.message); return }
    setCategories(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCat) {
      const { error } = await supabase.from("categories").update(formData).eq("id", editingCat.id)
      if (error) { toast.error("Failed to update: " + error.message); return }
      toast.success("Category updated!")
    } else {
      const { error } = await supabase.from("categories").insert({ ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, "-") })
      if (error) { toast.error("Failed to create: " + error.message); return }
      toast.success("Category created!")
    }
    setShowModal(false); setEditingCat(null); setFormData({ name: "", slug: "", icon: "", color: "#06b6d4" }); fetchCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    const { error } = await supabase.from("categories").delete().eq("id", id)
    if (error) { toast.error("Failed to delete: " + error.message); return }
    toast.success("Category deleted!"); fetchCategories()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black flex items-center gap-2"><Tags className="w-8 h-8 text-neo-cyan dark:text-neo-purple" /> Manage Categories</h1>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setEditingCat(null); setFormData({ name: "", slug: "", icon: "", color: "#06b6d4" }); setShowModal(true) }} className="neo-button px-4 py-2 bg-neo-cyan dark:bg-neo-purple text-white font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</motion.button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <motion.div key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neo-card bg-white dark:bg-neo-gray-dark p-4">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg border-2 border-neo-black flex items-center justify-center" style={{ backgroundColor: cat.color }}><span className="text-white font-bold text-sm">{cat.name.charAt(0)}</span></div><div><p className="font-bold">{cat.name}</p><p className="text-xs text-gray-500">{cat.slug}</p></div></div>
            <div className="flex gap-2"><button onClick={() => { setEditingCat(cat); setFormData(cat); setShowModal(true) }} className="neo-button p-2 bg-neo-yellow text-neo-black flex-1 flex items-center justify-center gap-1 text-xs font-bold"><Pencil className="w-3 h-3" /> Edit</button><button onClick={() => handleDelete(cat.id)} className="neo-button p-2 bg-red-500 text-white flex-1 flex items-center justify-center gap-1 text-xs font-bold"><Trash2 className="w-3 h-3" /> Delete</button></div>
          </motion.div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="neo-card bg-white dark:bg-neo-gray-dark p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-black">{editingCat ? "Edit" : "Add"} Category</h2><button onClick={() => setShowModal(false)} className="neo-button p-2"><X className="w-4 h-4" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block font-bold text-sm mb-1">Name</label><input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="neo-input w-full px-3 py-2" /></div>
              <div><label className="block font-bold text-sm mb-1">Icon (lucide name)</label><input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="neo-input w-full px-3 py-2" placeholder="gamepad2" /></div>
              <div><label className="block font-bold text-sm mb-1">Color</label><div className="flex gap-2"><input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-12 h-10 border-2 border-neo-black rounded-lg cursor-pointer" /><input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="neo-input flex-1 px-3 py-2" /></div></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={() => setShowModal(false)} className="neo-button flex-1 py-2 bg-gray-200 font-bold">Cancel</button><button type="submit" className="neo-button flex-1 py-2 bg-neo-cyan dark:bg-neo-purple text-white font-bold">Save</button></div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
                                      }
        
