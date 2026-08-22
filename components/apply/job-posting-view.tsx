"use client";

import { JdHeader } from "./jd-header";
import { ApplySidebar } from "./apply-sidebar";
import { useEffect, useState } from "react";
import candidateService from "@/store/services/candidate.service";
import dynamic from "next/dynamic";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const PdfViewer = dynamic(
  () => import("./pdf-viewer").then((mod) => mod.PdfViewer),
  { ssr: false }
);

export function JobPostingView({ job }: any) {
  const { job_details } = job;
  const [jdLink, setJdLink] = useState("");

  useEffect(() => {
    candidateService.getCv(job_details.jd_link).then((res) => {
      setJdLink(res.data.url);
    });
  }, [job_details.jd_link]);

  const getFileNameFromUrl = (url: string) => {
    if (!url) return "";

    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").pop() ?? "");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-white transition-colors duration-200">
      <JdHeader job={job_details} jdLink={jdLink} />

      <div className="px-6 sm:px-10 py-3">
        <Breadcrumbs
          customItems={[
            { label: "Jobs Pipeline", href: "/my_jobs" },
            { label: job_details?.job_title || "Job Application" },
          ]}
        />
      </div>

      <main className="grid grid-cols-1 gap-6 px-6 pb-16 sm:px-10 lg:grid-cols-[1fr_360px]">
        <PdfViewer fileName={getFileNameFromUrl(jdLink)} fileUrl={jdLink} />
        <ApplySidebar job={job} />
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 dark:border-white/10 px-6 py-6 sm:px-10 bg-white dark:bg-transparent">
        <div>
          <p className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {job.company || "evalcv"}
          </p>
          <p className="text-xs text-zinc-500 dark:text-neutral-500">
            © {new Date().getFullYear()} {job.company || "evalcv"}. All rights reserved. • Powered by <span className="font-semibold text-zinc-700 dark:text-zinc-300">Evolytics</span>
          </p>
        </div>
        <div className="flex gap-6 text-xs text-zinc-600 dark:text-neutral-400">
          <a
            href="#"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
