"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  UploadCloud,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Clock,
  Filter,
  Plus,
  Share,
  Download,
  FileSpreadsheet,
  FileType,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import CandidateService from "@/store/services/candidate.service";
import JobService from "@/store/services/job.service";
import CandidateTable from "./jobInsightComponents/CandidateTable";
import StatesCards from "./jobInsightComponents/StatesCards";

export const NEON = {
  green: "#39FF9B",
  yellow: "#F4E04D",
};

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "strong", label: "Strong Match" },
  { value: "mid", label: "Medium Match" },
  { value: "low", label: "Low Match" },
];

// ---------------------------------------------------------------------------
// Generic skeleton primitive — a pulsing block used to build up
// placeholder shapes that mirror the real content's dimensions.
// ---------------------------------------------------------------------------
function Skeleton({ className = "" }) {
  return (
    <span
      className={`inline-block animate-pulse rounded-md bg-zinc-200 dark:bg-white/10 ${className}`}
    />
  );
}

// ---------------------------------------------------------------------------
// Small centered confirmation dialog used before committing changes that
// hit the API (e.g. updating job status/deadline).
// ---------------------------------------------------------------------------
function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#111111] p-6 shadow-2xl">
        <h3 className="text-sm font-bold tracking-widest text-zinc-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-white/60">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-zinc-300 dark:border-white/15 px-5 py-2.5 text-xs font-bold tracking-widest text-zinc-600 dark:text-white/60 transition-colors hover:text-black dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-black text-white dark:bg-white dark:text-black px-5 py-2.5 text-xs font-bold tracking-widest transition hover:bg-zinc-800 dark:hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "UPDATING..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ roleName, onAddCandidate, jobLoading, jobShare }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-white/40">
          JOB INSIGHT
        </span>
        {jobLoading ? (
          <div className="mt-2">
            <Skeleton className="h-8 w-56 sm:h-9 sm:w-72" />
          </div>
        ) : (
          <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {roleName}
          </h1>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
        <button
          type="button"
          onClick={jobShare}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold uppercase tracking-wider border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#121215] text-zinc-900 dark:text-white shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none w-full sm:w-auto"
        >
          <Share className="w-4 h-4" />
          Share Job
        </button>

        <button
          type="button"
          onClick={onAddCandidate}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Candidate
        </button>
      </div>
    </div>
  );
}

function RangeStyles() {
  return (
    <style>{`
      input[type="range"].ji-range {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 2px;
        background: rgba(160,160,160,0.3);
        border-radius: 999px;
        outline: none;
      }
      input[type="range"].ji-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 999px;
        background: #000000;
        cursor: pointer;
        border: none;
        box-shadow: 0 0 0 4px rgba(0,0,0,0.1);
      }
      .dark input[type="range"].ji-range::-webkit-slider-thumb {
        background: #ffffff;
        box-shadow: 0 0 0 4px rgba(255,255,255,0.2);
      }
      input[type="date"].ji-date::-webkit-calendar-picker-indicator {
        filter: invert(1);
        opacity: 0.6;
        cursor: pointer;
      }
      .dark input[type="date"].ji-date::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
    `}</style>
  );
}

