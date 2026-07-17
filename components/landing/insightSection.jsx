"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  FileBarChart,
  Search,
  Award,
} from "lucide-react";

const seekerPoints = [
  "Get your resume scored 0-100",
  "Discover missing skills",
  "Identify strengths",
  "Receive recommendations",
  "Understand the fit",
];

const recruiterPoints = [
  "Instantly screen resumes",
  "Rank candidates by relevance",
  "Identify skill gaps",
  "Get evaluation scores",
  "Generate evaluation reports",
];

const reportFeatures = [
  { icon: FileBarChart, label: "Match Score" },
  { icon: Search, label: "Skills Gaps" },
  { icon: Award, label: "Strengths" },
];

export function InsightSection() {
  const [swap, setSwap] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSwap((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="why-us"
      className="relative overflow-hidden snap-always snap-start min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] flex items-center border-b border-border py-8 md:py-0"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl mx-4 md:mx-auto">

        {/* LEFT - Candidate */}
        <div
          className={`p-6 sm:p-10 md:p-16 transition-all duration-1000 ${
            swap
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground"
          }`}
        >
          <p
            className={`text-sm uppercase tracking-widest transition-all duration-1000 ${
              swap ? "text-white/60" : "text-muted-foreground"
            }`}
          >
            For Candidates
          </p>

          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Know How Employers See Your Resume.
          </h2>

          <p
            className={`mt-5 text-base md:text-lg leading-relaxed max-w-lg transition-all duration-1000 ${
              swap ? "text-white/70" : "text-muted-foreground"
            }`}
          >
            Stop applying blindly. Our AI analyzes your resume against a job
            description and gives you clear, actionable insights.
          </p>

          <ul className="mt-6 sm:mt-10 space-y-3 sm:space-y-5">
            {seekerPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 text-base font-medium"
              >
                <ArrowRight
                  className={`size-5 transition-all duration-1000 ${
                    swap ? "text-white/80" : "text-primary"
                  }`}
                />
                {point}
              </li>
            ))}
          </ul>

          <div
            className={`mt-12 pt-8 transition-all duration-1000 ${
              swap
                ? "border-t border-white/20"
                : "border-t border-border"
            }`}
          >
            <p
              className={`text-xs uppercase tracking-[0.2em] transition-all duration-1000 ${
                swap ? "text-white/60" : "text-muted-foreground"
              }`}
            >
              Detailed AI Report Includes
            </p>

            <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-3 sm:gap-6">
              {reportFeatures.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className={`rounded-xl border p-3 sm:p-5 text-center transition-all duration-1000 hover:scale-105 ${
                    swap
                      ? "border-white/20 bg-white/5 backdrop-blur-sm"
                      : "border-border bg-background"
                  }`}
                >
                  <Icon
                    className={`mx-auto size-7 transition-all duration-1000 ${
                      swap ? "text-white" : "text-primary"
                    }`}
                  />
                  <p className="mt-3 text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT - Recruiter */}
        <div
          className={`relative p-6 sm:p-10 md:p-16 transition-all duration-1000 ${
            swap
              ? "bg-card text-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          <p
            className={`text-sm uppercase tracking-widest transition-all duration-1000 ${
              swap ? "text-muted-foreground" : "text-white/60"
            }`}
          >
            For Recruiters
          </p>

          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Find Top Talent Faster.
          </h2>

          <p
            className={`mt-5 text-base md:text-lg leading-relaxed max-w-lg transition-all duration-1000 ${
              swap ? "text-muted-foreground" : "text-white/70"
            }`}
          >
            Reduce manual screening and focus only on candidates who actually
            match.
          </p>

          <ul className="mt-6 sm:mt-10 space-y-3 sm:space-y-5">
            {recruiterPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 text-base font-medium"
              >
                <ArrowRight
                  className={`size-5 transition-all duration-1000 ${
                    swap ? "text-primary" : "text-white/80"
                  }`}
                />
                {point}
              </li>
            ))}
          </ul>

          <div
            className={`mt-12 pt-8 transition-all duration-1000 ${
              swap
                ? "border-t border-border"
                : "border-t border-white/20"
            }`}
          >
            <p className="text-3xl font-bold">
              Save Hours Every Week.
            </p>

            <p
              className={`mt-3 text-base leading-relaxed max-w-md transition-all duration-1000 ${
                swap
                  ? "text-muted-foreground"
                  : "text-white/70"
              }`}
            >
              Automate resume screening, ranking, and evaluation
              so you can focus on hiring decisions—not manual
              review.
            </p>
          </div>

          {/* Floating Stats */}
          <div
            className={`absolute bottom-6 right-6 sm:bottom-10 sm:right-10 rounded-2xl p-3 sm:p-5 backdrop-blur-xl transition-all duration-1000 ${
              swap
                ? "bg-primary/10 border border-border"
                : "bg-white/10 border border-white/20"
            }`}
          >
            <div className="text-2xl sm:text-4xl font-extrabold">92%</div>
            <div
              className={`text-sm transition-all duration-1000 ${
                swap
                  ? "text-muted-foreground"
                  : "text-white/70"
              }`}
            >
              Faster Screening
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}