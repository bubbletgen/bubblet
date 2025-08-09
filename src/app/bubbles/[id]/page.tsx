// src/app/bubbles/[id]/page.tsx
export const dynamic = "force-dynamic";

import { supabaseServer } from "@/lib/supabase";
import Link from "next/link";

// Next 15: params는 Promise일 수 있음 → 반드시 await
type Params = Promise<{ id: string }>;

export default async function BubbleDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("bubbles")
    .select("id, title, content, emoji, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">버블을 찾을 수 없어요</h1>
        <p className="mt-2 text-gray-400">삭제되었거나 잘못된 주소일 수 있어요.</p>
        <Link href="/" className="inline-block mt-4 text-blue-400 underline">
          전장으로(메인으로)
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{data.emoji}</span>
        <h1 className="text-2xl font-semibold">{data.title}</h1>
      </div>

      <article className="whitespace-pre-wrap leading-7 text-white/90">
        {data.content}
      </article>

      <div className="text-sm text-white/50">
        작성일: {new Date(data.created_at).toLocaleString()}
      </div>

      <div className="pt-4">
        <Link
          href="/"
          className="inline-block rounded-md bg-white/10 hover:bg-white/20 text-white px-4 py-2"
        >
          전장으로(메인으로)
        </Link>
      </div>
    </main>
  );
}