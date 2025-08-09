import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("bubbles")
      .select("id, title, content, emoji, created_at")
      .eq("id", id)
      .single();

    if (error) {
      console.error("GET /api/bubbles/[id] error:", error.message);
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ item: data }, { status: 200 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("GET /api/bubbles/[id] fatal:", errorMessage);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}