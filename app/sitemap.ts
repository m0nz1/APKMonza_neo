import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const { data: apps } = await supabase.from("apps").select("slug, updated_at")

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://neostore.vercel.app"

  const routes = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/search`, lastModified: new Date() },
    { url: `${baseUrl}/auth/login`, lastModified: new Date() },
    { url: `${baseUrl}/auth/register`, lastModified: new Date() },
  ]

  const appRoutes = (apps || []).map((app) => ({
    url: `${baseUrl}/app/${app.slug}`,
    lastModified: app.updated_at ? new Date(app.updated_at) : new Date(),
  }))

  return [...routes, ...appRoutes]
}
