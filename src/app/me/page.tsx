// src/app/me/page.tsx
export const dynamic = "force-dynamic"; // 항상 최신

import { getSessionFromCookie } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase";

type Me = {
  id: string;
  kakao_id: string;
  nickname: string | null;
  email: string | null;
  avatar_url: string | null;
};

export default async function MePage() {
  // 1) 서버에서 바로 쿠키 읽기 (세션)
  const s = await getSessionFromCookie();
  if (!s?.kakao_id) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-semibold">내 정보</h1>
        <p className="mt-2 text-sm text-gray-600">로그인이 필요합니다.</p>
      </div>
    );
  }

  // 2) DB에서 최신 사용자 정보 조회 (API 경유 X)
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("users")
    .select("id, kakao_id, nickname, email, avatar_url")
    .eq("kakao_id", s.kakao_id)
    .single();

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-semibold">내 정보</h1>
        <p className="mt-2 text-sm text-red-500">사용자 정보를 불러오지 못했어요.</p>
      </div>
    );
  }

  const me = data as Me;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">내 정보</h1>

      <div className="space-y-2">
        <div>
          <span className="text-gray-500">닉네임: </span>
          {me.nickname ?? "-"}
        </div>
        <div>
          <span className="text-gray-500">이메일: </span>
          {me.email ?? "-"}
        </div>
      </div>

      <a
        href="/me/edit"
        className="inline-block rounded-md bg-black text-white px-4 py-2"
      >
        프로필 수정
      </a>
    </div>
  );
}