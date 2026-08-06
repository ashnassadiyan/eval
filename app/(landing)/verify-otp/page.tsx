"use client";

import React, { Suspense } from "react";
import { OtpVerificationScreen } from "@/components/auth/OtpVerificationScreen";

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
          <div className="h-8 w-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        </div>
      }
    >
      <OtpVerificationScreen />
    </Suspense>
  );
}
