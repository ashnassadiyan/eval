"use client";

import { useState, useCallback, ReactNode, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import api from "@/lib/axios";
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getUserCredit } from "@/store/slices/creditSlice";

import { pdf } from "@react-pdf/renderer";
import PdfReportDocument from "@/components/evaluate/ReportTemplate";
import { FileText, File, UploadCloud, X, CheckCircle2, RotateCcw } from "lucide-react";
// import { PdfReportDocument } from "@/components/evaluate/PdfReportDocument";

// Using actual data from backend

// Configure PDFJS Worker

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
    red: "text-red-300 border-red-500/60 bg-red-500/10 shadow-[0_0_8px_#ef4444]",
    blue: "text-blue-300 border-blue-500/60 bg-blue-500/10 shadow-[0_0_8px_#3b82f6]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      {icon}
      {label}
    </span>
  );
}

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
    <div className="flex h-[280px] sm:h-[340px] flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] p-6 shadow-xs transition-colors">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
          {title}
        </h3>
        <span className="inline-flex items-center gap-1.5">{badges}</span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-1 flex-col rounded-xl border-2 border-dashed transition-colors duration-200 ${
          isDragging
            ? "border-black dark:border-white bg-zinc-100 dark:bg-zinc-900"
            : file
            ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10"
            : "border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#121214] hover:border-zinc-400 dark:hover:border-zinc-700"
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
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2
                size={26}
                strokeWidth={1.5}
              />
            </div>
            <div className="max-w-full">
              <p className="truncate text-sm font-bold text-zinc-900 dark:text-white font-mono">
                {file.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500 font-mono">
                {formatBytes(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClear();
              }}
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 transition hover:border-red-500 hover:text-red-500 dark:hover:border-red-400 dark:hover:text-red-400 cursor-pointer"
            >
              <X size={12} />
              Remove File
            </button>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 p-4"
          >
            <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/80">
              <UploadCloud
                size={26}
                strokeWidth={1.5}
                className={isDragging ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}
              />
            </div>
            <p className="px-4 text-center text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {isDragging ? "Drop file here" : hint}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              or click to browse
            </p>
          </label>
        )}
      </div>
    </div>
  );
}

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    text += strings.join(" ") + "\n";
  }

  return text;
};

