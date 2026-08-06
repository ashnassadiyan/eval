"use client";

import { useState, useCallback, ReactNode, useRef, useEffect } from "react";
import api from "@/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { getUserCredit } from "@/store/slices/creditSlice";
import { showNotification } from "@/store/slices/NotificationSlice";
import { pdf, BlobProvider } from "@react-pdf/renderer";
import PdfReportDocument from "@/components/evaluate/ReportTemplate";
import TailoredCvPdfDocument from "@/components/evaluate/TailoredCvPdfDocument";
import { PageLoader } from "@/components/ui/PageLoader";
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
  Maximize2,
  Minimize2,
  AlertTriangle,
  Circle,
  Copy,
  GraduationCap,
  Award,
  TrendingUp,
  MessageSquarePlus,
  Star,
  Send,
} from "lucide-react";

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

/* Circular Progress Gauge Component */
function CircularProgress({ value, label }: { value: number; label: string }) {
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

/* Step Indicator Bar */
function StepIndicator({
  currentStep,
  onGoToStep,
}: {
  currentStep: 1 | 2 | 3;
  onGoToStep: (s: 1 | 2 | 3) => void;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-5 left-10 right-10 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
        <div
          className="absolute top-5 left-10 h-0.5 bg-zinc-900 dark:bg-white transition-all duration-500 -z-0"
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
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 ring-4 ring-zinc-500/20 scale-110 shadow-lg"
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
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 ring-4 ring-zinc-500/20 scale-110 shadow-lg"
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
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 ring-4 ring-zinc-500/20 scale-110 shadow-lg"
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
  badges?: ReactNode;
  onError?: (msg: string) => void;
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
  onError,
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      if (selectedFile.size > 10 * 1024 * 1024) {
        if (onError) onError("File size exceeds maximum limit of 10MB.");
        return;
      }
      onFile(selectedFile);
    },
    [onFile, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) validateAndSetFile(dropped);
    },
    [validateAndSetFile]
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-8 transition-all duration-500 shadow-xl shadow-black/5 dark:shadow-black/20 flex flex-col justify-between">
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
        {!file ? (
          <>
            <div className="p-3.5 rounded-2xl bg-muted border border-border text-foreground mb-3">
              <UploadCloud className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground mb-1 text-center">
              {hint}
            </p>
            <p className="text-[11px] text-muted-foreground mb-4 text-center font-mono">
              Drag & drop your file here or click browse (Max size 10MB)
            </p>
            <label
              htmlFor={inputId}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-border bg-card text-foreground hover:bg-muted transition-all cursor-pointer shadow-xs select-none"
            >
              <span>Browse File</span>
            </label>
            <input
              id={inputId}
              type="file"
              accept={accept}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) validateAndSetFile(f);
              }}
              className="hidden"
            />
          </>
        ) : (
          <div className="flex flex-col items-center text-center space-y-3 w-full">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-0.5 max-w-full px-4">
              <p className="text-xs sm:text-sm font-bold text-foreground truncate max-w-xs sm:max-w-md">
                {file.name}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB • File Ready
              </p>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider text-red-500 hover:text-red-600 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Remove File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EvaluatePage() {
  const dispatch = useDispatch();

  const { balance, total_added, total_used } = useSelector(
    (state: any) => state.credits || {}
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // TAILORED CV STATES (SCOPED PER EVALUATION)
  const [tailoredQuota, setTailoredQuota] = useState<{ used: number; remaining: number; limit: number }>({
    used: 0,
    remaining: 2,
    limit: 2,
  });
  const [isGeneratingTailoredCv, setIsGeneratingTailoredCv] = useState(false);
  const [tailoredCvData, setTailoredCvData] = useState<any>(null);
  const [showTailoredCvModal, setShowTailoredCvModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingTailoredPdf, setIsDownloadingTailoredPdf] = useState(false);

  // EVALUATION FEEDBACK STATES
  const [showEvalFeedbackModal, setShowEvalFeedbackModal] = useState(false);
  const [evalRating, setEvalRating] = useState<number>(5);
  const [evalFeedbackText, setEvalFeedbackText] = useState("");
  const [isSubmittingEvalFeedback, setIsSubmittingEvalFeedback] = useState(false);

  const handleFileError = (msg: string) => {
    dispatch(
      showNotification({
        title: "Invalid File",
        body: msg,
        type: "error",
      })
    );
  };

  const fetchTailoredQuota = useCallback(async (targetEvalId?: string) => {
    try {
      const activeId = targetEvalId || evaluationId;
      const res = await api.get("/evaluation/tailored-cv-quota", {
        params: activeId ? { evaluation_id: activeId } : {},
      });
      if (res.data) {
        setTailoredQuota(res.data);
      }
    } catch (err) {
      console.warn("Could not fetch tailored CV quota:", err);
    }
  }, [evaluationId]);

  useEffect(() => {
    dispatch(getUserCredit() as any);
    fetchTailoredQuota();
  }, [dispatch, fetchTailoredQuota]);

  const handleGenerateCv = async () => {
    if (!evaluationResult) return;
    try {
      setIsDownloading(true);
      const doc = (
        <PdfReportDocument
          evaluationResult={evaluationResult}
          candidateName={cvFile?.name?.replace(/\.[^/.]+$/, "") || "Candidate"}
        />
      );
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${cvFile?.name?.replace(/\.[^/.]+$/, "") || "Evaluation"}_Generated_CV.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      dispatch(
        showNotification({
          title: "CV Generated Successfully",
          body: "Evaluation PDF report compiled & downloaded.",
          type: "success",
        })
      );
    } catch (err) {
      console.error("PDF generation failed:", err);
      dispatch(
        showNotification({
          title: "PDF Compilation Failed",
          body: "Failed to generate evaluation report PDF. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateTailoredCv = async () => {
    if (!cvFile || !jdFile) {
      dispatch(
        showNotification({
          title: "Files Missing",
          body: "Please ensure both Candidate CV and Target JD files are uploaded.",
          type: "error",
        })
      );
      return;
    }

    if (tailoredQuota.remaining <= 0) {
      dispatch(
        showNotification({
          title: "Quota Reached",
          body: "You have reached your limit of 2 free Tailored CV generations for this candidate evaluation.",
          type: "error",
        })
      );
      return;
    }

    try {
      setIsGeneratingTailoredCv(true);

      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("jd", jdFile);
      if (evaluationId) {
        formData.append("evaluation_id", evaluationId);
      }

      const res = await api.post("/evaluation/generate-tailored-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success) {
        setTailoredCvData(res.data.tailored_cv);
        setTailoredQuota({
          used: res.data.generations_used,
          remaining: res.data.generations_remaining,
          limit: res.data.limit,
        });
        setShowTailoredCvModal(true);
        dispatch(
          showNotification({
            title: "Tailored CV Generated!",
            body: "Your ATS-optimized tailored CV has been compiled successfully.",
            type: "success",
          })
        );
      }
    } catch (err: any) {
      console.error("Failed to generate tailored CV:", err);
      const rawDetail = err?.response?.data?.detail;
      const msg = typeof rawDetail === "string" ? rawDetail : (err?.response?.data?.message || err?.message || "Failed to generate tailored CV. Please try again.");
      dispatch(
        showNotification({
          title: "Generation Failed",
          body: msg,
          type: "error",
        })
      );
    } finally {
      setIsGeneratingTailoredCv(false);
    }
  };

  const handleSubmitEvalFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalFeedbackText.trim()) return;

    try {
      setIsSubmittingEvalFeedback(true);
      await api.post("/feedback", {
        rating: evalRating,
        feedback: evalFeedbackText.trim(),
        category: "Evaluation Match Feedback",
        subject: `Candidate Screening Feedback for ${cvFile?.name || "CV"}`,
      });

      dispatch(
        showNotification({
          title: "Feedback Submitted!",
          body: "Thank you for rating your candidate evaluation experience.",
          type: "success",
        })
      );

      setShowEvalFeedbackModal(false);
      setEvalFeedbackText("");
    } catch (err: any) {
      console.error("Feedback submission error:", err);
      dispatch(
        showNotification({
          title: "Submission Error",
          body: "Could not submit evaluation feedback. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsSubmittingEvalFeedback(false);
    }
  };

  const handleCopyTailoredText = () => {
    if (!tailoredCvData) return;
    try {
      const lines = [
        `${tailoredCvData.full_name || ""} - ${tailoredCvData.professional_title || ""}`,
        `Contact: ${Object.values(tailoredCvData.contact || {}).filter(Boolean).join(" | ")}`,
        "",
        "EXECUTIVE SUMMARY",
        tailoredCvData.executive_summary || "",
        "",
        "CORE COMPETENCIES",
        (tailoredCvData.core_competencies || []).join(", "),
        "",
        "WORK EXPERIENCE",
        ...(tailoredCvData.work_experience || []).flatMap((job: any) => [
          `${job.job_title} @ ${job.company} (${job.period})`,
          ...(job.key_achievements || []).map((a: string) => `• ${a}`),
          "",
        ]),
        "EDUCATION",
        ...(tailoredCvData.education || []).map(
          (e: any) => `${e.degree} - ${e.institution} (${e.year})`
        ),
      ].join("\n");

      navigator.clipboard.writeText(lines);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      dispatch(
        showNotification({
          title: "Copied to Clipboard",
          body: "Tailored CV text copied successfully.",
          type: "success",
        })
      );
    } catch (err) {
      dispatch(
        showNotification({
          title: "Copy Failed",
          body: "Could not copy text to clipboard.",
          type: "error",
        })
      );
    }
  };

  const handleDownloadTailoredPdf = async () => {
    if (!tailoredCvData) return;
    try {
      setIsDownloadingTailoredPdf(true);
      const doc = <TailoredCvPdfDocument data={tailoredCvData} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Tailored_CV_${(tailoredCvData.full_name || "Candidate").replace(/\s+/g, "_")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      dispatch(
        showNotification({
          title: "PDF Downloaded",
          body: "Tailored ATS Resume downloaded as PDF.",
          type: "success",
        })
      );
    } catch (err) {
      console.error("Tailored PDF generation failed:", err);
      dispatch(
        showNotification({
          title: "PDF Download Failed",
          body: "Could not compile tailored CV PDF.",
          type: "error",
        })
      );
    } finally {
      setIsDownloadingTailoredPdf(false);
    }
  };

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

  const startEvaluation = async () => {
    if (!cvFile || !jdFile) {
      dispatch(
        showNotification({
          title: "Missing Files",
          body: "Please upload both the target Job Description and Candidate CV.",
          type: "error",
        })
      );
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

      if (res.data && res.data.success) {
        const newEvalId = res.data.evaluation_id;
        setEvaluationId(newEvalId);
        setEvaluationResult(res.data.result);
        setStep(3);
        
        // Fetch fresh quota for this evaluation session (2 free generations per evaluation)
        fetchTailoredQuota(newEvalId);

        // Prompt feedback modal automatically 5 seconds after evaluation finishes
        setTimeout(() => {
          setShowEvalFeedbackModal(true);
        }, 5000);

        dispatch(
          showNotification({
            title: "Evaluation Completed",
            body: `Candidate match report generated successfully for ${cvFile?.name || "CV"}.`,
            type: "success",
          })
        );
      }
    } catch (err: any) {
      console.error("Evaluation failed:", err);
      const rawDetail = err?.response?.data?.detail;
      const msg = typeof rawDetail === "string" 
        ? rawDetail 
        : (err?.response?.data?.message || err?.message || "Evaluation failed. Please check your file format and credits.");
      
      dispatch(
        showNotification({
          title: "Evaluation Error",
          body: msg,
          type: "error",
        })
      );
    } finally {
      setIsProcessing(false);
      dispatch(getUserCredit() as any);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-2 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors overflow-hidden">
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

      <div className="relative mx-auto w-full max-w-6xl space-y-8">
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
              onError={handleFileError}
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* LEFT COLUMN: Upload Card & Token Usage Bar */}
            <div className="lg:col-span-5 space-y-6">
              {/* Target Job Benchmark Banner Card */}
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Target JD Loaded
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 underline hover:text-foreground transition-colors cursor-pointer"
                  >
                    Change JD
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold font-mono text-foreground truncate">
                      {jdFile?.name}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground">
                      {(jdFile?.size ? jdFile.size / 1024 : 0).toFixed(0)} KB • Active Position Benchmark
                    </p>
                  </div>
                </div>
              </div>

              {/* CV Dropzone Card */}
              <UploadCard
                title="Candidate Resume (CV)"
                inputId="cv-upload"
                accept=".pdf"
                file={cvFile}
                onFile={setCvFile}
                onClear={() => setCvFile(null)}
                hint="Upload candidate Resume (PDF)"
                onError={handleFileError}
                badges={
                  <Badge icon={<FileText size={12} />} label="PDF" tone="red" />
                }
              />

              <button
                type="button"
                onClick={startEvaluation}
                disabled={!cvFile || isProcessing}
                className={`w-full py-4 px-6 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-xl select-none cursor-pointer flex items-center justify-center gap-2.5 ${
                  !cvFile || isProcessing
                    ? "bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-50"
                    : "bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] shadow-primary/20"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? "Evaluating Candidate CV..." : "Run AI Evaluation"}</span>
              </button>

              {/* SYSTEM ENGINE STATUS & TOKEN USAGE BAR */}
              <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    System Engine Status
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px]">
                    <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
                    AI Core Active
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-foreground font-semibold">
                    <span>Token Allocation Usage</span>
                    <span>{usagePercentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                    <span>Available: {balanceNum} Tokens</span>
                    <span>Used: {usedTokens} / {maxTokens}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Benchmarking Overview */}
            <div className="lg:col-span-7 rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-8 shadow-xl space-y-6 min-h-[520px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Automated Benchmarking
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Cross-Match Candidate Against Position Requirements
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                  Our neural parser automatically indexes candidate experience, technical stack match percentages, missing prerequisites, and ATS parsing reliability against your target Job Description.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <CircularProgress value={85} label="Avg Match Benchmark" />
                  <CircularProgress value={92} label="ATS Compatibility" />
                  <CircularProgress value={78} label="Selection Probability" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/50 border border-border text-xs text-muted-foreground font-mono space-y-1.5">
                <p className="font-bold text-foreground">
                  💡 Evaluation Tip:
                </p>
                <p>
                  Ensure candidate CV is in clean PDF format without scanned imagery to maximize ATS extraction accuracy.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PROCESSING MODAL */}
        {isProcessing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 dark:bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card/95 dark:bg-[#111115]/95 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse z-20" />
              <PageLoader
                message="Running AI Match Scoring..."
                subtext="Evaluating ATS keyword alignment, extracting missing technical skills, and compiling recruiter recommendations."
                fullScreen={false}
              />
            </div>
          </div>
        )}

        {/* STEP 3: MATCH REPORT & RESULTS */}
        {step === 3 && evaluationResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* LEFT COLUMN: CONTROL CARD & TAILORED CV PROMPT */}
            <div className="lg:col-span-5 space-y-6">
              {/* TAILORED CV AI GENERATOR PROMPT BANNER CARD */}
              <div className="rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-emerald-500/10 p-6 shadow-2xl space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary animate-pulse" />

                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-mono font-extrabold uppercase tracking-widest text-primary">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>AI Resume Tailor</span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    tailoredQuota.remaining > 0
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-red-500/30 bg-red-500/10 text-red-500"
                  }`}>
                    {tailoredQuota.remaining} of {tailoredQuota.limit} Free Generations Left
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-black uppercase text-foreground tracking-tight flex items-center gap-2">
                    <span>Generate Tailored CV For This Role?</span>
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                    Our AI engine detected match gaps in the current resume. Would you like us to generate a tailored, ATS-aligned resume optimized specifically for this Job Description?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateTailoredCv}
                  disabled={isGeneratingTailoredCv || tailoredQuota.remaining <= 0}
                  className={`w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer select-none ${
                    tailoredQuota.remaining <= 0
                      ? "bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-60"
                      : "bg-foreground text-background hover:opacity-90 hover:scale-[1.02] shadow-black/20"
                  }`}
                >
                  {isGeneratingTailoredCv ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                      <span>Crafting Tailored Resume...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>
                        {tailoredQuota.remaining <= 0
                          ? "Quota Limit Reached (2/2)"
                          : "✨ Generate Tailored CV Now"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Evaluation Details & Action Buttons Card */}
              <div className="rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Evaluation Completed
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground tracking-tight">
                    Candidate Match Report
                  </h2>
                  <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                    Target JD: <strong className="text-foreground">{jdFile?.name || "Job Description.pdf"}</strong>
                    <br />
                    Candidate: <strong className="text-foreground">{cvFile?.name || "Candidate CV.pdf"}</strong>
                  </p>
                </div>

                {/* Vertical Stacked Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleGenerateCv}
                    disabled={isDownloading}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg cursor-pointer select-none disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloading ? "Generating PDF..." : "Download Report PDF"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFullScreen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider border border-border bg-card hover:bg-muted text-foreground transition-all shadow-xs cursor-pointer select-none"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Full Screen Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEvalFeedbackModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-all shadow-xs cursor-pointer select-none"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Rate Evaluation Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCvFile(null);
                      setEvaluationResult(null);
                      setEvaluationId(null);
                      setTailoredQuota({ used: 0, remaining: 2, limit: 2 });
                      setStep(2);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md cursor-pointer select-none"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add New CV (Same JD)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCvFile(null);
                      setJdFile(null);
                      setEvaluationResult(null);
                      setEvaluationId(null);
                      setTailoredQuota({ used: 0, remaining: 2, limit: 2 });
                      setStep(1);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer select-none"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>New JD</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PDF REPORT VIEWER */}
            <div className="lg:col-span-7 rounded-3xl border border-border bg-card overflow-hidden shadow-2xl min-h-[850px] flex flex-col">
              <BlobProvider
                document={
                  <PdfReportDocument
                    evaluationResult={evaluationResult}
                    candidateName={
                      cvFile?.name?.replace(/\.[^/.]+$/, "") || "Candidate"
                    }
                  />
                }
              >
                {({ url, loading, error }) => {
                  if (loading) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-muted-foreground font-mono">
                        <div className="w-8 h-8 border-2 border-foreground border-t-transparent animate-spin rounded-full mb-3" />
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
                      <div className="p-3.5 px-6 bg-muted/60 border-b border-border flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          Interactive PDF Candidate Report
                        </span>
                        <a
                          href={url || "#"}
                          download={`${
                            cvFile?.name?.replace(/\.[^/.]+$/, "") || "Evaluation_Report"
                          }.pdf`}
                          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-foreground text-background hover:opacity-90 transition-all shadow-xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Download PDF Report
                        </a>
                      </div>
                      <iframe
                        src={url || undefined}
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

        {/* EVALUATION FEEDBACK MODAL */}
        {showEvalFeedbackModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-5 text-foreground">
              <button
                type="button"
                onClick={() => setShowEvalFeedbackModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl border border-border bg-muted hover:bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Evaluation Completed
                </span>
                <h3 className="text-xl font-extrabold text-foreground">
                  How was your evaluation experience?
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Your feedback helps us continuously calibrate our AI candidate matching engine.
                </p>
              </div>

              <form onSubmit={handleSubmitEvalFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEvalRating(star)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= evalRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted border-muted"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Feedback / Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={evalFeedbackText}
                    onChange={(e) => setEvalFeedbackText(e.target.value)}
                    placeholder="Share your thoughts on the report accuracy, candidate fit scoring, or ATS suggestions..."
                    className="w-full px-4 py-2.5 text-xs bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEvalFeedbackModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-border bg-muted hover:bg-card text-muted-foreground text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Skip
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingEvalFeedback}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-mono font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingEvalFeedback ? "Submitting..." : "Submit Feedback"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAILORED CV RESULT MODAL */}
        {showTailoredCvModal && tailoredCvData && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border border-border bg-card/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500 animate-pulse" />

              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/40">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black uppercase tracking-tight text-foreground">
                        Tailored ATS Resume Generated
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
                        {tailoredQuota.remaining} of {tailoredQuota.limit} Free Generations Left
                      </span>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      Optimized for <strong className="text-foreground">{tailoredCvData.professional_title || "Target Role"}</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTailoredCvModal(false)}
                  className="p-2 rounded-xl border border-border bg-muted hover:bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Resume Preview */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 font-mono text-xs text-foreground">
                {/* Candidate Header */}
                <div className="p-6 rounded-2xl bg-muted/40 border border-border space-y-2">
                  <h1 className="text-2xl font-black text-foreground uppercase tracking-wide">
                    {tailoredCvData.full_name || "CANDIDATE NAME"}
                  </h1>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {tailoredCvData.professional_title}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground pt-1">
                    {tailoredCvData.contact?.email && <span>📧 {tailoredCvData.contact.email}</span>}
                    {tailoredCvData.contact?.phone && <span>📱 {tailoredCvData.contact.phone}</span>}
                    {tailoredCvData.contact?.location && <span>📍 {tailoredCvData.contact.location}</span>}
                  </div>
                </div>

                {/* Executive Summary */}
                {tailoredCvData.executive_summary && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
                      Tailored Executive Summary
                    </h3>
                    <p className="text-xs text-foreground leading-relaxed font-sans bg-muted/20 p-4 rounded-xl border border-border/60">
                      {tailoredCvData.executive_summary}
                    </p>
                  </div>
                )}

                {/* Core Competencies */}
                {tailoredCvData.core_competencies?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
                      Core Competencies & Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tailoredCvData.core_competencies.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {tailoredCvData.work_experience?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
                      Tailored Experience & Achievements
                    </h3>
                    {tailoredCvData.work_experience.map((job: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-card border border-border space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="font-bold text-sm text-foreground">{job.job_title}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {job.company} • {job.period}
                          </span>
                        </div>
                        <ul className="space-y-1.5 pl-4 list-disc text-muted-foreground text-xs font-sans">
                          {job.key_achievements?.map((ach: string, aIdx: number) => (
                            <li key={aIdx} className="leading-relaxed text-foreground">
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer / Action Buttons */}
              <div className="p-6 border-t border-border bg-muted/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCopyTailoredText}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{isCopied ? "Copied to Clipboard!" : "Copy Full Text"}</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadTailoredPdf}
                    disabled={isDownloadingTailoredPdf}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloadingTailoredPdf ? "Generating PDF..." : "Download PDF Resume"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTailoredCvModal(false)}
                    className="px-5 py-3 rounded-xl border border-border bg-muted hover:bg-card text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FULL SCREEN MODAL OVERLAY */}
        {isFullScreen && evaluationResult && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md p-3 md:p-6 flex flex-col w-screen h-screen">
            <BlobProvider
              document={
                <PdfReportDocument
                  evaluationResult={evaluationResult}
                  candidateName={
                    cvFile?.name?.replace(/\.[^/.]+$/, "") || "Candidate"
                  }
                />
              }
            >
              {({ url }) => (
                <div className="w-full h-full flex flex-col">
                  <div className="bg-card border border-border p-4 px-6 rounded-t-2xl flex items-center justify-between shadow-2xl">
                    <span className="text-sm font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Candidate Evaluation Report — Full Screen
                    </span>
                    <div className="flex items-center gap-3">
                      <a
                        href={url || "#"}
                        download={`${
                          cvFile?.name?.replace(/\.[^/.]+$/, "") || "Evaluation_Report"
                        }.pdf`}
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-foreground text-background hover:opacity-90 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsFullScreen(false)}
                        className="inline-flex items-center gap-1.5 border border-border bg-muted hover:bg-card text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl text-foreground transition-colors cursor-pointer"
                      >
                        <Minimize2 className="w-4 h-4" />
                        <span>Exit Full Screen</span>
                      </button>
                    </div>
                  </div>
                  <iframe
                    src={url || undefined}
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
