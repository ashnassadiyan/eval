"use client";
import { Download } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import type { JobPosting } from "@/lib/types";

// Server component: the <h1> is rendered on the server so crawlers and
// social scrapers see the real title, independent of any client JS.
export function JdHeader({ job, jdLink }: any) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-8 sm:px-10">
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
        {job.job_title}
      </h1>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a
          href={jdLink}
          download
          className="inline-flex items-center gap-2 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
        >
          <Download size={14} />
          Download JD
        </a>
      </div>
    </header>
  );
}
