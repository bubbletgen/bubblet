// src/lib/session.ts
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "user_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-only-secret-change-me";

// base64url helpers
function toBase64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
function fromBase64Url(input: string) {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4;
  if (pad) input += "=".repeat(4 - pad);
  return Buffer.from(input, "base64");
}

// HMAC-SHA256
function sign(data: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(data).digest();
}

// pack: payload(base64url).sig(base64url)
function pack(payload: any) {
  const json = JSON.stringify(payload);
  const p = toBase64Url(json);
  const s = toBase64Url(sign(p));
  return `${p}.${s}`;
}

// unpack + verify
function unpack(token?: string | null) {
  if (!token) return null;
  const [p, s] = token.split(".");
  if (!p || !s) return null;
  const expected = toBase64Url(sign(p));
  if (!crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected))) return null;
  try {
    const json = fromBase64Url(p).toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: {
  kakao_id: string;
  nickname?: string | null;
  avatar_url?: string | null;
}) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, pack(payload), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSessionFromCookie(): Promise<
  { kakao_id: string; nickname?: string | null; avatar_url?: string | null } | null
> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  const parsed = unpack(raw);
  if (!parsed?.kakao_id) return null;
  return parsed;
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}