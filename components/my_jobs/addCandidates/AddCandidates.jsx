"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Circle,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Plus,
  Download,
  UserPlus,
  ShieldCheck,
  Check,
  Zap,
} from "lucide-react";
import candidateService from "@/store/services/candidate.service";
import jobService from "@/store/services/job.service";
import { useDispatch, useSelector } from "react-redux";
import { getUserCredit } from "@/store/slices/creditSlice";
import { showNotification } from "@/store/slices/NotificationSlice";
import PdfReportDocument from "@/components/evaluate/ReportTemplate";
import { pdf, BlobProvider } from "@react-pdf/renderer";

/* Gauge Circle Component matching /evaluate */
function CircularProgress({ value, label }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-sm">
      <div className="relative size-[72px]">
        <svg viewBox="0 0 80 80" className="size-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            className="text-zinc-200 dark:text-zinc-800"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-zinc-900 dark:text-white transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-zinc-900 dark:text-white font-mono">
          {value}<span className="text-xs font-normal">%</span>
        </span>
      </div>
      <p className="mt-2 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
    </div>
  );
}

export default function AddCandidates() {
  const params = useParams();
  const jobId = params?.id || params?.[":id"];
  const router = useRouter();
  const dispatch = useDispatch();

  const { balance, total_added, total_used } = useSelector(
    (state) => state.credits
  );

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | evaluating | done
  const [result, setResult] = useState(null);
  const [jobDetail, setJobDetail] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload CV, 2: Report

  const inputRef = useRef(null);
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  // Calculate Token Usage Properly
  const totalAddedNum = Number(total_added) || 0;
  const totalUsedNum = Number(total_used) || 0;
  const balanceNum = Number(balance) || 0;

  const maxTokens =
    totalAddedNum > 0
      ? totalAddedNum
      : balanceNum + totalUsedNum > 0
      ? balanceNum + totalUsedNum
      : 100;
  const usedTokens =
    totalUsedNum > 0 ? totalUsedNum : Math.max(0, maxTokens - balanceNum);
  const usagePercentage = Math.min(
    100,
    Math.max(0, Math.round((usedTokens / maxTokens) * 100))
  );

  // Fetch Credits & Job Details
  useEffect(() => {
    dispatch(getUserCredit());
  }, [dispatch]);

  useEffect(() => {
    const getJobDetails = async () => {
      if (!jobId) return;
      setJobLoading(true);
      try {
        const response = await jobService.getJobDetails(jobId);
        const details = response?.data?.job_details || response?.data;
        setJobDetail(details);
      } catch (err) {
        console.error("Failed to fetch job details:", err);
      } finally {
        setJobLoading(false);
      }
    };
    getJobDetails();
  }, [jobId]);

  const validateAndSetFile = useCallback((f) => {
    if (!f) return;
    if (
      f.type !== "application/pdf" &&
      !f.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are accepted.");
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File exceeds the 10MB limit.");
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    validateAndSetFile(f);
  };

  const handleSelect = (e) => {
    const f = e.target.files?.[0];
    validateAndSetFile(f);
  };

  const handleEvaluate = async () => {
    if (!file) {
      setError("Select a PDF file before evaluating.");
      return;
    }
    if (!jobId) {
      setError("Job ID not found. Please navigate from a valid job.");
      return;
    }
    setStatus("evaluating");
    setError("");
    try {
      const formData = new FormData();
      formData.append("cv", file);
      formData.append("is_allowed", "true");
      const response = await candidateService.createCandidate(formData, jobId);
      const data = response.data.result;
      setResult(data);
      setStatus("done");
      setStep(2);
      dispatch(getUserCredit());
      dispatch(
        showNotification({
          title: "Evaluation Completed",
          body: `Candidate match report for ${file?.name || "CV"} generated successfully.`,
          type: "success",
        })
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Evaluation failed. Please try again.";
      setError(message);
      setStatus("idle");
    }
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
    setStep(1);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const navigateToCandidates = () => {
    router.push(`/my_jobs/${jobId}/candidates`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-zinc-900 dark:text-white px-3.5 sm:px-8 pt-2 pb-12 transition-colors">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* TOP BAR ACTIONS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={navigateToCandidates}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs cursor-pointer select-none"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Candidates List
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            <button
              type="button"
              onClick={() => router.push(`/my_jobs/${jobId}/candidates/more_candidates`)}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer select-none"
            >
              <UserPlus className="w-3.5 h-3.5" /> Upload Multiple
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={clearFile}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-zinc-900 dark:bg-white dark:text-zinc-950 px-4 py-2 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-md transition-all cursor-pointer select-none"
              >
                <Plus className="w-4 h-4" /> Evaluate Another CV
              </button>
            )}
          </div>
        </div>

        {/* 2-STEP WORKFLOW INDICATOR */}
        <div className="w-full max-w-xl mx-auto py-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 sm:top-5 left-8 right-8 sm:left-12 sm:right-12 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
            <div
              className="absolute top-4 sm:top-5 left-8 sm:left-12 h-0.5 bg-zinc-900 dark:bg-white transition-all duration-500 -z-0"
              style={{ width: step === 1 ? "0%" : "100%" }}
            />

            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="relative z-10 flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all duration-300 ${
                  step === 1
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 ring-4 ring-zinc-500/20 scale-110 shadow-md"
                    : "bg-emerald-500 text-white shadow-md"
                }`}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span
                className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                  step === 1 ? "text-zinc-900 dark:text-white" : "text-zinc-500"
                }`}
              >
                1. Upload CV
              </span>
            </button>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all duration-300 ${
                  step === 2
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 ring-4 ring-zinc-500/20 scale-110 shadow-md"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                2
              </div>
              <span
                className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                  step === 2 ? "text-zinc-900 dark:text-white" : "text-zinc-500"
                }`}
              >
                2. AI Report
              </span>
            </div>
          </div>
        </div>

        {/* STEP 1: CANDIDATE CV UPLOAD & BENCHMARK */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Upload Card & Token Usage Bar */}
            <div className="lg:col-span-5 space-y-6">
              {/* Target Job Benchmark Banner Card */}
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Target Position
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Active Benchmark
                  </span>
                </div>
                {jobLoading ? (
                  <div className="h-8 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                ) : (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                      {jobDetail?.job_title || "Job Position"}
                    </h2>
                    {jobDetail?.department && (
                      <p className="text-xs text-zinc-500 mt-1 font-mono">
                        Department: {jobDetail.department}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* CV Dropzone Card */}
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-6 shadow-xl space-y-5">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[220px] ${
                    dragActive
                      ? "border-primary bg-primary/10 scale-[1.01]"
                      : file
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-700"
                  }`}
                >
                  {!file ? (
                    <>
                      <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-white mb-4">
                        <UploadCloud className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                        Upload Candidate CV
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[240px] mb-5 leading-relaxed font-mono">
                        Drag & drop candidate PDF resume (Max file size: 10MB)
                      </p>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all cursor-pointer shadow-xs"
                      >
                        Browse PDF File
                      </button>
                      <input
                        ref={inputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleSelect}
                        className="hidden"
                      />
                    </>
                  ) : (
                    <div className="w-full flex flex-col items-center">
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mb-3">
                        <FileText className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <p className="font-bold text-sm text-zinc-900 dark:text-white break-all px-2">
                        {file.name}
                      </p>
                      <p className="text-xs font-mono text-zinc-500 mt-1 mb-4">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-red-500 hover:text-red-600 border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Remove file
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={!file || status === "evaluating"}
                  className={`w-full py-3.5 px-6 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-lg select-none cursor-pointer flex items-center justify-center gap-2 ${
                    !file || status === "evaluating"
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                      : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 hover:-translate-y-0.5 active:translate-y-0"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {status === "evaluating"
                    ? "Running AI Evaluation..."
                    : "Start Evaluation"}
                </button>
              </div>

              {/* SYSTEM STATUS & FIXED TOKEN USAGE BAR */}
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-6 shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                    System Engine Status
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px]">
                    <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
                    AI Core Active
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-semibold">
                    <span>Token Allocation Usage</span>
                    <span>{usagePercentage}%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-500"
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                    <span>Available: {balanceNum} Tokens</span>
                    <span>Used: {usedTokens} / {maxTokens}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Instructions & Features Overview */}
            <div className="lg:col-span-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-8 shadow-xl space-y-6 min-h-[520px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Automated Benchmarking
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Cross-Match Candidate Against Position Requirements
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono">
                  Our neural parser automatically indexes candidate experience, technical stack match percentages, missing prerequisites, and ATS parsing reliability against your active Job Description.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <CircularProgress value={85} label="Avg Match Benchmark" />
                  <CircularProgress value={92} label="ATS Compatibility" />
                  <CircularProgress value={78} label="Selection Probability" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400 font-mono space-y-1.5">
                <p className="font-bold text-zinc-900 dark:text-white">
                  💡 Evaluation Tip:
                </p>
                <p>
                  Ensure candidate CV is in clean PDF format without scanned imagery to maximize ATS extraction accuracy.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: AI MATCH REPORT VIEW */}
        {step === 2 && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Action Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] shadow-md">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Evaluation Completed
                </span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                  {file?.name || "Candidate Evaluation Report"}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFullScreen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Full Screen
                </button>

                <button
                  type="button"
                  onClick={clearFile}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Evaluate Another CV
                </button>
              </div>
            </div>

            {/* PDF PREVIEW FRAME */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] overflow-hidden shadow-2xl min-h-[850px] flex flex-col">
              <BlobProvider
                document={
                  <PdfReportDocument
                    evaluationResult={result}
                    candidateName={
                      result?.name ||
                      result?.candidateName ||
                      file?.name?.replace(/\.[^/.]+$/, "") ||
                      "Candidate"
                    }
                  />
                }
              >
                {({ url, loading, error }) => {
                  if (loading) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-zinc-500 font-mono">
                        <div className="w-8 h-8 border-2 border-zinc-900 dark:border-white border-t-transparent animate-spin rounded-full mb-3" />
                        <p className="text-sm font-bold">Generating PDF Report Preview...</p>
                      </div>
                    );
                  }
                  if (error) {
                    return (
                      <div className="flex-1 flex items-center justify-center p-10 text-red-500 font-mono text-sm">
                        Failed to render PDF report preview.
                      </div>
                    );
                  }
                  return (
                    <div className="w-full flex-1 flex flex-col">
                      <div className="p-3 px-6 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          Interactive PDF Candidate Report
                        </span>
                        <a
                          href={url}
                          download={`${
                            file?.name?.replace(/\.[^/.]+$/, "") || "Evaluation_Report"
                          }.pdf`}
                          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Download PDF Report
                        </a>
                      </div>
                      <iframe
                        src={url}
                        className="w-full flex-1 border-0 min-h-[800px]"
                        title="Evaluation Report PDF Preview"
                      />
                    </div>
                  );
                }}
              </BlobProvider>
            </div>
          </div>
        )}

        {/* FULL SCREEN MODAL OVERLAY */}
        {isFullScreen && result && (
          <div className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-md p-3 md:p-6 flex flex-col w-screen h-screen">
            <BlobProvider
              document={
                <PdfReportDocument
                  evaluationResult={result}
                  candidateName={
                    result?.name ||
                    result?.candidateName ||
                    file?.name?.replace(/\.[^/.]+$/, "") ||
                    "Candidate"
                  }
                />
              }
            >
              {({ url }) => (
                <div className="w-full h-full flex flex-col">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 px-6 rounded-t-2xl flex items-center justify-between shadow-2xl">
                    <span className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Candidate Evaluation Report — Full Screen
                    </span>
                    <div className="flex items-center gap-3">
                      <a
                        href={url}
                        download={`${
                          file?.name?.replace(/\.[^/.]+$/, "") || "Evaluation_Report"
                        }.pdf`}
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsFullScreen(false)}
                        className="inline-flex items-center gap-1.5 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl text-white transition-colors cursor-pointer"
                      >
                        <Minimize2 className="w-4 h-4" />
                        <span>Exit Full Screen</span>
                      </button>
                    </div>
                  </div>
                  <iframe
                    src={url}
                    className="w-full flex-1 border-0 rounded-b-2xl shadow-2xl"
                    title="Full Screen Evaluation Report PDF"
                  />
                </div>
              )}
            </BlobProvider>
          </div>
        )}
      </div>
    </div>
  );
}
