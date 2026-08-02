"use client";

import { Zap, Briefcase, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UserService from "@/store/services/user.service";
import jobService from "@/store/services/job.service";

function StatusPill({ status }: { status: string }) {
  const isActive = status === "ACTIVE" || status === "active";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider border ${
        isActive
          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
          : "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
      }`}
    >
      {status}
    </span>
  );
}

/* ---------- Count-up animation ---------- */

function useCountUp(
  target: number | null | undefined,
  { duration = 1400, delay = 0, enabled = true } = {}
) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || target == null || Number.isNaN(target)) return undefined;

    let startTime: number | null = null;
    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
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

function CountUpNumber({
  value,
  delay = 0,
  duration = 1400,
  className = "",
}: {
  value: number | null | undefined;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const animated = useCountUp(value, {
    duration,
    delay,
    enabled: value != null,
  });
  return <span className={className}>{(animated ?? 0).toLocaleString()}</span>;
}

/* Mounts a card "revealed" */
function useReveal(active: boolean, delay = 0) {
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

function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-zinc-200 dark:bg-zinc-800/60 rounded-xs animate-pulse ${className}`} />
  );
}

function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-7 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <SkeletonBar className="h-3 w-28" />
        <SkeletonBar className="size-4" />
      </div>
      <SkeletonBar className="h-9 w-24 mb-5" />
      <SkeletonBar className="h-2 w-full mb-4" />
      <div className="pt-4 border-t border-border/60 flex justify-between">
        <SkeletonBar className="h-3 w-20" />
        <SkeletonBar className="h-3 w-24" />
      </div>
    </div>
  );
}

