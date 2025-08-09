// src/components/Header.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getSessionFromCookie } from "@/lib/session";

type LightUser = {
  kakao_id: string;
  nickname: string | null;
  avatar_url: string | null;
};

export default async function Header() {
  noStore(); // 캐시 금지

  const s = await getSessionFromCookie(); // ✅ 반드시 await
  const me: LightUser | null = s
    ? {
        kakao_id: s.kakao_id,
        nickname: s.nickname ?? null,
        avatar_url: s.avatar_url ?? null,
      }
    : null;

  const isLoggedIn = Boolean(me?.kakao_id);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur border-b border-white/10 text-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Bubblet
        </Link>

        <nav className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/me"
                className="hidden sm:inline-block text-sm text-white/80 hover:text-white transition"
              >
                마이페이지
              </Link>

              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 h-9">
                {me?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={me.avatar_url}
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/20" />
                )}
                <span className="text-sm">{me?.nickname ?? "사용자"}</span>
              </div>

              <a
                href="/api/auth/logout"
                className="text-sm bg-red-500 hover:brightness-110 text-white rounded-md h-9 px-3 flex items-center font-medium"
              >
                로그아웃
              </a>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-yellow-400 text-black hover:brightness-95 rounded-md h-9 px-3 flex items-center font-semibold"
            >
              카카오로 로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}