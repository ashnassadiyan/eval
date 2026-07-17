"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname, "pathname");

  // Public routes
  const isPublicRoute = pathname === "/" || pathname.startsWith("/apply");

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      // router.push("/login");
    }
  }, [isAuthenticated, isLoading, isPublicRoute, router]);

  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
            <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-zinc-500 font-medium tracking-wide">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  // Allow public routes without authentication
  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
