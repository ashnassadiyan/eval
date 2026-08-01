"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Upload, Cpu, FileSearch, CheckCheck, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Upload Documents",
    desc: "Drag & drop your resume PDF alongside the target job description.",
    badge: "Input Stage",
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI Analysis",
    desc: "Our neural engine evaluates context, skills, intent, and relevance.",
    badge: "Processing",
  },
  {
    num: "03",
    icon: FileSearch,
    title: "Detailed Insights",
    desc: "Generate match scores, skills gap breakdown, and recommendations.",
    badge: "Scoring",
  },
  {
    num: "04",
    icon: CheckCheck,
    title: "Data-Backed Action",
    desc: "Apply or hire with complete confidence backed by real intelligence.",
    badge: "Outcome",
  },
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Auto cycle active step every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative border-b border-border flex items-center py-20 sm:py-28 md:py-36 overflow-hidden bg-background text-foreground"
    >
      {/* Background Parallax Lighting */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse" />
        <div
          className="absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      <motion.div style={{ opacity }} className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-extrabold text-primary mb-4 backdrop-blur-xl shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Structured Evaluation Pipeline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            The Evaluation Process
          </h2>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            From document upload to intelligent candidate report in under 10 seconds.
            Our AI powers a 4-stage precision pipeline.
          </p>
        </div>

        {/* Process Steps Cards Grid */}
        <div className="mt-14 sm:mt-20 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 relative z-10">
          {steps.map(({ num, icon: Icon, title, desc, badge }, index) => {
            const active = activeStep === index;

            return (
              <div
                key={num}
                onClick={() => setActiveStep(index)}
                className={`
                  relative overflow-hidden rounded-3xl border p-6 sm:p-7
                  transition-all duration-500 cursor-pointer select-none flex flex-col justify-between
                  ${
                    active
                      ? "bg-gradient-to-b from-card via-card to-primary/10 border-primary/60 shadow-2xl scale-[1.03] shadow-primary/10"
                      : "bg-card/70 border-border/80 hover:border-primary/40 hover:bg-card hover:scale-[1.01]"
                  }
                `}
              >
                {/* Active Laser Top Bar */}
                {active && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
                )}

                <div>
                  {/* Top Row: Number & Status Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`text-4xl font-black font-mono tracking-tighter transition-colors duration-500 ${
                        active
                          ? "text-primary opacity-100"
                          : "text-muted-foreground/30"
                      }`}
                    >
                      {num}
                    </span>

                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-500 ${
                        active
                          ? "bg-primary/15 text-primary border border-primary/30 shadow-sm"
                          : "bg-muted/80 text-muted-foreground border border-border/60"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          active ? "bg-primary animate-ping" : "bg-muted-foreground/40"
                        }`}
                      />
                      {active ? "Active" : badge}
                    </div>
                  </div>

                  {/* Icon Container */}
                  <div className="my-4">
                    <div
                      className={`
                        w-13 h-13 rounded-2xl flex items-center justify-center
                        transition-all duration-500
                        ${
                          active
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                            : "bg-primary/10 text-primary border border-primary/20"
                        }
                      `}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 text-xl font-black text-foreground tracking-tight">
                    {title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                    {desc}
                  </p>
                </div>

                {/* Footer Step Indicator */}
                <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono font-bold text-muted-foreground">
                  <span>Step {index + 1} of 4</span>
                  {active && (
                    <span className="text-primary font-extrabold flex items-center gap-1">
                      Running <ArrowRight className="w-3 h-3 animate-pulse" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Timeline Progress Bar */}
        <div className="mt-14 max-w-xl mx-auto">
          <div className="h-2.5 rounded-full bg-muted/80 overflow-hidden p-0.5 border border-border/80 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-700 ease-out shadow-sm"
              style={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono font-extrabold text-muted-foreground">
            <span>Pipeline Progress</span>
            <span className="text-primary">{Math.round(((activeStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}