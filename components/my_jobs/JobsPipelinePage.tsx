import {
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
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

  // Local input state so typing feels instant, decoupled from the
  // (possibly network-triggering) `search` prop update.
  const [localSearch, setLocalSearch] = useState(search);

  // Keep local state in sync if `search` changes from outside
  // (e.g. cleared elsewhere in the app).
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce: only push to parent 400ms after the user stops typing.
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

    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="bg-surface-lowest text-on-surface px-6 sm:px-10 py-10">
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">My Jobs</h1>

            <p className="mt-2 max-w-md text-base text-on-surface-variant">
              Manage AI-driven recruitment streams and technical assessments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-outline pointer-events-none" />

              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filter jobs..."
                className="w-full border border-outline-variant bg-transparent pl-9 pr-3 py-3 text-sm outline-none focus:border-on-surface"
              />
            </div>

            <button
              onClick={() => router.push("my_jobs/create_job")}
              className="inline-flex items-center gap-2 bg-on-surface text-surface-lowest px-5 py-3 font-bold uppercase"
            >
              <Plus className="size-4" />
              Create Job
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-bento-border bg-bento">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="px-6 py-4 text-left">Job Title</th>
                <th className="px-6 py-4 text-left">Candidates</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Created</th>
                <th className="px-6 py-4 text-left">Closing Date</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: pageSize || 6 }).map((_, i) => (
                  <tr
                    key={`skeleton-${i}`}
                    className="border-b border-outline-variant"
                  >
                    <td className="px-6 py-5">
                      <div className="h-4 w-40 rounded bg-surface-low animate-pulse" />
                      <div className="mt-2 h-3 w-20 rounded bg-surface-low animate-pulse" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 w-8 rounded bg-surface-low animate-pulse" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-6 w-20 rounded bg-surface-low animate-pulse" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 w-24 rounded bg-surface-low animate-pulse" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 w-24 rounded bg-surface-low animate-pulse" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 w-4 rounded bg-surface-low animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  {jobs.map((job: any) => (
                    <tr
                      key={job.id}
                      className="border-b border-outline-variant hover:bg-surface-low"
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold">{job.job_title}</div>

                        <div
                          style={{ cursor: "pointer" }}
                          className="text-xs uppercase text-on-surface-variant"
                        >
                          {job.category}
                        </div>
                      </td>

                      <td className="px-6 py-5" style={{ cursor: "pointer" }}>
                        <div
                          onClick={() =>
                            router.push(`/my_jobs/${job.id}/candidates`)
                          }
                          className="text-on-surface hover:underline"
                        >
                          {job.candidate_count}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {job.status ? (
                          <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider border border-green-400 text-green-400 shadow-[0_0_10px_#00ff00]">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider border border-blue-400 text-blue-400 shadow-[0_0_10px_#3b82f6]">
                            Filled
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        {formatDateToDDMMYYYY(job.created)}
                      </td>

                      <td className="px-6 py-5">
                        {formatDateToDDMMYYYY(job.deadline)}
                      </td>

                      <td
                        className="px-6 py-5"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          router.push(`/my_jobs/${job.id}/candidates`)
                        }
                      >
                        <ExternalLink className="size-3.5" />
                      </td>
                    </tr>
                  ))}

                  {jobs.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-16 text-center text-on-surface-variant"
                      >
                        {search
                          ? `No jobs match "${search}".`
                          : "No jobs found."}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant px-6 py-4">
            <p className="text-xs uppercase text-on-surface-variant">
              {loading ? (
                <span className="inline-block h-3 w-32 rounded bg-surface-low animate-pulse align-middle" />
              ) : (
                <>
                  Showing {rangeStart}-{rangeEnd} of {total} results
                </>
              )}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1 || loading}
                className="size-9 border border-outline-variant disabled:opacity-30"
              >
                <ChevronLeft className="size-4 mx-auto" />
              </button>

              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`page-skel-${i}`}
                      className="size-9 border border-outline-variant bg-surface-low animate-pulse"
                    />
                  ))
                : pageNumbers.map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`size-9 border font-bold ${
                        p === page
                          ? "bg-on-surface text-surface-lowest border-on-surface"
                          : "border-outline-variant"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages || loading}
                className="size-9 border border-outline-variant disabled:opacity-30"
              >
                <ChevronRight className="size-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
