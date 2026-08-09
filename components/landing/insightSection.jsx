"use client";

import { useEffect, useState, useRef } from "react";
import {
  FileBarChart,
  Search,
  Award,
  CheckCircle2,
  Sparkles,
  Users,
  Target,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const seekerPoints = [
  "Get your resume scored 0-100",
  "Discover missing critical skills",
  "Identify resume strengths & gaps",
  "Receive actionable AI recommendations",
  "Understand employer match fit instantly",
];

const recruiterPoints = [
  "Instantly screen bulk resumes",
  "Automatically rank candidates by fit",
  "Identify candidate skill gaps at a glance",
  "Generate candidate evaluation scores",
  "Download comprehensive PDF evaluation reports",
];

const reportFeatures = [
  { icon: FileBarChart, label: "Match Score", desc: "0-100 Rating" },
  { icon: Search, label: "Skills Gaps", desc: "Missing Tech" },
  { icon: Award, label: "Strengths", desc: "Key Highlights" },
];

export function InsightSection() {
  const [activeTab, setActiveTab] = useState("candidate");
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Auto toggle between seeker and recruiter every 6s unless manually clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "candidate" ? "recruiter" : "candidate"));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="relative overflow-hidden flex flex-col justify-center border-b border-border py-20 sm:py-28 md:py-36 bg-background text-foreground"
    >
      {/* Background Lighting */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px] animate-pulse" />
        <div
          className="absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px] animate-pulse"
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

      <motion.div style={{ y: contentY, opacity }} className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-extrabold text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Dual-Sided Intelligence Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Built for Both Seekers & Recruiters
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground font-medium">
            Whether you want to optimize your resume or streamline candidate evaluation,
            EvalCV.app delivers actionable precision.
          </p>

          {/* Interactive Switcher Pill */}
          <div className="mt-8 inline-flex items-center gap-1.5 bg-card border border-border p-1.5 rounded-2xl shadow-lg">
            <button
              type="button"
              onClick={() => setActiveTab("candidate")}
              className={`flex items-center justify-center px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                activeTab === "candidate"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              For Job Seekers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recruiter")}
              className={`flex items-center justify-center px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                activeTab === "recruiter"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              For Recruiters
            </button>
          </div>
        </div>

        {/* Dual Card Section */}
        <div className="grid md:grid-cols-2 gap-8 rounded-3xl overflow-hidden shadow-2xl border border-border/80">
          {/* Candidate Card */}
          <motion.div
            animate={{
              scale: activeTab === "candidate" ? 1.01 : 0.99,
              opacity: activeTab === "candidate" ? 1 : 0.85,
            }}
            transition={{ duration: 0.4 }}
            className={`p-7 sm:p-10 md:p-12 flex flex-col justify-between transition-all duration-500 relative ${
              activeTab === "candidate"
                ? "bg-gradient-to-br from-primary/10 via-card to-card border-primary/40 shadow-xl"
                : "bg-card/60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-extrabold uppercase tracking-widest px-3 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                  Candidate Intelligence
                </span>
                {activeTab === "candidate" && (
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Know How Employers See Your Resume.
              </h3>

              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Stop applying blindly. Our AI analyzes your resume against target job descriptions and provides precise, actionable feedback.
              </p>

              <ul className="mt-8 space-y-3.5">
                {seekerPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm sm:text-base font-semibold text-foreground/90">
                    <div className="p-1 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5 border border-primary/20">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Report Feature Pills */}
            <div className="mt-10 pt-6 border-t border-border/80">
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3 font-bold">
                Report Includes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {reportFeatures.map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="p-3 rounded-xl border border-border/80 bg-background/60 backdrop-blur-md text-center hover:scale-105 transition-transform"
                  >
                    <Icon className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-xs font-bold text-foreground">{label}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recruiter Card */}
          <motion.div
            animate={{
              scale: activeTab === "recruiter" ? 1.01 : 0.99,
              opacity: activeTab === "recruiter" ? 1 : 0.85,
            }}
            transition={{ duration: 0.4 }}
            className={`p-7 sm:p-10 md:p-12 flex flex-col justify-between transition-all duration-500 relative ${
              activeTab === "recruiter"
                ? "bg-gradient-to-br from-primary/10 via-card to-card border-primary/40 shadow-xl"
                : "bg-card/60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-extrabold uppercase tracking-widest px-3 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                  Recruiter Screening
                </span>
                {activeTab === "recruiter" && (
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Screen & Rank Top Talent Faster.
              </h3>

              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Eliminate hundreds of hours of manual resume review. Filter for qualified candidates who actually match your role criteria.
              </p>

              <ul className="mt-8 space-y-3.5">
                {recruiterPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm sm:text-base font-semibold text-foreground/90">
                    <div className="p-1 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5 border border-primary/20">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Stat Card */}
            <div className="mt-10 p-5 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-md flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-foreground">
                  92%
                </p>
                <p className="text-xs font-bold text-foreground">Faster Resume Screening</p>
                <p className="text-[10px] text-muted-foreground">Automated matching pipeline</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-lg shadow-md">
                ⚡
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}