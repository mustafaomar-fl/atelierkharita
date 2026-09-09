import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createSessionToken } from "@/lib/adminAuth";
import { checkLoginRateLimit, clearLoginAttempts, getClientIp, recordFailedLogin } from "@/lib/loginRateLimit";

function passwordsMatch(submitted: string, expected: string): boolean {
  const a = Buffer.from(submitted);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 500 });
  }

  const ip = getClientIp(request);
  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "too_many_attempts", retryAfterSeconds: rateLimit.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const submitted = body?.password;

  if (typeof submitted !== "string" || !passwordsMatch(submitted, expected)) {
    recordFailedLogin(ip);
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  clearLoginAttempts(ip);

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return res;
}
