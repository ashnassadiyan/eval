import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  "Resume Match Score",
  "Skills Gap Analysis",
  "Hiring Recommendations",
  "Candidate Ranking",
  "AI-Powered Insights",
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative snap-always snap-start min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] shrink-0 overflow-hidden border-b border-border"
    >
      {/* BACKGROUND LAYERS */}

      {/* Base gradient */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Moving glow blobs */}
      {/* Increased opacity (20% -> 40%) so the black-tinted glow actually
          reads against the light background; on a white page a 140px-blur
          black blob at 20% opacity dilutes to invisible. */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/40 blur-[140px] animate-pulse -z-20" />
      <div
        className="absolute -right-40 bottom-[-120px] h-[500px] w-[500px] rounded-full bg-primary/25 blur-[140px] animate-pulse -z-20"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Light sweep animation */}
      {/* NOTE: this relies on a `shine` keyframe + `float` keyframe (used
          further below) that aren't defined in globals.css. Add the
          @keyframes block at the bottom of this file's comment to
          globals.css, or these two will silently no-op. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[30%] top-0 h-full w-[40%] rotate-12 bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-[shine_8s_linear_infinite]" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative mx-auto w-full min-h-[calc(100vh-4rem)] grid max-w-[1280px] items-center gap-8 md:gap-12 px-4 py-10 md:py-10 md:grid-cols-2 md:px-12">
        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Resume Intelligence Platform
          </div>

          <h1 className="mt-6 text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <span className="block bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              Resume Screening
            </span>
            <span className="block bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
              & Candidate Matching
            </span>
          </h1>

          <p className="mt-4 md:mt-6 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground">
            Help job seekers stand out and recruiters find the best talent —
            faster, smarter, and more accurately.
          </p>

          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Core Capabilities
            </p>

            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {capabilities.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg hover:opacity-90"
            >
              Get Started Free
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button size="lg" variant="outline">
              Book a Demo
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
          <div className="relative w-full max-w-[480px] h-[60vh] lg:h-[70vh] border border-border/40 bg-card/70 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Scanner line */}
            <div className="absolute left-0 right-0 top-0 h-[3px] bg-primary animate-scan z-20" />

            {/* Resume mock */}
            <div className="h-full p-8 flex flex-col">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-3 w-40 bg-foreground rounded-full" />
                  <div className="h-2 w-28 bg-border rounded-full" />
                  <div className="h-2 w-32 bg-border rounded-full" />
                </div>

                <CheckCircle2 className="text-primary" />
              </div>

              <div className="mt-8 flex-1 space-y-3 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full bg-border ${
                      i % 3 === 0
                        ? "w-full"
                        : i % 2 === 0
                        ? "w-10/12"
                        : "w-8/12"
                    }`}
                  />
                ))}
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    AI Analyzing Resume
                  </span>
                  <span className="text-4xl font-bold">82%</span>
                </div>

                <div className="mt-3 h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-[82%] bg-primary" />
                </div>
              </div>
            </div>

            {/* glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
