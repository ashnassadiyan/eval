import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // Protected paths list
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/evaluate") ||
    pathname.startsWith("/my_jobs") ||
    pathname.startsWith("/myprofile") ||
    pathname.startsWith("/onboarding");

  // Auth pages (login, signup)
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // 1. If accessing protected route without access_token cookie -> server redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If logged in and visiting login/signup -> redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/evaluate/:path*",
    "/my_jobs/:path*",
    "/myprofile/:path*",
    "/onboarding",
    "/login",
    "/signup",
    "/verify-otp",
  ],
};
