"use client";

import { useRouter } from "next/navigation";

export default function ModalClose() {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="닫기"
      onClick={() => router.back()}
      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
    >
      닫기
    </button>
  );
}