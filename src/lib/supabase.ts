// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

/**
 * 브라우저(클라이언트)에서 쓰는 Supabase 클라이언트
 * - 공개 키(ANON) 사용
 */
export function supabaseBrowser() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * 서버에서 쓰는 Supabase 클라이언트
 * - SERVICE_ROLE 키 사용(서버 전용, 클라 노출 금지)
 */
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );
}