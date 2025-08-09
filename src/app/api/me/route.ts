// src/app/api/me/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getSessionFromCookie, setSessionCookie } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase";

/**
 * GET /api/me
 * - 로그인 O: DB의 현재 사용자 라이트 정보
 * - 로그인 X: { user: null } (200)  ← 헤더/클라 분기 단순화를 위해 401 대신 200
 */
export async function GET(_req: NextRequest) {
  try {
    const s = await getSessionFromCookie();
    if (!s?.kakao_id) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("users")
      .select("id, kakao_id, nickname, email, avatar_url")
      .eq("kakao_id", s.kakao_id)
      .maybeSingle(); // 없으면 null

    if (error) {
      console.error("GET /api/me supabase error:", error.message);
      return NextResponse.json({ error: "db_error" }, { status: 500 });
    }

    return NextResponse.json({ user: data ?? null }, { status: 200 });
  } catch (e: any) {
    console.error("GET /api/me error:", e?.message || e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

/**
 * POST /api/me
 * - 닉네임/이메일 업데이트
 * - DB 갱신 후, 세션 쿠키도 최신 닉네임/아바타로 재설정
 */
export async function POST(req: NextRequest) {
  try {
    const s = await getSessionFromCookie();
    if (!s?.kakao_id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // 바디 파싱
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    // 최소 유효성 정리
    const inObj = (v: unknown): v is { nickname?: string; email?: string } =>
      !!v && typeof v === "object";
    if (!inObj(body)) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const nickname =
      typeof body.nickname === "string" ? body.nickname.trim() : null;
    const email = typeof body.email === "string" ? body.email.trim() : null;

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("users")
      .update({
        nickname: nickname || null,
        email: email || null,
        updated_at: new Date().toISOString(),
      })
      .eq("kakao_id", s.kakao_id)
      .select("id, kakao_id, nickname, email, avatar_url")
      .single();

    if (error) {
      console.error("POST /api/me supabase update error:", error.message);
      return NextResponse.json({ error: "db_update_failed" }, { status: 500 });
    }

    // 세션 쿠키도 최신 닉네임/아바타로 동기화 (헤더 즉시 반영용)
    await setSessionCookie({
      kakao_id: s.kakao_id,
      nickname: data?.nickname ?? s.nickname ?? null,
      avatar_url: data?.avatar_url ?? s.avatar_url ?? null,
    });

    return NextResponse.json({ ok: true, user: data }, { status: 200 });
  } catch (e: any) {
    console.error("POST /api/me error:", e?.message || e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}