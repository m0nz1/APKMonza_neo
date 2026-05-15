"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Crown, Check, Zap, MessageCircle, ArrowRight,
  Shield, ArrowLeft, AlertTriangle, Tag,
  Loader2, Star,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { MembershipPlan } from "@/types"

const WHATSAPP_BASE = "https://wa.me/6289696089274?text=Saya%20mau%20berlangganan%20VIP%20di%20APKMonza"

function getAccentClasses(accent: string) {
  switch (accent) {
    case "yellow":
      return {
        bg: "bg-neo-yellow",
        text: "text-neo-black",
        softBg: "bg-neo-yellow/10",
        softText: "text-neo-yellow-dark",
        border: "border-neo-yellow",
      }
    case "purple":
      return {
        bg: "bg-neo-purple",
        text: "text-white",
        softBg: "bg-neo-purple/10",
        softText: "text-neo-purple",
        border: "border-neo-purple",
      }
    case "cyan":
    default:
      return {
        bg: "bg-neo-cyan",
        text: "text-white",
        softBg: "bg-neo-cyan/10",
        softText: "text-neo-cyan",
        border: "border-neo-cyan",
      }
  }
}

export default function MembershipPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      if (error) {
        console.error("Error fetching plans:", error)
      } else {
        setPlans(data || [])
      }
      setLoading(false)
    }

    fetchPlans()
  }, [supabase])

  const handleWhatsAppClick = (plan: MembershipPlan) => {
    const planText = encodeURIComponent(` — Plan: ${plan.name}`)
    window.open(`${WHATSAPP_BASE}${planText}`, "_blank")
  }

  if (loading) {
    return (
      <main className="w-full max-w-5xl mx-auto py-6 px-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl border-2 border-neo-black" />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="w-full max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold hover:text-neo-cyan dark:hover:text-neo-purple transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-yellow/20 border-2 border-neo-black rounded-full">
          <Crown className="w-5 h-5 text-neo-yellow" />
          <span className="font-black text-sm">UPGRADE YOUR EXPERIENCE</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-neo-black dark:text-white">
          Choose Your <span className="text-neo-cyan dark:text-neo-purple">Plan</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium max-w-lg mx-auto">
          Get direct download links, VIP badge, and premium support. No more annoying redirects.
        </p>
      </motion.div>

      {/* Horizontal Plans List */}
      <div className="space-y-4">
        {plans.map((plan, index) => {
          const accent = getAccentClasses(plan.accent)
          const hasDiscount = plan.discount_percent && plan.discount_percent > 0
          const isFree = plan.is_free

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`
                relative neo-card p-5 flex flex-col md:flex-row items-start md:items-center gap-4
                ${isFree
                  ? "bg-white dark:bg-neo-gray-dark border-dashed border-2 border-gray-300 dark:border-gray-600"
                  : "bg-white dark:bg-neo-gray-dark border-3 border-neo-black"
                }
                ${plan.popular && !isFree ? "shadow-neo-lg" : "shadow-neo"}
                ${hoveredPlan === plan.id && !isFree ? "-translate-y-1 md:translate-x-1" : ""}
                transition-all duration-200
              `}
            >
              {/* Popular Badge - top right */}
              {plan.popular && (
                <div className={`absolute -top-3 right-4 px-3 py-1 ${accent.bg} border-2 border-neo-black rounded-full`}>
                  <span className={`text-xs font-black ${accent.text} flex items-center gap-1`}>
                    <Zap className="w-3 h-3" /> MOST POPULAR
                  </span>
                </div>
              )}

              {/* Info Gangguan - full width top */}
              {plan.info_gangguan && (
                <div className="w-full mb-1 p-2 bg-red-100 dark:bg-red-900/20 border-2 border-red-400 rounded-lg flex items-center gap-2 md:hidden">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">{plan.info_gangguan}</span>
                </div>
              )}

              {/* Left: Icon */}
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 ${accent.softBg} border-3 border-neo-black rounded-2xl flex items-center justify-center`}>
                  {isFree ? (
                    <Shield className={`w-8 h-8 ${accent.softText}`} />
                  ) : (
                    <Crown className={`w-8 h-8 ${accent.softText}`} />
                  )}
                </div>
              </div>

              {/* Middle: Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-xl font-black dark:text-white">{plan.name}</h3>
                  {plan.info_gangguan && (
                    <span className="hidden md:inline-flex px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-full border border-red-400 items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {plan.info_gangguan}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">{plan.description}</p>

                {/* Features inline */}
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {plan.features.map((feature, i) => (
                    <span key={i} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 font-medium">
                      <Check className={`w-3 h-3 ${accent.softText}`} /> {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Price + CTA */}
              <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 w-full md:w-auto">
                {/* Price */}
                <div className="text-left md:text-right">
                  {hasDiscount && plan.original_price && (
                    <div className="flex items-center gap-2 md:justify-end">
                      <span className="text-sm text-gray-400 line-through font-bold">{plan.original_price}</span>
                      <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-black rounded-full border border-red-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> -{plan.discount_percent}%
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-neo-black dark:text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWhatsAppClick(plan)}
                  className={`
                    neo-button px-5 py-3 font-black text-sm flex items-center gap-2 whitespace-nowrap
                    ${isFree
                      ? "bg-gray-100 dark:bg-neo-gray-dark text-gray-600 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600"
                      : `${accent.bg} ${accent.text} border-2 border-neo-black`
                    }
                  `}
                >
                  {isFree ? (
                    <>
                      <Shield className="w-4 h-4" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      Buy via WA
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Trust Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="neo-card bg-neo-yellow/10 dark:bg-neo-yellow/5 border-2 border-neo-black p-6 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-neo-yellow" />
          <span className="font-black text-neo-black dark:text-white">Secure & Instant Activation</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          After payment confirmation via WhatsApp, your VIP access will be activated within 5 minutes.
        </p>
      </motion.div>
    </main>
  )
}