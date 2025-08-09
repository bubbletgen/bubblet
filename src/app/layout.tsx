// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

const geistSans  = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono  = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces   = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["400","500","600","700"] });

export const metadata: Metadata = {
  title: "Bubblet",
  description: "Boldly, Bubble it.",
  icons: { icon: "/favicon.ico" },
};

// ✅ parallel route slot: `modal` 을 props로 받고 body 맨 아래에서 렌더
export default function RootLayout({
  children,
  modal,                // ★ 중요: @modal 슬롯
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased min-h-dvh bg-black text-white pt-14`}>
        <Header />
        {children}

        {/* 모달 레이어 (헤더 z-50 위) */}
        <div id="modal-root" className="fixed inset-0 z-[100] pointer-events-none">
          {/* 실제 모달 컴포넌트에서 pointer-events:auto 로 복구 */}
          {modal}
        </div>
      </body>
    </html>
  );
}