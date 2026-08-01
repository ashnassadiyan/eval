"use client";

import { useCallback, useRef, useState } from "react";
import { Clock, UploadCloud, ArrowRight, FileCheck2, X } from "lucide-react";
import candidateService from "@/store/services/candidate.service";
import ApplicationStatusModal from "./ApplicationStatusModel";

export function ApplySidebar({ job, onSubmit }: any) {
  const { job_details } = job;
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "failed"
  >("idle");

  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = useCallback((f: File | null) => {
    if (!f) return;

    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    const isValidSize = f.size <= 10 * 1024 * 1024;

    if (!isPdf) {
      setError("Only PDF files are allowed.");
      return;
    }

    if (!isValidSize) {
      setError("File size must be less than 10MB.");
      return;
    }

    setError("");
    setFile(f);
  }, []);

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return "Email is required.";
    }

    if (value.trim().length < 5) {
      return "Email must be at least 5 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    acceptFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleEvaluate = async () => {
    if (!file) {
      setError("Select a PDF file before submitting.");
      return;
    }

    const emailError = validateEmail(email);

    if (emailError) {
      setError(emailError);
      return;
    }

    if (!job_details.id) {
      setError("Job ID not found. Please navigate from a valid job.");
      return;
    }

    try {
      setStatus("submitting");

      const formData = new FormData();
      formData.append("cv", file);
      formData.append("is_allowed", "false");
      formData.append("email", email.trim());

      const response = await candidateService.createCandidate(
        formData,
        job_details.id
      );

      const data = response.data.result;
      console.log("Evaluation result:", data);

      onSubmit?.(file);
      setStatus("success");
    } catch (err) {
      setStatus("failed");
      console.log(err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    await handleEvaluate();
    setSubmitting(false);
  };

  return (
    <aside className="flex h-fit flex-col gap-5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0d0d0d] p-6 shadow-xs transition-colors">
      <div className="inline-flex w-fit items-center gap-2 rounded-md bg-emerald-500 text-white dark:bg-lime-300 dark:text-black px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
        <Clock size={14} strokeWidth={2.5} />
        Deadline: {job.deadline}
      </div>

      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Apply Now
        </h2>

        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-neutral-500">
          Role ID: #{job_details.id}
        </p>
      </div>

      {/* Email Field */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-neutral-100">
          Email Address
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="your@email.com"
          className="w-full rounded-lg border border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-transparent px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:focus:border-lime-500 text-zinc-900 dark:text-white transition-colors"
        />
      </div>

      {/* Upload */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          isDragging
            ? "border-emerald-500 bg-emerald-500/10 dark:border-lime-400 dark:bg-lime-400/10"
            : "border-emerald-500/60 dark:border-lime-500/70 bg-zinc-50 dark:bg-transparent hover:bg-emerald-500/5 dark:hover:bg-lime-400/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
        />

        {!file ? (
          <>
            <UploadCloud
              size={28}
              className="text-emerald-600 dark:text-lime-500"
              strokeWidth={1.75}
            />

            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-neutral-100">
                Upload CV / Resume
              </p>

              <p className="mt-1 text-xs text-zinc-500 dark:text-neutral-500">
                PDF only (Max 10MB)
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 rounded-md bg-zinc-100 dark:bg-white/10 px-3 py-2 text-sm text-zinc-900 dark:text-white">
            <FileCheck2 size={16} className="text-emerald-600 dark:text-lime-500" />
            <span className="max-w-[180px] truncate">{file.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="text-zinc-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ATS Tips */}
      <details
        open
        className="group rounded-xl border border-zinc-200 dark:border-white/10 bg-emerald-50/50 dark:bg-lime-400/5 px-4 py-3 open:pb-4"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-zinc-800 dark:text-neutral-100">
          Tips to improve your CV's ATS score
          <span className="text-emerald-600 dark:text-lime-500 transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>

        <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-zinc-600 dark:text-neutral-400">
          <li>
            • Use a simple, single-column layout — avoid tables, text boxes, and
            multi-column designs.
          </li>
          <li>
            • Stick to standard fonts (Arial, Calibri, Times New Roman) at
            10–12pt.
          </li>
          <li>
            • Use conventional section headings like "Experience," "Education,"
            and "Skills."
          </li>
          <li>
            • Save as a text-based PDF, not a scanned image — ATS software can't
            read images.
          </li>
          <li>
            • Match keywords from the job description (skills, tools, job
            titles) naturally in your CV.
          </li>
          <li>
            • Spell out acronyms at least once (e.g., "Search Engine
            Optimization (SEO)").
          </li>
          <li>
            • Avoid headers/footers for key info — some parsers skip them.
          </li>
          <li>
            • Use standard bullet points ( • or - ) instead of custom icons or
            symbols.
          </li>
        </ul>
      </details>

      {error && <p className="text-center text-xs text-red-500">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="flex items-center justify-center gap-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-6 py-4 text-sm font-extrabold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none"
      >
        {submitting ? "Submitting…" : "Submit Application"}
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>

      <p className="text-center text-[11px] leading-snug text-zinc-500 dark:text-neutral-500">
        By submitting, you agree to our Precision Recruiting{" "}
        <span className="italic">Privacy Protocol</span>.
      </p>

      {status !== "idle" && (
        <ApplicationStatusModal
          status={status}
        />
      )}
    </aside>
  );
}
