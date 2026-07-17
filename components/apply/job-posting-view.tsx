"use client";
import { ThemeProvider } from "./theme-provider";
import { JdHeader } from "./jd-header";

import { ApplySidebar } from "./apply-sidebar";
import { JobPosting } from "@/lib/types";
import { useEffect, useState } from "react";
import candidateService from "@/store/services/candidate.service";
import dynamic from "next/dynamic";
import ApplicationStatusModal from "./ApplicationStatusModel";

const PdfViewer = dynamic(
  () => import("./pdf-viewer").then((mod) => mod.PdfViewer),
  { ssr: false }
);

/**
 * This is a Server Component. It renders the header (real, crawlable
 * markup) and hands the interactive pieces (theme, PDF viewer, upload
 * form) to client components. It has no dependency on a root layout —
 * ThemeProvider carries its own dark/light class, so this component
 * can be dropped into any page or app.
 */
export function JobPostingView({ job }: any) {
  const { job_details } = job;
  const [jdLink, setJdLink] = useState("");

  useEffect(() => {
    candidateService.getCv(job_details.jd_link).then((res) => {
      setJdLink(res.data.url);
    });
  }, []);

  const getFileNameFromUrl = (url: string) => {
    if (!url) return "";

    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").pop() ?? "");
  };

  console.log(jdLink, "jdLink");

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black transition-colors">
        <JdHeader job={job_details} jdLink={jdLink} />

        <main className="grid grid-cols-1 gap-6 px-6 pb-16 sm:px-10 lg:grid-cols-[1fr_360px]">
          <PdfViewer fileName={getFileNameFromUrl(jdLink)} fileUrl={jdLink} />
          <ApplySidebar job={job} />
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 dark:border-white/10 px-6 py-6 sm:px-10">
          <div>
            <p className="text-sm font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {job.company}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              © {new Date().getFullYear()} {job.company}.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-neutral-500 dark:text-neutral-400">
            <a
              href="#"
              className="hover:text-neutral-900 dark:hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-neutral-900 dark:hover:text-white"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-neutral-900 dark:hover:text-white"
            >
              Contact
            </a>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
