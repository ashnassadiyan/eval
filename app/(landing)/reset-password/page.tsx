"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email") || "";
    const code = searchParams.get("code") || "";
    const token = searchParams.get("token") || "";

    const finalCode = code || token;
    let target = "/forgot-password";
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (finalCode) params.set("code", finalCode);

    if (params.toString()) {
      target += `?${params.toString()}`;
    }

    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">Redirecting to Password Reset...</p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
          <div className="h-8 w-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        </div>
      }
    >
      <ResetPasswordRedirect />
    </Suspense>
  );
}
