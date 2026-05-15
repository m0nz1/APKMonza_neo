"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

// Panggil ini di layout/root app untuk cek expired VIP setiap load
export function useVipExpiryCheck() {
  const supabase = createClient()

  useEffect(() => {
    const checkExpiry = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("users")
        .select("is_vip, vip_expires_at")
        .eq("id", user.id)
        .single()

      if (!profile?.is_vip || !profile?.vip_expires_at) return

      const expiryDate = new Date(profile.vip_expires_at)
      const now = new Date()

      // Kalau sudah expired
      if (now > expiryDate) {
        await supabase
          .from("users")
          .update({
            is_vip: false,
            vip_plan_id: null,
            vip_expires_at: null,
          })
          .eq("id", user.id)

        // Refresh page biar UI update
        window.location.reload()
      }
    }

    checkExpiry()
    // Cek tiap 1 jam juga
    const interval = setInterval(checkExpiry, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [supabase])
}
