"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Briefcase,
  UserCheck,
  Building,
  Award,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/NotificationSlice";

type UserRole = "recruiter" | "candidate";

export default function OnboardingPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("candidate");

  // Step 2 Form State (Job Seeker / Candidate)
  const [targetRole, setTargetRole] = useState("Full-Stack Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Senior (3-5 yrs)");
  const [keySkills, setKeySkills] = useState("React, TypeScript, Node.js");

  // Step 2 Form State (Independent Recruiter)
  const [agencyName, setAgencyName] = useState(user?.name ? `${user.name} Recruiting` : "Independent Talent");
  const [hiringCategory, setHiringCategory] = useState("Engineering & Tech");
  const [candidateVolume, setCandidateVolume] = useState("20 - 50 Candidates/month");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    try {
      // Save onboarding choices to user object in localStorage
      const storedUser = localStorage.getItem("user");
      const userObj = storedUser ? JSON.parse(storedUser) : { ...user };

      const updatedUser = {
        ...userObj,
        user_type: selectedRole,
        onboarding_completed: true,
        preferences:
          selectedRole === "candidate"
            ? { targetRole, experienceLevel, keySkills }
            : { agencyName, hiringCategory, candidateVolume },
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      dispatch(
        showNotification({
          title: "Welcome to evalcv.app!",
          body: `Onboarding completed as ${
            selectedRole === "recruiter" ? "Independent Recruiter" : "Job Seeker"
          }.`,
          type: "success",
        })
      );

      router.push(`/signup-success?email=${encodeURIComponent(user?.email || "")}&role=${selectedRole}`);
    } catch (e) {
      console.error("Error completing onboarding:", e);
      router.push(`/signup-success?email=${encodeURIComponent(user?.email || "")}&role=${selectedRole}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0a0a0c] text-zinc-900 dark:text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[160px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Top Header & Progress Steps */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-extrabold text-blue-600 dark:text-blue-400 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Account Onboarding Setup</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Welcome to evalcv.app, {user?.name || "Member"}!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Let&apos;s customize your intelligence engine based on your goals.
          </p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                    step === s
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md scale-110"
                      : step > s
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-10 sm:w-16 h-1 rounded-full transition-colors ${
                      step > s ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding Steps Card */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {/* STEP 1: SELECT USER ROLE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center max-w-md mx-auto">
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                    Choose Your Role
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Select the option that best describes how you plan to use evalcv.app.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Job Seeker Selection Card */}
                  <div
                    onClick={() => setSelectedRole("candidate")}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                      selectedRole === "candidate"
                        ? "border-blue-600 dark:border-white bg-blue-50/40 dark:bg-blue-950/20 shadow-lg scale-[1.02]"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/40"
                    }`}
                  >
                    {selectedRole === "candidate" && (
                      <div className="absolute top-4 right-4 text-blue-600 dark:text-white">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        Job Seeker
                      </span>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-2">
                        Candidate & Job Hunter
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium">
                        Evaluate your resume against target job descriptions, discover missing skills, and boost ATS match scores.
                      </p>
                    </div>

                    <ul className="mt-5 space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Resume Score (0-100)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Skills Gap Analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Custom AI Suggestions
                      </li>
                    </ul>
                  </div>

                  {/* Independent Recruiter Selection Card */}
                  <div
                    onClick={() => setSelectedRole("recruiter")}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                      selectedRole === "recruiter"
                        ? "border-blue-600 dark:border-white bg-blue-50/40 dark:bg-blue-950/20 shadow-lg scale-[1.02]"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/40"
                    }`}
                  >
                    {selectedRole === "recruiter" && (
                      <div className="absolute top-4 right-4 text-blue-600 dark:text-white">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        Recruiter
                      </span>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-2">
                        Independent Recruiter
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium">
                        Screen bulk applicant CVs, evaluate fit scores, rank candidates, and produce PDF evaluation reports.
                      </p>
                    </div>

                    <ul className="mt-5 space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Bulk CV Screening
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Automated Candidate Ranking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Download PDF Reports
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 shadow-md transition-all cursor-pointer"
                  >
                    Continue to Preferences
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ROLE PREFERENCES & SETUP */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center max-w-md mx-auto">
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                    {selectedRole === "candidate"
                      ? "Job Seeker Setup"
                      : "Recruiter Setup"}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Help us personalize your evaluation workspace.
                  </p>
                </div>

                {selectedRole === "candidate" ? (
                  <div className="space-y-4 max-w-lg mx-auto bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                        Target Job Role
                      </label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Senior Frontend Developer"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                        Experience Level
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
                        <option value="Mid-Senior (3-5 yrs)">Mid-Senior (3-5 yrs)</option>
                        <option value="Senior / Lead (6+ yrs)">Senior / Lead (6+ yrs)</option>
                        <option value="Executive / Manager">Executive / Manager</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                        Primary Key Skills
                      </label>
                      <input
                        type="text"
                        value={keySkills}
                        onChange={(e) => setKeySkills(e.target.value)}
                        placeholder="e.g. React, TypeScript, Tailwind, Node.js"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-lg mx-auto bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                        Agency or Recruiter Brand Name
                      </label>
                      <input
                        type="text"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder="e.g. Apex Talent Solutions"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                        Primary Hiring Sector
                      </label>
                      <select
                        value={hiringCategory}
                        onChange={(e) => setHiringCategory(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Engineering & Tech">Engineering & Tech</option>
                        <option value="Product & Design">Product & Design</option>
                        <option value="Finance & Banking">Finance & Banking</option>
                        <option value="Sales & Marketing">Sales & Marketing</option>
                        <option value="General Recruiting">General Recruiting</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                        Monthly Candidate Volume
                      </label>
                      <select
                        value={candidateVolume}
                        onChange={(e) => setCandidateVolume(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="1 - 10 Candidates/month">1 - 10 Candidates/month</option>
                        <option value="20 - 50 Candidates/month">20 - 50 Candidates/month</option>
                        <option value="50 - 100+ Candidates/month">50 - 100+ Candidates/month</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 shadow-md transition-all cursor-pointer"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CONFIRM & LAUNCH */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
                  <Award className="w-8 h-8" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                    You&apos;re All Set!
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    Your account has been configured as a{" "}
                    <span className="font-bold text-zinc-900 dark:text-white uppercase">
                      {selectedRole === "recruiter"
                        ? "Independent Recruiter"
                        : "Job Seeker"}
                    </span>
                    .
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 max-w-md mx-auto text-left space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Configured Summary
                  </p>
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-zinc-500">Account Type:</span>
                    <span className="font-bold text-zinc-900 dark:text-white capitalize">
                      {selectedRole}
                    </span>
                  </div>
                  {selectedRole === "candidate" ? (
                    <>
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-zinc-500">Target Role:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {targetRole}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-zinc-500">Experience Level:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {experienceLevel}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-zinc-500">Brand Name:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {agencyName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-zinc-500">Hiring Sector:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {hiringCategory}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center text-xs font-medium pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-500">Evaluation Credits:</span>
                    <span className="font-bold text-emerald-500">20 Free Tokens</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishOnboarding}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    {isSubmitting ? "Finishing..." : "Launch Dashboard"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
