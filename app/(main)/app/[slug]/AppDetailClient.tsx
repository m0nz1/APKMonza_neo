"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Download, Share2, Star, Calendar, Package, HardDrive, Crown, ArrowLeft, ChevronRight } from "lucide-react"
import { App } from "@/types"
import { formatDate } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { AppCard } from "@/components/ui/AppCard"
import { toast } from "sonner"

interface Props {
  app: App
  relatedApps: App[]
}

export function AppDetailClient({ app, relatedApps }: Props) {
  const [user, setUser] = useState<any>(null)
  const [isVip, setIsVip] = useState(false)
  const [showVipModal, setShowVipModal] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from("users").select("is_vip").eq("id", user.id).single()
        setIsVip(data?.is_vip || false)
      }
    }
    getUser()
  }, [])

  const handleDownload = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu")
      return
    }

    const downloadUrl = isVip && app.vip_url ? app.vip_url : app.free_url

    if (!downloadUrl) {
      toast.error("Link download tidak tersedia")
      return
    }

    if (app.vip_url && !isVip) {
      setShowVipModal(true)
      return
    }

    // Record download
    await supabase.from("downloads").insert({
      user_id: user.id,
      app_id: app.id,
      app_name: app.name,
      download_url: downloadUrl,
      is_vip: isVip,
    })

    // Open download
    window.open(downloadUrl, "_blank")
    toast.success("Download dimulai!")
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold hover:text-neo-cyan dark:hover:text-neo-purple transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neo-card bg-white dark:bg-neo-gray-dark p-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Icon */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="w-28 h-28 bg-neo-cyan/20 dark:bg-neo-purple/20 border-3 border-neo-black rounded-2xl flex items-center justify-center overflow-hidden shadow-neo">
              {app.icon_url ? (
                <Image src={app.icon_url} alt={app.name} width={112} height={112} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-neo-cyan dark:text-neo-purple">{app.name.charAt(0)}</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black mb-1">{app.name}</h1>
            <p className="text-neo-cyan dark:text-neo-purple font-bold mb-2">v{app.version}</p>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-3">{app.developer}</p>

            {app.mod_feature_full && (
              <div className="inline-block neo-badge bg-neo-yellow text-neo-black mb-4">
                {app.mod_feature_full}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-neo-yellow text-neo-yellow" />
                {app.rating || "4.5"}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {(app.download_count || 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-4 h-4" />
                {app.size}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 md:min-w-[200px]">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="neo-button px-6 py-4 bg-neo-cyan dark:bg-neo-purple text-white font-black text-lg flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </motion.button>

            {app.vip_url && (
              <div className="flex items-center justify-center gap-1 text-sm">
                <Crown className="w-4 h-4 text-neo-yellow" />
                <span className="text-neo-yellow font-bold">VIP</span>
                <span className="text-gray-500">available</span>
              </div>
            )}

            <button className="neo-button px-4 py-2 bg-white dark:bg-neo-gray-dark text-sm flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </motion.div>

      {/* Screenshots */}
      {app.screenshots && app.screenshots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="neo-card bg-white dark:bg-neo-gray-dark p-6"
        >
          <h2 className="text-xl font-black mb-4">Screenshots</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {app.screenshots.map((screenshot, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-48 h-80 rounded-xl border-3 overflow-hidden transition-all ${
                  activeImage === i ? "border-neo-cyan dark:border-neo-purple shadow-neo-cyan" : "border-neo-black"
                }`}
              >
                <Image src={screenshot} alt={`Screenshot ${i + 1}`} width={192} height={320} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="neo-card bg-white dark:bg-neo-gray-dark p-6"
      >
        <h2 className="text-xl font-black mb-4">Deskripsi</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{app.description}</p>
        </div>
      </motion.div>

      {/* Info Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="neo-card bg-white dark:bg-neo-gray-dark p-6"
      >
        <h2 className="text-xl font-black mb-4">Informasi</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoItem icon={<Package className="w-5 h-5" />} label="Package" value={app.package_name} />
          <InfoItem icon={<HardDrive className="w-5 h-5" />} label="Size" value={app.size} />
          <InfoItem icon={<Calendar className="w-5 h-5" />} label="Updated" value={formatDate(app.upload_date)} />
          <InfoItem icon={<ChevronRight className="w-5 h-5" />} label="Version" value={app.version} />
        </div>
      </motion.div>

      {/* Related Apps */}
      {relatedApps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-black mb-4">Aplikasi Serupa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedApps.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* VIP Modal */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="neo-card bg-white dark:bg-neo-gray-dark p-8 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-neo-yellow/20 border-2 border-neo-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-neo-yellow" />
            </div>
            <h2 className="text-2xl font-black mb-2">Upgrade ke VIP</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Download link VIP dengan kecepatan tinggi dan tanpa iklan. Upgrade sekarang!
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowVipModal(false)}
                className="flex-1 neo-button px-4 py-3 bg-gray-200 text-sm font-bold"
              >
                Nanti
              </button>
              <button 
                onClick={() => {
                  setShowVipModal(false)
                  toast.info("Fitur upgrade VIP segera hadir!")
                }}
                className="flex-1 neo-button px-4 py-3 bg-neo-yellow text-neo-black text-sm font-bold"
              >
                Upgrade VIP
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 border-2 border-neo-black rounded-lg bg-neo-gray-light dark:bg-neo-gray-dark">
      <div className="text-neo-cyan dark:text-neo-purple mb-1">{icon}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-bold text-sm truncate">{value}</p>
    </div>
  )
}
