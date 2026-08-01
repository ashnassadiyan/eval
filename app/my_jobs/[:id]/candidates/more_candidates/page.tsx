"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getUserCredit } from "@/store/slices/creditSlice";
import { showNotification } from "@/store/slices/NotificationSlice";
import candidateService from "@/store/services/candidate.service";
import {
  FileUp,
  ClipboardList,
  X,
  FileText,
  CircleDot,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const MAX_FILES = 50;
const TOKENS_PER_FILE = 1;

export default function BulkCVAnalysis() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const jobId = params?.id || params?.[":id"];

  const { balance, total_added, total_used, loadingCredits } = useSelector(
    (state: any) => state.credits
  );

  useEffect(() => {
    dispatch(getUserCredit() as any);
  }, [dispatch]);

  const [files, setFiles] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [evaluationState, setEvaluationState] = useState<
    "idle" | "evaluating" | "done" | "failed"
  >("idle");
  const [showScreeningModal, setShowScreeningModal] = useState(false);
  const [statusMap, setStatusMap] = useState<
    Record<
      string,
      {
        status: "queued" | "uploading" | "processing" | "completed" | "failed";
        progress: number;
        error?: string;
        s3Key?: string;
      }
    >
  >({});

  const inputRef = useRef<HTMLInputElement>(null);

  const tokensRequired = files.length * TOKENS_PER_FILE;
  const tokensAvailable = balance || 0;
  const canEvaluate =
    files.length > 0 &&
    tokensRequired <= tokensAvailable &&
    evaluationState === "idle";

  const addFiles = useCallback((incoming: any) => {
    const valid = Array.from(incoming).filter((f: any) =>
      /\.(pdf|docx)$/i.test(f?.name)
    );
    setFiles((prev) => {
      const combined = [...prev, ...valid];
      return combined.slice(0, MAX_FILES);
    });
  }, []);

  const handleInputChange = (e: any) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const startPolling = (uploadData: any[]) => {
    // Polling logic template
  };

  const handleBulkEvaluate = async () => {
    if (!canEvaluate) return;
    setEvaluationState("evaluating");
    setShowScreeningModal(true);

    dispatch(
      showNotification({
        title: "AI Screening Initialized",
        body: `Started evaluation for ${files.length} candidate CVs...`,
        type: "info",
      }) as any
    );

    const initialStatus: Record<
      string,
      {
        status: "queued" | "uploading" | "processing" | "completed" | "failed";
        progress: number;
        error?: string;
        s3Key?: string;
      }
    > = {};
    files.forEach((file: any) => {
      initialStatus[file.name] = { status: "queued", progress: 0 };
    });
    setStatusMap(initialStatus);

    try {
      const fileNames = files.map((f: any) => f.name);

      const response = await candidateService.getUploadUrls(jobId, fileNames);
      const uploadData = response.data.upload_data;

      const uploadPromises = files.map(async (file: any) => {
        const item = uploadData.find((d: any) => d.file_name === file.name);
        if (!item) {
          setStatusMap((prev) => ({
            ...prev,
            [file.name]: {
              status: "failed",
              progress: 0,
              error: "Failed to get upload URL",
            },
          }));
          return;
        }

        const { upload_url, s3_key } = item;

        setStatusMap((prev) => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: "uploading",
            s3Key: s3_key,
          },
        }));

        try {
          const uploadRes = await fetch(upload_url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/pdf",
            },
            body: file,
          });

          if (!uploadRes.ok) {
            throw new Error(`Upload failed (${uploadRes.status})`);
          }

          setStatusMap((prev) => ({
            ...prev,
            [file.name]: {
              ...prev[file.name],
              status: "processing",
              progress: 100,
            },
          }));
        } catch (err: any) {
          setStatusMap((prev) => ({
            ...prev,
            [file.name]: {
              status: "failed",
              progress: 0,
              error: err.message || "Upload failed",
            },
          }));
        }
      });

      await Promise.all(uploadPromises);
      startPolling(uploadData);
    } catch (err: any) {
      console.error("Bulk upload initialization failed:", err);
      setEvaluationState("failed");
      dispatch(
        showNotification({
          title: "Screening Failed",
          body: "Could not initialize bulk upload batch.",
          type: "error",
        }) as any
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-white p-6 md:p-10 font-sans transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-zinc-900 dark:text-white">
          BULK CV ANALYSIS
        </h1>
        <p className="text-zinc-600 dark:text-neutral-400 max-w-2xl mb-10 leading-relaxed">
          Upload multiple candidate CVs for batch processing. Our AI will
          cross-reference each profile against your technical benchmarks
          simultaneously.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Upload panel */}
          <div className="bg-white dark:bg-[#131313] border border-zinc-200 dark:border-neutral-800 rounded-md p-6 flex flex-col shadow-xs">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex-1 border-2 border-dashed rounded-sm flex flex-col items-center justify-center text-center py-16 px-6 transition-colors ${
                isDragging
                  ? "border-black dark:border-white bg-zinc-100 dark:bg-neutral-900"
                  : "border-zinc-300 dark:border-neutral-700 bg-zinc-50 dark:bg-transparent hover:border-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              <FileUp
                className="w-12 h-12 text-zinc-500 dark:text-neutral-500 mb-5"
                strokeWidth={1.5}
              />
              <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">
                Batch Upload
                <br />
                Dropzone
              </h2>
              <p className="text-zinc-600 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                Drag and drop multiple PDF or
                <br />
                Docx files here.
                <br />
                Max {MAX_FILES} files per batch.
              </p>
              <button
                onClick={() => inputRef.current?.click()}
                className="border border-zinc-300 dark:border-neutral-500 text-zinc-800 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] text-xs font-bold tracking-widest px-6 py-3 rounded-lg cursor-pointer select-none"
              >
                SELECT FILES
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx"
                multiple
                className="hidden"
                onChange={handleInputChange}
              />
            </div>

            {/* Selected files list */}
            {files.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto space-y-1 pr-1">
                {files.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between bg-zinc-100 dark:bg-neutral-900 border border-zinc-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-zinc-500 dark:text-neutral-500 shrink-0" />
                      <span className="truncate text-zinc-800 dark:text-neutral-300">
                        {f.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-zinc-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-white shrink-0 ml-2 transition-colors cursor-pointer"
                      aria-label={`Remove ${f.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Token summary */}
            <div className="flex justify-between mt-6 mb-4 text-sm">
              <div>
                <div className="text-zinc-500 dark:text-neutral-500 text-xs tracking-widest mb-1 font-semibold">
                  TOKENS REQUIRED
                </div>
                <div className="font-bold text-lg text-zinc-900 dark:text-white">{tokensRequired}</div>
              </div>
              <div className="text-right">
                <div className="text-zinc-500 dark:text-neutral-500 text-xs tracking-widest mb-1 font-semibold">
                  TOKENS AVAILABLE
                </div>
                <div
                  className={`font-bold text-lg ${
                    tokensRequired > tokensAvailable
                      ? "text-red-500 dark:text-red-400"
                      : "text-emerald-600 dark:text-green-400"
                  }`}
                >
                  {tokensAvailable}
                </div>
              </div>
            </div>

            <button
              onClick={handleBulkEvaluate}
              disabled={!canEvaluate}
              className={`w-full py-4 text-sm font-extrabold tracking-wider uppercase rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] select-none ${
                canEvaluate
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer shadow-md hover:shadow-lg"
                  : "bg-zinc-200 dark:bg-neutral-800 text-zinc-400 dark:text-neutral-500 cursor-not-allowed"
              }`}
            >
              {evaluationState === "evaluating"
                ? "EVALUATING..."
                : evaluationState === "done"
                ? "EVALUATION COMPLETED"
                : "EVALUATE BATCH"}
            </button>
          </div>

          {/* Right column: Queue + status */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-[#131313] border border-zinc-200 dark:border-neutral-800 rounded-md overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-zinc-200 dark:border-neutral-800 bg-zinc-50/50 dark:bg-transparent">
                <span className="text-xs font-bold tracking-widest text-zinc-700 dark:text-neutral-300">
                  BATCH QUEUE STATUS
                </span>
              </div>
              <div className="min-h-[280px] flex flex-col items-center justify-center text-center px-6 py-10">
                {files.length === 0 ? (
                  <>
                    <ClipboardList
                      className="w-10 h-10 text-zinc-400 dark:text-neutral-600 mb-4"
                      strokeWidth={1.5}
                    />
                    <p className="text-zinc-500 dark:text-neutral-500 text-sm">
                      No files in queue. Upload CVs to begin batch analysis.
                    </p>
                  </>
                ) : (
                  <div className="w-full space-y-3 text-left">
                    {files.map((f, idx) => {
                      const itemState = statusMap[f.name];
                      const status = itemState?.status || "queued";
                      const error = itemState?.error;

                      return (
                        <div
                          key={`${f.name}-${idx}-q`}
                          className="flex items-center justify-between bg-zinc-50 dark:bg-neutral-900/50 border border-zinc-200 dark:border-neutral-800 rounded-sm px-3.5 py-2.5 text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText className="w-4 h-4 text-zinc-400 dark:text-neutral-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="truncate block text-zinc-800 dark:text-neutral-300">
                                {f.name}
                              </span>
                              {error && (
                                <span className="text-red-500 dark:text-red-400 text-xs block truncate mt-0.5">
                                  {error}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            {status === "queued" && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-neutral-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-neutral-600 inline-block animate-pulse" />
                                Queued
                              </span>
                            )}
                            {status === "uploading" && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                                Uploading
                              </span>
                            )}
                            {status === "processing" && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-yellow-400 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                                AI Screen
                              </span>
                            )}
                            {status === "completed" && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-[#39FF9B] flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                Done
                              </span>
                            )}
                            {status === "failed" && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                Failed
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-5 py-4 bg-zinc-100 dark:bg-[#1a1a1a] border-t border-zinc-200 dark:border-neutral-800">
                <span className="text-xs font-bold tracking-widest text-zinc-700 dark:text-neutral-300">
                  {evaluationState === "done"
                    ? "BATCH COMPLETED"
                    : evaluationState === "evaluating"
                    ? "PROCESSING..."
                    : files.length === 0
                    ? "READY FOR PROCESSING"
                    : "QUEUED"}
                </span>
                {evaluationState === "done" ? (
                  <button
                    onClick={() => router.push(`/my_jobs/${jobId}`)}
                    className="text-xs font-bold tracking-widest text-white bg-black dark:text-black dark:bg-[#39FF9B] hover:opacity-90 px-5 py-2.5 transition-colors rounded-sm"
                  >
                    GO TO JOB INSIGHTS
                  </button>
                ) : (
                  <button
                    disabled
                    className="text-xs font-bold tracking-widest text-zinc-400 dark:text-neutral-600 border border-zinc-200 dark:border-neutral-800 px-4 py-2 cursor-not-allowed"
                  >
                    DOWNLOAD BATCH REPORT
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System status panel */}
        <div className="bg-white dark:bg-[#131313] border border-zinc-200 dark:border-neutral-800 rounded-md p-6 mt-6 max-w-md shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-widest text-zinc-700 dark:text-neutral-300">
              SYSTEM STATUS
            </span>
            <span className="flex items-center gap-2 text-sm text-emerald-600 dark:text-green-400 font-semibold">
              <CircleDot className="w-3 h-3 fill-emerald-500 dark:fill-green-400" />
              AI Core Online
            </span>
          </div>

          <div className="flex items-center justify-between text-sm mb-2 text-zinc-900 dark:text-white">
            <span className="text-zinc-500 dark:text-neutral-500">LLM MODEL</span>
            <span className="font-semibold">PRECISION-V4.2</span>
          </div>
          <div className="flex items-center justify-between text-sm mb-4 text-zinc-900 dark:text-white">
            <span className="text-zinc-500 dark:text-neutral-500">COMPUTE LOAD</span>
            <span className="font-semibold">0.04%</span>
          </div>

          <div className="border-t border-zinc-200 dark:border-neutral-800 pt-4">
            <div className="flex items-center justify-between text-sm mb-2 text-zinc-900 dark:text-white">
              <span className="text-zinc-500 dark:text-neutral-500 text-xs tracking-widest">
                TOKEN USAGE
              </span>
              <span className="font-semibold">
                {balance || 0} / {total_added || 100}
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                style={{
                  width: `${
                    total_added
                      ? ((total_added - (balance || 0)) / total_added) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-neutral-500">
              <span>
                USED: {total_added ? total_added - (balance || 0) : 0}
              </span>
              <span>AVAILABLE: {balance || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI SCREENING IN PROGRESS MODAL (BLURRY SCREEN BACKDROP) */}
      {showScreeningModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/95 dark:bg-[#121214]/95 border border-zinc-200 dark:border-zinc-800/80 shadow-2xl rounded-2xl w-full max-w-lg p-6 md:p-8 space-y-6 relative text-center">
            <button
              type="button"
              onClick={() => setShowScreeningModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* AI Processing Glow Icon */}
            <div className="relative mx-auto size-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20 animate-ping opacity-75" />
              <div className="relative size-16 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shadow-xl">
                {evaluationState === "done" ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 dark:text-emerald-600" />
                ) : (
                  <Sparkles className="w-8 h-8 animate-pulse text-amber-400 dark:text-amber-500" />
                )}
              </div>
            </div>

            {/* Header Info */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {evaluationState === "done" ? "Screening Finished" : "AI Core Active"}
              </span>
              <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                {evaluationState === "done"
                  ? "AI Screening Completed!"
                  : "AI Screening in Progress"}
              </h3>
              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                {evaluationState === "done"
                  ? "All candidate CVs have been evaluated. View candidate profiles and match scores now."
                  : "Our AI engine is currently cross-referencing candidate CVs against technical benchmarks. We will let you know once complete."}
              </p>
            </div>

            {/* Progress Card */}
            {(() => {
              const completedCount = Object.values(statusMap).filter(
                (s) => s.status === "completed" || s.status === "processing"
              ).length;
              const totalCount = files.length || 1;
              const overallProgress = Math.min(
                Math.round((completedCount / totalCount) * 100),
                100
              );

              return (
                <div className="bg-zinc-100 dark:bg-[#1a1a1c] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3 text-left">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-500 uppercase tracking-wider font-bold">
                      Processing Candidates ({completedCount} / {files.length})
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {overallProgress}%
                    </span>
                  </div>

                  <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono text-center pt-1">
                    {evaluationState === "done"
                      ? "All candidate profiles processed successfully."
                      : "Please wait while files are analyzed..."}
                  </p>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {evaluationState === "done" ? (
                <button
                  onClick={() => router.push(`/my_jobs/${jobId}`)}
                  className="w-full bg-black text-white dark:bg-white dark:text-black py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md cursor-pointer"
                >
                  Go to Job Insights
                </button>
              ) : (
                <button
                  onClick={() => setShowScreeningModal(false)}
                  className="w-full border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white text-zinc-800 dark:text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-transparent cursor-pointer"
                >
                  Keep Working in Background
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

