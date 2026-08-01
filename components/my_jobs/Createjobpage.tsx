"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Calendar, FileUp, Sliders, Server } from "lucide-react";

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
    <div className="bg-slate-50 dark:bg-black text-zinc-900 dark:text-white px-6 sm:px-10 py-10 min-h-screen transition-colors">
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              <span> My Jobs / Create</span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
              Create New Job
            </h1>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Status
            </p>
            <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
              Engine Active
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6">
              {/* Basic info block */}
              <div className="relative border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col gap-6">
                  <div>
                    <label
                      htmlFor="employer"
                      className="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400"
                    >
                      Employer / Company Name
                    </label>
                    <input
                      id="employer"
                      type="text"
                      value={employer}
                      onChange={(e) => setEmployer(e.target.value)}
                      placeholder="e.g. Aether Dynamics Corp"
                      className="mt-3 w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-2 text-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus-visible:border-black dark:focus-visible:border-white transition-colors"
                    />
                    {errors.employer && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.employer}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="jobTitle"
                      className="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400"
                    >
                      Job Title
                    </label>
                    <input
                      id="jobTitle"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Kernel Engineer"
                      className="mt-3 w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-2 text-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus-visible:border-black dark:focus-visible:border-white transition-colors"
                    />
                    {errors.jobTitle && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.jobTitle}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="applicationDeadline"
                        className="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400"
                      >
                        Application Deadline
                      </label>
                      <div className="relative mt-3">
                        <input
                          id="applicationDeadline"
                          type="date"
                          inputMode="numeric"
                          value={applicationDeadline}
                          onChange={(e) =>
                            setApplicationDeadline(e.target.value)
                          }
                          placeholder="YYYY-MM-DD"
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-4 py-3 pr-10 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus-visible:border-black dark:focus-visible:border-white transition-colors"
                        />
                        <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                      </div>
                      {errors.applicationDeadline && (
                        <p className="mt-2 text-xs text-red-500">
                          {errors.applicationDeadline}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* JD upload block */}
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-6 sm:p-8 shadow-xs">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    Job Description Data
                  </h2>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Format: PDF, DOCX, TXT
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
                  className={`mt-4 flex flex-col items-center justify-center gap-4 border-2 border-dashed px-6 py-14 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-black dark:border-white bg-zinc-100 dark:bg-zinc-900"
                      : "border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-transparent hover:border-zinc-400 dark:hover:border-zinc-700"
                  }`}
                >
                  <span className="flex items-center justify-center size-16 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                    <FileUp className="size-6" />
                  </span>

                  {jdFile ? (
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white break-all">
                        {jdFile.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {(jdFile.size / (1024 * 1024)).toFixed(2)} MB &middot;
                        click or drop to replace
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-zinc-900 dark:text-white">
                        Drop JD here or click to browse
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Max file size: 10MB | Encrypted transmission
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
                  <p className="mt-3 text-xs text-red-500">{errors.jdFile}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="self-start inline-flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-7 py-3.5 rounded-xl text-sm font-extrabold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer select-none"
              >
                {isSubmitting ? "Creating..." : "Create Position"}
              </button>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-6">
              {/* Insight panel */}
              <div className="relative border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-6 sm:p-8 pl-8 shadow-xs">
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-black dark:bg-white" />

                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center size-6 bg-black text-white dark:bg-white dark:text-black rounded-xs">
                    <Sliders className="size-3.5" />
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
                    Recruitment Engine Insight
                  </h2>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Uploading a detailed JD allows EvalCv to construct a precise{" "}
                  <strong className="font-bold text-zinc-900 dark:text-white">
                    Technical Matrix
                  </strong>{" "}
                  for candidate cross-referencing. The engine will extract 20+
                  skill parameters automatically.
                </p>

                <div className="mt-6 flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      <span>Extraction Precision</span>
                      <span className="text-zinc-900 dark:text-white font-bold">98.2%</span>
                    </div>
                    <div className="mt-2 h-1 w-full bg-zinc-200 dark:bg-zinc-800">
                      <div className="h-full w-[98.2%] bg-black dark:bg-white" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      <span>Latent Processing</span>
                      <span className="text-zinc-900 dark:text-white font-bold">
                        &lt; 200ms
                      </span>
                    </div>
                    <div className="mt-2 h-1 w-full bg-zinc-200 dark:bg-zinc-800">
                      <div className="h-full w-[35%] bg-black dark:bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Parameters block */}
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center size-10 border border-zinc-300 dark:border-zinc-700 text-lg font-black text-zinc-900 dark:text-white rounded-lg">
                    02
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
                    Parameters
                  </h2>
                </div>

                <ul className="flex flex-col gap-4">
                  {[
                    "Ensure role requirements are listed as bullet points for maximum AI parsing accuracy.",
                    "Include specific tech-stack versions (e.g., Python 3.12, React 18).",
                    "Define soft-skill qualifiers for sentiment analysis scoring.",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400"
                    >
                      <span className="mt-1 size-1.5 shrink-0 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
                      <span className="uppercase tracking-wide">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
