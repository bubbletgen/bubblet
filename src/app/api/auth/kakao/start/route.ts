import { NextResponse } from "next/server";

export async function GET() {
  // 기본: 이메일 포함 시도
  const withEmail = new URLSearchParams({
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    response_type: "code",
    scope: "account_email profile_nickname profile_image",
  });

  // 폴백: 이메일 제외
  const withoutEmail = new URLSearchParams({
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    response_type: "code",
    scope: "profile_nickname profile_image",
  });

  // 환경변수로 이메일 권한 스위치 (없으면 바로 폴백)
  const wantEmail = process.env.NEXT_PUBLIC_WANT_EMAIL === "true";

  const url = `https://kauth.kakao.com/oauth/authorize?${
    (wantEmail ? withEmail : withoutEmail).toString()
  }`;
  return NextResponse.redirect(url);
}