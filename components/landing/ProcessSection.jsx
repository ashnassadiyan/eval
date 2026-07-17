"use client";
import { useEffect, useState } from "react";
import { Upload, Cpu, FileSearch, CheckCheck } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Upload Documents",
    desc: "Submit your resume and target job description.",
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI Analysis",
    desc: "Our engine evaluates skills, experience, and intent.",
  },
  {
    num: "03",
    icon: FileSearch,
    title: "Detailed Insights",
    desc: "Receive match scores and a complete strength analysis.",
  },
  {
    num: "04",
    icon: CheckCheck,
    title: "Better Decisions",
    desc: "Apply or hire with complete, data-backed confidence.",
  },
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      className="border-b border-border flex items-center py-12 sm:py-24 bg-surface-dim overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-12">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
            The Evaluation Process
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed px-4 md:px-0">
            From resume upload to intelligent candidate evaluation in seconds.
            Our AI analyzes, scores, and generates insights through a structured
            processing pipeline.
          </p>
        </div>

        {/* Process Cards */}
        <div className="mt-10 sm:mt-20 grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
          {steps.map(({ num, icon: Icon, title, desc }, index) => {
            const active = activeStep === index;

            return (
              <div
                key={num}
                className={`
                  relative overflow-hidden rounded-3xl border
                  transition-all duration-700 ease-in-out
                  ${
                    active
                      ? "bg-black text-white scale-105 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border-black"
                      : "bg-card border-border hover:border-primary/30"
                  }
                `}
              >
                {/* Animated Scan Layer */}
                {active && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 animate-pulse" />

                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-white">
                      <div className="absolute inset-0 blur-md bg-white" />
                    </div>
                  </>
                )}

                <div className="relative z-10 p-4 sm:p-8">
                  {/* Number */}
                  <span
                    className={`
                      block text-4xl sm:text-7xl font-black transition-all duration-700
                      ${
                        active
                          ? "text-white/20"
                          : "text-border/40"
                      }
                    `}
                  >
                    {num}
                  </span>

                  {/* Icon */}
                  <div className="mt-8">
                    <div
                      className={`
                        inline-flex items-center justify-center
                        rounded-2xl p-4 transition-all duration-700
                        ${
                          active
                            ? "bg-white text-black shadow-xl"
                            : "bg-primary/10 text-primary"
                        }
                      `}
                    >
                      <Icon className="size-7" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 sm:mt-6 text-lg sm:text-2xl font-bold">
                    {title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`
                      mt-4 leading-relaxed transition-all duration-700
                      ${
                        active
                          ? "text-white/70"
                          : "text-muted-foreground"
                      }
                    `}
                  >
                    {desc}
                  </p>

                  {/* Status */}
                  <div className="mt-8 flex items-center gap-2">
                    <div
                      className={`
                        h-3 w-3 rounded-full transition-all duration-700
                        ${
                          active
                            ? "bg-green-400 animate-pulse"
                            : "bg-border"
                        }
                      `}
                    />

                    <span
                      className={`
                        text-xs uppercase tracking-widest font-medium
                        transition-all duration-700
                        ${
                          active
                            ? "text-green-400"
                            : "text-muted-foreground"
                        }
                      `}
                    >
                      {active ? "Processing" : "Waiting"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-16">
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>

          <div className="mt-3 text-center text-sm text-muted-foreground">
            AI Pipeline Progress
          </div>
        </div>
      </div>
    </section>
  );
}