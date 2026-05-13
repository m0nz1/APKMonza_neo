"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCat, setEditingCat] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "", slug: "", icon: "", color: "#06b6d4" })
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name")
    setCategories(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCat) {
      await supabase.from("categories").update(formData).eq("id", editingCat.id)
      toast.success("Category updated!")
    } else {
      await supabase.from("categories").insert({ ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, "-") })
      toast.success("Category created!")
    }

    setShowModal(false)
    setEditingCat(null)
    setFormData({ name: "", slug: "", icon: "", color: "#06b6d4" })
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return
    await supabase.from("categories").delete().eq("id", id)
    toast.success("Category deleted!")
    fetchCategories()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Manage Categories</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setEditingCat(null); setFormData({ name: "", slug: "", icon: "", color: "#06b6d4" }); setShowModal(true) }}
          className="neo-button px-4 py-2 bg-neo-cyan dark:bg-neo-purple text-white font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="neo-card bg-white dark:bg-neo-gray-dark p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg border-2 border-neo-black flex items-center justify-center"
                style={{ backgroundColor: cat.color }}
              >
                <span className="text-white font-bold text-sm">{cat.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-bold">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat.slug}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingCat(cat); setFormData(cat); setShowModal(true) }}
                className="neo-button p-2 bg-neo-yellow text-neo-black flex-1 flex items-center justify-center gap-1 text-xs font-bold"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="neo-button p-2 bg-red-500 text-white flex-1 flex items-center justify-center gap-1 text-xs font-bold"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="neo-card bg-white dark:bg-neo-gray-dark p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-black mb-4">{editingCat ? "Edit" : "Add"} Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-sm mb-1">Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="neo-input w-full px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">Icon (lucide name)</label>
                <input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="neo-input w-full px-3 py-2"
                  placeholder="gamepad2"
                />
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 border-2 border-neo-black rounded-lg cursor-pointer"
                  />
                  <input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="neo-input flex-1 px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="neo-button flex-1 py-2 bg-gray-200 font-bold">Cancel</button>
                <button type="submit" className="neo-button flex-1 py-2 bg-neo-cyan dark:bg-neo-purple text-white font-bold">Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
