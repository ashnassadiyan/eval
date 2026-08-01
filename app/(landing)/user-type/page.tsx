"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Briefcase, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { SignUpAnimation } from "@/components/auth/SignUpAnimation";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/NotificationSlice";

function UserTypeSelectionContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [userType, setUserType] = useState<"recruiter" | "candidate">("recruiter");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmUserType = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("user_type_preference", userType);
    }

    dispatch(
      showNotification({
        title: "Account & Persona Saved",
        body: "Account created successfully. Please log in to proceed.",
        type: "success",
      })
    );

    // Route directly to Page 3: /login with prefilled email & registered banner
    router.push(`/login?registered=true${emailParam ? `&email=${encodeURIComponent(emailParam)}` : ""}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-background text-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Monochromatic FX */}
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

      {/* Main Responsive Grid Layout */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: Animated Credit Bonus Showcase (Desktop LG) */}
        <div className="hidden lg:flex flex-col justify-center items-center lg:col-span-6">
          <SignUpAnimation />
        </div>

        {/* RIGHT COLUMN: Dedicated User Type Card (Span 6 on LG) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card/95 dark:bg-[#111115]/95 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl overflow-hidden transition-all duration-300">
            {/* Top Active Laser Scan Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent animate-pulse" />

            <form onSubmit={handleConfirmUserType} className="space-y-6">
              <div className="text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-foreground text-background font-black text-xl flex items-center justify-center mb-4 shadow-xs">
                  E
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-[11px] font-mono font-extrabold text-foreground mb-3 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-foreground" />
                  <span>Step 2 of 2 • Persona Selection</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Select Account Persona
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
                  Choose your primary role to customize your workspace experience.
                </p>
              </div>

              <div className="space-y-3">
                {/* Option A: Independent Recruiter */}
                <div
                  onClick={() => setUserType("recruiter")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    userType === "recruiter"
                      ? "border-foreground bg-foreground/5 shadow-md"
                      : "border-border/80 bg-background/50 hover:border-foreground/40"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold transition-colors ${
                        userType === "recruiter"
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-foreground">
                          Independent Recruiter
                        </h3>
                        {userType === "recruiter" && (
                          <CheckCircle2 className="w-4 h-4 text-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">
                        Create hiring roles, generate shareable application links, and rank candidates automatically.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Option B: Job Seeker */}
                <div
                  onClick={() => setUserType("candidate")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    userType === "candidate"
                      ? "border-foreground bg-foreground/5 shadow-md"
                      : "border-border/80 bg-background/50 hover:border-foreground/40"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold transition-colors ${
                        userType === "candidate"
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-foreground">
                          Job Seeker
                        </h3>
                        {userType === "candidate" && (
                          <CheckCircle2 className="w-4 h-4 text-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">
                        Upload your resume, audit ATS keyword compatibility, and optimize overall job match score.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-foreground text-background px-4 py-3.5 text-sm font-extrabold shadow-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>{isSubmitting ? "Saving..." : "Confirm & Proceed to Sign In"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Bottom Trust Tag */}
              <div className="pt-4 border-t border-border/80 flex items-center justify-center gap-2 text-[11px] font-semibold text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-foreground" />
                <span>SSL Encrypted • Instant Setup</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserTypeSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
          <div className="h-8 w-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        </div>
      }
    >
      <UserTypeSelectionContent />
    </Suspense>
  );
}