export default function EvaluatePage() {
  const dispatch = useDispatch<AppDispatch>();

  const { balance, total_added, total_used, loadingCredits } = useSelector(
    (state: any) => state.credits
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showNewEvalModal, setShowNewEvalModal] = useState(false);

  const processingRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!evaluationResult) return;
    try {
      setIsDownloading(true);

      const blob = await pdf(
        <PdfReportDocument
          evaluationResult={evaluationResult}
          candidateName={cvFile?.name?.replace(/\.[^/.]+$/, "")}
          // candidatePhotoUrl={...} // pass a URL here if/when you have one
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Evaluation_Report.pdf";
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
      alert("Please upload both CV and Job Description files.");
      return;
    }

    try {
      setIsProcessing(true);
      setShowResults(false);

      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("jd", jdFile);

      const res = await api.post("/evaluation/upload-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API RESPONSE:", res.data);

      if (res.data.success) {
        setEvaluationResult(res.data.result);
        setShowResults(true);
      }
    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setIsProcessing(false);
      dispatch(getUserCredit());
    }
  };

  useEffect(() => {
    dispatch(getUserCredit());
  }, [dispatch]);

  return (
    <div className="flex flex-col flex-1 min-w-0 bg-slate-50 dark:bg-black text-zinc-900 dark:text-white transition-colors">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Main scrollable area */}
        <div className="flex-1 overflow-y-auto dashboard-scroll p-4 sm:p-6 md:p-12 space-y-6 max-w-5xl mx-auto lg:mx-0 w-full">
          {/* UPLOAD SCREENS (Hidden when results are shown) */}
          {(!showResults || !evaluationResult) && (
            <>
              {/* HEADER BANNER FOR CANDIDATES */}
              <div className="space-y-3 pb-6 border-b border-zinc-200 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    // CANDIDATE AI ATS EVALUATOR
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                  Match Your CV with Any Job
                </h1>
                <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                  Upload your CV alongside any target Job Description. Our precision AI will analyze ATS keyword compatibility, uncover skill gaps, calculate your match score, and provide recruiter-grade feedback.
                </p>
              </div>

              {/* Input section */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CV Upload */}
                <UploadCard
                  title="Candidate CV"
                  inputId="cv-upload"
                  accept=".pdf"
                  file={cvFile}
                  onFile={setCvFile}
                  onClear={() => setCvFile(null)}
                  hint="Upload your candidate Resume (PDF)"
                  badges={
                    <Badge icon={<FileText size={12} />} label="PDF" tone="red" />
                  }
                />

                {/* Job Description */}
                <UploadCard
                  title="Job Description (JD)"
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
              </section>

              {/* Action section */}
              <section className="flex flex-col items-center py-6 space-y-4">
                <div className="bg-white dark:bg-[#111113] px-6 py-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center gap-3.5 shadow-sm text-center">
                  <span
                    className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    info
                  </span>
                  <p className="text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200">
                    Evaluation consumes <span className="font-bold text-zinc-900 dark:text-white">1 token</span>. You have{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{balance || 0}</span> tokens remaining.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={startEvaluation}
                  disabled={!cvFile || !jdFile || isProcessing}
                  className={`px-12 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider transition-all duration-200 shadow-xl select-none flex items-center gap-2 ${
                    !cvFile || !jdFile || isProcessing
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                      : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
                  }`}
                >
                  {isProcessing ? "Evaluating CV..." : "Evaluate CV"}
                </button>
              </section>
            </>
          )}

          {/* Processing state Modal */}
          {isProcessing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
              <section
                ref={processingRef as any}
                className="p-8 py-12 space-y-8 flex flex-col items-center max-w-lg w-full bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl relative"
              >
                <div className="relative w-full max-w-[320px] h-[280px] border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl shadow-2xl overflow-hidden flex-shrink-0 mx-auto">
                  {/* Scanner line */}
                  <div className="absolute left-0 right-0 top-0 h-[3px] bg-emerald-500 dark:bg-emerald-400 animate-scan z-20 shadow-[0_0_12px_#10b981]" />

                  {/* Resume mock */}
                  <div className="h-full p-6 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="h-3 w-32 bg-black dark:bg-white rounded-full" />
                        <div className="h-2 w-24 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                        <div className="h-2 w-28 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                      </div>
                    </div>

                    <div className="mt-6 flex-1 space-y-3 overflow-hidden opacity-50">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 ${
                            i % 3 === 0
                              ? "w-full"
                              : i % 2 === 0
                              ? "w-10/12"
                              : "w-8/12"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
                </div>

                <div className="text-center space-y-2 mt-4">
                  <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    Analyzing Candidate CV...
                  </h2>
                  <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 max-w-sm">
                    Our AI engine is matching skills against the job description, evaluating ATS keyword compatibility, and generating recruiter insights.
                  </p>
                </div>
              </section>
            </div>
          )}

          {/* Results section */}
          {showResults && evaluationResult && (
            <section
              ref={resultsRef as any}
              className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                  Evaluation Report
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewEvalModal(true)}
                  className="inline-flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-md transition-all cursor-pointer select-none"
                >
                  <RotateCcw className="h-4 w-4" />
                  Evaluate New
                </button>
              </div>

              {/* Match Score overview grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: "Overall Match",
                    value: evaluationResult.overall_match_percentage,
                  },
                  {
                    label: "Selection Prob.",
                    value: evaluationResult.selection_probability,
                  },
                  {
                    label: "ATS Compatibility",
                    value: evaluationResult.ats_compatibility_score,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 p-6 text-center shadow-xs">
                    <p className="text-sm uppercase text-zinc-500 dark:text-[#c4c7c8] mb-2 font-semibold">
                      {label}
                    </p>
                    <div className="text-5xl font-bold text-zinc-900 dark:text-white mb-2">
                      {value}
                      <span className="text-2xl text-zinc-500 dark:text-[#c4c7c8]">%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-200 dark:bg-[#353535]">
                      <div
                        className="progress-bar-fill h-full bg-black dark:bg-white"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI insights grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs">
                  <h4 className="text-sm uppercase text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-white pb-2 mb-4 font-semibold">
                    Strengths
                  </h4>
                  <ul className="space-y-3 text-sm text-zinc-800 dark:text-white">
                    {evaluationResult.strengths?.map(
                      (item: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">+</span>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs">
                  <h4 className="text-sm uppercase text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-white pb-2 mb-4 font-semibold">
                    Weaknesses
                  </h4>
                  <ul className="space-y-3 text-sm text-zinc-700 dark:text-white dark:opacity-80">
                    {evaluationResult.weaknesses?.map(
                      (item: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-[#444748]">-</span>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs">
                  <h4 className="text-sm uppercase text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-white pb-2 mb-4 font-semibold">
                    Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {evaluationResult.missing_skills?.map((skill: string) => (
                      <span
                        key={skill}
                        className="bg-zinc-100 dark:bg-[#171717] px-3 py-1 text-sm border border-zinc-200 dark:border-[#262626] text-zinc-900 dark:text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col shadow-xs">
                  <h4 className="text-sm uppercase text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-white pb-2 mb-4 font-semibold">
                    Recruiter Summary
                  </h4>
                  <p className="text-sm italic text-zinc-600 dark:text-[#c4c7c8] flex-1">
                    &ldquo;{evaluationResult.recruiter_summary}&rdquo;
                  </p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mt-4 uppercase tracking-widest text-right">
                    Verdict: {evaluationResult.final_verdict}
                  </p>
                </div>
              </div>

              {/* Technical match breakdown */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs">
                <h4 className="text-sm uppercase text-zinc-900 dark:text-white mb-6 font-semibold">
                  Skill Matching
                </h4>
                <div className="space-y-6 text-zinc-900 dark:text-white">
                  {evaluationResult.skill_matching?.map(
                    (skillItem: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-semibold">
                            {skillItem.skill}
                          </span>
                          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                            {skillItem.match_percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-zinc-200 dark:bg-[#353535]">
                          <div
                            className="progress-bar-fill h-full bg-black dark:bg-white"
                            style={{ width: `${skillItem.match_percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Download & Evaluate New actions bar */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-6 pb-12">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2.5 rounded-xl border border-zinc-900 dark:border-white text-zinc-900 dark:text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
                >
                  <span className="material-symbols-outlined">
                    {isDownloading ? "hourglass_empty" : "download"}
                  </span>
                  {isDownloading
                    ? "Generating PDF..."
                    : "Download Full Report (PDF)"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowNewEvalModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-8 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
                >
                  <RotateCcw className="w-4 h-4" />
                  Evaluate New Candidate
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* EVALUATE NEW PROMPT MODAL */}
      {showNewEvalModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121214] border border-zinc-300 dark:border-[#2c2c2e] w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl rounded-2xl relative">
            <div className="flex justify-between items-start border-b border-zinc-200 dark:border-[#222225] pb-4">
              <div>
                <p className="text-[10px] font-mono font-black tracking-[0.25em] text-zinc-500 dark:text-[#8e8e93] uppercase">
                  // New Evaluation Setup
                </p>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mt-1">
                  Evaluate New Candidate
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewEvalModal(false)}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Would you like to evaluate a new CV against the <span className="font-bold underline text-zinc-900 dark:text-white">same Job Description</span> ({jdFile?.name || "current JD"}), or upload a <span className="font-bold underline text-zinc-900 dark:text-white">new Job Description</span>?
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  // Keep JD, clear CV only
                  setCvFile(null);
                  setShowResults(false);
                  setEvaluationResult(null);
                  setShowNewEvalModal(false);
                }}
                className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Keep Current JD (Upload New CV Only)
              </button>

              <button
                type="button"
                onClick={() => {
                  // Clear both JD and CV
                  setCvFile(null);
                  setJdFile(null);
                  setShowResults(false);
                  setEvaluationResult(null);
                  setShowNewEvalModal(false);
                }}
                className="w-full border border-zinc-300 dark:border-[#2c2c2e] hover:border-black dark:hover:border-white text-zinc-800 dark:text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-transparent cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Upload New JD & New CV
              </button>

              <button
                type="button"
                onClick={() => setShowNewEvalModal(false)}
                className="w-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer text-center pt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global footer */}
      <footer className="w-full py-4 sm:py-6 border-t border-zinc-200 dark:border-[#444748] bg-white dark:bg-[#131313] px-4 sm:px-8 md:px-12 flex flex-col md:flex-row justify-between items-center shrink-0">
        <div className="flex flex-col md:flex-row gap-6 items-center mb-4 md:mb-0">
          <span className="text-sm font-bold text-zinc-900 dark:text-white">
            Obsidian Precision
          </span>
          <p className="text-sm text-zinc-500 dark:text-[#c4c7c8]">
            © 2026 Obsidian Precision AI. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
          {[
            "Legal",
            "Privacy Policy",
            "Contact Support",
            "API Documentation",
          ].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-zinc-600 dark:text-[#c4c7c8] hover:text-black dark:hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

