"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, Download, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Login successful!")
    router.push("/profile")
    router.refresh()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md relative"
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => router.back()}
        className="absolute -top-2 -left-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </motion.button>

      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-neo-cyan dark:bg-neo-purple border-3 border-neo-black rounded-xl shadow-neo flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black">
          <span className="text-neo-cyan dark:text-neo-purple">APK</span>
          <span className="text-neo-yellow">Monza</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Login to your account</p>
      </div>

      {/* Form Card */}
      <div className="neo-card bg-white dark:bg-neo-gray-dark p-8">
        <form onSubmit={handleLogin} className="space-y-5">
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

          <div>
            <label className="block font-bold text-sm mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="neo-input w-full pl-12 pr-12 py-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 border-2 border-neo-black rounded" />
              <span>Remember me</span>
            </label>
            <Link href="/auth/forgot-password" className="text-neo-cyan dark:text-neo-purple font-bold hover:underline">
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="neo-button w-full py-3 bg-neo-cyan dark:bg-neo-purple text-white font-black text-lg disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-neo-cyan dark:text-neo-purple font-bold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
