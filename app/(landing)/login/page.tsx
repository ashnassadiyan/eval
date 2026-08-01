"use client";

import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Sparkles, ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/NotificationSlice";
import { PageLoader } from "@/components/ui/PageLoader";
import { SignInAnimation } from "@/components/auth/SignInAnimation";

function LoginForm() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const isRegisteredParam = searchParams.get("registered") === "true";
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successBanner, setSuccessBanner] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, isLoading, authError } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const target = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";
      router.push(target);
    }
  }, [isAuthenticated, isLoading, router, redirectParam]);

  // Handle registration success banner & pre-filled email
  useEffect(() => {
    if (isRegisteredParam) {
      setSuccessBanner("Account created successfully! Please sign in with your password to proceed.");
    }
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [isRegisteredParam, emailParam]);

  // Display auth error if redirected from session expiration / 401
  useEffect(() => {
    if (authError) {
      setError(authError);
    } else if (redirectParam) {
      setError("Please sign in to access that page.");
    }
  }, [authError, redirectParam]);

  if (isLoading) {
    return (
      <PageLoader
        message="Authenticating Session..."
        subtext="Verifying user credentials with backend"
        fullScreen={true}
      />
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      
      // Set session trigger so DashboardLayout renders the 6-second Welcome Screen!
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trigger_welcome_splash", "true");
      }

      dispatch(
        showNotification({
          title: "Login Successful",
          body: "Welcome to EvalCv AI Talent Platform!",
          type: "success",
        })
      );

      const target = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard?welcome=true";
      router.push(target);
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      const message =
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Invalid credentials or user not found. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-background text-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* RICH FILLED BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Dynamic Glowing Mesh Orbs */}
        <div className="absolute -left-32 -top-32 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-foreground/10 via-foreground/5 to-transparent blur-[180px] animate-pulse" />
        <div
          className="absolute -right-32 -bottom-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent blur-[180px] animate-pulse"
          style={{ animationDelay: "2.5s" }}
        />
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-foreground/5 blur-[150px] animate-pulse" />

        {/* Ambient Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />

        {/* Shimmer Beam & Particle Nodes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-[40%] top-0 h-full w-[50%] rotate-12 bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-[shine_8s_linear_infinite]" />
        </div>
        <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-foreground/20 animate-ping" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-foreground/20 animate-ping" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* 2-COLUMN SIDE-BY-SIDE GRID LAYOUT */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* LEFT COLUMN: 3D ANIMATION CARD ON THE SIDE (FLAT NO SHADOW) */}
        <div className="hidden lg:flex flex-col justify-center items-center lg:col-span-6">
          <SignInAnimation />
        </div>

        {/* RIGHT COLUMN: GLASSMORPHIC SIGN IN FORM CARD WITH PREMIUM BOX SHADOW */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card/95 dark:bg-[#111115]/95 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden transition-all duration-300">
            {/* Top Active Laser Scan Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent animate-pulse" />

            {/* Header Branding */}
            <div className="text-center flex flex-col items-center">
              <div className="relative mb-4 p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="EvalCv Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-contain"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-[11px] font-mono font-extrabold text-foreground mb-3">
                <Sparkles className="w-3.5 h-3.5 text-foreground" />
                <span>AI Talent Intelligence Platform</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Sign In
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
                Welcome back. Access your candidate match reports and evaluation tools.
              </p>
            </div>

            {/* Success Banner Box */}
            {successBanner && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-foreground/30 bg-muted p-4 text-xs font-semibold text-foreground">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{successBanner}</p>
              </div>
            )}

            {/* Error Alert Box */}
            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-foreground/30 bg-muted p-4 text-xs font-semibold text-foreground">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email-address"
                    className="block text-xs font-extrabold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-foreground" /> Email Address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground text-sm font-medium transition-all"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-extrabold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-foreground" /> Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground text-sm font-medium transition-all pr-11"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-foreground text-background px-4 py-3.5 text-sm font-extrabold shadow-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-background animate-pulse" />
                  {loading ? "Signing in..." : "Sign In to Dashboard"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Footer Navigation */}
              <div className="text-center text-xs text-muted-foreground font-medium pt-2">
                Don&apos;t have an account?{" "}
                <Link
                  href={redirectParam ? `/signup?redirect=${encodeURIComponent(redirectParam)}` : "/signup"}
                  className="font-bold text-foreground hover:underline underline-offset-4 transition-colors"
                >
                  Register for free
                </Link>
              </div>
            </form>

            {/* Bottom Trust Tag */}
            <div className="mt-8 pt-6 border-t border-border/80 flex items-center justify-center gap-2 text-[11px] font-semibold text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-foreground" />
              <span>Encrypted Session • SOC2 & GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
          <div className="h-8 w-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
