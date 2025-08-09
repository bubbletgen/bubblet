// src/app/me/edit/page.tsx
export const dynamic = "force-dynamic"; // 항상 최신 DB값

import { supabaseServer } from "@/lib/supabase";
import { getSessionFromCookie } from "@/lib/session";
import EditForm from "./EditForm";

export default async function EditPage() {
  // 1) 로그인 세션 확인
  const session = await getSessionFromCookie();
  if (!session?.kakao_id) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">프로필 수정</h1>
        <p className="mt-2 text-gray-600">로그인이 필요합니다.</p>
      </div>
    );
  }

  // 2) DB에서 현재 사용자 값 조회
  const supabase = supabaseServer();
  const { data: user, error } = await supabase
    .from("users")
    .select("nickname, email")
    .eq("kakao_id", session.kakao_id)
    .maybeSingle();

  if (error) {
    console.error("edit/page DB error:", error.message);
  }

  const defaultNickname = user?.nickname ?? "";
  const defaultEmail = user?.email ?? "";

  // 3) 클라이언트 폼에 기본값 전달
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">프로필 수정</h1>
      <EditForm defaultNickname={defaultNickname} defaultEmail={defaultEmail} />
    </div>
  );
}