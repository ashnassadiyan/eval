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
} from "lucide-react";
import candidateService from "@/store/services/candidate.service";
import jobService from "@/store/services/job.service";
import { useDispatch, useSelector } from "react-redux";
import { getUserCredit } from "@/store/slices/creditSlice";
import PdfReportDocument from "@/components/evaluate/ReportTemplate";
import { pdf, BlobProvider } from "@react-pdf/renderer";

function StatBar({ label, value }) {
  return (
    <div className="border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/40 rounded-md p-4 flex-1 min-w-[180px]">
      <div className="text-[11px] tracking-wide text-zinc-500 dark:text-white/50 uppercase font-semibold mb-3 leading-tight">
        {label}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-zinc-900 dark:text-white tabular-nums">
          {value}%
        </span>
        <div className="flex-1 h-[3px] bg-zinc-200 dark:bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-black dark:bg-white rounded-full"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function AddCandidates() {
  const params = useParams();
  const jobId = params?.id || params?.[":id"];
  const router = useRouter();
  const dispatch = useDispatch();

  const { balance, total_added, total_used, loadingCredits } = useSelector(
    (state) => state.credits
  );

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | evaluating | done
  const [result, setResult] = useState(null);
  const [jobDetail, setJobDetail] = useState({ job_title: "" });
  const inputRef = useRef(null);
  const processingRef = useRef(null);
  const [jobLoading, setJobLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

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
    setResult(null);
    setStatus("idle");
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
      formData.append("is_allowed", true);
      const response = await candidateService.createCandidate(formData, jobId);
      const data = response.data.result;
      setResult(data);
      setStatus("done");
      dispatch(getUserCredit());
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
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    const fetchLatestReport = async () => {
      if (!jobId) return;
      setLoadingReport(true);
      try {
        const response = await candidateService.getCandidates(
          jobId,
          1,
          1,
          "",
          "",
          "",
          ""
        );
        const resData = response?.data;
        if (resData) {
          const rawCandidates =
            resData.candidates ||
            resData.results ||
            resData.data ||
            (Array.isArray(resData) ? resData : []);

          if (rawCandidates && rawCandidates.length > 0) {
            setResult(rawCandidates[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch candidate report:", err);
      } finally {
        setLoadingReport(false);
      }
    };

    fetchLatestReport();
  }, [jobId]);

  useEffect(() => {
    const getJobDetails = async () => {
      setJobLoading(true);
      try {
        const response = await jobService.getJobDetails(jobId);
        const details = response.data.job_details;
        setJobDetail(details);
        setJobLoading(false);
      } catch (err) {
      } finally {
        setJobLoading(false);
      }
    };
    getJobDetails();
  }, [jobId]);

  const handleDownload = async (evaluationResult) => {
    if (!evaluationResult) return;
    try {
      const blob = await pdf(
        <PdfReportDocument
          evaluationResult={evaluationResult}
          candidateName={evaluationResult.cv_link?.name?.replace(
            /\.[^/.]+$/,
            ""
          )}
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
    }
  };

  const navigate = () => {
    router.push("more_candidates");
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-white p-6 md:p-10 transition-colors font-sans">
      <div className="max-w-[1500px] mx-auto">
        {/* Header */}
        {jobLoading ? (
          <div className="mb-3">
            <div className="h-12 md:h-20 w-3/4 rounded-lg bg-zinc-200 dark:bg-white/10 animate-pulse" />
          </div>
        ) : (
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3 text-zinc-900 dark:text-white">
            {jobDetail?.job_title}
          </h1>
        )}

        <p className="text-zinc-600 dark:text-white/50 max-w-2xl mb-8 leading-relaxed">
          Upload a candidate's CV to perform an automated cross-analysis against
          technical benchmarks and architectural proficiency requirements.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Upload card */}
            <div className="border border-zinc-200 dark:border-white/10 rounded-lg p-6 bg-white dark:bg-[#0d0d0d] shadow-xs">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center px-6 py-14 transition-colors ${
                  dragActive
                    ? "border-black dark:border-white/60 bg-zinc-100 dark:bg-white/5"
                    : "border-zinc-300 dark:border-white/25 bg-zinc-50 dark:bg-transparent"
                }`}
              >
                {!file ? (
                  <>
                    <UploadCloud
                      className="w-10 h-10 text-zinc-500 dark:text-white/70 mb-4"
                      strokeWidth={1.5}
                    />
                    <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">Drop CV File</h2>
                    <p className="text-zinc-500 dark:text-white/45 text-sm mb-6 max-w-[260px] leading-relaxed">
                      Drag and drop the candidate's PDF file here. Max file
                      size: 10MB.
                    </p>
                    <button
                      onClick={() => inputRef.current?.click()}
                      className="border border-zinc-300 dark:border-white/70 text-zinc-800 dark:text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer select-none"
                    >
                      Select File
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
                    <FileText
                      className="w-10 h-10 text-zinc-500 dark:text-white/70 mb-4"
                      strokeWidth={1.5}
                    />
                    <p className="font-semibold mb-1 break-all px-2 text-zinc-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-zinc-500 dark:text-white/40 text-xs mb-6">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={clearFile}
                      className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-zinc-600 dark:text-white/60 hover:text-red-500 dark:hover:text-white border border-zinc-300 dark:border-white/20 px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Remove file
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Multiple Candidates CTA */}
              <button
                onClick={() => navigate()}
                className="w-full mt-4 border border-emerald-600 dark:border-[#39FF14]/60 text-emerald-700 dark:text-[#39FF14] text-xs font-bold tracking-wider uppercase px-5 py-3 rounded-lg hover:bg-emerald-500/10 dark:hover:bg-[#39FF14]/10 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer shadow-xs select-none"
              >
                Upload Multiple Candidates
              </button>

              {error && (
                <p className="text-amber-600 dark:text-amber-400 text-xs mt-3 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
                </p>
              )}

              <button
                onClick={handleEvaluate}
                disabled={status === "evaluating"}
                className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-extrabold tracking-wider uppercase text-sm py-4 rounded-xl mt-6 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none"
              >
                {status === "evaluating" ? "Evaluating..." : "Evaluate CV"}
              </button>
            </div>

            {/* System status card */}
            <div className="border border-zinc-200 dark:border-white/10 rounded-lg p-6 bg-white dark:bg-[#0d0d0d] text-sm shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-500 dark:text-white/50 uppercase text-xs tracking-wide font-semibold">
                  System Status
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 dark:fill-emerald-400 dark:text-emerald-400" />
                  AI Core Online
                </span>
              </div>

              <div className="border-t border-zinc-200 dark:border-white/10 pt-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-500 dark:text-white/45 mb-2">
                  <span>Token Usage</span>
                  <span>
                    {balance} / {total_added}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                    style={{ width: `${(total_used / total_added) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500 dark:text-white/40">
                  <span>Used: {total_added - balance}</span>
                  <span>Available: {balance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="border border-zinc-200 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] flex flex-col overflow-hidden min-h-[800px] lg:min-h-[900px] h-[calc(100vh-180px)] shadow-xs">
            {loadingReport ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-10 py-20 text-zinc-500 dark:text-white/50">
                <div className="w-8 h-8 border-2 border-zinc-900 dark:border-white border-t-transparent animate-spin rounded-full mb-4" />
                <p className="text-sm font-medium">Fetching candidate evaluation report...</p>
              </div>
            ) : !result ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-10 py-20 text-zinc-400 dark:text-white/35">
                <FileText className="w-12 h-12 mb-4" strokeWidth={1} />
                <p className="text-sm max-w-xs leading-relaxed">
                  {status === "evaluating"
                    ? "Cross-analyzing candidate against technical benchmarks..."
                    : "Upload a PDF and run the evaluation to view the evaluation report here."}
                </p>
              </div>
            ) : (
              <BlobProvider
                document={
                  <PdfReportDocument
                    evaluationResult={result}
                    candidateName={
                      result.name ||
                      result.candidateName ||
                      result.cv_link?.name?.replace(/\.[^/.]+$/, "") ||
                      "Candidate"
                    }
                  />
                }
              >
                {({ url, loading, error }) => {
                  if (loading) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-zinc-500 dark:text-white/50">
                        <div className="w-8 h-8 border-2 border-zinc-900 dark:border-white border-t-transparent animate-spin rounded-full mb-3" />
                        <p className="text-sm font-medium">Generating PDF Report Preview...</p>
                      </div>
                    );
                  }
                  if (error) {
                    return (
                      <div className="flex-1 flex items-center justify-center p-10 text-red-500 text-sm">
                        Failed to render PDF report preview.
                      </div>
                    );
                  }
                  return (
                    <>
                      <div className="w-full h-full flex flex-col flex-1">
                        <div className="bg-zinc-100 dark:bg-zinc-900/80 p-3.5 px-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            Evaluation Report Preview
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setIsFullScreen(true)}
                              className="flex items-center gap-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-md text-zinc-800 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer shadow-xs"
                              title="Full Screen View"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Full Screen</span>
                            </button>
                            <a
                              href={url}
                              download={`${
                                result.name ||
                                result.candidateName ||
                                result.cv_link?.name?.replace(/\.[^/.]+$/, "") ||
                                "Evaluation_Report"
                              }.pdf`}
                              className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md text-zinc-800 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer shadow-xs"
                            >
                              Export PDF
                            </a>
                          </div>
                        </div>
                        <iframe
                          src={url}
                          className="w-full flex-1 border-0 min-h-[750px]"
                          title="Evaluation Report PDF Preview"
                        />
                      </div>

                      {/* FULL SCREEN MODAL OVERLAY */}
                      {isFullScreen && (
                        <div className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-md p-3 md:p-6 flex flex-col w-screen h-screen">
                          <div className="bg-zinc-900 border border-zinc-800 p-4 px-6 rounded-t-xl flex items-center justify-between shadow-2xl">
                            <span className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-400" />
                              Candidate Evaluation Report — Full Screen
                            </span>
                            <div className="flex items-center gap-3">
                              <a
                                href={url}
                                download={`${
                                  result.name ||
                                  result.candidateName ||
                                  result.cv_link?.name?.replace(/\.[^/.]+$/, "") ||
                                  "Evaluation_Report"
                                }.pdf`}
                                className="border border-zinc-700 bg-zinc-800 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                              >
                                Export PDF
                              </a>
                              <button
                                type="button"
                                onClick={() => setIsFullScreen(false)}
                                className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-md text-white transition-colors cursor-pointer"
                                title="Exit Full Screen"
                              >
                                <Minimize2 className="w-4 h-4" />
                                <span>Exit Full Screen</span>
                              </button>
                            </div>
                          </div>
                          <iframe
                            src={url}
                            className="w-full flex-1 border-0 rounded-b-xl shadow-2xl"
                            title="Full Screen Evaluation Report PDF"
                          />
                        </div>
                      )}
                    </>
                  );
                }}
              </BlobProvider>
            )}

            {status === "evaluating" && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
                <section
                  ref={processingRef}
                  className="p-8 py-16 space-y-8 flex flex-col items-center max-w-lg w-full bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl"
                >
                  <div className="relative w-full max-w-[320px] h-[300px] border border-zinc-300 dark:border-[#444748] bg-zinc-50 dark:bg-[#111] rounded-lg shadow-2xl overflow-hidden flex-shrink-0 mx-auto">
                    <div className="absolute left-0 right-0 top-0 h-[3px] bg-black dark:bg-white animate-scan z-20" />
                    <div className="h-full p-6 flex flex-col">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="h-3 w-32 bg-black dark:bg-white rounded-full" />
                          <div className="h-2 w-24 bg-zinc-300 dark:bg-[#444748] rounded-full" />
                          <div className="h-2 w-28 bg-zinc-300 dark:bg-[#444748] rounded-full" />
                        </div>
                      </div>

                      <div className="mt-6 flex-1 space-y-3 overflow-hidden opacity-50">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 rounded-full bg-zinc-300 dark:bg-[#444748] ${
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
                  </div>

                  <div className="text-center space-y-2 mt-4">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                      Analyzing candidate profile...
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-[#c4c7c8]">
                      Our engine is matching skills, checking ATS
                      compatibility, and generating insights.
                    </p>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
