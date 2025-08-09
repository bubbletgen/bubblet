import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const protectedPaths = ["/me", "/api/me"];
  const needsAuth = protectedPaths.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
  if (!needsAuth) return NextResponse.next();

  // ✅ user_session 하나만 체크 (보안 스프린트 적용 전)
  const has = req.cookies.get("user_session")?.value;
  if (!has) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/me/:path*", "/api/me/:path*"],
};