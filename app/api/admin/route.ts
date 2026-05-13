import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const { table, operation, data, id, filter } = await request.json()
    const supabase = createAdminClient()

    let result

    switch (operation) {
      case "insert":
        result = await supabase.from(table).insert(data).select()
        break
      case "update":
        result = await supabase.from(table).update(data).eq("id", id).select()
        break
      case "delete":
        result = await supabase.from(table).delete().eq("id", id).select()
        break
      case "select":
        result = await supabase.from(table).select(data || "*")
        if (filter) {
          Object.entries(filter).forEach(([key, value]) => {
            result = result.eq(key, value)
          })
        }
        result = await result
        break
      default:
        return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
