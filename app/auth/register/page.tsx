"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, User, Download } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    })

    if (error) {
      setLoading(false)
      toast.error(error.message)
      return
    }

    if (data.user) {
      // Create user profile
      await supabase.from("users").insert({
        id: data.user.id,
        email,
        username,
        is_vip: false,
        role: "user",
      })
    }

    setLoading(false)
    toast.success("Registration successful! Please check your email for verification.")
    router.push("/auth/login")
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
          <span className="text-neo-cyan dark:text-neo-purple">APK</span>
          <span className="text-neo-yellow">Monza</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Create a new account</p>
      </div>

      <div className="neo-card bg-white dark:bg-neo-gray-dark p-8">
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block font-bold text-sm mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
                className="neo-input w-full pl-12 pr-4 py-3"
              />
            </div>
          </div>

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
                placeholder="Min. 6 characters"
                required
                minLength={6}
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

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="neo-button w-full py-3 bg-neo-cyan dark:bg-neo-purple text-white font-black text-lg disabled:opacity-50"
          >
            {loading ? "Loading..." : "Register"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-neo-cyan dark:text-neo-purple font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
