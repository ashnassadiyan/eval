"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Mail,
  Phone,
  User,
  Info,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import candidateService from "@/store/services/candidate.service";
import PdfReportDocument from "@/components/evaluate/ReportTemplate";
import { pdf } from "@react-pdf/renderer";

export const NEON = {
  green: "#10b981",
  yellow: "#eab308",
  red: "#ef4444",
};

const STATUS_STYLES = {
  strong: {
    label: "Strong",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    border: "border-emerald-500/30",
  },
  mid: {
    label: "Medium",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    border: "border-amber-500/30",
  },
  low: {
    label: "Low",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-500/10 dark:bg-red-500/15",
    border: "border-red-500/30",
  },
};

function CompactScoreCell({ value }) {
  const num = Number(value) || 0;
  let scoreColor = "text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700";

  if (num >= 80) {
    scoreColor = "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30";
  } else if (num >= 60) {
    scoreColor = "text-amber-700 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30";
  } else if (num > 0) {
    scoreColor = "text-red-700 dark:text-red-400 bg-red-500/10 dark:bg-red-500/15 border-red-500/30";
  }

  return (
    <span className={`inline-flex items-center gap-0.5 font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg border shadow-2xs tabular-nums ${scoreColor}`}>
      {num}%
    </span>
  );
}

function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  const s = STATUS_STYLES[key] || STATUS_STYLES.mid;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border shadow-2xs ${s.color} ${s.bg} ${s.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

export function CandidateTable({
  candidates,
  onViewReport,
  page,
  setPage,
  total,
  limit = 10,
}) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);

  const start = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const end = Math.min(safePage * limit, total);

  const handleDownload = async (evaluationResult, candidateName) => {
    if (!evaluationResult) return;
    setIsDownloading(true);
    try {
      const blob = await pdf(
        <PdfReportDocument
          evaluationResult={evaluationResult}
          candidateName={candidateName || evaluationResult.cv_link?.name?.replace(/\.[^/.]+$/, "")}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Evaluation_Report_${candidateName || "Candidate"}.pdf`;
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

  if (candidates.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0c] px-6 py-16 text-center shadow-lg">
        <p className="text-xs font-mono font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
          NO CANDIDATES FOUND MATCHING CRITERIA
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#0a0a0c] shadow-xl transition-all">
        {/* Table Outer Container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/80">
                <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                  Candidate
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                  Email
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                  Phone Number
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                  CV Document
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                  Match Status
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase text-right">
                  ATS Score
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase text-right">
                  Overall Match
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase text-right">
                  Selection Prob.
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/60">
              {candidates.map((c) => {
                const candidateName = c.name || "Candidate";
                const isExpanded = expandedRowId === c.id;

                return (
                  <React.Fragment key={c.id}>
                    <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors">
                      {/* Candidate Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
                            {candidateName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-white text-xs">
                              {candidateName}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                               {c?.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
                          <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate max-w-[160px]" title={c.email || "N/A"}>
                            {c.email || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Phone Number Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
                          <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>{c.phone || c.phone_number || "N/A"}</span>
                        </div>
                      </td>

                      {/* CV Link Column */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => {
                            if (c.cv_link) {
                              candidateService.getCv(c.cv_link).then((res) => {
                                window.open(res.data.url, "_blank");
                              });
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-primary hover:border-primary/40 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          <span> CV</span>
                        </button>
                      </td>

                      {/* Match Status Column */}
                      <td className="px-5 py-4">
                        <StatusBadge status={c.final_verdict} />
                      </td>

                      {/* ATS Score Column */}
                      <td className="px-5 py-4 text-right">
                        <CompactScoreCell value={c.atsScore} />
                      </td>

                      {/* Overall Match Column */}
                      <td className="px-5 py-4 text-right">
                        <CompactScoreCell value={c.overallMatch} />
                      </td>

                      {/* Selection Probability Column */}
                      <td className="px-5 py-4 text-right">
                        <CompactScoreCell value={c.selectionProb} />
                      </td>

                      {/* Action Buttons Column */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Details Toggle Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedCandidate(c)}
                            title="Inspect Recruiter Summary"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                          >
                            <Info className="w-3.5 h-3.5 text-blue-500" />
                            <span>Details</span>
                          </button>

                          {/* View / Download PDF Report Button */}
                          <button
                            type="button"
                            onClick={() => handleDownload(c.evaluationResult, candidateName)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-extrabold hover:opacity-90 transition-all shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Report</span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline Expandable Row Detail */}
                    {isExpanded && (
                      <tr className="bg-zinc-50/90 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Recruiter Evaluation Summary
                              </span>
                              <button
                                onClick={() => setExpandedRowId(null)}
                                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                              >
                                Close
                              </button>
                            </div>
                            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                              {c.recruiter_summary || "No specific summary provided for this candidate."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
          <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            SHOWING {start} - {end} OF {total} CANDIDATES
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> PREV
            </button>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const maxVal = Math.min(3, totalPages);
              const startVal = Math.min(
                Math.max(1, safePage - 1),
                Math.max(1, totalPages - maxVal + 1)
              );
              const pNum = startVal + i;
              return (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    pNum === safePage
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-all cursor-pointer"
            >
              NEXT <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recruiter Summary Inspection Modal (Prevents Clipping) */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-extrabold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  Candidate Insights
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-2">
                  {selectedCandidate.name || "Candidate Report"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  ID: {selectedCandidate.id} • {selectedCandidate.email}
                </p>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-center">
              <div>
                <span className="block text-[10px] font-mono uppercase text-zinc-400">ATS Score</span>
                <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                  {selectedCandidate.atsScore}%
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-zinc-400">Overall Match</span>
                <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                  {selectedCandidate.overallMatch}%
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-zinc-400">Selection Prob.</span>
                <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                  {selectedCandidate.selectionProb}%
                </span>
              </div>
            </div>

            {/* Detailed Recruiter Summary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Recruiter Evaluation Summary
              </h4>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium max-h-48 overflow-y-auto">
                {selectedCandidate.recruiter_summary || "No specific recruiter summary provided for this candidate."}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDownload(selectedCandidate.evaluationResult, selectedCandidate.name);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Download className="w-4 h-4" />
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CandidateTable;
