// src/app/api/bubbles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { getSessionFromCookie } from "@/lib/session";

/** GET /api/bubbles — 최근 50개 */
export async function GET() {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("bubbles")
      .select("id, title, emoji, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("GET /api/bubbles error:", error.message);
      return NextResponse.json({ error: "db_error", detail: error.message }, { status: 500 });
    }
    return NextResponse.json({ items: data ?? [] }, { status: 200 });
  } catch (e: any) {
    console.error("GET /api/bubbles fatal:", e?.message || e);
    return NextResponse.json({ error: "server_error", detail: e?.message }, { status: 500 });
  }
}

/** POST /api/bubbles — 새로 만들기 */
export async function POST(req: NextRequest) {
  try {
    // 0) 세션 체크
    const s = await getSessionFromCookie();
    if (!s?.kakao_id) {
      return NextResponse.json(
        { error: "unauthorized", reason: "no_session" },
        { status: 401 }
      );
    }

    // 1) 바디 파싱
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "invalid_json", reason: "parse_failed" },
        { status: 400 }
      );
    }

    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const content = typeof body?.content === "string" ? body.content.trim() : "";
    const emoji =
      typeof body?.emoji === "string" && body.emoji.trim() ? body.emoji.trim() : "💬";

    if (!title || !content) {
      return NextResponse.json(
        { error: "invalid_payload", reason: "empty_title_or_content", debug: { titleLen: title.length, contentLen: content.length } },
        { status: 400 }
      );
    }

    // 2) DB insert
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("bubbles")
      .insert({
        author_kakao_id: s.kakao_id,
        title,
        content,
        emoji,
      })
      .select("id")
      .single();

    if (error) {
      console.error("POST /api/bubbles insert error:", error.message);
      return NextResponse.json(
        { error: "db_insert_failed", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/bubbles fatal:", e?.message || e);
    return NextResponse.json({ error: "server_error", detail: e?.message }, { status: 500 });
  }
}