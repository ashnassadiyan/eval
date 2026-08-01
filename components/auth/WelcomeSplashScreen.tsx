"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCheck, ShieldCheck, CheckCircle2, Award, Cpu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface WelcomeSplashScreenProps {
  onComplete: () => void;
  durationSeconds?: number;
}

export function WelcomeSplashScreen({
  onComplete,
  durationSeconds = 6,
}: WelcomeSplashScreenProps) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing Intelligence Engine...");

  const userName = user?.name || user?.email?.split("@")[0] || "Member";

  useEffect(() => {
    const startTime = Date.now();
    const duration = durationSeconds * 1000; // 6 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 25) {
        setStatusMessage("Verifying Security Credentials & Session Token...");
      } else if (pct < 50) {
        setStatusMessage("Initializing Neural Candidate Matching Engine...");
      } else if (pct < 75) {
        setStatusMessage("Loading Resume Parsing Analytics & Credit Wallet...");
      } else {
        setStatusMessage("Workspace Ready! Launching Intelligence Dashboard...");
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("has_seen_welcome", "true");
        }
        onComplete();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete, durationSeconds]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50 dark:bg-[#09090b] text-zinc-900 dark:text-white overflow-hidden select-none antialiased animate-in fade-in duration-300">
      {/* Light Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-zinc-400/10 dark:bg-white/5 blur-[180px] animate-pulse" />
        <div className="absolute -left-32 -top-32 w-[450px] h-[450px] rounded-full bg-zinc-300/20 dark:bg-white/5 blur-[140px]" />
        <div className="absolute -right-32 -bottom-32 w-[450px] h-[450px] rounded-full bg-zinc-300/20 dark:bg-white/5 blur-[140px]" />

        {/* Crisp Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Subtle Light Beam Sweep */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-[40%] top-0 h-full w-[50%] rotate-12 bg-gradient-to-r from-transparent via-zinc-900/5 dark:via-white/10 to-transparent animate-[shine_6s_linear_infinite]" />
        </div>
      </div>

      {/* Main Glass Card with White Background */}
      <div className="relative z-10 max-w-xl w-full mx-4 flex flex-col items-center text-center p-8 sm:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#111114]/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Active Laser Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zinc-900 dark:via-white to-transparent animate-pulse" />

        {/* Animated Central Emblem & Floating Badges */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Pulsing Backlight Ring */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-40 h-40 rounded-full bg-zinc-900/10 dark:bg-white/10 blur-2xl"
          />

          {/* Rotating Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 rounded-full p-0.5 bg-gradient-to-tr from-zinc-900 via-zinc-500 to-zinc-300 dark:from-white dark:via-zinc-400 dark:to-zinc-700 shadow-xl flex items-center justify-center"
          >
            <div className="w-full h-full bg-white dark:bg-[#09090b] rounded-full flex items-center justify-center">
              <Cpu className="w-12 h-12 text-zinc-900 dark:text-white animate-pulse" />
            </div>
          </motion.div>

          {/* Floating Badge - Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute -left-24 top-4 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 backdrop-blur-xl text-[11px] font-extrabold text-zinc-900 dark:text-white shadow-md"
          >
            <CheckCheck className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
            <span>AI Match 100%</span>
          </motion.div>

          {/* Floating Badge - Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -right-24 bottom-4 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 backdrop-blur-xl text-[11px] font-extrabold text-zinc-900 dark:text-white shadow-md"
          >
            <Award className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
            <span>ATS Certified</span>
          </motion.div>
        </div>

        {/* Welcome Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-white animate-spin" style={{ animationDuration: "6s" }} />
            <span>Authentication Verified</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            Welcome Back,{" "}
            <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto font-medium leading-relaxed">
            Launching your high-precision AI Candidate Matching & Resume Evaluation Workspace...
          </p>
        </motion.div>

        {/* 6-Second Progress Indicator Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 w-full p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-2xl shadow-inner space-y-3"
        >
          {/* Progress Message */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 truncate max-w-[280px] sm:max-w-none">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-white shrink-0" />
              <span>{statusMessage}</span>
            </span>
            <span className="font-extrabold text-zinc-900 dark:text-white text-sm tabular-nums shrink-0">{progress}%</span>
          </div>

          {/* High-Contrast Progress Bar */}
          <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-300 dark:border-zinc-700 shadow-inner">
            <div
              className="h-full rounded-full bg-zinc-900 dark:bg-white transition-all ease-linear shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-400 font-mono pt-1">
            <span>6.0s Launch Pipeline</span>
            <span className="text-zinc-900 dark:text-white font-bold">✓ SSL Encrypted</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WelcomeSplashScreen;
