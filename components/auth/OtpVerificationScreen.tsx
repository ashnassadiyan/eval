"use client";

import React, { useState, useRef, useEffect, type ClipboardEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  LogOut,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/NotificationSlice";

interface OtpVerificationScreenProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

export function OtpVerificationScreen({ onSuccess, redirectUrl = "/dashboard" }: OtpVerificationScreenProps) {
  const { user, verifyOtp, resendOtp, logout } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(60);
  const [shake, setShake] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer countdown for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Mask user email for privacy (e.g., a***n@domain.com)
  const getMaskedEmail = (emailStr?: string) => {
    if (!emailStr) return "your registered email";
    const parts = emailStr.split("@");
    if (parts.length !== 2) return emailStr;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `${name.charAt(0)}***@${domain}`;
    return `${name.charAt(0)}${"*".repeat(Math.max(name.length - 2, 3))}${name.slice(-1)}@${domain}`;
  };

  const handleChange = (value: string, index: number) => {
    // Only keep numerical input
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue && value !== "") return;

    setError(null);
    const newOtp = [...otp];
    const char = cleanValue.slice(-1); // Take last digit if multiple entered
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto advance focus to next field if value entered
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all digits are entered
    if (newOtp.every((digit) => digit !== "")) {
      handleVerification(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move focus backward if current box is empty
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

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");
    if (!pastedData) return;

    const digits = pastedData.slice(0, OTP_LENGTH).split("");
    const newOtp = [...otp];

    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);

    // Focus last filled digit or final input box
    const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();

    if (newOtp.every((digit) => digit !== "")) {
      handleVerification(newOtp.join(""));
    }
  };

  const handleVerification = async (codeToSubmit?: string) => {
    const finalCode = codeToSubmit || otp.join("");
    if (finalCode.length < OTP_LENGTH) {
      setError(`Please enter the full ${OTP_LENGTH}-digit verification code.`);
      triggerShake();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await verifyOtp(finalCode);
      setSuccessMsg("Account successfully verified! Redirecting...");

      dispatch(
        showNotification({
          title: "Account Verified",
          body: "Your identity has been verified. Welcome aboard!",
          type: "success",
        })
      );

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectUrl);
        }
      }, 1200);
    } catch (err: any) {
      const msg = err.message || "Invalid OTP code. Please check and try again.";
      setError(msg);
      triggerShake();
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleResendCode = async () => {
    if (timer > 0 || resending) return;

    setResending(true);
    setError(null);
    try {
      await resendOtp();
      setTimer(60);
      setSuccessMsg("A new 6-digit verification code has been dispatched to your email.");
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleDevQuickVerify = () => {
    // Quick helper to fill and submit test code
    const devCode = ["1", "2", "3", "4", "5", "6"];
    setOtp(devCode);
    handleVerification(devCode.join(""));
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-background text-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* RICH FILLED BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Dynamic Glowing Orbs */}
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

        {/* Particle animations */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-foreground/20 animate-ping" />
        <div
          className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-foreground/20 animate-ping"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* GLASSMORPHIC MAIN CARD */}
      <div className="relative w-full max-w-lg z-10">
        <div
          className={`relative rounded-3xl border border-border/80 bg-card/95 dark:bg-[#111115]/95 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden transition-all duration-300 ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* Active Top Glowing Scanning Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent animate-pulse" />

          {/* Header Section */}
          <div className="text-center flex flex-col items-center">
            <div className="relative mb-5 group select-none">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-primary/30 to-blue-500/30 blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
              <div className="relative p-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border border-zinc-200/20 dark:border-zinc-800 shadow-2xl flex items-center justify-center">
                <KeyRound className="w-8 h-8" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Two-Factor Account Protection</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Security Verification
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
              We&apos;ve dispatched a 6-digit authentication code to{" "}
              <span className="font-bold text-foreground inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted">
                <Mail className="w-3 h-3" />
                {getMaskedEmail(user?.email)}
              </span>
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
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

          {/* 6-DIGIT OTP PIN INPUT GRID */}
          <div className="mt-8">
            <label className="block text-center text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-4">
              Enter 6-Digit OTP Code
            </label>

            <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
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
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-black rounded-2xl border bg-background/60 text-foreground shadow-sm transition-all focus:outline-none ${
                    digit
                      ? "border-foreground bg-muted/40 shadow-md scale-[1.03]"
                      : "border-border hover:border-border/80 focus:border-foreground focus:ring-2 focus:ring-foreground/20"
                  } ${error ? "border-red-500/80 bg-red-500/5 text-red-600 dark:text-red-400" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => handleVerification()}
              disabled={loading || otp.join("").length < OTP_LENGTH}
              className="group relative flex w-full justify-center items-center gap-2 rounded-2xl bg-foreground text-background px-4 py-4 text-sm font-extrabold shadow-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-background animate-pulse" />
                  <span>Verify Account</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>

          {/* RESEND TIMER & ACTION */}
          <div className="mt-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
              <span>Didn&apos;t receive code?</span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={timer > 0 || resending}
                className="font-bold text-foreground hover:underline disabled:opacity-50 disabled:no-underline inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                {timer > 0 ? `Resend Code in ${timer}s` : resending ? "Sending..." : "Resend Code"}
              </button>
            </div>

            {/* DEV QUICK VERIFY TEST HELPER */}
            <div className="pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={handleDevQuickVerify}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-xl border border-border transition-all cursor-pointer"
              >
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>Demo Test: Click to Auto-Verify</span>
              </button>
            </div>
          </div>

          {/* FOOTER SWITCH ACCOUNT / LOGOUT */}
          <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
              <span>SOC2 Encrypted</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 font-bold text-red-500 hover:text-red-600 hover:underline cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
