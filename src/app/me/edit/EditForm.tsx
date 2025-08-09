// src/app/me/edit/EditForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  defaultNickname: string;
  defaultEmail: string;
};

export default function EditForm({ defaultNickname, defaultEmail }: Props) {
  const router = useRouter();

  // 초기값: 서버에서 넘어온 값으로 세팅
  const [nickname, setNickname] = useState(defaultNickname ?? "");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ✅ props가 나중에 갱신되는 경우(탭 이동/리프레시 등)에도 동기화
  useEffect(() => {
    setNickname(defaultNickname ?? "");
  }, [defaultNickname]);

  useEffect(() => {
    setEmail(defaultEmail ?? "");
  }, [defaultEmail]);

  // 디버깅: 실제로 뭐가 넘어오는지 브라우저 콘솔에서 확인
  useEffect(() => {
    console.log("[EditForm props]", { defaultNickname, defaultEmail });
  }, [defaultNickname, defaultEmail]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    try {
      const res = await fetch("/api/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 배포에서 쿠키 이슈 생기면 ↓ 주석 해제
        // credentials: "include",
        body: JSON.stringify({ nickname, email }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.error || "save_failed");
        return;
      }

      // 저장 성공 → 마이페이지로 이동 후 서버컴포넌트 트리 최신화
      router.replace("/me");
      router.refresh();
    } catch {
      setErr("network_error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">닉네임</label>
        <input
          name="nickname"
          type="text"
          className="w-full rounded-md border px-3 py-2"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">이메일</label>
        <input
          name="email"
          type="email"
          className="w-full rounded-md border px-3 py-2"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {err && <p className="text-sm text-red-500">저장 실패: {err}</p>}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
      >
        {saving ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}