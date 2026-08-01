"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Cpu, Award, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function AuthScanningShowcase() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      {/* Backlight Ambient Glow */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-primary/20 via-purple-600/15 to-indigo-500/20 blur-2xl animate-pulse -z-10" />

      {/* Main Glass Showcase Box */}
      <div className="relative border border-border/80 bg-card/90 dark:bg-[#111115]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col justify-between h-[480px]">
        {/* Active Laser Scanner Line */}
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent animate-scan z-30 shadow-[0_0_20px_rgba(var(--primary),0.9)]" />

        {/* Top Header Badge Row */}
        <div className="flex items-center justify-between z-10 pt-1">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-extrabold text-primary shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: "6s" }} />
            <span>AI Neural Scanner</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE SCANNING
          </div>
        </div>

        {/* Central Animated Cogs & Document Mock */}
        <div className="relative my-6 flex-1 flex flex-col justify-center z-10">
          {/* Animated Gear / Cog Overlays */}
          <div className="absolute right-4 top-2 pointer-events-none opacity-20 dark:opacity-30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-2 border-dashed border-primary rounded-full flex items-center justify-center"
            >
              <Cpu className="w-8 h-8 text-primary" />
            </motion.div>
          </div>

          <div className="absolute left-2 bottom-4 pointer-events-none opacity-15 dark:opacity-25">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border border-dashed border-purple-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-purple-500" />
            </motion.div>
          </div>

          {/* Document Header Mock */}
          <div className="space-y-2.5 mb-4">
            <div className="h-4 w-48 bg-foreground/90 rounded-full" />
            <div className="h-2.5 w-32 bg-muted-foreground/30 rounded-full" />
            <div className="h-2.5 w-40 bg-muted-foreground/20 rounded-full" />
          </div>

          {/* Candidate Skill Chips */}
          <div className="flex items-center gap-1.5 flex-wrap my-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              React 19
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              TypeScript
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              NLP Engine
            </span>
          </div>

          {/* Document Line Placeholders with Active Scanning Animation */}
          <div className="space-y-2.5 my-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full ${
                  i === 1
                    ? "bg-primary/40 w-11/12 animate-pulse"
                    : i % 3 === 0
                    ? "bg-muted-foreground/25 w-full"
                    : i % 2 === 0
                    ? "bg-muted-foreground/15 w-10/12"
                    : "bg-muted-foreground/15 w-8/12"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Match Score Box */}
        <div className="relative z-10 pt-4 border-t border-border/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Overall Match Score
              </span>
            </div>
            <span className="text-3xl font-black text-foreground">
              98<span className="text-lg font-bold text-muted-foreground">%</span>
            </span>
          </div>

          {/* Score Bar */}
          <div className="h-2.5 bg-muted rounded-full overflow-hidden p-0.5 border border-border shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-purple-600 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: "98%" }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-between items-center mt-3 text-[11px] font-semibold text-muted-foreground">
            <span className="text-primary font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High Compatibility Match
            </span>
            <span>Evaluated in 2.8s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthScanningShowcase;
