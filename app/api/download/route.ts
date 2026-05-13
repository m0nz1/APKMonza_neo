import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { appId } = await request.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: app } = await supabase.from("apps").select("*").eq("id", appId).single()
  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 })
  }

  const { data: profile } = await supabase.from("users").select("is_vip").eq("id", user.id).single()
  const isVip = profile?.is_vip || false

  const downloadUrl = isVip && app.vip_url ? app.vip_url : app.free_url

  if (!downloadUrl) {
    return NextResponse.json({ error: "Download URL not available" }, { status: 404 })
  }

  await supabase.from("downloads").insert({
    user_id: user.id,
    app_id: app.id,
    app_name: app.name,
    download_url: downloadUrl,
    is_vip: isVip,
  })

  return NextResponse.json({ downloadUrl, isVip })
}
