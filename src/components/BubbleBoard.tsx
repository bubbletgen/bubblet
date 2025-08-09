// src/components/BubbleBoard.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  id: string;
  title: string;
  emoji: string | null;
  created_at: string;
};

type Props = {
  items: Item[];
};

// 0~1 의사난수
function hash01(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const trunc10 = (s: string) => (s.length > 10 ? s.slice(0, 10) + "…" : s);

export default function BubbleBoard({ items }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  // 컨테이너 크기
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const resize = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const points = useMemo(() => {
    if (!size) return [];
    const padding = 60; // 여백을 늘려서 더 적절한 간격 제공
    const minR = 28;
    const maxR = 44;

    // 1) 초기 좌표
    const pts = items.map((b) => {
      const r01a = hash01(b.id);
      const r01b = hash01(b.id + ":b");
      const r01c = hash01(b.id + ":c");

      const r = Math.round(minR + (maxR - minR) * r01c);
      const x = Math.round(padding + (size.w - padding * 2) * r01a);
      const y = Math.round(padding + (size.h - padding * 2) * r01b);

      return { id: b.id, x, y, r, title: b.title, emoji: b.emoji ?? "💬" };
    });

    // 2) 간단 겹침 완화(최소 간격 유지, 가벼운 2패스)
    const minGap = 12; // 원 가장자리 사이 최소거리를 약간 늘림
    const iterMax = 2;
    for (let iter = 0; iter < iterMax; iter++) {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const need = a.r + b.r + minGap;
          if (dist < need) {
            const push = (need - dist) / 2;
            const ux = dx / dist, uy = dy / dist;
            a.x = clamp(a.x - ux * push, padding + a.r, size.w - padding - a.r);
            a.y = clamp(a.y - uy * push, padding + a.r, size.h - padding - a.r);
            b.x = clamp(b.x + ux * push, padding + b.r, size.w - padding - b.r);
            b.y = clamp(b.y + uy * push, padding + b.r, size.h - padding - b.r);
          }
        }
      }
    }

    return pts;
  }, [items, size]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full min-h-[calc(100dvh-56px)]"
      style={{ contain: "layout paint size" }}
    >
      <div
        className={`absolute inset-0 transition-opacity ${size ? "opacity-100" : "opacity-0"} pointer-events-none`}
      >
        {size &&
          points.map((p) => {
            const d01 = hash01(p.id + ":dur");
            const a01 = hash01(p.id + ":delay");
            const durationSec = 5 + Math.round(d01 * 4); // 5~9초
            const delaySec = Math.round(a01 * 3);        // 0~3초

            return (
              <Link
                key={p.id}
                href={`/bubbles/${p.id}`}
                scroll={false}
                className="group absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{ left: p.x, top: p.y }}
                title={p.title}
              >
                <div
                  className="bubble-wobble flex items-center justify-center rounded-full border border-white/15 bg-white/10
                             hover:bg-white/20 transition-all shadow-md"
                  style={{
                    width: p.r * 2,
                    height: p.r * 2,
                    animationDuration: `${durationSec}s`,
                    animationDelay: `${delaySec}s`,
                  }}
                >
                  <span className="text-2xl select-none">{p.emoji}</span>
                </div>

                {/* 제목: 10자 고정 + … */}
                <div
                  className="mt-1 w-max max-w-[220px]
                             text-xs text-white/80 bg-black/40 backdrop-blur rounded-full px-2 py-0.5
                             pointer-events-none"
                >
                  {trunc10(p.title)}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}