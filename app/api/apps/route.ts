import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const searchParams = request.nextUrl.searchParams

  const page = parseInt(searchParams.get("page") || "0")
  const limit = parseInt(searchParams.get("limit") || "12")
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  let query = supabase
    .from("apps")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (category) {
    query = query.eq("category_id", category)
  }

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ apps: data })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const body = await request.json()

  const { data, error } = await supabase.from("apps").insert(body).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ app: data[0] }, { status: 201 })
}
