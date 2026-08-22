"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Link2,
  FileText,
  FileUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Copy,
  Check,
  UserCheck,
  Layers,
} from "lucide-react";

const flowSteps = [
  {
    step: "01",
    icon: Link2,
    badge: "Recruiter Action",
    title: "1. Share Unique Job Link",
    desc: "Recruiters generate a dedicated job link on evalcv and post it on LinkedIn, job boards, or email it directly to candidates.",
    preview: "evalcv.app/apply/Senior-FullStack-Engineer/102",
  },
  {
    step: "02",
    icon: FileText,
    badge: "No Login Needed",
    title: "2. Candidate Views Role",
    desc: "Candidate clicks the link to view the complete Job Description, role specs, and company info without creating an account.",
    preview: "Clean JD document viewer with role requirements",
  },
  {
    step: "03",
    icon: FileUp,
    badge: "1-Click Submission",
    title: "3. Direct CV Upload",
    desc: "Candidate drops their PDF resume and email address into the quick-apply panel and clicks 'Submit Application'.",
    preview: "Drag & Drop PDF • Max 10MB • Instant verification",
  },
  {
    step: "04",
    icon: Layers,
    badge: "Automated Screening",
    title: "4. AI Scoring & Pipeline Sync",
    desc: "evalcv AI instantly parses the resume, calculates match score %, extracts skill gaps, and syncs candidate to recruiter dashboard.",
    preview: "Match Score 94% • High Fit • Automated Confidential Report",
  },
];

export function CandidateFlowSection() {
  const [copied, setCopied] = useState(false);
  const sampleUrl = "https://evalcv.app/apply/Senior%20Software%20Engineer/demo-job-1";

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="candidate-flow" className="relative py-20 lg:py-28 bg-background text-foreground transition-colors overflow-hidden">
      {/* Background Decorative Lighting (Monochrome) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-foreground/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-800 text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
            <span>Direct Candidate Application Flow</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
            How Candidates Apply <br />
            <span className="text-zinc-900 dark:text-white">
              Directly via Unique Job Links.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Eliminate friction in candidate sourcing. Candidates click your custom job link, review the job description, and submit their CV in under 30 seconds.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative">
          {flowSteps.map(({ step, icon: Icon, badge, title, desc, preview }, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-[#111115]/90 backdrop-blur-xl shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Top Row: Step number & Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-black font-mono text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {step}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
                  {badge}
                </span>
              </div>

              <div>
                {/* Premium Icon Badge Container (Monochrome Black & White) */}
                <div className="p-3.5 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 w-fit mb-5 border border-zinc-200/20 dark:border-zinc-800 shadow-xl shadow-black/10 dark:shadow-white/10 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white transition-colors tracking-tight mb-2">
                  {title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium mb-6">
                  {desc}
                </p>
              </div>

              {/* Sample preview box */}
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono font-semibold text-zinc-600 dark:text-zinc-400 flex items-center justify-between gap-2 overflow-hidden">
                <span className="truncate">{preview}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-white shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Link Demo Box */}
        <div className="p-8 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#111115]/95 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-1 left-0 bg-zinc-900 dark:bg-white" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left text */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-mono font-bold border border-zinc-200 dark:border-zinc-800 mb-3">
                <Zap className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                <span>Zero Candidate Friction • No Password Required</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Try the Candidate Application Experience
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                Test how a candidate sees your job link. When candidates apply through this link, their CV is parsed and benchmarked instantly into your candidate pipeline.
              </p>

              {/* Sample Shareable URL Input */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full flex-1">
                  <input
                    type="text"
                    readOnly
                    value={sampleUrl}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-900 dark:text-white font-mono text-xs sm:text-sm focus:outline-none select-all"
                  />
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-zinc-900 dark:text-white" />
                      <span>Copied Link!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-900 dark:text-white" />
                      <span>Copy Job Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center">
              <div className="p-3.5 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 mb-3 shadow-md">
                <UserCheck className="w-7 h-7 stroke-[2]" />
              </div>
              <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Ready to collect candidate applications?
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium mb-4">
                Create your first job posting and generate your shareable link in under 1 minute.
              </p>
              <Link
                href="/my_jobs/create_job"
                className="w-full py-3 px-6 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-extrabold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 dark:shadow-white/10"
              >
                <span>Create Job & Get Link</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
