import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "./lib/adminAuth";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/sign-in") {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const authed = await verifySessionToken(token);
    if (!authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/sign-in";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