function ToggleSwitch({ checked, onChange }) {
  const activeColor = checked ? NEON.green : NEON.yellow;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative h-6 w-11 shrink-0 rounded-full border transition-colors"
      style={{
        backgroundColor: `${activeColor}33`,
        borderColor: `${activeColor}66`,
      }}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all ${
          checked ? "left-6" : "left-1"
        }`}
        style={{ backgroundColor: activeColor }}
      />
    </button>
  );
}

function DownloadDropdown({ onExportExcel, onExportCsv, onExportPdf }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { label: "Excel", icon: FileSpreadsheet, onClick: onExportExcel },
    { label: "CSV", icon: FileText, onClick: onExportCsv },
    { label: "PDF", icon: FileType, onClick: onExportPdf },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-white/15 bg-white dark:bg-transparent px-4 py-2 text-xs font-bold tracking-widest text-zinc-700 dark:text-white/70 transition hover:border-zinc-400 dark:hover:border-white/40 hover:text-black dark:hover:text-white shadow-xs"
      >
        <Download size={14} strokeWidth={2} />
        DOWNLOAD
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-md border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0d0d0d] shadow-lg shadow-black/20">
          {options.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                onClick?.();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-semibold tracking-widest text-zinc-700 dark:text-white/70 transition hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TopBar({
  closePosition,
  onToggleClose,
  deadline,
  onDeadlineChange,
  jobLoading,
  isDirty,
  onUpdate,
  onExportExcel,
  onExportCsv,
  onExportPdf,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0d0d0d] px-6 py-5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-widest text-zinc-600 dark:text-white/60">
            {closePosition ? "CLOSE JOB" : "OPEN JOB"}
          </span>
          {jobLoading ? (
            <Skeleton className="h-6 w-11 rounded-full" />
          ) : (
            <ToggleSwitch checked={closePosition} onChange={onToggleClose} />
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-widest text-zinc-600 dark:text-white/60">
            DEADLINE
          </span>
          {jobLoading ? (
            <Skeleton className="h-8 w-36 rounded-md" />
          ) : (
            <input
              type="date"
              value={deadline}
              onChange={(e) => onDeadlineChange(e.target.value)}
              className="ji-date rounded-md border border-zinc-300 dark:border-white/15 bg-white dark:bg-transparent px-3 py-1.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-white/40"
            />
          )}
        </div>

        {!jobLoading && isDirty && (
          <button
            type="button"
            onClick={onUpdate}
            className="inline-flex items-center gap-2 rounded-md bg-black text-white dark:bg-white dark:text-black px-5 py-2 text-xs font-bold tracking-widest transition hover:bg-zinc-800 dark:hover:bg-white/90 shadow-sm"
          >
            UPDATE
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <DownloadDropdown
          onExportExcel={onExportExcel}
          onExportCsv={onExportCsv}
          onExportPdf={onExportPdf}
        />
        <button
          type="button"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-600 dark:text-white/70 transition-colors hover:text-black dark:hover:text-white"
        >
          <Clock size={14} strokeWidth={2} />
          JOB STATUS &amp; TIMELINE
        </button>
      </div>
    </div>
  );
}

function FilterSlider({ label, value, onChange }) {
  return (
    <div className="flex-1">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-zinc-600 dark:text-white/60">
          {label}
        </span>
        <span className="text-xs font-bold text-zinc-900 dark:text-white">{value}% - 100%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ji-range"
      />
    </div>
  );
}

function StatusSelect({ value, onChange }) {
  return (
    <div className="relative w-full max-w-xs">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-zinc-300 dark:border-white/15 bg-white dark:bg-[#0d0d0d] px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-white/40"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-black dark:bg-[#0d0d0d] dark:text-white">
            {opt.label.toUpperCase()}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={2}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white/50"
      />
    </div>
  );
}

function FiltersPanel({ filters, onChange, onApply, onReset, isDirty }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0d0d0d] px-6 py-6 shadow-xs transition-colors">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={16}
            strokeWidth={2}
            className="text-zinc-600 dark:text-white/70"
          />
          <span className="text-sm font-bold tracking-widest text-zinc-900 dark:text-white">
            CANDIDATE FILTERS
          </span>
        </div>

        {isDirty && (
          <span className="text-xs font-semibold tracking-widest text-amber-600 dark:text-white/40">
            UNAPPLIED CHANGES
          </span>
        )}
      </div>

      <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
        <FilterSlider
          label="MIN ATS SCORE"
          value={filters.minAtsScore}
          onChange={(v) => onChange({ ...filters, minAtsScore: v })}
        />
        <FilterSlider
          label="MIN OVERALL MATCH"
          value={filters.minOverallMatch}
          onChange={(v) => onChange({ ...filters, minOverallMatch: v })}
        />
        <FilterSlider
          label="MIN SELECTION PROB."
          value={filters.minSelectionProb}
          onChange={(v) => onChange({ ...filters, minSelectionProb: v })}
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-3 block text-xs font-semibold tracking-widest text-zinc-600 dark:text-white/60">
            STATUS FILTER
          </span>
          <StatusSelect
            value={filters.status}
            onChange={(v) => onChange({ ...filters, status: v })}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-zinc-300 dark:border-white/15 px-5 py-3 text-xs font-bold tracking-widest text-zinc-600 dark:text-white/60 transition-colors hover:text-black dark:hover:text-white"
          >
            RESET
          </button>
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center gap-2 rounded-md bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-xs font-bold tracking-widest transition hover:bg-zinc-800 dark:hover:bg-white/90 shadow-sm"
          >
            <Filter size={14} strokeWidth={2} />
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ roleName, onAddCandidate }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-zinc-300 dark:border-white/15 bg-white dark:bg-transparent px-6 py-16 text-center">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-100 dark:bg-[#1c1c1c]">
        <UploadCloud size={26} strokeWidth={1.5} className="text-zinc-600 dark:text-white/70" />
      </div>

      <h2 className="text-3xl font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        No candidates yet
      </h2>

      <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-white/60">
        The recruitment pipeline for{" "}
        <span className="font-semibold text-zinc-900 dark:text-white">{roleName}</span> is
        currently offline. Initial data ingestion is required to activate AI
        screening protocols.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onAddCandidate}
          className="rounded-md bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-xs font-bold tracking-widest transition hover:bg-zinc-800 dark:hover:bg-white/90 shadow-sm"
        >
          ADD NEW CANDIDATE
        </button>
      </div>

      <p className="mt-10 text-xs font-medium tracking-widest text-zinc-400 dark:text-white/30">
        DROP CVS DIRECTLY HERE TO START BATCH PROCESSING
      </p>
    </div>
  );
}

const DEFAULT_FILTERS = {
  minAtsScore: 0,
  minOverallMatch: 0,
  minSelectionProb: 0,
  status: "all",
};

function toBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

function toDateInputValue(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function JobInsight({ roleName = "Neural Architect" }) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id || params?.[":id"];

  const [closePosition, setClosePosition] = useState(false);
  const [deadline, setDeadline] = useState("2024-12-31");

  const [draftClosePosition, setDraftClosePosition] = useState(false);
  const [draftDeadline, setDraftDeadline] = useState("2024-12-31");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [jobUpdating, setJobUpdating] = useState(false);

  const [strongMatches, setStrongMatches] = useState(0);
  const [lowMatches, setLowMatches] = useState(0);

  const isJobDirty =
    draftClosePosition !== closePosition || draftDeadline !== deadline;

  const handleRequestUpdate = () => {
    if (!isJobDirty) return;
    setConfirmOpen(true);
  };

  const handleCancelUpdate = () => {
    setConfirmOpen(false);
  };

  const handleConfirmUpdate = async () => {
    setJobUpdating(true);
    try {
      await JobService.updateJobDetails(id, draftClosePosition, draftDeadline);
      setClosePosition(draftClosePosition);
      setDeadline(draftDeadline);
    } catch (err) {
      console.error("Failed to update job status/deadline:", err);
    } finally {
      setJobUpdating(false);
      setConfirmOpen(false);
    }
  };

  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(true);

  const [job, setJob] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await CandidateService.getCandidates(
          id,
          page,
          10,
          appliedFilters.minAtsScore,
          appliedFilters.minSelectionProb,
          appliedFilters.minOverallMatch,
          appliedFilters.status
        );
        const resData = response.data;

        const rawCandidates =
          resData.candidates ||
          resData.results ||
          resData.data ||
          (Array.isArray(resData) ? resData : []);

        const mapped = rawCandidates.map((c) => ({
          id: c._id || c.id || "N/A",
          name: c.name || c.candidateName || c.candidate_name || "Unnamed Candidate",
          email: c.email || c.candidate_email || c.contact_email || "N/A",
          phone: c.phone || c.phone_number || c.candidate_phone || "N/A",
          cvFile: c.cvFile || c.cvUrl || c.cv || "cv.pdf",
          final_verdict: c.final_verdict,
          atsScore:
            c.ats_compatibility_score !== undefined
              ? c.ats_compatibility_score
              : c.atsScore || 0,
          overallMatch:
            c.overall_match_percentage !== undefined
              ? c.overall_match_percentage
              : c.overallMatch || 0,
          selectionProb:
            c.selection_probability !== undefined
              ? c.selection_probability
              : c.selectionProb || 0,
          recruiter_summary: c.recruiter_summary,
          cv_link: c.cv_link,
          evaluationResult: { ...c },
        }));

        setStrongMatches(resData.strong_matches);
        setLowMatches(resData.low_matches);

        setCandidates(mapped);
        setTotal(resData.total);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [id, page, appliedFilters]);

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        setJobLoading(true);
        const response = await JobService.getJobDetails(id);
        const details = response.data.job_details;
        setJob(details);

        const rawClosed = details?.status;

        if (rawClosed !== undefined) {
          const closedBool = toBool(rawClosed);
          setClosePosition(closedBool);
          setDraftClosePosition(closedBool);
        }

        const formattedDeadline = toDateInputValue(details?.deadline);
        if (formattedDeadline) {
          setDeadline(formattedDeadline);
          setDraftDeadline(formattedDeadline);
        }
      } catch (err) {
      } finally {
        setJobLoading(false);
      }
    };
    getJobDetails();
  }, [id]);

  const hasCandidates = candidates.length > 0;

  const navigate = () => {
    router.push("candidates/add_candidates");
  };

  const jobShare = () => {
    window.open(
      `/apply/${job?.job_title}/${id}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleViewReport = (candidate, kind) => {
    console.log(kind, candidate.id);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleDownloadReport = async (docType) => {
    if (!id) return;
    try {
      const response = await CandidateService.downloadSelectedCandidates(id, docType);

      let filename = `candidates_${id}.${docType === "excel" ? "xlsx" : docType}`;
      const contentDisposition = response.headers?.["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const blob = new Blob([response.data], {
        type: response.headers?.["content-type"] || "application/octet-stream",
      });

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(`Failed to download ${docType} report:`, err);
    }
  };

  const handleExportCsv = () => handleDownloadReport("csv");
  const handleExportExcel = () => handleDownloadReport("excel");
  const handleExportPdf = () => handleDownloadReport("pdf");

  const isDirty =
    JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);

  const tableKey = JSON.stringify(appliedFilters);

  return (
    <div className="w-full bg-slate-50 dark:bg-black text-zinc-900 dark:text-white p-6 sm:p-10 transition-colors min-h-screen">
      <RangeStyles />
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <PageHeader
          roleName={job?.job_title || job?.role || roleName}
          onAddCandidate={navigate}
          jobLoading={jobLoading}
          jobShare={jobShare}
        />
        <TopBar
          closePosition={draftClosePosition}
          onToggleClose={setDraftClosePosition}
          deadline={draftDeadline}
          onDeadlineChange={setDraftDeadline}
          jobLoading={jobLoading}
          isDirty={isJobDirty}
          onUpdate={handleRequestUpdate}
          onExportExcel={handleExportExcel}
          onExportCsv={handleExportCsv}
          onExportPdf={handleExportPdf}
        />

        <FiltersPanel
          filters={draftFilters}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          isDirty={isDirty}
        />

        <StatesCards
          loading={loading}
          hasCandidates={hasCandidates}
          total={total}
          eligible={strongMatches}
          rejected={lowMatches}
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="text-sm font-mono text-zinc-500 dark:text-white/50">
              LOADING PIPELINE DATA...
            </span>
          </div>
        ) : hasCandidates ? (
          <CandidateTable
            key={tableKey}
            candidates={candidates}
            onViewReport={handleViewReport}
            page={page}
            setPage={setPage}
            total={total}
            limit={10}
          />
        ) : (
          <EmptyState roleName={roleName} onAddCandidate={navigate} />
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="CONFIRM UPDATE"
        message={`Set position to ${
          draftClosePosition ? "CLOSED" : "OPEN"
        } with deadline ${draftDeadline}. Continue?`}
        confirmLabel="CONFIRM"
        busy={jobUpdating}
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
      />
    </div>
  );
}
