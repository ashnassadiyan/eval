"use client";

import React, { useState, useEffect, useRef, Suspense, type FormEvent, type ClipboardEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/NotificationSlice";

const OTP_LENGTH = 6;

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const initialEmail = searchParams.get("email") || "";
  const initialCode = searchParams.get("code") || "";

  const { requestPasswordReset, verifyResetOtp, resetPassword, resendResetOtp } = useAuth();

  // Multi-step flow: 1 = Request Email, 2 = Enter OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialCode ? 3 : 1);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState<string[]>(
    initialCode && initialCode.length === OTP_LENGTH
      ? initialCode.split("")
      : Array(OTP_LENGTH).fill("")
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(60);
  const [resending, setResending] = useState(false);
  const [shake, setShake] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input box when step 2 opens
  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  // Resend OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  // Password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isPasswordValid = hasMinLength && hasUpperLower && hasNumber && passwordsMatch;

  // Mask user email for privacy (e.g. j***e@domain.com)
  const getMaskedEmail = (emailStr: string) => {
    if (!emailStr) return "your registered email";
    const parts = emailStr.split("@");
    if (parts.length !== 2) return emailStr;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `${name.charAt(0)}***@${domain}`;
    return `${name.charAt(0)}${"*".repeat(Math.max(name.length - 2, 3))}${name.slice(-1)}@${domain}`;
  };

  // STEP 1: Submit email to receive OTP
  const handleRequestOtp = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      triggerShake();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccessMsg(`Reset code dispatched to ${getMaskedEmail(email)}`);
      setTimer(60);
      setStep(2);
      dispatch(
        showNotification({
          title: "Verification Code Sent",
          body: `A 6-digit password reset OTP has been sent to ${email}`,
          type: "success",
        })
      );
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || "Failed to send reset code. Please verify your email.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // OTP Input logic
  const handleOtpChange = (value: string, index: number) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue && value !== "") return;

    setError(null);
    const newOtp = [...otp];
    const char = cleanValue.slice(-1);
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");
    if (!pastedData) return;

    const digits = pastedData.slice(0, OTP_LENGTH).split("");
    const newOtp = [...otp];

    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();

    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  // STEP 2: Verify 6-digit OTP code
  const handleVerifyOtp = async (codeToSubmit?: string) => {
    const finalCode = codeToSubmit || otp.join("");
    if (finalCode.length < OTP_LENGTH) {
      setError(`Please enter the full ${OTP_LENGTH}-digit code.`);
      triggerShake();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await verifyResetOtp(email, finalCode);
      setSuccessMsg("OTP verified! Now enter your new password.");
      setStep(3);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || "Invalid or expired OTP code. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP helper
  const handleResendCode = async () => {
    if (timer > 0 || resending) return;

    setResending(true);
    setError(null);

    try {
      await resendResetOtp(email);
      setTimer(60);
      setSuccessMsg("A new verification code has been sent to your email.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  // STEP 3: Reset password with new password
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("Please ensure your new password meets all security criteria.");
      triggerShake();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const finalCode = otp.join("");
      await resetPassword(email, finalCode, newPassword);

      setStep(4);
      dispatch(
        showNotification({
          title: "Password Reset Successful",
          body: "Your password has been updated. Please sign in with your new password.",
          type: "success",
        })
      );
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || "Failed to update password. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-background text-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* RICH BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -left-32 -top-32 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-foreground/10 via-foreground/5 to-transparent blur-[180px] animate-pulse" />
        <div
          className="absolute -right-32 -bottom-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent blur-[180px] animate-pulse"
          style={{ animationDelay: "2.5s" }}
        />
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-foreground/5 blur-[150px] animate-pulse" />
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
      </div>

      {/* MAIN CARD CONTAINER */}
      <div className="relative w-full max-w-md z-10">
        <div
          className={`relative rounded-3xl border border-border/80 bg-card/95 dark:bg-[#111115]/95 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden transition-all duration-300 ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* Top Laser Scanner Shimmer */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent animate-pulse" />

          {/* Step Indicator Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === s
                      ? "w-6 bg-foreground"
                      : step > s
                      ? "w-2 bg-emerald-500"
                      : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Global Header */}
          <div className="text-center flex flex-col items-center">
            <div className="relative mb-4 group select-none">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-primary/30 to-emerald-500/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-3.5 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border border-zinc-200/20 dark:border-zinc-800 shadow-xl flex items-center justify-center">
                <KeyRound className="w-7 h-7" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "OTP Verification"}
              {step === 3 && "Reset Password"}
              {step === 4 && "Password Reset!"}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-xs">
              {step === 1 && "Enter your registered email address and we'll dispatch a 6-digit OTP security code."}
              {step === 2 && (
                <>
                  Enter the 6-digit code sent to{" "}
                  <span className="font-bold text-foreground inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted">
                    <Mail className="w-3 h-3" />
                    {getMaskedEmail(email)}
                  </span>
                </>
              )}
              {step === 3 && "Create a new strong password for your EvalCV account."}
              {step === 4 && "Your security credentials have been updated successfully."}
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && step !== 4 && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{successMsg}</p>
            </div>
          )}

          {/* Error Alert Box */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {/* STEP 1: EMAIL REQUEST FORM */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-extrabold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-foreground" /> Registered Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground text-sm font-medium transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-foreground text-background px-4 py-3.5 text-sm font-extrabold shadow-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                    <span>Dispatching OTP...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-background animate-pulse" />
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
          {step === 2 && (
            <div className="mt-7 space-y-6">
              <div>
                <label className="block text-center text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-4">
                  Enter 6-Digit OTP Code
                </label>

                <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className={`w-10 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border bg-background/60 text-foreground shadow-sm transition-all focus:outline-none ${
                        digit
                          ? "border-foreground bg-muted/40 shadow-md scale-[1.03]"
                          : "border-border hover:border-border/80 focus:border-foreground focus:ring-2 focus:ring-foreground/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={loading || otp.join("").length < OTP_LENGTH}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-foreground text-background px-4 py-3.5 text-sm font-extrabold shadow-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                    <span>Verifying OTP Code...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-background animate-pulse" />
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
                  <span>Didn&apos;t receive code?</span>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={timer > 0 || resending}
                    className="font-bold text-foreground hover:underline disabled:opacity-50 disabled:no-underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                    {timer > 0 ? `Resend in ${timer}s` : resending ? "Sending..." : "Resend Code"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SET NEW PASSWORD FORM */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="mt-7 space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-extrabold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-foreground" /> New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground text-sm font-medium transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-extrabold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-foreground" /> Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground text-sm font-medium transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Rules checklist */}
              <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/80 space-y-2 text-xs font-medium">
                <p className="font-bold text-foreground mb-1">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
                    {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>At least 8 chars</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpperLower ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
                    {hasUpperLower ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>Upper & lower case</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
                    {hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>At least 1 number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
                    {passwordsMatch ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>Passwords match</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !isPasswordValid}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-foreground text-background px-4 py-3.5 text-sm font-extrabold shadow-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-background animate-pulse" />
                      <span>Reset Password & Finish</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION STATE */}
          {step === 4 && (
            <div className="mt-7 text-center space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 mb-2 animate-bounce" />
                <p className="font-extrabold text-sm">Password Successfully Reset!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You can now sign in using your new security password.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(`/login?email=${encodeURIComponent(email)}&reset=success`)
                }
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-foreground text-background px-4 py-3.5 text-sm font-extrabold shadow-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

          {/* Footer Security Badge */}
          <div className="mt-8 pt-6 border-t border-border/80 flex items-center justify-center gap-2 text-[11px] font-semibold text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-foreground" />
            <span>256-Bit SSL Encrypted Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
          <div className="h-8 w-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
