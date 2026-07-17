"use client";

import { useState, useCallback, ReactNode, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import api from "@/lib/axios";
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getUserCredit } from "@/store/slices/creditSlice";

import { pdf } from "@react-pdf/renderer";
import PdfReportDocument from "@/components/evaluate/ReportTemplate";
import { FileText, File, UploadCloud, X, CheckCircle2 } from "lucide-react";
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
    <div className="flex h-[260px] flex-col rounded-xl border border-white/10 bg-[#111111] p-6 sm:h-[320px]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/60">
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
        className={`relative flex flex-1 flex-col rounded-lg border-2 border-dashed transition-colors duration-200 ${
          isDragging
            ? "border-white bg-white/[0.05]"
            : file
            ? "border-emerald-500/40 bg-emerald-500/[0.04]"
            : "border-white/15 hover:border-white/40"
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
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1c1c1c]">
              <CheckCircle2
                size={24}
                strokeWidth={1.5}
                className="text-emerald-400"
              />
            </div>
            <div className="max-w-full">
              <p className="truncate text-sm font-medium text-white">
                {file.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/40">
                {formatBytes(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClear();
              }}
              className="mt-1 inline-flex items-center gap-1 rounded-md border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/70 transition hover:border-red-400/50 hover:text-red-300"
            >
              <X size={12} />
              Remove
            </button>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2"
          >
            <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1c1c1c]">
              <UploadCloud
                size={24}
                strokeWidth={1.5}
                className={isDragging ? "text-white" : "text-white/70"}
              />
            </div>
            <p className="px-4 text-center text-sm text-white/60">
              {isDragging ? "Drop it here" : hint}
            </p>
            <p className="text-xs font-medium uppercase tracking-widest text-white/30">
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
    <div className="flex flex-col flex-1 min-w-0">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Main scrollable area */}
        <div className="flex-1 overflow-y-auto dashboard-scroll p-4 sm:p-6 md:p-12 space-y-6 max-w-5xl mx-auto lg:mx-0 w-full">
          {/* Input section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CV Upload */}
            <UploadCard
              title="CV Upload"
              inputId="cv-upload"
              accept=".pdf"
              file={cvFile}
              onFile={setCvFile}
              onClear={() => setCvFile(null)}
              hint="Drag and drop CV or click to browse"
              badges={
                <Badge icon={<FileText size={12} />} label="PDF" tone="red" />
              }
            />

            {/* Job Description */}
            <UploadCard
              title="JD Upload"
              inputId="jd-upload"
              accept=".pdf,.doc,.docx"
              file={jdFile}
              onFile={setJdFile}
              onClear={() => setJdFile(null)}
              hint="Drag and drop JD or click to browse"
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
            <div className="bg-[#1b1b1b] px-6 py-3 border border-[#444748] flex items-center gap-4">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                info
              </span>
              <p className="text-sm text-white">
                This action will consume{" "}
                <span className="font-bold">1 token</span>. You have {balance}{" "}
                tokens remaining.
              </p>
            </div>
            <button
              type="button"
              onClick={startEvaluation}
              className="bg-white text-black px-12 py-4 text-lg font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              Evaluate CV
            </button>
          </section>

          {/* Processing state Modal */}
          {isProcessing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <section
                ref={processingRef as any}
                className="bento-card p-8 py-16 space-y-8 flex flex-col items-center max-w-lg w-full bg-[#111]"
              >
                <div className="relative w-full max-w-[320px] h-[300px] border border-[#444748] bg-[#111] rounded-lg shadow-2xl overflow-hidden flex-shrink-0 mx-auto">
                  {/* Scanner line */}
                  <div className="absolute left-0 right-0 top-0 h-[3px] bg-white animate-scan z-20" />

                  {/* Resume mock */}
                  <div className="h-full p-6 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="h-3 w-32 bg-white rounded-full" />
                        <div className="h-2 w-24 bg-[#444748] rounded-full" />
                        <div className="h-2 w-28 bg-[#444748] rounded-full" />
                      </div>
                    </div>

                    <div className="mt-6 flex-1 space-y-3 overflow-hidden opacity-50">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full bg-[#444748] ${
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
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
                </div>

                <div className="text-center space-y-2 mt-4">
                  <h2 className="text-2xl font-bold text-white">
                    Analyzing candidate profile...
                  </h2>
                  <p className="text-sm text-[#c4c7c8]">
                    Our engine is matching skills, checking ATS compatibility,
                    and generating insights.
                  </p>
                </div>
              </section>
            </div>
          )}

          {/* Results section */}
          {showResults && evaluationResult && (
            <section ref={resultsRef as any} className="space-y-6">
              {/* Match summary */}
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
                  <div key={label} className="bento-card p-6 text-center">
                    <p className="text-sm uppercase text-[#c4c7c8] mb-2 font-semibold">
                      {label}
                    </p>
                    <div className="text-5xl font-bold text-white mb-2">
                      {value}
                      <span className="text-2xl text-[#c4c7c8]">%</span>
                    </div>
                    <div className="w-full h-1 bg-[#353535]">
                      <div
                        className="progress-bar-fill h-full bg-white"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI insights grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bento-card p-6">
                  <h4 className="text-sm uppercase text-white border-b border-white pb-2 mb-4 font-semibold">
                    Strengths
                  </h4>
                  <ul className="space-y-3 text-sm text-white">
                    {evaluationResult.strengths?.map(
                      (item: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-white">+</span>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="bento-card p-6">
                  <h4 className="text-sm uppercase text-white border-b border-white pb-2 mb-4 font-semibold">
                    Weaknesses
                  </h4>
                  <ul className="space-y-3 text-sm text-white opacity-80">
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

                <div className="bento-card p-6">
                  <h4 className="text-sm uppercase text-white border-b border-white pb-2 mb-4 font-semibold">
                    Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {evaluationResult.missing_skills?.map((skill: string) => (
                      <span
                        key={skill}
                        className="bg-[#171717] px-3 py-1 text-sm border border-[#262626] text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bento-card p-6 flex flex-col">
                  <h4 className="text-sm uppercase text-white border-b border-white pb-2 mb-4 font-semibold">
                    Recruiter Summary
                  </h4>
                  <p className="text-sm italic text-[#c4c7c8] flex-1">
                    &ldquo;{evaluationResult.recruiter_summary}&rdquo;
                  </p>
                  <p className="text-sm font-bold text-white mt-4 uppercase tracking-widest text-right">
                    Verdict: {evaluationResult.final_verdict}
                  </p>
                </div>
              </div>

              {/* Technical match breakdown */}
              <div className="bento-card p-6">
                <h4 className="text-sm uppercase text-white mb-6 font-semibold">
                  Skill Matching
                </h4>
                <div className="space-y-6 text-white">
                  {evaluationResult.skill_matching?.map(
                    (skillItem: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-semibold">
                            {skillItem.skill}
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {skillItem.match_percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#353535]">
                          <div
                            className="progress-bar-fill h-full bg-white"
                            style={{ width: `${skillItem.match_percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Download action */}
              <div className="flex justify-center pt-6 pb-12">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2 border border-white text-white px-8 py-3 font-bold hover:bg-white hover:text-black transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">
                    {isDownloading ? "hourglass_empty" : "download"}
                  </span>
                  {isDownloading
                    ? "Generating PDF..."
                    : "Download Full Report (PDF)"}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Hidden PDF Template Container */}
      {/* <div className="absolute top-0 left-[-9999px] z-[-1]">
        {evaluationResult && (
          <ReportTemplate 
            ref={reportRef} 
            evaluationResult={evaluationResult} 
            candidateName={cvFile?.name?.replace(/\.[^/.]+$/, "")} 
          />
        )}
      </div> */}

      {/* Global footer */}
      <footer className="w-full py-4 sm:py-6 border-t border-[#444748] bg-[#131313] px-4 sm:px-8 md:px-12 flex flex-col md:flex-row justify-between items-center shrink-0">
        <div className="flex flex-col md:flex-row gap-6 items-center mb-4 md:mb-0">
          <span className="text-sm font-bold text-white">
            Obsidian Precision
          </span>
          <p className="text-sm text-[#c4c7c8]">
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
              className="text-sm text-[#c4c7c8] hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
