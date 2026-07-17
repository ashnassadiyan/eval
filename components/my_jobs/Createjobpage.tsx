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
    (e: React.DragEvent<HTMLDivElement>) => {
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
    <div className="bg-surface-lowest text-on-surface px-6 sm:px-10 py-10">
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-on-surface-variant">
              <span> My Jobs / Create</span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-on-surface">
              Create New Job
            </h1>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">
              Status
            </p>
            <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-green-400">
              <span className="size-2 bg-green-400" />
              Terminal Active
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6">
              {/* Basic info block */}
              <div className="relative border border-bento-border bg-bento p-6 sm:p-8">
                <div className="flex flex-col gap-6">
                  <div>
                    <label
                      htmlFor="employer"
                      className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
                    >
                      Employer / Company Name
                    </label>
                    <input
                      id="employer"
                      type="text"
                      value={employer}
                      onChange={(e) => setEmployer(e.target.value)}
                      placeholder="e.g. Aether Dynamics Corp"
                      className="mt-3 w-full bg-transparent border-b border-outline-variant pb-2 text-lg text-on-surface placeholder:text-outline outline-none focus-visible:border-on-surface transition-colors"
                    />
                    {errors.employer && (
                      <p className="mt-2 text-xs text-red-400">
                        {errors.employer}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="jobTitle"
                      className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
                    >
                      Job Title
                    </label>
                    <input
                      id="jobTitle"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Kernel Engineer"
                      className="mt-3 w-full bg-transparent border-b border-outline-variant pb-2 text-lg text-on-surface placeholder:text-outline outline-none focus-visible:border-on-surface transition-colors"
                    />
                    {errors.jobTitle && (
                      <p className="mt-2 text-xs text-red-400">
                        {errors.jobTitle}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="applicationDeadline"
                        className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
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
                          className="w-full bg-transparent border border-outline-variant px-4 py-3 pr-10 text-sm text-on-surface placeholder:text-outline outline-none focus-visible:border-on-surface transition-colors"
                        />
                        <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-outline" />
                      </div>
                      {errors.applicationDeadline && (
                        <p className="mt-2 text-xs text-red-400">
                          {errors.applicationDeadline}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* JD upload block */}
              <div className="border border-bento-border bg-bento p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Job Description Data
                  </h2>
                  <span className="text-xs text-outline">
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
                  // @ts-ignore

                  onDrop={handleDrop}
                  className={`mt-4 flex flex-col items-center justify-center gap-4 border-2 border-dashed px-6 py-14 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-on-surface bg-surface-low"
                      : "border-outline-variant hover:border-outline"
                  }`}
                >
                  <span className="flex items-center justify-center size-16 border border-outline-variant text-on-surface">
                    <FileUp className="size-6" />
                  </span>

                  {jdFile ? (
                    <div>
                      <p className="text-sm font-bold text-on-surface break-all">
                        {jdFile.name}
                      </p>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {(jdFile.size / (1024 * 1024)).toFixed(2)} MB &middot;
                        click or drop to replace
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-on-surface">
                        Drop JD here or click to browse
                      </p>
                      <p className="mt-1 text-xs text-on-surface-variant">
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
                  <p className="mt-3 text-xs text-red-400">{errors.jdFile}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="self-start inline-flex items-center justify-center gap-2 bg-on-surface text-surface-lowest px-6 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? "Creating..." : "Create Position"}
              </button>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-6">
              {/* Insight panel */}
              <div className="relative border border-bento-border bg-bento p-6 sm:p-8 pl-8">
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-on-surface" />

                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center size-6 bg-on-surface text-surface-lowest">
                    <Sliders className="size-3.5" />
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface">
                    Recruitment Engine Insight
                  </h2>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-on-surface-variant">
                  Uploading a detailed JD allows EVAL CV to construct a precise{" "}
                  <strong className="font-bold text-on-surface">
                    Technical Matrix
                  </strong>{" "}
                  for candidate cross-referencing. The engine will extract 20+
                  skill parameters automatically.
                </p>

                <div className="mt-6 flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-on-surface-variant">
                      <span>Extraction Precision</span>
                      <span className="text-on-surface font-bold">98.2%</span>
                    </div>
                    <div className="mt-2 h-1 w-full bg-surface-high">
                      <div className="h-full w-[98.2%] bg-on-surface" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-on-surface-variant">
                      <span>Latent Processing</span>
                      <span className="text-on-surface font-bold">
                        &lt; 200ms
                      </span>
                    </div>
                    <div className="mt-2 h-1 w-full bg-surface-high">
                      <div className="h-full w-[35%] bg-on-surface" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Parameters block */}
              <div className="border border-outline-variant p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center size-10 border border-outline-variant text-lg font-black text-on-surface">
                    02
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface">
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
                      className="flex items-start gap-3 text-xs leading-relaxed text-on-surface-variant"
                    >
                      <span className="mt-1 size-1.5 shrink-0 bg-on-surface-variant" />
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
