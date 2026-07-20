"use client";
import { Zap, Briefcase, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UserService from "../../store/services/user.service";

function StatusPill({ status }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[11px] font-bold uppercase tracking-wider border ${
        isActive
          ? "border-green-400 text-green-400 shadow-[0_0_10px_#00ff0055]"
          : "border-gray-500 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}

/* ---------- Count-up animation ---------- */

function useCountUp(
  target,
  { duration = 1400, delay = 0, enabled = true } = {}
) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!enabled || target == null || Number.isNaN(target)) return undefined;

    let startTime = null;
    const timeoutId = setTimeout(() => {
      const step = (timestamp) => {
        if (startTime === null) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setValue(Math.round(target * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay, enabled]);

  return value;
}

function CountUpNumber({ value, delay = 0, duration = 1400, className = "" }) {
  const animated = useCountUp(value, {
    duration,
    delay,
    enabled: value != null,
  });
  return <span className={className}>{(animated ?? 0).toLocaleString()}</span>;
}

/* Mounts a card "revealed", starting false so width/height transitions
   (progress bar fill, sparkline bars) have a 0 state to animate from
   instead of popping in already at their target size. */
function useReveal(active, delay = 0) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!active) return undefined;
    setRevealed(false);
    const id = requestAnimationFrame(() => {
      const t = setTimeout(() => setRevealed(true), delay);
      return () => clearTimeout(t);
    });
    return () => cancelAnimationFrame(id);
  }, [active, delay]);
  return revealed;
}

/* ---------- Skeleton primitives ---------- */

function SkeletonBar({ className = "" }) {
  return (
    <div className={`bg-gray-800 rounded-sm animate-pulse ${className}`} />
  );
}

function StatCardSkeleton({ accent }) {
  return (
    <div className="relative bg-[#0a0a0a] border border-gray-800 pl-6 pr-6 py-6 overflow-hidden">
      <span
        className="absolute left-0 top-0 bottom-0 w-[3px] opacity-40"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-center justify-between mb-6">
        <SkeletonBar className="h-3 w-28" />
        <SkeletonBar className="size-4" />
      </div>
      <SkeletonBar className="h-9 w-24 mb-5" />
      <SkeletonBar className="h-1.5 w-full mb-3" />
      <SkeletonBar className="h-3 w-32" />
    </div>
  );
}

function JobRowSkeleton() {
  return (
    <div className="flex items-center gap-6 px-6 py-5 border-b border-gray-800 last:border-b-0">
      <SkeletonBar className="size-9 shrink-0" />
      <div className="min-w-[220px] space-y-2">
        <SkeletonBar className="h-4 w-40" />
        <SkeletonBar className="h-2.5 w-20" />
      </div>
      <div className="flex-1">
        <SkeletonBar className="h-3 w-28" />
      </div>
      <SkeletonBar className="h-6 w-20" />
      <SkeletonBar className="h-3 w-24 shrink-0" />
    </div>
  );
}

/* ---------- Dashboard ---------- */

