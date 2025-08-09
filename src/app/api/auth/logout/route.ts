// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET으로 간단히 처리: /api/auth/logout 방문하면 쿠키 지우고 홈으로 이동
export async function GET(request: NextRequest) {
  const jar = await cookies();
  jar.delete("user_session"); // 로그인 세션 쿠키 삭제
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "https://bubblet.kr")); // 홈으로
}