"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/PageLoader";
import { OtpVerificationScreen } from "@/components/auth/OtpVerificationScreen";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes (no authentication required)
  const isPublicRoute =
    pathname === "/" ||
    Boolean(pathname?.startsWith("/apply")) ||
    Boolean(pathname?.startsWith("/login")) ||
    Boolean(pathname?.startsWith("/signup")) ||
    Boolean(pathname?.startsWith("/forgot-password")) ||
    Boolean(pathname?.startsWith("/reset-password")) ||
    Boolean(pathname?.startsWith("/verify-otp")) ||
    Boolean(pathname?.startsWith("/contact-support")) ||
    Boolean(pathname?.startsWith("/privacy")) ||
    Boolean(pathname?.startsWith("/terms"));

  const isAuthPage =
    Boolean(pathname?.startsWith("/login")) ||
    Boolean(pathname?.startsWith("/signup"));

  useEffect(() => {
    if (isLoading) return;

    // 1. If trying to access protected route without valid auth or user object -> redirect to login
    if ((!isAuthenticated || !user) && !isPublicRoute) {
      console.warn(`Unauthenticated access attempt to ${pathname}. Redirecting to login.`);
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
      return;
    }

    // 2. If authenticated user attempts to visit /login or /signup -> redirect to dashboard or verify-otp
    if (isAuthenticated && user && isAuthPage) {
      if (!user.is_verified) {
        router.push("/verify-otp");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, isLoading, isPublicRoute, isAuthPage, pathname, router]);

  // Loading Screen for Protected Routes during Session Validation or Redirects
  if ((isLoading || !isAuthenticated || !user) && !isPublicRoute) {
    return (
      <PageLoader
        message={isLoading ? "Validating Session..." : "Authentication Required"}
        subtext={isLoading ? "Verifying user credentials with backend" : "Redirecting to sign in screen..."}
        fullScreen={true}
      />
    );
  }

  // 3. IF USER IS LOGGED IN BUT IS_VERIFIED IS FALSE OR MISSING -> RENDER OTP VERIFICATION SCREEN
  if (isAuthenticated && user && !user.is_verified && !isPublicRoute && pathname !== "/verify-otp") {
    return <OtpVerificationScreen redirectUrl={pathname || "/dashboard"} />;
  }

  return <>{children}</>;
}
