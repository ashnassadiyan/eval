import { CheckCircle2, TrendingUp, XCircle } from "lucide-react";
import React from "react";

function Skeleton({ className }) {
  return (
    <div className={`animate-pulse rounded-md bg-white/10 ${className}`} />
  );
}

function StatCard({ icon, label, value, sublabel, accent, loading }) {
  return (
    <div
      className="group relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#111111] p-6 transition-all hover:border-white/20"
      style={{ boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.03)` }}
    >
      {/* accent glow top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.12]"
        style={{
          background: `radial-gradient(120px 60px at 20% 0%, ${accent}, transparent)`,
        }}
      />

      <div className="relative flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-white/50">
          {label}
        </span>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
        >
          {icon}
        </span>
      </div>

      <div className="relative mt-4 flex items-baseline gap-2">
        {loading ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <span className="text-4xl font-bold tabular-nums text-white">
            {value}
          </span>
        )}
        {!loading && (
          <span className="text-xs font-medium uppercase tracking-wide text-white/40">
            {sublabel}
          </span>
        )}
      </div>

      {loading && <Skeleton className="mt-2 h-3 w-28" />}

      <div className="relative mt-5 h-px w-full bg-white/10" />

      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

const StatesCards = ({ hasCandidates, total, eligible, rejected, loading }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <StatCard
        icon={<TrendingUp size={16} strokeWidth={2} />}
        label="TOTAL CANDIDATES"
        value={hasCandidates ? total : "0"}
        sublabel={hasCandidates ? "In pipeline" : "Pending intake"}
        accent="#60a5fa"
        loading={loading}
      />
      <StatCard
        icon={<CheckCircle2 size={16} strokeWidth={2} />}
        label="ELIGIBLE MATCHES"
        value={hasCandidates ? eligible : "0"}
        sublabel={
          hasCandidates ? "Shortlisted or interviewing" : "No matches found"
        }
        accent="#4ade80"
        loading={loading}
      />
      <StatCard
        icon={<XCircle size={16} strokeWidth={2} />}
        label="REJECTED / LOW SCORE"
        value={hasCandidates ? rejected : "0"}
        sublabel={hasCandidates ? "Below threshold" : "Zero attrition"}
        accent="#f87171"
        loading={loading}
      />
    </div>
  );
};

export default StatesCards;
