// src/app/login/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";

export default async function LoginPage() {
  // ✅ Next 15 규칙: cookies()는 await 필요
  const jar = await cookies();
  const raw = jar.get("user_session")?.value;

  // 세션 파싱
  let user: any = null;
  if (raw) {
    try {
      user = JSON.parse(raw);
    } catch {
      user = null;
    }
  }

  const isLoggedIn = Boolean(user?.id);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] pt-6 flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-semibold">로그인</h1>

        {isLoggedIn ? (
          <div className="space-y-4">
            <p className="text-white/80">이미 로그인되어 있습니다.</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/"
                className="px-4 h-10 rounded-md bg-white/10 hover:bg-white/15 flex items-center"
              >
                홈으로
              </Link>
              <a
                href="/api/auth/logout"
                className="px-4 h-10 rounded-md bg-red-500 hover:brightness-110 flex items-center"
              >
                로그아웃
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-white/80">카카오 계정으로 로그인하세요.</p>
            <a
              href="/api/auth/kakao/start"
              className="inline-flex items-center justify-center gap-2 px-4 h-11 rounded-md bg-yellow-400 text-black font-semibold hover:brightness-95 w-full"
            >
              카카오로 로그인
            </a>
            <Link
              href="/"
              className="block text-sm text-white/70 hover:text-white underline underline-offset-4"
            >
              돌아가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}