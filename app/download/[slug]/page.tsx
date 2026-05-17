"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft, Download, Clock, Shield, AlertTriangle,
  FileDown, Loader2, Crown
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { App } from "@/types"
import { toast } from "sonner"

const TIMER_SECONDS = 15

export default function DownloadPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [app, setApp] = useState<App | null>(null)
  const [loading, setLoading] = useState(true)
  const [timer, setTimer] = useState(TIMER_SECONDS)
  const [canDownload, setCanDownload] = useState(false)
  const [isVip, setIsVip] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const supabase = createClient()

  // Fetch app data and check VIP status
  useEffect(() => {
    const fetchData = async () => {
      // Fetch app by slug
      const { data: appData, error: appError } = await supabase
        .from("apps")
        .select("*")
        .eq("slug", slug)
        .single()

      if (appError || !appData) {
        toast.error("App not found")
        router.push("/")
        return
      }

      setApp(appData)

      // Check if user is VIP
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("is_vip, vip_expires_at")
          .eq("id", user.id)
          .single()

        if (profile) {
          const vipActive = profile.is_vip && new Date(profile.vip_expires_at) > new Date()
          setIsVip(vipActive)

          // VIP users: redirect to direct download immediately
          if (vipActive && appData.vip_url) {
            // Record download
            await supabase.from("downloads").insert({
              app_id: appData.id,
              app_name: appData.name,
              user_id: user.id,
              is_vip: true,
            })

            // Redirect to direct download
            window.location.href = appData.vip_url
            return
          }
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [slug, supabase, router])

  // Countdown timer for non-VIP
  useEffect(() => {
    if (isVip || canDownload || loading || !app) return

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCanDownload(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isVip, canDownload, loading, app])

  const handleDownload = async () => {
    if (!app?.free_url) {
      toast.error("Download link not available")
      return
    }

    setDownloading(true)

    // Record download
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from("downloads").insert({
      app_id: app.id,
      app_name: app.name,
      user_id: user?.id || null,
      is_vip: false,
    })

    // Trigger file download
    const link = document.createElement("a")
    link.href = app.free_url
    link.download = `${app.slug}.apk`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Download started!")
    setDownloading(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neo-gray-light dark:bg-neo-black flex items-center justify-center">
        <div className="neo-card bg-white dark:bg-neo-gray-dark p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-neo-cyan mx-auto mb-4" />
          <p className="font-bold">Loading...</p>
        </div>
      </main>
    )
  }

  if (!app) return null

  return (
    <main className="min-h-screen bg-neo-gray-light dark:bg-neo-black py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Back Button */}
        <Link
          href={`/app/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold hover:text-neo-cyan dark:hover:text-neo-purple transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to App
        </Link>

        {/* App Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-card bg-white dark:bg-neo-gray-dark p-6 border-3 border-neo-black"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-neo-cyan/20 rounded-2xl border-3 border-neo-black flex items-center justify-center overflow-hidden">
              {app.icon_url ? (
                <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
              ) : (
                <FileDown className="w-8 h-8 text-neo-cyan" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black dark:text-white">{app.name}</h1>
              <p className="text-sm text-gray-500 font-medium">{app.developer}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-neo-black dark:text-white">{app.size}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm text-gray-500">v{app.version}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="neo-card bg-white dark:bg-neo-gray-dark p-6 border-3 border-neo-black"
        >
          {/* This page is only for non-VIP users */}
          <div className="text-center space-y-4">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-neo-gray-dark border-2 border-neo-black rounded-full">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="font-black text-sm text-gray-600 dark:text-gray-400">FREE DOWNLOAD</span>
              </div>

              {/* Timer Display */}
              {!canDownload && (
                <div className="py-4">
                  <div className="relative w-32 h-32 mx-auto">
                    {/* Circular Progress */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="42"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        className="dark:stroke-gray-700"
                      />
                      <circle
                        cx="50" cy="50" r="42"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={264}
                        strokeDashoffset={264 * (timer / TIMER_SECONDS)}
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Clock className="w-6 h-6 text-neo-cyan mx-auto mb-1" />
                        <span className="text-3xl font-black text-neo-black dark:text-white">
                          {timer}
                        </span>
                        <span className="text-xs text-gray-500 block">seconds</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mt-3">
                    Please wait while we prepare your download...
                  </p>
                </div>
              )}

              {/* Download Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={!canDownload || downloading}
                className={`
                  neo-button w-full py-4 font-black text-lg flex items-center justify-center gap-3
                  ${canDownload
                    ? "bg-neo-cyan dark:bg-neo-purple text-white"
                    : "bg-gray-200 dark:bg-neo-gray-dark text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {downloading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : canDownload ? (
                  <Download className="w-6 h-6" />
                ) : (
                  <Clock className="w-6 h-6" />
                )}
                {downloading
                  ? "DOWNLOADING..."
                  : canDownload
                    ? `DOWNLOAD APK (${app.size})`
                    : `WAIT ${timer}s`
                }
              </motion.button>

              {/* Upgrade Banner */}
              <Link
                href="/membership"
                className="block neo-card bg-neo-yellow/10 dark:bg-neo-yellow/5 border-2 border-neo-black p-4 hover:bg-neo-yellow/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-neo-yellow flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-sm text-neo-black dark:text-white">
                      Tired of waiting?
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Upgrade to VIP for instant downloads, no ads, and premium support.
                    </p>
                  </div>
                  <ArrowLeft className="w-5 h-5 rotate-180 text-neo-yellow flex-shrink-0" />
                </div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Safety Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="neo-card bg-white dark:bg-neo-gray-dark p-4 border-2 border-neo-black"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-neo-yellow flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-neo-black dark:text-white">
                Download Safety
              </p>
              <p className="text-xs text-gray-500 mt-1">
                All APK files are scanned for malware. If Chrome warns about the file, 
                go to Settings → Privacy & Security → turn off "Safe Browsing" temporarily.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
