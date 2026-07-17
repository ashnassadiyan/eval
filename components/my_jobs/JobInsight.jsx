"use client";
import { useState, useEffect, useCallback } from "react";
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
      className={`inline-block animate-pulse rounded-md bg-white/10 ${className}`}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/15 bg-[#111111] p-6 shadow-2xl">
        <h3 className="text-sm font-bold tracking-widest text-white">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-white/15 px-5 py-2.5 text-xs font-bold tracking-widest text-white/60 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-white px-5 py-2.5 text-xs font-bold tracking-widest text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
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
        <span className="text-xs font-semibold tracking-widest text-white/40">
          JOB INSIGHT
        </span>
        {jobLoading ? (
          <div className="mt-2">
            <Skeleton className="h-8 w-56 sm:h-9 sm:w-72" />
          </div>
        ) : (
          <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
            {roleName}
          </h1>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <button
          type="button"
          onClick={jobShare}
          className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-xs font-bold tracking-widest text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: NEON.yellow,
            boxShadow: `0 0 24px ${NEON.green}55, 0 0 4px ${NEON.green}AA`,
          }}
        >
          <Share size={14} strokeWidth={2.5} />
          SHARE JOB
        </button>

        <button
          type="button"
          onClick={onAddCandidate}
          className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-xs font-bold tracking-widest text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: NEON.green,
            boxShadow: `0 0 24px ${NEON.green}55, 0 0 4px ${NEON.green}AA`,
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          ADD NEW CANDIDATE
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
        background: rgba(255,255,255,0.15);
        border-radius: 999px;
        outline: none;
      }
      input[type="range"].ji-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 999px;
        background: #ffffff;
        cursor: pointer;
        border: none;
        box-shadow: 0 0 0 4px rgba(0,0,0,0.4);
      }
      input[type="range"].ji-range::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 999px;
        background: #ffffff;
        cursor: pointer;
        border: none;
        box-shadow: 0 0 0 4px rgba(0,0,0,0.4);
      }
      input[type="date"].ji-date::-webkit-calendar-picker-indicator {
        filter: invert(1);
        opacity: 0.6;
        cursor: pointer;
      }
    `}</style>
  );
}

function ToggleSwitch({ checked, onChange }) {
  // checked === true means the position is OPEN, false means CLOSED.
  const activeColor = checked ? NEON.green : NEON.yellow;
  console.log("top-bar", checked);

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

function TopBar({
  closePosition, // true = job is OPEN, false = job is CLOSED
  onToggleClose,
  deadline,
  onDeadlineChange,
  jobLoading,
  isDirty,
  onUpdate,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0d0d0d] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-widest text-white/60">
            {closePosition ? "CLOSE JOB" : "OPEN JOB"}
          </span>
          {jobLoading ? (
            <Skeleton className="h-6 w-11 rounded-full" />
          ) : (
            <ToggleSwitch checked={closePosition} onChange={onToggleClose} />
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-widest text-white/60">
            DEADLINE
          </span>
          {jobLoading ? (
            <Skeleton className="h-8 w-36 rounded-md" />
          ) : (
            <input
              type="date"
              value={deadline}
              onChange={(e) => onDeadlineChange(e.target.value)}
              className="ji-date rounded-md border border-white/15 bg-transparent px-3 py-1.5 text-sm text-white outline-none focus:border-white/40"
              style={{ colorScheme: "dark" }}
            />
          )}
        </div>

        {!jobLoading && isDirty && (
          <button
            type="button"
            onClick={onUpdate}
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2 text-xs font-bold tracking-widest text-black transition hover:bg-white/90"
          >
            UPDATE
          </button>
        )}
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white/70 transition-colors hover:text-white"
      >
        <Clock size={14} strokeWidth={2} />
        JOB STATUS &amp; TIMELINE
      </button>
    </div>
  );
}

function FilterSlider({ label, value, onChange }) {
  return (
    <div className="flex-1">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-white/60">
          {label}
        </span>
        <span className="text-xs font-bold text-white">{value}% - 100%</span>
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
        className="w-full appearance-none rounded-md border border-white/15 bg-[#0d0d0d] px-4 py-3 text-sm text-white outline-none focus:border-white/40"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0d0d0d]">
            {opt.label.toUpperCase()}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={2}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// FiltersPanel now edits a *draft* filter state and only reports it upward
// when "Apply Filters" is pressed. `isDirty` lights the button up so it's
// obvious when there are unapplied changes.
// ---------------------------------------------------------------------------
function FiltersPanel({ filters, onChange, onApply, onReset, isDirty }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={16}
            strokeWidth={2}
            className="text-white/70"
          />
          <span className="text-sm font-bold tracking-widest text-white">
            CANDIDATE FILTERS
          </span>
        </div>

        {isDirty && (
          <span className="text-xs font-semibold tracking-widest text-white/40">
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
          <span className="mb-3 block text-xs font-semibold tracking-widest text-white/60">
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
            className="rounded-md border border-white/15 px-5 py-3 text-xs font-bold tracking-widest text-white/60 transition-colors hover:text-white"
          >
            RESET
          </button>
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-xs font-bold tracking-widest text-black transition hover:bg-white/90"
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
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-white/15 px-6 py-16 text-center">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-[#1c1c1c]">
        <UploadCloud size={26} strokeWidth={1.5} className="text-white/70" />
      </div>

      <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
        No candidates yet
      </h2>

      <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60">
        The recruitment pipeline for{" "}
        <span className="font-semibold text-white">{roleName}</span> is
        currently offline. Initial data ingestion is required to activate AI
        screening protocols.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onAddCandidate}
          className="rounded-md bg-white px-6 py-3 text-xs font-bold tracking-widest text-black transition hover:bg-white/90"
        >
          ADD NEW CANDIDATE
        </button>
      </div>

      <p className="mt-10 text-xs font-medium tracking-widest text-white/30">
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

// Coerce whatever the API sends for a boolean-ish field ("true"/"false",
// 1/0, true/false) into an actual boolean.
function toBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

// <input type="date"> only accepts a strict "YYYY-MM-DD" string — if the
// API sends a full ISO timestamp (or a Date-like value), the input just
// renders blank even though the value is present. Normalize whatever we
// get into the format the date picker actually understands.
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

  // "Saved" values — what's actually persisted on the server, used to
  // detect whether the draft below has unsaved changes.
  const [closePosition, setClosePosition] = useState(false);
  const [deadline, setDeadline] = useState("2024-12-31");

  // "Draft" values — what the toggle/date input currently show. These are
  // only pushed to the API when the UPDATE button is pressed (and
  // confirmed), instead of auto-saving on every click/keystroke.
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
      // Leave the draft as-is on failure so the user can retry without
      // losing what they picked.
    } finally {
      setJobUpdating(false);
      setConfirmOpen(false);
    }
  };

  // Draft = what the sliders/select currently show.
  // Applied = what's actually used to filter the table.
  // They only sync when "Apply Filters" is clicked.
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
        // Filtering now happens server-side — pass the *applied* filters
        // through as query params so the API returns only matching rows,
        // already paginated against those filters.
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

        // Your API returns both `total` (all candidates for this job,
        // ignoring filters) and `filtered` (count matching the current
        // ats/pro/match filters). Pagination has to be driven by whichever
        // count the current page of `data` was actually sliced from —

        const mapped = rawCandidates.map((c) => ({
          id: c._id || c.id || "N/A",
          name: c.name || c.candidateName || "Unnamed Candidate",
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

        // Sync job-derived fields once the real data arrives. The API's
        // field name for the closed flag isn't fixed in stone, so check
        // a few likely variants and coerce whatever comes back to a real
        // boolean — otherwise a value like "true" (string) or 1 fails the
        // `!== undefined` check's intent and the switch silently stays on
        // its default (open/green) even when the job is actually closed.
        const rawClosed = details?.status;

        if (rawClosed !== undefined) {
          const closedBool = toBool(rawClosed);
          setClosePosition(closedBool);
          setDraftClosePosition(closedBool);
        }

        // job.deadline needs normalizing to what <input type="date">
        // expects — a bare ISO timestamp or Date-ish value won't render
        // in the picker otherwise, which is why the initial value looked
        // like it was missing.
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
    setPage(1); // reset pagination whenever the applied filter set changes
  };

  const handleResetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const isDirty =
    JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);

  // Remount the table whenever the *applied* filters change.
  const tableKey = JSON.stringify(appliedFilters);

  return (
    <div className="w-full bg-black p-6 sm:p-10">
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
            <span className="text-sm font-mono text-white/50">
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
