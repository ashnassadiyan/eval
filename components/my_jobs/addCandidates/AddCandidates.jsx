"use client";
import React, { useRef, useState, useCallback, useEffect, use } from "react";
import { useParams } from "next/navigation";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Circle,
} from "lucide-react";
import candidateService from "@/store/services/candidate.service";
import jobService from "@/store/services/job.service";
import { useDispatch, useSelector } from "react-redux";
import { getUserCredit } from "@/store/slices/creditSlice";

function StatBar({ label, value }) {
  return (
    <div className="border border-white/10 bg-black/40 rounded-md p-4 flex-1 min-w-[180px]">
      <div className="text-[11px] tracking-wide text-white/50 uppercase font-semibold mb-3 leading-tight">
        {label}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-white tabular-nums">
          {value}%
        </span>
        <div className="flex-1 h-[3px] bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full"
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

  console.log(jobLoading, "jobLoading");

  return (
    <div className="w-full bg-[#0a0a0a] text-white p-6 md:p-10">
      <div className="max-w-[1500px] mx-auto">
        {/* Header */}
        {jobLoading ? (
          <div className="mb-3">
            <div className="h-12 md:h-20 w-3/4 rounded-lg bg-white/10 animate-pulse" />
          </div>
        ) : (
          <h1
            className="text-4xl md:text-6xl font-black tracking-tight mb-3"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #ffffff 0%, #9a9a9a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily:
                "'Arial Black', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            {jobDetail?.job_title}
          </h1>
        )}

        <p className="text-white/50 max-w-2xl mb-8 leading-relaxed">
          Upload a candidate's CV to perform an automated cross-analysis against
          technical benchmarks and architectural proficiency requirements.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Upload card */}
            <div className="border border-white/10 rounded-lg p-6 bg-[#0d0d0d]">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border border-dashed rounded-md flex flex-col items-center justify-center text-center px-6 py-14 transition-colors ${
                  dragActive ? "border-white/60 bg-white/5" : "border-white/25"
                }`}
              >
                {!file ? (
                  <>
                    <UploadCloud
                      className="w-10 h-10 text-white/70 mb-4"
                      strokeWidth={1.5}
                    />
                    <h2 className="text-xl font-bold mb-2">Drop CV File</h2>
                    <p className="text-white/45 text-sm mb-6 max-w-[260px] leading-relaxed">
                      Drag and drop the candidate's PDF file here. Max file
                      size: 10MB.
                    </p>
                    <button
                      onClick={() => inputRef.current?.click()}
                      className="border border-white/70 text-xs font-semibold tracking-wide uppercase px-5 py-2.5 rounded-sm hover:bg-white hover:text-black transition-colors"
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
                      className="w-10 h-10 text-white/70 mb-4"
                      strokeWidth={1.5}
                    />
                    <p className="font-semibold mb-1 break-all px-2">
                      {file.name}
                    </p>
                    <p className="text-white/40 text-xs mb-6">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={clearFile}
                      className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/60 hover:text-white border border-white/20 px-4 py-2 rounded-sm transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Remove file
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-amber-400 text-xs mt-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
                </p>
              )}

              <button
                onClick={handleEvaluate}
                disabled={status === "evaluating"}
                className="w-full bg-white text-black font-bold tracking-wide uppercase text-sm py-4 rounded-sm mt-6 hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "evaluating" ? "Evaluating..." : "Evaluate CV"}
              </button>
            </div>

            {/* System status card */}
            <div className="border border-white/10 rounded-lg p-6 bg-[#0d0d0d] text-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/50 uppercase text-xs tracking-wide font-semibold">
                  System Status
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                  <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />
                  AI Core Online
                </span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/45 mb-2">
                  <span>Token Usage</span>
                  <span>
                    {balance} / {total_added}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${(total_used / total_added) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Used: {total_added - balance}</span>
                  <span>Available: {balance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="border border-white/10 rounded-lg bg-[#0d0d0d] flex flex-col overflow-hidden min-h-[600px]">
            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-10 py-20 text-white/35">
                <FileText className="w-12 h-12 mb-4" strokeWidth={1} />
                <p className="text-sm max-w-xs leading-relaxed">
                  {status === "evaluating"
                    ? "Cross-analyzing candidate against technical benchmarks..."
                    : "Upload a PDF and run the evaluation to see the technical match breakdown here."}
                </p>
              </div>
            ) : (
              <>
                <div className="p-6 md:p-8 border-b border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        label: "Overall Match",
                        value: result.overall_match_percentage,
                      },
                      {
                        label: "Selection Prob.",
                        value: result.selection_probability,
                      },
                      {
                        label: "ATS Compatibility",
                        value: result.ats_compatibility_score,
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
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-1 h-4 bg-cyan-400 inline-block shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" />
                    <h3 className="text-xs uppercase tracking-wide font-semibold text-white/70">
                      Skills Matched
                    </h3>
                  </div>
                  <div className="bento-card p-6 mb-8 border border-cyan-400/30 bg-cyan-400/[0.04] rounded-md shadow-[0_0_24px_-8px_rgba(34,211,238,0.35)]">
                    <div className="flex flex-wrap gap-2">
                      {result?.skill_matching?.map((b) => (
                        <span
                          key={b.skill}
                          className="bg-cyan-400/10 px-3 py-1.5 text-sm border border-cyan-400/40 text-cyan-300 rounded-full shadow-[0_0_10px_-3px_rgba(34,211,238,0.6)]"
                        >
                          {b.skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bento-card p-6 mb-8 mt-8 border border-yellow-400/30 bg-yellow-400/[0.04] rounded-md shadow-[0_0_24px_-8px_rgba(250,204,21,0.35)]">
                    <h4 className="text-sm uppercase text-yellow-300 border-b border-yellow-400/30 pb-2 mb-4 font-semibold tracking-wide">
                      Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_skills?.map((skill) => (
                        <span
                          key={skill}
                          className="bg-yellow-400/10 px-3 py-1.5 text-sm border border-yellow-400/40 text-yellow-300 rounded-full shadow-[0_0_10px_-3px_rgba(250,204,21,0.6)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="border border-emerald-900 bg-emerald-950/20 rounded-md p-5">
                      <h4 className="text-xs uppercase tracking-wide font-semibold text-white/70 mb-4">
                        Strengths
                      </h4>
                      <ul className="space-y-3">
                        {result.strengths.map((s) => (
                          <li
                            key={s}
                            className="flex items-start gap-2.5 text-sm leading-snug"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border border-amber-900 bg-amber-950/10 rounded-md p-5">
                      <h4 className="text-xs uppercase tracking-wide font-semibold text-white/70 mb-4">
                        Weaknesses
                      </h4>
                      <ul className="space-y-3">
                        {result.weaknesses.map((w) => (
                          <li
                            key={w}
                            className="flex items-start gap-2.5 text-sm leading-snug"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs uppercase tracking-wide font-semibold text-white/70">
                      Recommendations
                    </h3>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold bg-white text-black rounded-full px-3 py-1.5">
                      <Sparkles className="w-3 h-3" /> AI Insight
                    </span>
                  </div>
                  <div className="border-l-2 border-white/70 bg-black/30 rounded-r-md p-6 relative">
                    <span className="absolute top-3 right-5 text-5xl text-white/10 font-serif select-none">
                      &rdquo;
                    </span>
                    <p className="italic text-white/85 leading-relaxed">
                      &ldquo;{result.recruiter_summary}&rdquo;
                    </p>

                    <p className="text-sm font-bold text-white mb-2 uppercase tracking-widest text-right">
                      Verdict: {result.final_verdict}
                    </p>
                  </div>
                </div>

                <div className="mt-auto bg-white/[0.03] border-t border-white/10 p-6 flex justify-end gap-3">
                  <button className="border border-white/25 text-xs font-semibold uppercase tracking-wide px-5 py-3 rounded-sm text-white/70 hover:text-white hover:border-white/50 transition-colors">
                    Export PDF
                  </button>
                  <button className="bg-white text-black text-xs font-semibold uppercase tracking-wide px-5 py-3 rounded-sm hover:bg-white/90 transition-colors">
                    Advance Candidate
                  </button>
                </div>

                {status === "evaluating" && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <section
                      ref={processingRef}
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
                          Our engine is matching skills, checking ATS
                          compatibility, and generating insights.
                        </p>
                      </div>
                    </section>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
