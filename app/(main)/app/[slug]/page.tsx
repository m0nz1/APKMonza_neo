import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { App } from "@/types"
import { Metadata } from "next"
import { AppDetailClient } from "./AppDetailClient"

interface Props {
  params: { slug: string }
}

async function getApp(slug: string): Promise<App | null> {
  const supabase = createClient()
  const { data } = await supabase.from("apps").select("*, categories(name)").eq("slug", slug).single()
  return data
}

async function getRelatedApps(categoryId: string, currentId: string): Promise<App[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("apps")
    .select("*")
    .eq("category_id", categoryId)
    .neq("id", currentId)
    .limit(6)
  return data || []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = await getApp(params.slug)
  if (!app) return { title: "Not Found" }

  return {
    title: `${app.name} v${app.version} - Download APK`,
    description: app.description.slice(0, 160),
    openGraph: {
      images: app.icon_url ? [app.icon_url] : [],
    },
  }
}

export default async function AppDetailPage({ params }: Props) {
  const app = await getApp(params.slug)
  if (!app) notFound()

  const relatedApps = await getRelatedApps(app.category_id, app.id)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <AppDetailClient app={app} relatedApps={relatedApps} />
    </main>
  )
}
