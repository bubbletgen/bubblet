"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // 백드롭 클릭 시 닫기, 패널 클릭은 전파 막기
  const onBackdropClick = () => router.back();
  const onPanelClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
    >
      <div
        className="relative w-[min(720px,92vw)] max-h-[86vh] overflow-auto rounded-2xl bg-zinc-900 shadow-2xl border border-white/10"
        onClick={onPanelClick}
      >
        {children}
      </div>
    </div>
  );
}