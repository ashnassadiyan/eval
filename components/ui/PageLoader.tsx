"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Cpu, ShieldCheck, Zap } from "lucide-react";

interface PageLoaderProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

const DEFAULT_PHASES = [
  "Initializing Intelligence Engine...",
  "Parsing candidate matching parameters...",
  "Loading ATS evaluation algorithms...",
  "Optimizing talent analytics dashboard...",
  "Readying your workspace...",
];

export function PageLoader({
  message,
  subtext,
  fullScreen = true,
}: PageLoaderProps) {
  const [progress, setProgress] = useState(12);
  const [phaseIndex, setPhaseIndex] = useState(0);

  // Smooth progress increment simulation & cycling phase text if default
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        const diff = Math.max(1, Math.floor((100 - prev) / 8));
        return prev + diff;
      });
    }, 180);

    const phaseTimer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % DEFAULT_PHASES.length);
    }, 2200);

    return () => {
      clearInterval(progressTimer);
      clearInterval(phaseTimer);
    };
  }, []);

  const currentMessage = message || DEFAULT_PHASES[phaseIndex];
  const currentSubtext =
    subtext || "AI-powered resume screening & candidate matching environment";

  const content = (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto p-8 sm:p-10 select-none z-10">
      {/* Dynamic Background Monochromatic Mesh Orbs */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-72 h-72 rounded-full bg-foreground/10 dark:bg-white/10 blur-[90px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute w-80 h-80 rounded-full bg-zinc-400/15 dark:bg-zinc-200/10 blur-[110px]"
        />
      </div>

      {/* Central Animated Splash Emblem (Black & White Monochromatic) */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Outer Rotating Laser Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-r from-foreground via-zinc-400 to-foreground dark:from-white dark:via-zinc-400 dark:to-white opacity-85 shadow-lg shadow-black/10 dark:shadow-white/10"
        >
          <div className="w-full h-full bg-background/90 backdrop-blur-xl rounded-full" />
        </motion.div>

        {/* Middle Counter-Rotating Dashed Orbit */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-28 h-28 rounded-full border-2 border-dashed border-foreground/30 dark:border-white/30"
        />

        {/* Orbiting Monochromatic Light Particle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-32 h-32 flex items-start justify-center pointer-events-none"
        >
          <div className="w-3.5 h-3.5 -mt-1.5 rounded-full bg-foreground dark:bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] dark:shadow-[0_0_12px_rgba(255,255,255,0.9)] border-2 border-background" />
        </motion.div>

        {/* Inner Pulsing Radar Wave */}
        <motion.div
          animate={{
            scale: [0.8, 1.35],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute w-20 h-20 rounded-full bg-foreground/10 dark:bg-white/10 border border-foreground/20 dark:border-white/20 pointer-events-none"
        />

        {/* Hero Central Monochromatic Emblem Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="absolute w-16 h-16 rounded-2xl bg-gradient-to-tr from-foreground via-zinc-400 to-zinc-700 dark:from-white dark:via-zinc-300 dark:to-zinc-600 p-0.5 shadow-xl shadow-black/20 dark:shadow-white/10 flex items-center justify-center group"
        >
          <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center relative overflow-hidden backdrop-blur-md">
            {/* Shimmer overlay */}
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 dark:via-white/20 to-transparent -skew-x-12"
            />
            <span className="font-black text-xl tracking-tighter text-foreground dark:text-white">
              EV
            </span>
            <Sparkles className="absolute top-1 right-1 w-3 h-3 text-foreground dark:text-white animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Brand Badge Pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-muted backdrop-blur-md shadow-xs mb-3"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground dark:bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground dark:bg-white" />
        </span>
        <span className="text-[11px] font-bold tracking-wider uppercase text-foreground dark:text-white flex items-center gap-1">
          EvalCV.app <span className="opacity-40">•</span> Talent AI Engine
        </span>
      </motion.div>

      {/* Animated Message & Subtext Box */}
      <div className="text-center min-h-[64px] flex flex-col items-center justify-center max-w-xs">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-base font-bold tracking-tight text-foreground dark:text-white"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-1 text-xs text-muted-foreground leading-relaxed font-normal"
        >
          {currentSubtext}
        </motion.p>
      </div>

      {/* Progress Bar & Percentage Readout */}
      <div className="w-full mt-6 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground px-0.5">
          <span className="flex items-center gap-1 text-foreground dark:text-white font-mono">
            <Cpu className="w-3 h-3 text-foreground dark:text-white animate-spin" style={{ animationDuration: '4s' }} />
            Processing
          </span>
          <span className="font-mono text-xs font-bold text-foreground dark:text-white">
            {progress}%
          </span>
        </div>

        {/* Monochromatic Track & Light Flare */}
        <div className="relative w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden p-[1px] shadow-inner">
          <motion.div
            className="h-full rounded-full bg-foreground dark:bg-white relative overflow-hidden"
            initial={{ width: "5%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Shimmer flare traversing progress bar */}
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent w-1/2"
            />
          </motion.div>
        </div>
      </div>

      {/* Monochromatic Security & Reliability Footer Tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex items-center justify-center gap-3 text-[10px] text-muted-foreground font-medium"
      >
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-foreground dark:text-white" /> Secure Processing
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-foreground dark:text-white" /> Instant Match AI
        </span>
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] w-screen h-screen flex items-center justify-center bg-background/95 dark:bg-[#09090b]/95 backdrop-blur-2xl transition-all duration-300 overflow-hidden antialiased">
        {content}
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[380px] flex items-center justify-center p-6 bg-card/40 dark:bg-card/20 backdrop-blur-xl border border-border/60 rounded-3xl overflow-hidden shadow-xl">
      {content}
    </div>
  );
}

export default PageLoader;
