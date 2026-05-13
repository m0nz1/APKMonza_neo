"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Search, Image as ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { App } from "@/types"
import { toast } from "sonner"
import { generateSlug } from "@/lib/utils"

export default function AdminApps() {
  const [apps, setApps] = useState<App[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingApp, setEditingApp] = useState<App | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  const emptyApp: Partial<App> = {
    name: "",
    slug: "",
    version: "",
    developer: "",
    mod_feature: "",
    mod_feature_full: "",
    description: "",
    package_name: "",
    size: "",
    free_url: "",
    vip_url: "",
    category_id: "",
    icon_url: "",
    screenshots: [],
  }

  const [formData, setFormData] = useState<Partial<App>>(emptyApp)

  useEffect(() => {
    fetchApps()
    fetchCategories()
  }, [])

  const fetchApps = async () => {
    const { data } = await supabase.from("apps").select("*").order("created_at", { ascending: false })
    setApps(data || [])
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*")
    setCategories(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const slug = formData.slug || generateSlug(formData.name || "")
    const data = { ...formData, slug }

    if (editingApp) {
      const { error } = await supabase.from("apps").update(data).eq("id", editingApp.id)
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("App updated!")
    } else {
      const { error } = await supabase.from("apps").insert(data)
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("App created!")
    }

    setShowModal(false)
    setEditingApp(null)
    setFormData(emptyApp)
    fetchApps()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus app ini?")) return
    const { error } = await supabase.from("apps").delete().eq("id", id)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("App deleted!")
    fetchApps()
  }

  const openEdit = (app: App) => {
    setEditingApp(app)
    setFormData(app)
    setShowModal(true)
  }

  const openCreate = () => {
    setEditingApp(null)
    setFormData(emptyApp)
    setShowModal(true)
  }

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Manage Apps</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={openCreate}
          className="neo-button px-4 py-2 bg-neo-cyan dark:bg-neo-purple text-white font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add App
        </motion.button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search apps..."
          className="neo-input w-full pl-12 pr-4 py-3"
        />
      </div>

      <div className="neo-card bg-white dark:bg-neo-gray-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neo-black bg-neo-gray-light dark:bg-neo-gray-dark">
                <th className="text-left px-4 py-3 font-black text-sm">App</th>
                <th className="text-left px-4 py-3 font-black text-sm hidden md:table-cell">Version</th>
                <th className="text-left px-4 py-3 font-black text-sm hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-black text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-neo-cyan/5 dark:hover:bg-neo-purple/10">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neo-cyan/20 rounded-lg border border-neo-black flex items-center justify-center">
                        {app.icon_url ? (
                          <img src={app.icon_url} alt="" className="w-full h-full rounded-lg object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.developer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{app.version}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">
                    {categories.find((c) => c.id === app.category_id)?.name || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(app)}
                        className="neo-button p-2 bg-neo-yellow text-neo-black"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="neo-button p-2 bg-red-500 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="neo-card bg-white dark:bg-neo-gray-dark p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-black mb-6">
              {editingApp ? "Edit App" : "Add New App"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm mb-1">Name *</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="App Name"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">Slug</label>
                  <input
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="auto-generated"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">Version *</label>
                  <input
                    required
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="1.0.0"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">Developer *</label>
                  <input
                    required
                    value={formData.developer}
                    onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="Developer Name"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="neo-input w-full px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">Package Name</label>
                  <input
                    value={formData.package_name || ""}
                    onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="com.example.app"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">Size</label>
                  <input
                    value={formData.size || ""}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="50 MB"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">Icon URL</label>
                  <input
                    value={formData.icon_url || ""}
                    onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm mb-1">Mod Feature (Short)</label>
                <input
                  value={formData.mod_feature || ""}
                  onChange={(e) => setFormData({ ...formData, mod_feature: e.target.value })}
                  className="neo-input w-full px-3 py-2"
                  placeholder="Unlimited Money"
                />
              </div>

              <div>
                <label className="block font-bold text-sm mb-1">Mod Feature (Full)</label>
                <input
                  value={formData.mod_feature_full || ""}
                  onChange={(e) => setFormData({ ...formData, mod_feature_full: e.target.value })}
                  className="neo-input w-full px-3 py-2"
                  placeholder="Full mod description"
                />
              </div>

              <div>
                <label className="block font-bold text-sm mb-1">Description</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="neo-input w-full px-3 py-2"
                  placeholder="App description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm mb-1">Free Download URL</label>
                  <input
                    value={formData.free_url || ""}
                    onChange={(e) => setFormData({ ...formData, free_url: e.target.value })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">VIP Download URL</label>
                  <input
                    value={formData.vip_url || ""}
                    onChange={(e) => setFormData({ ...formData, vip_url: e.target.value })}
                    className="neo-input w-full px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="neo-button flex-1 py-2 bg-gray-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neo-button flex-1 py-2 bg-neo-cyan dark:bg-neo-purple text-white font-bold"
                >
                  {editingApp ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
