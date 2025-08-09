// src/app/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import BubbleBoard from "@/components/BubbleBoard";

type BubbleItem = {
  id: string;
  title: string;
  emoji: string | null;
  created_at: string;
};

// 서버에서 최신 버블 50개 가져오기 (no-store로 항상 최신)
async function fetchBubbles(): Promise<BubbleItem[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const res = await fetch(`${base}/api/bubbles`, { cache: "no-store" }).catch(() => null);
  if (!res || !res.ok) return [];
  const j = await res.json().catch(() => ({}));
  return (j?.items ?? []) as BubbleItem[];
}

export default async function HomePage() {
  const items = await fetchBubbles();

  return (
    <main className="relative min-h-[calc(100dvh-56px)]">
      {/* 와글와글 버블 보드 (랜덤 배치 + 제목 라벨 + 모달 인터셉트 링크 내부에서 처리) */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-8">
        <h1 className="sr-only">Bubblet Board</h1>
        <BubbleBoard items={items} />
      </section>

      {/* 하단 중앙 기능바 */}
      <div className="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur px-3 py-2 shadow-2xl">
          <Link
            href="/bubbles/new"
            scroll={false} // ★ 모달 인터셉트 핵심
            className="rounded-full bg-yellow-400 text-black px-4 py-2 text-sm font-semibold hover:brightness-95"
          >
            새 버블
          </Link>
          <Link
            href="/hot" // 더미
            className="rounded-full bg-white/10 text-white px-4 py-2 text-sm hover:bg-white/15"
          >
            주요 전장
          </Link>
          <Link
            href="/feed" // 더미
            className="rounded-full bg-white/10 text-white px-4 py-2 text-sm hover:bg-white/15"
          >
            내 피드
          </Link>
        </div>
      </div>
    </main>
  );
}