"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="relative border-b border-border bg-background text-foreground overflow-hidden py-24 sm:py-32 md:py-40"
    >
      {/* Dynamic Background */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-primary/10 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      <motion.div
        style={{ scale, y: contentY }}
        className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center"
      >
        {/* Top Tag Pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-extrabold text-primary mb-8 backdrop-blur-xl shadow-sm"
        >
          <Sparkles className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: "8s" }} />
          <span>Start for free — Includes 100 Free AI Evaluation Credits</span>
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-foreground"
        >
          Ready to Screen & Match
          <span className="block bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent pb-2">
            Candidates Smarter?
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium"
        >
          Join thousands of recruiters and job seekers leveraging EvalCv to make data-backed hiring decisions with zero friction.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            className="group h-14 px-10 rounded-2xl text-base font-extrabold bg-primary text-primary-foreground shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            asChild
          >
            <Link href="/dashboard/evaluate">
              <Sparkles className="mr-2 h-5 w-5 text-primary-foreground animate-pulse" />
              Evaluate CV Free Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-14 px-9 rounded-2xl text-base font-bold bg-background border-border hover:bg-muted text-foreground shadow-sm transition-all"
            asChild
          >
            <Link href="/login">
              Sign In to Account
            </Link>
          </Button>
        </motion.div>

        {/* Trust Badges Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground font-semibold"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Free credits included
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" /> GDPR & SOC2 Compliant
          </span>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
