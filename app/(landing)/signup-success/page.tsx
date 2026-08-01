"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SignUpAnimation } from "@/components/auth/SignUpAnimation";

function SignupSuccessContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const roleParam = searchParams.get("role") || "";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-background text-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Ambient Monochromatic Backlight FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -left-40 -top-40 w-[650px] h-[650px] rounded-full bg-foreground/5 blur-[170px] animate-pulse" />
        <div
          className="absolute -right-40 -bottom-40 w-[650px] h-[650px] rounded-full bg-foreground/5 blur-[170px] animate-pulse"
          style={{ animationDelay: "2.5s" }}
        />

        {/* Micro Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Light Shimmer Sweep */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-[40%] top-0 h-full w-[50%] rotate-12 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-[shine_8s_linear_infinite]" />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: Animated Credit Bonus Showcase (Desktop LG) */}
        <div className="hidden lg:flex flex-col justify-center items-center lg:col-span-6">
          <SignUpAnimation />
        </div>

        {/* RIGHT COLUMN: Dedicated Success Card (Span 6 on LG) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card/95 dark:bg-[#111115]/95 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl overflow-hidden transition-all duration-300">
            {/* Top Active Laser Scan Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent animate-pulse" />

            <div className="text-center flex flex-col items-center py-4 space-y-6">
              {/* Checkmark Emblem */}
              <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center shadow-2xl animate-in zoom-in duration-300">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-muted border border-border text-[11px] font-mono font-extrabold text-foreground uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Registration Verified
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Account Created Successfully
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">
                  Your account and role profile have been verified. Please log in with your credentials to proceed to your workspace.
                </p>
              </div>

              {/* Login CTA Button */}
              <div className="w-full pt-4">
                <Link
                  href={`/login?registered=true${emailParam ? `&email=${encodeURIComponent(emailParam)}` : ""}`}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-foreground text-background px-4 py-3.5 text-sm font-extrabold shadow-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="pt-2 border-t border-border/80 w-full flex items-center justify-center gap-2 text-[11px] font-semibold text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-foreground" />
                <span>SSL Encrypted Session • Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
          <div className="h-8 w-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        </div>
      }
    >
      <SignupSuccessContent />
    </Suspense>
  );
}
