import React from "react";
function Skeleton({ className = "" }) {
  return (
    <span
      className={`inline-block animate-pulse rounded-md bg-white/10 ${className}`}
    />
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${
        checked ? "border-white/40 bg-white/30" : "border-white/15 bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function TopBar({
  closePosition,
  onToggleClose,
  deadline,
  onDeadlineChange,
  jobLoading,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0d0d0d] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-widest text-white/60">
            CLOSE POSITION
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
