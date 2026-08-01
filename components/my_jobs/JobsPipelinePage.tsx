import {
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Briefcase,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

interface JobsPipelinePageProps {
  jobs: any[];
  search: any;
  setSearch: (x: any) => void;
  page: number;
  setPage: (x: any) => void;
  pageSize: number;
  total: number;
  loading: boolean;
}

export function JobsPipelinePage({
  jobs,
  search,
  setSearch,
  page,
  setPage,
  pageSize,
  total,
  loading = false,
}: JobsPipelinePageProps) {
  const router = useRouter();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    if (localSearch === search) return;

    const timeout = setTimeout(() => {
      setSearch(localSearch);
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  const pageNumbers = useMemo(() => {
    const max = Math.min(3, totalPages);

    const start = Math.min(
      Math.max(1, page - 1),
      Math.max(1, totalPages - max + 1)
    );

    return Array.from({ length: max }, (_, i) => start + i);
  }, [page, totalPages]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  function formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "N/A";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="bg-slate-50 dark:bg-[#09090b] text-zinc-900 dark:text-white px-4 sm:px-8 py-8 min-h-screen transition-colors">
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="inline-block text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
              Job Postings & Pipelines
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              My Jobs
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Manage AI-driven recruitment streams, candidate evaluation flows, and position statuses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search job titles..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64 shadow-xs"
              />
            </div>

            {/* Create Job Button */}
            <button
              onClick={() => router.push("/my_jobs/create_job")}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Job</span>
            </button>
          </div>
        </div>

        {/* Unified Table Outer Container */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#0a0a0c] shadow-xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/80">
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    Job Title & Category
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    Applicants
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    Created
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    Closing Date
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/60">
                {loading ? (
                  Array.from({ length: pageSize || 5 }).map((_, i) => (
                    <tr key={`skeleton-${i}`}>
                      <td className="px-5 py-4">
                        <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800/60 animate-pulse" />
                        <div className="mt-2 h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-800/60 animate-pulse" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-12 rounded bg-zinc-200 dark:bg-zinc-800/60 animate-pulse" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800/60 animate-pulse" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800/60 animate-pulse" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800/60 animate-pulse" />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="h-6 w-16 rounded bg-zinc-200 dark:bg-zinc-800/60 animate-pulse ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    {jobs.map((job: any) => (
                      <tr
                        key={job.id}
                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="font-bold text-xs text-zinc-900 dark:text-white">
                            {job.job_title}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                            {job.category || "General Recruiting"}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => router.push(`/my_jobs/${job.id}/candidates`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 hover:border-primary transition-all cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-primary" />
                            <span>{job.candidate_count ?? 0} Candidates</span>
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          {job.status ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                              Closed
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                          {formatDateToDDMMYYYY(job.created)}
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                          {formatDateToDDMMYYYY(job.deadline)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => router.push(`/my_jobs/${job.id}/candidates`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 transition-all shadow-xs cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {jobs.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-16 text-center text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider"
                        >
                          {search
                            ? `No job postings match "${search}".`
                            : "No jobs created yet. Click 'Create New Job' above to start screening."}
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Unified Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
            <p className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {loading ? (
                <span className="inline-block h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              ) : (
                <>
                  SHOWING {rangeStart} - {rangeEnd} OF {total} RESULTS
                </>
              )}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1 || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> PREV
              </button>

              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`page-skel-${i}`}
                      className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 animate-pulse"
                    />
                  ))
                : pageNumbers.map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        p === page
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-all cursor-pointer"
              >
                NEXT <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
