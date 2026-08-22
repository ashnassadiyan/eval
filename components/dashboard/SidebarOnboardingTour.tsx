"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  FileCheck2,
  Briefcase,
  Bell,
  User,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  navKey: string;
  description: string;
  details: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to evalcv.app Intelligence Workspace!",
    badge: "New User Onboarding",
    icon: <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />,
    navKey: "overview",
    description:
      "Your high-precision evalcv engine is ready. Let's take a quick 1-minute guided tour of your navigation sidebar so you can hit the ground running.",
    details: [
      "AI Candidate Benchmarking & Evaluation",
      "Tailored ATS Resume Generation",
      "Automated Job Applicant Portals",
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard Overview",
    badge: "Main Hub",
    icon: <LayoutDashboard className="w-6 h-6 text-blue-500" />,
    navKey: "Dashboard",
    description:
      "Your central command center for hiring metrics, recent candidate evaluations, active job postings, and token allocation usage.",
    details: [
      "Track total candidates evaluated",
      "Monitor active job position metrics",
      "View quick-access recruitment insights",
    ],
  },
  {
    id: "evaluation",
    title: "AI Candidate Evaluation & Tailored CVs",
    badge: "Core Feature",
    icon: <FileCheck2 className="w-6 h-6 text-emerald-500" />,
    navKey: "Evaluation",
    description:
      "Upload target Job Descriptions and Candidate Resumes to run strict AI match scoring, extract missing technical skills, generate PDF recruiter reports, and build ATS-tailored CVs.",
    details: [
      "Cross-match candidate CV against JD",
      "Generate detailed PDF evaluation reports",
      "Build tailored ATS resumes (2 free generations)",
    ],
  },
  {
    id: "my_jobs",
    title: "My Jobs & Public Applicant Portal",
    badge: "Position Manager",
    icon: <Briefcase className="w-6 h-6 text-purple-500" />,
    navKey: "My Jobs",
    description:
      "Create and manage position requirements, set deadline dates, and share automated public candidate application links directly with applicants.",
    details: [
      "Create & edit position requirements",
      "Share public application links with candidates",
      "Automatically collect & screen incoming resumes",
    ],
  },
  {
    id: "notifications",
    title: "Notifications & Token Balance",
    badge: "Alerts & Credits",
    icon: <Bell className="w-6 h-6 text-amber-500" />,
    navKey: "Notifications",
    description:
      "Stay informed with real-time push alerts when candidates apply, and keep track of your available evaluation credit tokens in the top header.",
    details: [
      "Receive push alerts for new applicant uploads",
      "Track evaluation credit token consumption",
      "Manage notification preferences",
    ],
  },
  {
    id: "profile_help",
    title: "My Profile, Settings & Support",
    badge: "Account & Assistance",
    icon: <User className="w-6 h-6 text-cyan-500" />,
    navKey: "My Profile",
    description:
      "Manage your recruiter account credentials, security settings, FCM notification tokens, and access documentation or contact support anytime.",
    details: [
      "Update profile & account credentials",
      "Access Help & Support guidebooks",
      "Re-trigger this guided sidebar tour anytime",
    ],
  },
];

const LOCAL_STORAGE_KEY = "evalcv_sidebar_tour_seen";

interface SidebarOnboardingTourProps {
  onTourClose?: () => void;
}

export function SidebarOnboardingTour({ onTourClose }: SidebarOnboardingTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeen = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!hasSeen || hasSeen !== "true") {
        setIsOpen(true);
      }
    }
  }, []);

  const handleFinishTour = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    }
    if (onTourClose) onTourClose();
  };

  const handleNextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinishTour();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/75 dark:bg-black/85 backdrop-blur-md p-4 select-none antialiased">
        {/* Parallax Background Grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-32 -top-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[160px] animate-pulse" />
          <div className="absolute -right-32 -bottom-32 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[160px] animate-pulse" />
        </div>

        {/* TOUR DIALOG CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden text-foreground"
        >
          {/* Top Laser Scanner Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />

          {/* Close / Skip Button */}
          <button
            type="button"
            onClick={handleFinishTour}
            className="absolute top-5 right-5 p-2 rounded-xl border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step Badge & Navigation Counter */}
          <div className="flex items-center justify-between mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-mono font-extrabold uppercase tracking-wider text-primary">
              {currentStep.icon}
              <span>{currentStep.badge}</span>
            </div>

            <span className="text-xs font-mono font-bold text-muted-foreground">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
              {currentStep.title}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans font-medium">
              {currentStep.description}
            </p>

            {/* Highlights List */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground">
                Key Features & Capabilities:
              </p>
              <div className="space-y-1.5">
                {currentStep.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Indicators Bar */}
          <div className="flex items-center justify-center gap-1.5 my-6">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentStepIndex
                    ? "w-6 bg-foreground"
                    : idx < currentStepIndex
                    ? "w-2 bg-emerald-500"
                    : "w-2 bg-muted"
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={isFirstStep}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                isFirstStep
                  ? "opacity-30 border border-border text-muted-foreground cursor-not-allowed"
                  : "border border-border bg-card hover:bg-muted text-foreground"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFinishTour}
                className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Skip Tour
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-foreground text-background hover:opacity-90 transition-all shadow-md cursor-pointer"
              >
                <span>{isLastStep ? "Finish Tour ✓" : "Next Step"}</span>
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function resetSidebarTour() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}