function JobRowSkeleton() {
  return (
    <div className="flex items-center gap-6 px-6 py-5 border-b border-zinc-200 dark:border-zinc-800/60 last:border-b-0">
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

/* ---------- Dashboard Client Component ---------- */

export default function DashboardClient() {
  const { balance, total_added, total_used, loadingCredits } = useSelector(
    (state: any) => state?.credits
  );
  const user = useSelector((state: any) => state?.auth?.user);

  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [insightsError, setInsightsError] = useState(false);

  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    const fetchRecentJobs = async () => {
      setLoadingJobs(true);
      setJobsError(false);
      try {
        const response: any = await jobService.getMyJobs(1, "", 4);
        if (!cancelled) {
          setRecentJobs(response?.data?.jobs ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch recent jobs:", error);
        if (!cancelled) setJobsError(true);
      } finally {
        if (!cancelled) setLoadingJobs(false);
      }
    };

    fetchRecentJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasCreditData =
    !loadingCredits && typeof total_added === "number" && total_added > 0;
  const usedPct = hasCreditData
    ? Math.min(100, Math.round((balance / total_added) * 100))
    : 0;

  const jobsCount = insights?.job_count ?? recentJobs.length ?? 0;
  const sparkline: number[] = insights?.jobStats?.sparkline?.length
    ? insights.jobStats.sparkline
    : [20, 45, 30, 70, 85, 60, 95];
  const cvsAnalyzed = insights?.cvsAnalyzed ?? insights?.candidates_count ?? 0;

  const creditsRevealed = useReveal(!loadingCredits, 100);
  const insightsRevealed = useReveal(!loadingInsights, 100);

  return (
    <div className="relative min-h-screen bg-background text-foreground px-6 sm:px-10 py-8 font-sans transition-colors overflow-hidden">
      {/* Background Lighting & Grid Pattern from ProcessSection */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse" />
        <div
          className="absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800/80">
          <div>
            <span className="inline-block text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
              Overview & Analytics
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Recruitment Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Active</span>
            </div>
          </div>
        </div>

        {/* Stat cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-8">
          {/* Card 1: Token Usage */}
          {loadingCredits ? (
            <StatCardSkeleton />
          ) : (
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-7 transition-all duration-500 flex flex-col justify-between hover:border-primary/40 hover:bg-card hover:scale-[1.01] shadow-xl shadow-black/5 dark:shadow-black/20">
              {/* Top Laser Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />

              <div>
                {/* Top Row: Label & Previous Icon Style */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Token Usage
                  </span>
                  <Zap className="size-4 text-zinc-700 dark:text-zinc-300" />
                </div>

                {/* Main Count & Total */}
                <div className="flex items-baseline gap-1.5 mb-4">
                  <CountUpNumber
                    value={balance ?? 0}
                    delay={150}
                    duration={1400}
                    className="text-3xl sm:text-4xl font-black text-foreground tracking-tight"
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    / {(total_added ?? 0).toLocaleString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 rounded-full bg-muted mb-3 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-[1400ms] ease-out"
                    style={{ width: `${creditsRevealed ? usedPct : 0}%` }}
                  />
                </div>

                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {hasCreditData
                    ? `${usedPct}% balance available`
                    : "No credit usage recorded"}
                </p>
              </div>

              {/* Footer Indicator */}
              <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono font-bold text-muted-foreground">
                <span>CREDIT METRIC</span>
                <span className="text-foreground">{(balance ?? 0).toLocaleString()} Remaining</span>
              </div>
            </div>
          )}

          {/* Card 2: Active Jobs */}
          {loadingInsights ? (
            <StatCardSkeleton />
          ) : (
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-7 transition-all duration-500 flex flex-col justify-between hover:border-primary/40 hover:bg-card hover:scale-[1.01] shadow-xl shadow-black/5 dark:shadow-black/20">
              {/* Top Laser Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />

              <div>
                {/* Top Row: Label & Previous Icon Style */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Active Jobs
                  </span>
                  <Briefcase className="size-4 text-zinc-700 dark:text-zinc-300" />
                </div>

                {/* Main Count */}
                <div className="flex items-baseline gap-2 mb-4">
                  <CountUpNumber
                    value={jobsCount}
                    delay={400}
                    duration={1500}
                    className="text-3xl sm:text-4xl font-black text-foreground tracking-tight"
                  />
                </div>

                {/* Sparkline Visual */}
                <div className="flex items-end gap-1.5 h-8">
                  {sparkline.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-xs bg-primary/20 hover:bg-primary transition-all duration-500"
                      style={{
                        height: insightsRevealed ? `${Math.max(h, 12)}%` : "0%",
                        transitionDelay: `${400 + i * 60}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Footer Indicator */}
              <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono font-bold text-muted-foreground">
                <span>PIPELINE HEALTH</span>
                <span className="text-foreground">{jobsCount} Active Positions</span>
              </div>
            </div>
          )}

          {/* Card 3: CVs Evaluated */}
          {loadingInsights ? (
            <StatCardSkeleton />
          ) : (
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-7 transition-all duration-500 flex flex-col justify-between hover:border-primary/40 hover:bg-card hover:scale-[1.01] shadow-xl shadow-black/5 dark:shadow-black/20">
              {/* Top Laser Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />

              <div>
                {/* Top Row: Label & Previous Icon Style */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    CVs Evaluated
                  </span>
                  <FileText className="size-4 text-zinc-700 dark:text-zinc-300" />
                </div>

                {/* Main Count */}
                <div className="mb-4">
                  <CountUpNumber
                    value={cvsAnalyzed}
                    delay={650}
                    duration={1600}
                    className="text-3xl sm:text-4xl font-black text-foreground tracking-tight"
                  />
                </div>

                {/* Indicator Subtext */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Real-time pipeline active
                  </span>
                </div>
              </div>

              {/* Footer Indicator */}
              <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono font-bold text-muted-foreground">
                <span>AI ENGINE</span>
                <span className="text-foreground">Under 10s Analysis</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Job Postings Table */}
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0c] overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-transparent">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
              Recent Job Postings & Pipeline
            </h2>
          </div>

          <div>
            {loadingJobs ? (
              <>
                <JobRowSkeleton />
                <JobRowSkeleton />
                <JobRowSkeleton />
                <JobRowSkeleton />
              </>
            ) : jobsError ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Unable to fetch recent jobs at this time.
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 font-mono">
                  Please refresh the page to retry.
                </p>
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  No active job postings found.
                </p>
              </div>
            ) : (
              recentJobs.map((job: any, index: number) => {
                const title = job.job_title || job.title || "Untitled Job";
                const id = job.id || job._id || job.ref || `job-${index}`;
                const candidatesCount = job.candidate_count ?? job.candidates ?? 0;
                const rawStatus = job.status;
                const statusStr =
                  typeof rawStatus === "boolean"
                    ? rawStatus
                      ? "ACTIVE"
                      : "CLOSED"
                    : rawStatus || "ACTIVE";
                const postedDate = job.created
                  ? new Date(job.created).toLocaleDateString()
                  : job.posted || "Recently";

                return (
                  <div
                    key={id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800/60 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-8 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-800 dark:text-white shrink-0">
                        <Briefcase className="size-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zinc-900 dark:text-white">
                          {title}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 tracking-wider">
                          REF: {id}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-zinc-600 dark:text-zinc-300">
                      <span className="font-mono">
                        Candidates:{" "}
                        <strong className="text-zinc-900 dark:text-white">
                          {candidatesCount}
                        </strong>
                      </span>
                      <StatusPill status={statusStr} />
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono">
                        {postedDate}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

