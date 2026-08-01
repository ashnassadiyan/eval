"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

import { PageLoader } from "@/components/ui/PageLoader";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.user_type !== "admin") {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <PageLoader
        message="Checking Permissions..."
        subtext="Verifying admin access rights"
        fullScreen={true}
      />
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (!isAuthorized && user?.user_type !== "admin") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-black text-[#e2e2e2] px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-red-950/30 border border-red-500/20 text-red-500 animate-pulse">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white">
              Access Denied
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              This area is restricted to administrators only. Your account type is not authorized to view this resource.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#2c2c2e] hover:border-[#444] text-white px-6 py-3 font-bold text-sm transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
