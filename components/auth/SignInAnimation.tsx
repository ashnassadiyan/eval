"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Key, CheckCircle2 } from "lucide-react";

export function SignInAnimation() {
  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      {/* Backlight Ambient Monochromatic Glow */}
      <div className="absolute -inset-2 rounded-3xl bg-zinc-400/10 dark:bg-white/10 blur-3xl animate-pulse -z-10" />

      {/* Main Black & White Glass Card - Matching Sign In Form Dimensions */}
      <div className="relative border border-border/80 bg-card/95 dark:bg-[#111115]/95 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-none overflow-hidden flex flex-col items-center justify-between min-h-[480px] text-center">
        {/* Top Active Laser Scan Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent animate-pulse" />

        {/* Ambient Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top Security Monochromatic Pill */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-muted border border-border text-xs font-mono font-extrabold text-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
          <span>Encrypted Session Vault</span>
        </div>

        {/* Central Animated Monochromatic Security Core & Orbiting Rings */}
        <div className="relative my-auto flex items-center justify-center z-10 w-full py-6">
          {/* Pulsing Backlight Halo */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-44 h-44 rounded-full bg-foreground/10 blur-2xl"
          />

          {/* Outer Orbiting Ring 1 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="w-40 h-40 rounded-full border border-dashed border-foreground/30 flex items-center justify-center p-2"
          >
            <div className="w-full h-full rounded-full border border-foreground/20 border-dotted" />
          </motion.div>

          {/* Counter Orbiting Ring 2 */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 rounded-full border border-foreground/30 p-1 flex items-center justify-center"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-foreground absolute -top-1" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/50 absolute -bottom-1" />
          </motion.div>

          {/* Central Shield Core */}
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-24 h-24 rounded-3xl bg-gradient-to-tr from-foreground via-zinc-400 to-zinc-600 dark:from-white dark:via-zinc-300 dark:to-zinc-600 p-0.5 shadow-none flex items-center justify-center"
          >
            <div className="w-full h-full bg-background rounded-[22px] flex items-center justify-center">
              <Lock className="w-10 h-10 text-foreground animate-pulse" />
            </div>
          </motion.div>

          {/* Floating Monochromatic Badge - Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute -left-2 top-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-muted border border-border text-[11px] font-mono font-extrabold text-foreground shadow-none"
          >
            <Key className="w-3.5 h-3.5 text-foreground" />
            <span>256-bit SSL</span>
          </motion.div>

          {/* Floating Monochromatic Badge - Bottom Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -right-2 bottom-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-muted border border-border text-[11px] font-mono font-extrabold text-foreground shadow-none"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
            <span>Identity Verified</span>
          </motion.div>
        </div>

        {/* Bottom Feature Text */}
        <div className="relative z-10 space-y-1">
          <h3 className="text-base font-extrabold text-foreground">Secure Session Verification</h3>
          <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto">
            Instant neural authorization token with SSL encrypted session protection.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInAnimation;
