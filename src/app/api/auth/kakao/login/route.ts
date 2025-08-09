// src/app/api/auth/kakao/login/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

  if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT_URI) {
    return new NextResponse("Missing Kakao OAuth configuration", { status: 500 });
  }

  // 카카오 로그인 URL 생성
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`;

  // 카카오 로그인 페이지로 리디렉션
  return NextResponse.redirect(kakaoAuthURL);
}