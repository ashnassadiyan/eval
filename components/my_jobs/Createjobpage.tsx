"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Calendar, FileUp, Sliders, Server, Sparkles } from "lucide-react";

export interface CreateJobFormValues {
  employer: string;
  jobTitle: string;
  applicationDeadline: string; // YYYY-MM-DD
  jdFile: File | null;
}

interface CreateJobPageProps {
  jobInitId?: string;
  onSubmit?: (values: CreateJobFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

const ACCEPTED_TYPES = [".pdf", ".docx", ".txt"];
const ACCEPTED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

type FormErrors = Partial<
  Record<"employer" | "jobTitle" | "applicationDeadline" | "jdFile", string>
>;

function validateFile(file: File): string | null {
  const extOk = ACCEPTED_TYPES.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );
  const mimeOk = ACCEPTED_MIME.includes(file.type) || file.type === "";
  if (!extOk && !mimeOk) {
    return "Unsupported file type. Use PDF, DOCX, or TXT.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "File exceeds the 10MB limit.";
  }
  return null;
}

export function CreateJobPage({
  jobInitId = "JOB-INIT-2024-429",
  onSubmit,
  isSubmitting = false,
}: CreateJobPageProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [employer, setEmployer] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleFileSelected = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, jdFile: error }));
      return;
    }
    setErrors((prev) => ({ ...prev, jdFile: undefined }));
    setJdFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<any>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelected(file);
    },
    [handleFileSelected]
  );

  function validate(): FormErrors {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(applicationDeadline);
    const next: FormErrors = {};
    if (!employer.trim())
      next.employer = "Employer / company name is required.";
    if (!jobTitle.trim()) next.jobTitle = "Job title is required.";
    if (!applicationDeadline.trim()) {
      next.applicationDeadline = "Application deadline is required.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(applicationDeadline)) {
      next.applicationDeadline = "Use the format YYYY-MM-DD.";
    } else if (isNaN(deadlineDate.getTime())) {
      next.applicationDeadline = "Invalid date.";
    } else if (deadlineDate <= today) {
      next.applicationDeadline = "Application deadline must be a future date.";
    }
    if (!jdFile) next.jdFile = "Upload a job description file.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit?.({
      employer,
      jobTitle,
      applicationDeadline,
      jdFile,
    });
  }

  return (
    <div className="px-4 sm:px-8 py-6 max-w-[1280px] mx-auto space-y-8 min-h-screen text-zinc-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Create New Job Position
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Configure job specifications and upload job description files for candidate evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Engine Active</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Basic info card */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#0a0a0c] p-6 sm:p-8 space-y-6">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Position Overview
              </h2>

              <div>
                <label
                  htmlFor="employer"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Employer / Company Name
                </label>
                <input
                  id="employer"
                  type="text"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                  placeholder="e.g. Aether Dynamics Corp"
                  className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                />
                {errors.employer && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.employer}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="jobTitle"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Kernel Engineer"
                  className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                />
                {errors.jobTitle && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.jobTitle}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="applicationDeadline"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Application Deadline
                </label>
                <div className="relative">
                  <input
                    id="applicationDeadline"
                    type="date"
                    inputMode="numeric"
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 px-4 py-3 pr-10 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                  />
                  <Calendar className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                </div>
                {errors.applicationDeadline && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.applicationDeadline}
                  </p>
                )}
              </div>
            </div>

            {/* JD upload card */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#0a0a0c] p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Job Description File
                </h2>
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                  PDF, DOCX, TXT (Max 10MB)
                </span>
              </div>

              <label
                htmlFor={fileInputId}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:border-primary/50 dark:hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-center size-14 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-primary">
                  <FileUp className="size-6" />
                </div>

                {jdFile ? (
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white break-all">
                      {jdFile.name}
                    </p>
                    <p className="mt-1 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {(jdFile.size / (1024 * 1024)).toFixed(2)} MB &middot; Click to replace
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                      Drop JD document here or click to browse
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Encrypted candidate matching & matrix extraction
                    </p>
                  </div>
                )}

                <input
                  id={fileInputId}
                  ref={fileInputRef}
                  type="file"
                  accept={[...ACCEPTED_TYPES, ...ACCEPTED_MIME].join(",")}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelected(file);
                  }}
                />
              </label>
              {errors.jdFile && (
                <p className="text-xs font-semibold text-red-500">{errors.jdFile}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="self-start inline-flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer select-none"
            >
              {isSubmitting ? "Creating..." : "Create Position"}
            </button>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Insight card */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#0a0a0c] p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center size-7 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                  <Sliders className="size-4" />
                </span>
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
                  Engine Insights
                </h2>
              </div>

              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
                Uploading a detailed JD enables EvalCv to construct a precise{" "}
                <strong className="font-bold text-zinc-900 dark:text-white">
                  Technical Matrix
                </strong>{" "}
                for candidate cross-referencing and automated score ranking.
              </p>

              <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    <span>Extraction Precision</span>
                    <span className="text-zinc-900 dark:text-white font-bold">98.2%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full w-[98.2%] bg-primary rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    <span>Latent Processing</span>
                    <span className="text-zinc-900 dark:text-white font-bold">
                      &lt; 200ms
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full w-[35%] bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Parameters card */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#0a0a0c] p-6 sm:p-8 space-y-4">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="flex items-center justify-center size-6 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-mono font-bold">02</span>
                Best Practices
              </h2>

              <ul className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                {[
                  "List role requirements clearly in bullet points for maximum parsing accuracy.",
                  "Specify key tech-stack versions (e.g. Python 3.12, React 18, Node.js).",
                  "Define clear experience criteria for candidate ranking.",
                ].map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 bg-primary rounded-full" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateJobPage;
