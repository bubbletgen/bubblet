// src/app/api/auth/kakao/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { setSessionCookie } from "@/lib/session";        // 서명된 라이트 세션 저장
import { supabaseServer } from "@/lib/supabase";         // 서버용 Supabase 클라이언트

type KakaoUser = {
  id: number;
  kakao_account?: {
    email?: string | null;
    profile?: {
      nickname?: string | null;
      profile_image_url?: string | null;
      thumbnail_image_url?: string | null;
    };
  };
  properties?: {
    nickname?: string | null;
    profile_image?: string | null;
    thumbnail_image?: string | null;
  };
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  if (!code) {
    return new Response("Authorization code not found", { status: 400 });
  }

  // 1) 액세스 토큰 교환
  let access_token: string;
  try {
    const tokenRes = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID || "",
        redirect_uri: process.env.KAKAO_REDIRECT_URI || "",
        code,
        // client_secret: process.env.KAKAO_CLIENT_SECRET || "", // 앱에서 필수로 켰다면 주석 해제
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    access_token = tokenRes.data.access_token;

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ token scope:", tokenRes.data.scope);
    }
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ token exchange failed:", err?.response?.data || err?.message);
    }
    return new Response("카카오 토큰 교환 실패", { status: 500 });
  }

  // 2) 사용자 정보 조회
  let kakao: KakaoUser;
  try {
    const userRes = await axios.get<KakaoUser>("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    kakao = userRes.data;

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ kakao user:", {
        id: kakao.id,
        email: kakao.kakao_account?.email ?? null,
        nickname:
          kakao.kakao_account?.profile?.nickname ??
          kakao.properties?.nickname ??
          null,
      });
    }
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ user fetch failed:", err?.response?.data || err?.message);
    }
    return new Response("카카오 사용자 조회 실패", { status: 500 });
  }

  // 3) 업서트용 정제 필드
  const kakao_id = String(kakao.id);
  const kakaoNickname =
    kakao.kakao_account?.profile?.nickname ??
    kakao.properties?.nickname ??
    null;
  const kakaoAvatar =
    kakao.kakao_account?.profile?.profile_image_url ??
    kakao.properties?.profile_image ??
    null;
  const kakaoEmail = kakao.kakao_account?.email ?? null; // 동의/스코프 승인 전이면 null

  const supabase = supabaseServer();

  // 4) 기존 사용자 조회
  const { data: existing, error: selErr } = await supabase
    .from("users")
    .select("id, kakao_id, nickname, email, avatar_url")
    .eq("kakao_id", kakao_id)
    .maybeSingle();

  if (selErr) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ supabase select error:", selErr);
    }
    return new Response("DB error", { status: 500 });
  }

  if (!existing) {
    // 👉 최초 로그인: 카카오 값으로 생성
    const { error: insErr } = await supabase
      .from("users")
      .insert({
        kakao_id,
        nickname: kakaoNickname,   // 없으면 null로 들어감
        email: kakaoEmail,
        avatar_url: kakaoAvatar,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insErr) {
      if (process.env.NODE_ENV !== "production") {
        console.error("❌ supabase insert error:", insErr);
      }
      return new Response("DB insert error", { status: 500 });
    }
  } else {
    // 👉 재로그인: 덮어쓰기 금지
    // - DB에 값이 **없을 때만** 카카오 값으로 채움
    const patch: Record<string, any> = {};
    if (!existing.nickname && kakaoNickname) patch.nickname = kakaoNickname;
    if (!existing.email && kakaoEmail) patch.email = kakaoEmail;
    if (!existing.avatar_url && kakaoAvatar) patch.avatar_url = kakaoAvatar;

    if (Object.keys(patch).length > 0) {
      patch.updated_at = new Date().toISOString();
      const { error: updErr } = await supabase
        .from("users")
        .update(patch)
        .eq("kakao_id", kakao_id);

      if (updErr) {
        if (process.env.NODE_ENV !== "production") {
          console.error("❌ supabase update error:", updErr);
        }
        return new Response("DB update error", { status: 500 });
      }
    }
  }

  // 5) DB 최종값 기준으로 세션 쿠키 갱신
  const { data: finalUser, error: finalErr } = await supabase
    .from("users")
    .select("kakao_id, nickname, avatar_url")
    .eq("kakao_id", kakao_id)
    .single();

  if (finalErr || !finalUser) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ supabase final fetch error:", finalErr);
    }
    return new Response("DB error", { status: 500 });
  }

  await setSessionCookie({
    kakao_id: finalUser.kakao_id,
    nickname: finalUser.nickname ?? null,
    avatar_url: finalUser.avatar_url ?? null,
  });

  // 6) 리다이렉트
  return NextResponse.redirect(new URL(next, request.url));
}