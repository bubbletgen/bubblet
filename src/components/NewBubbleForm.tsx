"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBubbleForm() {
  const router = useRouter();
  const [emoji, setEmoji] = useState("💬");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    try {
      const res = await fetch("/api/bubbles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji, title, content }),
      });

      const j = await res.json().catch(() => ({}));

      if (!res.ok) {
        // 서버에서 주는 reason을 보여주면 디버그 쉬움
        setErr(j?.error || j?.reason || "save_failed");
        return;
      }

      // 모달이면 자연스럽게 뒤로, 홈은 보드가 바로 보임
      router.back();
      router.refresh();
    } catch (e) {
      setErr("network_error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label className="block text-sm text-white/70 mb-1">이모지</label>
        <input
          type="text"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          maxLength={4}
          className="w-24 text-center rounded-md border border-white/20 bg-white/10 text-white px-3 py-2"
        />
        <p className="text-xs text-white/50 mt-1">예: 💬 🔥 🫧 ⭐️</p>
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1">제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="버블 제목"
          className="w-full rounded-md border border-white/20 bg-white/10 text-white px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="무엇이든 거품처럼 써봐 🫧"
          className="w-full rounded-md border border-white/20 bg-white/10 text-white px-3 py-2 min-h-[120px]"
          required
        />
      </div>

      {err && <p className="text-sm text-red-400">저장 실패: {err}</p>}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center rounded-md bg-yellow-400 text-black px-4 py-2 font-semibold disabled:opacity-60"
      >
        {saving ? "저장 중…" : "버블 만들기"}
      </button>
    </form>
  );
}