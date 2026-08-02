"use client";

import { useState, useCallback, ReactNode, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import api from "@/lib/axios";
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getUserCredit } from "@/store/slices/creditSlice";
import { pdf } from "@react-pdf/renderer";
import PdfReportDocument from "@/components/evaluate/ReportTemplate";
import {
  FileText,
  File,
  UploadCloud,
  X,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Download,
  Zap,
  Briefcase,
  Check,
  ShieldCheck,
  PlusCircle,
  FileUp,
  Award,
  AlertTriangle,
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function formatBytes(bytes: any) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

type BadgeTone = "red" | "blue";

interface BadgeProps {
  icon: ReactNode;
  label: string;
  tone: BadgeTone;
}

function Badge({ icon, label, tone }: BadgeProps) {
  const tones: Record<BadgeTone, string> = {
    red: "text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/10",
    blue: "text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${tones[tone]}`}
    >
      {icon}
      {label}
    </span>
  );
}

/* Step Indicator Bar */
function StepIndicator({
  currentStep,
  onGoToStep,
}: {
  currentStep: 1 | 2 | 3;
  onGoToStep: (s: 1 | 2 | 3) => void;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-5 left-10 right-10 h-0.5 bg-border -z-0" />
        <div
          className="absolute top-5 left-10 h-0.5 bg-primary transition-all duration-500 -z-0"
          style={{
            width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
          }}
        />

        {/* Step 1: Target JD */}
        <button
          type="button"
          onClick={() => currentStep > 1 && onGoToStep(1)}
          disabled={currentStep === 1}
          className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer disabled:cursor-default"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all duration-300 ${
              currentStep === 1
                ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-lg"
                : currentStep > 1
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            {currentStep > 1 ? <Check className="w-5 h-5" /> : "1"}
          </div>
          <span
            className={`text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
              currentStep === 1 ? "text-foreground font-black" : "text-muted-foreground"
            }`}
          >
            1. Target JD
          </span>
        </button>

        {/* Step 2: Candidate CV */}
        <button
          type="button"
          onClick={() => currentStep === 3 && onGoToStep(2)}
          disabled={currentStep < 2}
          className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer disabled:cursor-default"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all duration-300 ${
              currentStep === 2
                ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-lg"
                : currentStep > 2
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            {currentStep > 2 ? <Check className="w-5 h-5" /> : "2"}
          </div>
          <span
            className={`text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
              currentStep === 2 ? "text-foreground font-black" : "text-muted-foreground"
            }`}
          >
            2. Candidate CV
          </span>
        </button>

        {/* Step 3: Match Report */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all duration-300 ${
              currentStep === 3
                ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-lg"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            3
          </div>
          <span
            className={`text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
              currentStep === 3 ? "text-foreground font-black" : "text-muted-foreground"
            }`}
          >
            3. AI Report
          </span>
        </div>
      </div>
    </div>
  );
}

/* Upload Card Component */
interface UploadCardProps {
  title: string;
  inputId: string;
  accept: string;
  file: File | null;
  onFile: (file: File) => void;
  onClear: () => void;
  hint: string;
  badges: ReactNode;
}

function UploadCard({
  title,
  inputId,
  accept,
  file,
  onFile,
  onClear,
  hint,
  badges,
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) onFile(dropped);
    },
    [onFile]
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-8 transition-all duration-500 shadow-xl shadow-black/5 dark:shadow-black/20 flex flex-col justify-between">
      {/* Top Laser Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </h3>
        <div className="flex items-center gap-2">{badges}</div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 p-6 ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : file
            ? "border-emerald-500/60 bg-emerald-500/10"
            : "border-border/80 bg-muted/30 hover:border-primary/50 hover:bg-card"
        }`}
      >
        <input
          type="file"
          accept={accept}
          className="hidden"
          id={inputId}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />

        {file ? (
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-foreground font-mono truncate max-w-xs sm:max-w-md">
                {file.name}
              </p>
              <p className="mt-1 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {formatBytes(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClear();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <X size={14} /> Remove & Change File
            </button>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex flex-col items-center justify-center cursor-pointer text-center space-y-3 w-full h-full py-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <UploadCloud size={28} />
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-foreground">
                {isDragging ? "Drop file here" : hint}
              </p>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Click to browse files or drag & drop
              </p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
}

export default function EvaluatePage() {
  const dispatch = useDispatch<AppDispatch>();

  const { balance } = useSelector((state: any) => state.credits);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    dispatch(getUserCredit());
  }, [dispatch]);

  const handleDownload = async () => {
    if (!evaluationResult) return;
    try {
      setIsDownloading(true);

      const blob = await pdf(
        <PdfReportDocument
          evaluationResult={evaluationResult}
          candidateName={cvFile?.name?.replace(/\.[^/.]+$/, "")}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Evaluation_Report_${cvFile?.name?.replace(/\.[^/.]+$/, "") || "Candidate"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const startEvaluation = async () => {
    if (!cvFile || !jdFile) {
      alert("Please ensure both JD and Candidate CV are uploaded.");
      return;
    }

    try {
      setIsProcessing(true);

      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("jd", jdFile);

      const res = await api.post("/evaluation/upload-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setEvaluationResult(res.data.result);
        setStep(3);
      }
    } catch (err: any) {
      console.error("Evaluation failed:", err);
      alert(err?.response?.data?.detail || "Evaluation failed. Please try again.");
    } finally {
      setIsProcessing(false);
      dispatch(getUserCredit());
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors overflow-hidden">
      {/* Background Parallax Ambient Glow & Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse" />
        <div
          className="absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-5xl space-y-8">
        {/* STEP INDICATOR */}
        <StepIndicator
          currentStep={step}
          onGoToStep={(s) => setStep(s)}
        />

        {/* STEP 1: UPLOAD TARGET JOB DESCRIPTION */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-extrabold text-primary shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 1 of 3: Position Benchmark</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
                Upload Job Description (JD)
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-md mx-auto">
                First, upload the target Job Description (PDF or DOCX). Our AI will extract requirements, required skills, and key qualifications.
              </p>
            </div>

            <UploadCard
              title="Target Job Description (JD)"
              inputId="jd-upload"
              accept=".pdf,.doc,.docx"
              file={jdFile}
              onFile={setJdFile}
              onClear={() => setJdFile(null)}
              hint="Upload target Job Description (PDF or DOCX)"
              badges={
                <>
                  <Badge icon={<FileText size={12} />} label="PDF" tone="red" />
                  <Badge icon={<File size={12} />} label="DOCX" tone="blue" />
                </>
              }
            />

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!jdFile}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 shadow-lg select-none cursor-pointer ${
                  !jdFile
                    ? "bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-50"
                    : "bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] shadow-primary/20"
                }`}
              >
                <span>Continue to Candidate CV →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: UPLOAD CANDIDATE RESUME */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-extrabold text-primary shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 2 of 3: Candidate Resume</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
                Upload Candidate CV
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-md mx-auto">
                Now upload the candidate&apos;s resume (PDF) to analyze ATS compatibility and skill match score.
              </p>
            </div>

            {/* Loaded JD Summary Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 font-bold">
                  <Briefcase size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    TARGET JOB DESCRIPTION LOADED
                  </span>
                  <p className="text-xs sm:text-sm font-bold font-mono text-foreground truncate max-w-xs sm:max-w-md">
                    {jdFile?.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground underline shrink-0 cursor-pointer"
              >
                Change JD
              </button>
            </div>

            <UploadCard
              title="Candidate Resume (CV)"
              inputId="cv-upload"
              accept=".pdf"
              file={cvFile}
              onFile={setCvFile}
              onClear={() => setCvFile(null)}
              hint="Upload candidate Resume (PDF)"
              badges={
                <Badge icon={<FileText size={12} />} label="PDF" tone="red" />
              }
            />

            {/* Credit Notice */}
            <div className="rounded-2xl border border-border/80 bg-card/70 p-4 text-center text-xs font-mono text-muted-foreground">
              Evaluation consumes <strong className="text-foreground">1 Token</strong>. Current balance:{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">{balance || 0} Tokens</strong>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider border border-border text-foreground hover:bg-muted transition-all cursor-pointer"
              >
                <ArrowLeft size={16} /> Back to JD
              </button>

              <button
                type="button"
                onClick={startEvaluation}
                disabled={!cvFile || isProcessing}
                className={`inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 shadow-xl select-none cursor-pointer ${
                  !cvFile || isProcessing
                    ? "bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-50"
                    : "bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] shadow-primary/20"
                }`}
              >
                <Sparkles size={16} />
                <span>{isProcessing ? "Evaluating CV..." : "Run AI Evaluation"}</span>
              </button>
            </div>
          </div>
        )}

        {/* PROCESSING MODAL */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="p-8 py-12 space-y-8 flex flex-col items-center max-w-lg w-full bg-card border border-border rounded-3xl shadow-2xl relative text-center">
              <div className="relative w-full max-w-[320px] h-[260px] border border-border bg-muted/40 rounded-2xl shadow-2xl overflow-hidden shrink-0 mx-auto">
                {/* Scanner line */}
                <div className="absolute left-0 right-0 top-0 h-[3px] bg-primary animate-scan z-20 shadow-[0_0_14px_currentColor]" />

                {/* Resume Mock Lines */}
                <div className="h-full p-6 flex flex-col space-y-4">
                  <div className="h-4 w-36 bg-foreground/20 rounded-full" />
                  <div className="h-2.5 w-24 bg-foreground/10 rounded-full" />
                  <div className="space-y-2 pt-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 rounded-full bg-foreground/10 ${
                          i % 2 === 0 ? "w-full" : "w-3/4"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                  Running AI Match Scoring...
                </h2>
                <p className="text-xs font-mono text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Evaluating ATS keyword alignment, extracting missing technical skills, and compiling recruiter recommendations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MATCH REPORT & RESULTS */}
        {step === 3 && evaluationResult && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Action Card Top Prompt */}
            <div className="rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase font-mono">
                  <CheckCircle2 size={14} /> Evaluation Completed
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground tracking-tight">
                  Candidate Match Report
                </h2>
                <p className="text-xs font-mono text-muted-foreground">
                  Target JD: <strong className="text-foreground">{jdFile?.name}</strong> • Candidate: <strong className="text-foreground">{cvFile?.name}</strong>
                </p>
              </div>

              {/* Action Buttons: Add New CV vs New JD */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setCvFile(null);
                    setEvaluationResult(null);
                    setStep(2);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-md cursor-pointer"
                >
                  <PlusCircle size={16} />
                  <span>Add New CV (Same JD)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCvFile(null);
                    setJdFile(null);
                    setEvaluationResult(null);
                    setStep(1);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-border text-foreground text-xs font-extrabold uppercase tracking-wider hover:bg-muted transition-all cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span>Upload New JD</span>
                </button>
              </div>
            </div>

            {/* Match Score overview grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  label: "Overall Match",
                  value: evaluationResult.overall_match_percentage,
                  icon: Award,
                },
                {
                  label: "Selection Probability",
                  value: evaluationResult.selection_probability,
                  icon: ShieldCheck,
                },
                {
                  label: "ATS Compatibility",
                  value: evaluationResult.ats_compatibility_score,
                  icon: Zap,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 transition-all duration-500 hover:border-primary/40 hover:scale-[1.01] shadow-xl shadow-black/5 dark:shadow-black/20 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </span>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <div className="text-4xl sm:text-5xl font-black text-foreground mb-3 font-mono">
                    {value}
                    <span className="text-2xl text-muted-foreground">%</span>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground border-b border-border pb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Candidate Strengths
                </h4>
                <ul className="space-y-3 text-xs sm:text-sm text-foreground font-medium">
                  {evaluationResult.strengths?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-emerald-500 font-extrabold shrink-0">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground border-b border-border pb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Areas for Improvement
                </h4>
                <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground font-medium">
                  {evaluationResult.weaknesses?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-amber-500 font-extrabold shrink-0">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Skills */}
              <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground border-b border-border pb-3">
                  Missing Skills & Gaps
                </h4>
                <div className="flex flex-wrap gap-2">
                  {evaluationResult.missing_skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-muted px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-border text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recruiter Summary */}
              <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-6 sm:p-8 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground border-b border-border pb-3 mb-3">
                    Recruiter Summary & Verdict
                  </h4>
                  <p className="text-xs sm:text-sm italic text-muted-foreground leading-relaxed">
                    &ldquo;{evaluationResult.recruiter_summary}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-muted-foreground uppercase">FINAL VERDICT</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase font-extrabold">
                    {evaluationResult.final_verdict}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Match Breakdown */}
            <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground border-b border-border pb-3">
                Technical Skill Breakdown
              </h4>
              <div className="space-y-4">
                {evaluationResult.skill_matching?.map((skillItem: any, i: number) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-foreground">{skillItem.skill}</span>
                      <span className="text-muted-foreground">{skillItem.match_percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${skillItem.match_percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action Footer Bar */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 text-center space-y-6 shadow-xl">
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase text-foreground">
                  Next Actions
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Download the complete PDF evaluation report or continue evaluating candidates.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Download size={16} />
                  <span>{isDownloading ? "Generating PDF..." : "Download Full PDF Report"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCvFile(null);
                    setEvaluationResult(null);
                    setStep(2);
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <PlusCircle size={16} />
                  <span>Add New CV (Keep Same JD)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCvFile(null);
                    setJdFile(null);
                    setEvaluationResult(null);
                    setStep(1);
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw size={16} />
                  <span>Upload New JD & Start Fresh</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
