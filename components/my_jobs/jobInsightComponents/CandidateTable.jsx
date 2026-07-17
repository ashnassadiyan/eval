import React from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import candidateService from "@/store/services/candidate.service";
import PdfReportDocument from "@/components/evaluate/ReportTemplate";
import { pdf } from "@react-pdf/renderer";

export const NEON = {
  green: "#39FF9B",
  yellow: "#F4E04D",
};

const STATUS_STYLES = {
  strong: {
    label: "strong",
    color: NEON.green,
    bg: `${NEON.green}1A`,
    border: `${NEON.green}66`,
  },
  mid: {
    label: "mid",
    color: NEON.yellow,
    bg: `${NEON.yellow}1A`,
    border: `${NEON.yellow}66`,
  },
  low: {
    label: "low",
    color: "#FF6B6B",
    bg: "#FF6B6B1A",
    border: "#FF6B6B66",
  },
};

function ScoreCell({ value }) {
  return (
    <span className="text-2xl font-bold tabular-nums text-white">{value}%</span>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider"
      style={{
        color: s.color,
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

function CandidateTable({
  candidates,
  onViewReport,
  page,
  setPage,
  total,
  limit = 10,
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);

  const start = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const end = Math.min(safePage * limit, total);

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
      // setIsDownloading(false);
    }
  };

  if (candidates.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 px-6 py-16 text-center">
        <p className="text-sm font-semibold tracking-widest text-white/40">
          NO CANDIDATES MATCH THESE FILTERS
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              {[
                "ID",
                "CV Link",
                "Match Status",
                "ATS Score",
                "Overall Match",
                "Selection Prob.",
                "Action",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-xs font-bold tracking-widest text-white/60 ${
                    i >= 3 ? "text-right" : ""
                  }`}
                >
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr
                key={c.id}
                className="border-b border-white/5 last:border-b-0 transition-colors hover:bg-white/[0.03]"
              >
                <td className="px-6 py-5">
                  {/* <div className="font-semibold text-white">{c.name}</div> */}
                  <div className="mt-0.5 text-xs text-white/40">ID: {c.id}</div>
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => {
                      candidateService.getCv(c.cv_link).then((res) => {
                        window.open(res.data.url, "_blank");
                      });
                    }}
                    style={{ cursor: "pointer" }}
                    className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    <FileText
                      size={15}
                      strokeWidth={1.75}
                      className="text-white/50"
                    />
                    CV
                  </button>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={c.final_verdict} />
                </td>
                <td className="px-6 py-5 text-right">
                  <ScoreCell value={c.atsScore} />
                </td>
                <td className="px-6 py-5 text-right">
                  <ScoreCell value={c.overallMatch} />
                </td>
                <td className="px-6 py-5 text-right">
                  <ScoreCell value={c.selectionProb} />
                </td>
                <td className="relative px-6 py-5 text-right group">
                  <button
                    onClick={() => handleDownload(c.evaluationResult)}
                    className="rounded-md border border-white/15 px-4 py-2 text-xs font-bold tracking-widest text-white transition-colors hover:bg-white hover:text-black"
                  >
                    VIEW REPORT
                  </button>

                  {/* Tooltip / Popover */}
                  <div
                    className="
                        pointer-events-none
                        absolute
                        right-0
                        top-full
                        z-50
                        mt-3
                        hidden
                        w-72
                        rounded-xl
                        border
                        border-white/10
                        bg-[#111]
                        p-4
                        text-left
                        shadow-2xl
                        group-hover:block
                      "
                  >
                    <div className="mb-3 text-sm font-bold text-white">
                      Recruiter Summary
                    </div>

                    <div className="space-y-2 text-xs text-white/60">
                      <div>{c.recruiter_summary}</div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 bg-white/[0.02] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-medium tracking-widest text-white/40">
          SHOWING {start}-{end} OF {total} CANDIDATES
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold tracking-widest text-white/50 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={14} strokeWidth={2} />
            PREVIOUS
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
            const active = n === safePage;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="h-8 w-8 rounded-md text-xs font-bold transition-colors"
                style={
                  active
                    ? { backgroundColor: "#ffffff", color: "#000" }
                    : { color: "rgba(255,255,255,0.5)" }
                }
              >
                {n}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold tracking-widest text-white/50 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            NEXT
            <ChevronRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateTable;