export default function Dashboard() {
  const { balance, total_added, total_used, loadingCredits } = useSelector(
    (state: any) => state?.credits
  );

  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [insightsError, setInsightsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const getInsights = async () => {
      setLoadingInsights(true);
      setInsightsError(false);
      try {
        const response = await UserService.getUserInsigts();
        if (!cancelled) setInsights(response?.data ?? null);
      } catch (error) {
        if (!cancelled) setInsightsError(true);
      } finally {
        if (!cancelled) setLoadingInsights(false);
      }
    };

    getInsights();
    return () => {
      cancelled = true;
    };
  }, []);

  // Guard against divide-by-zero / undefined credit totals
  const hasCreditData =
    !loadingCredits && typeof total_added === "number" && total_added > 0;
  const usedPct = hasCreditData
    ? Math.min(100, Math.round((balance / total_added) * 100))
    : 0;

  const recentJobs = insights?.recentJobs ?? [];
  const jobsCount =
    insights?.jobStats?.count ?? insights?.candidates_count ?? 0;
  const jobsChangePct = insights?.jobStats?.changePct ?? null;
  const sparkline = insights?.jobStats?.sparkline?.length
    ? insights.jobStats.sparkline
    : [0, 0, 0, 0, 0];
  const cvsAnalyzed = insights?.cvsAnalyzed ?? insights?.candidates_count ?? 0;

  const creditsRevealed = useReveal(!loadingCredits, 100);
  const insightsRevealed = useReveal(!loadingInsights, 100);

  return (
    <div className="min-h-screen bg-black text-white px-6 sm:px-10 py-10 font-sans">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              Welcome back, Alex!
            </h1>
            <p className="mt-2 text-xs sm:text-sm uppercase tracking-widest text-gray-400">
              System status: Optimal &nbsp;•&nbsp; 0.04ms latency
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {/* Token Usage */}
          {loadingCredits ? (
            <StatCardSkeleton accent="#60a5fa" />
          ) : (
            <div className="relative bg-[#0a0a0a] border border-gray-800 pl-6 pr-6 py-6 overflow-hidden">
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-400 shadow-[0_0_12px_#60a5fa]" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Token Usage
                </span>
                <Zap className="size-4 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-1 mb-5">
                <CountUpNumber
                  value={balance ?? 0}
                  delay={150}
                  duration={1400}
                  className="text-4xl font-black"
                />
                <span className="text-sm text-gray-500">
                  / {(total_added ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 mb-3">
                <div
                  className="h-full bg-blue-400 shadow-[0_0_8px_#60a5fa] transition-all duration-[1400ms] ease-out"
                  style={{ width: `${creditsRevealed ? usedPct : 0}%` }}
                />
              </div>
              <p className="text-[11px] uppercase tracking-widest text-gray-500">
                {hasCreditData
                  ? `${usedPct}% threshold reached`
                  : "No usage data yet"}
              </p>
            </div>
          )}

          {/* Recent Jobs stat */}
          {loadingInsights ? (
            <StatCardSkeleton accent="#facc15" />
          ) : (
            <div className="relative bg-[#0a0a0a] border border-gray-800 pl-6 pr-6 py-6 overflow-hidden">
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400 shadow-[0_0_12px_#facc15]" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                  Recent Jobs
                </span>
                <Briefcase className="size-4 text-yellow-400" />
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <CountUpNumber
                  value={jobsCount}
                  delay={400}
                  duration={1500}
                  className="text-4xl font-black"
                />
                {jobsChangePct != null && (
                  <span className="text-sm text-gray-500">
                    {jobsChangePct >= 0 ? "+" : ""}
                    {jobsChangePct}% vs last week
                  </span>
                )}
              </div>

              <div className="flex items-end gap-1 h-10">
                {sparkline.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-yellow-400/60 rounded-t-sm transition-all duration-700"
                    style={{
                      height: insightsRevealed ? `${Math.max(h, 4)}%` : "0%",
                      transitionDelay: `${400 + i * 80}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CVs Analyzed */}
          {loadingInsights ? (
            <StatCardSkeleton accent="#4ade80" />
          ) : (
            <div className="relative bg-[#0a0a0a] border border-gray-800 pl-6 pr-6 py-6 overflow-hidden">
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-green-400 shadow-[0_0_12px_#4ade80]" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-green-400">
                  CVs Analyzed
                </span>
                <FileText className="size-4 text-green-400" />
              </div>
              <div className="mb-5">
                <CountUpNumber
                  value={cvsAnalyzed}
                  delay={650}
                  duration={1600}
                  className="text-4xl font-black"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-2 rounded-full bg-gray-700 animate-pulse"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <span className="text-[11px] uppercase tracking-widest text-gray-500">
                  Real-time processing active
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Job Postings */}
        <div className="border border-gray-800 bg-[#0a0a0a]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-300">
              Recent Job Postings
            </h2>
            <button className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none px-1">
              ···
            </button>
          </div>

          <div>
            {loadingInsights ? (
              <>
                <JobRowSkeleton />
                <JobRowSkeleton />
                <JobRowSkeleton />
              </>
            ) : insightsError ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-400 mb-1">
                  Couldn't load recent job postings.
                </p>
                <p className="text-[11px] uppercase tracking-widest text-gray-600">
                  Check your connection and try again.
                </p>
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-400">
                  No job postings yet. Create one to see it here.
                </p>
              </div>
            ) : (
              recentJobs.map((job) => (
                <div
                  key={job.ref}
                  className="flex items-center gap-6 px-6 py-5 border-b border-gray-800 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <div
                    className="size-9 flex items-center justify-center border shrink-0"
                    style={{ borderColor: job.accent, color: job.accent }}
                  >
                    <Briefcase className="size-4" />
                  </div>

                  <div className="min-w-[220px]">
                    <div className="font-bold text-sm">{job.title}</div>
                    <div className="text-[11px] uppercase tracking-widest text-gray-500">
                      REF: {job.ref}
                    </div>
                  </div>

                  <div className="flex-1 text-sm text-gray-300">
                    Candidates: {job.candidates}
                  </div>

                  <div className="w-24">
                    <StatusPill status={job.status} />
                  </div>

                  <div className="text-sm text-gray-500 shrink-0">
                    {job.posted}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
