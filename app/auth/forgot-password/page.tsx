"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, Download } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    setSent(true)
    toast.success("Link reset password telah dikirim ke email Anda!")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-neo-cyan dark:bg-neo-purple border-3 border-neo-black rounded-xl shadow-neo flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black">
          <span className="text-neo-cyan dark:text-neo-purple">Neo</span>
          <span className="text-neo-yellow">Store</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Reset password Anda</p>
      </div>

      <div className="neo-card bg-white dark:bg-neo-gray-dark p-8">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-neo-cyan/20 dark:bg-neo-purple/20 border-2 border-neo-black rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-neo-cyan dark:text-neo-purple" />
            </div>
            <h2 className="text-xl font-bold">Cek Email Anda</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Kami telah mengirimkan link reset password ke {email}
            </p>
            <Link href="/auth/login" className="neo-button inline-block px-6 py-2 bg-neo-cyan dark:bg-neo-purple text-white font-bold">
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-bold text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="neo-input w-full pl-12 pr-4 py-3"
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="neo-button w-full py-3 bg-neo-cyan dark:bg-neo-purple text-white font-black text-lg disabled:opacity-50"
            >
              {loading ? "Loading..." : "Kirim Link Reset"}
            </motion.button>
          </form>
        )}

        <div className="mt-6">
          <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-neo-cyan dark:hover:text-neo-purple transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Login
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
