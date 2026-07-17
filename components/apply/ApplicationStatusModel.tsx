"use client";

import { useEffect, useState } from "react";

/**
 * ApplicationStatusModal
 * -----------------------
 * Drop-in replacement for the three states shown in the reference screenshots:
 *   - "submitting"  -> animated "reading the document" loader
 *   - "success"     -> green success panel
 *   - "failed"      -> yellow/amber error panel
 *
 * Usage inside JobPostingView (or ApplySidebar):
 *
 *   const [status, setStatus] = useState<"idle" | "submitting" | "success" | "failed">("idle");
 *
 *   const handleSubmit = async () => {
 *     setStatus("submitting");
 *     try {
 *       await candidateService.uploadCv(file);
 *       setStatus("success");
 *     } catch (e) {
 *       setStatus("failed");
 *     }
 *   };
 *
 *   {status !== "idle" && (
 *     <ApplicationStatusModal
 *       status={status}
 *       onRetry={() => handleSubmit()}
 *       onCancel={() => setStatus("idle")}
 *       onGoToDashboard={() => router.push("/dashboard")}
 *       onViewStatus={() => router.push("/applications")}
 *     />
 *   )}
 */

type Status = "submitting" | "success" | "failed";

interface ApplicationStatusModalProps {
  status: Status;
  fileName?: string;
  errorMessage?: string;
  onGoToDashboard?: () => void;
  onViewStatus?: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
}

const THEME: Record<
  Status,
  { ring: string; glow: string; text: string; dim: string }
> = {
  submitting: {
    ring: "border-cyan-400/70",
    glow: "shadow-[0_0_40px_-8px_rgba(34,211,238,0.45)]",
    text: "text-cyan-300",
    dim: "text-cyan-400/50",
  },
  success: {
    ring: "border-green-400/70",
    glow: "shadow-[0_0_40px_-8px_rgba(74,222,128,0.45)]",
    text: "text-green-300",
    dim: "text-green-400/50",
  },
  failed: {
    ring: "border-yellow-300/70",
    glow: "shadow-[0_0_40px_-8px_rgba(253,224,71,0.4)]",
    text: "text-yellow-200",
    dim: "text-yellow-300/50",
  },
};

function useFakeId(status: Status) {
  const [id, setId] = useState("________");
  useEffect(() => {
    if (status !== "submitting") return;
    const chars = "abcdef0123456789";
    const interval = setInterval(() => {
      setId(
        Array.from(
          { length: 8 },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join("")
      );
    }, 90);
    return () => clearInterval(interval);
  }, [status]);
  return id;
}

function useClockUTC() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const format = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setNow(
        `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(
          d.getUTCDate()
        )}_${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
      );
    };
    format();
    const t = setInterval(format, 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/** Animated "scanning a document" glyph used while the CV is being read/analyzed. */
function ReadingDocumentIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-label="Reading document"
    >
      <defs>
        <linearGradient id="scan-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <clipPath id="doc-clip">
          <path d="M26 10h30l14 14v62a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" />
        </clipPath>
      </defs>

      {/* outer pulsing ring */}
      <circle
        cx="48"
        cy="48"
        r="44"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      >
        <animate
          attributeName="r"
          values="40;44;40"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-opacity"
          values="0.35;0.1;0.35"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* document body */}
      <path
        d="M26 10h30l14 14v62a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* folded corner */}
      <path
        d="M56 10v14h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* text lines, revealed left-to-right in sequence */}
      {[30, 40, 50, 60, 70].map((y, i) => (
        <rect
          key={y}
          x="30"
          y={y}
          width={i === 4 ? 20 : 36}
          height="3.2"
          rx="1.6"
          fill="currentColor"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.9;0.9;0"
            keyTimes="0;0.08;0.75;1"
            dur="2.4s"
            begin={`${i * 0.18}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}

      {/* moving scan bar sweeping down the page */}
      <g clipPath="url(#doc-clip)">
        <rect x="22" y="0" width="52" height="18" fill="url(#scan-fade)">
          <animate
            attributeName="y"
            values="4;84;4"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-label="Success"
    >
      <circle
        cx="48"
        cy="48"
        r="44"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M30 49l12 12 24-26"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="48"
        strokeDashoffset="48"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="48"
          to="0"
          dur="0.5s"
          begin="0.15s"
          fill="freeze"
        />
      </path>
    </svg>
  );
}

function WarningIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-label="Failed"
    >
      <circle
        cx="48"
        cy="48"
        r="44"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M48 30v24"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="48" cy="64" r="2.6" fill="currentColor" />
    </svg>
  );
}

export function ApplicationStatusModal({
  status,
  fileName,
  errorMessage = "There was an error uploading your CV. Please ensure the file is a PDF and under 5MB.",
  onGoToDashboard,
  onViewStatus,
  onRetry,
  onCancel,
}: ApplicationStatusModalProps) {
  const theme = THEME[status];
  const fakeId = useFakeId(status);
  const clock = useClockUTC();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div
        className={`relative w-full max-w-md rounded-lg border bg-black ${theme.ring} ${theme.glow} px-8 py-10 text-center transition-colors duration-500`}
      >
        {/* icon */}
        <div className="mb-6 flex justify-center">
          {status === "submitting" && (
            <ReadingDocumentIcon className={`h-20 w-20 ${theme.text}`} />
          )}
          {status === "success" && (
            <CheckIcon className={`h-20 w-20 ${theme.text}`} />
          )}
          {status === "failed" && (
            <WarningIcon className={`h-20 w-20 ${theme.text}`} />
          )}
        </div>

        {/* title */}
        <h2
          className={`mb-3 font-mono text-2xl font-bold uppercase tracking-wide ${
            status === "submitting"
              ? "text-white"
              : theme.text.replace("300", "200")
          }`}
        >
          {status === "submitting" && "Analyzing your CV"}
          {status === "success" && "Application successful"}
          {status === "failed" && "Application failed"}
        </h2>

        {status === "failed" && (
          <div className={`mx-auto mb-1 h-px w-16 bg-current ${theme.text}`} />
        )}

        {/* body */}
        {status === "submitting" && (
          <p className="mb-8 text-sm text-neutral-400">
            {fileName ? (
              <span className="text-neutral-300">{fileName}</span>
            ) : (
              "Your CV"
            )}{" "}
            is being uploaded and scanned. This usually takes a few seconds.
          </p>
        )}

        {status === "success" && (
          <p className="mb-8 text-sm text-neutral-400">
            Your CV has been successfully uploaded and sent for analysis.
          </p>
        )}

        {status === "failed" && (
          <div className="mb-8 mt-4 rounded border-l-2 border-yellow-300 bg-white/5 px-4 py-3 text-left text-sm text-neutral-300">
            Did you apply already or try to refresh the page and re-apply
          </div>
        )}

        {/* actions */}
        <div className="space-y-3">
          {status === "submitting" && (
            <div className="flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase tracking-widest text-cyan-300/70">
              <span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-cyan-300" />
              Processing
            </div>
          )}
        </div>

        {/* status footer bar, mirrors the terminal-style readout in the reference screenshots */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
          {status === "submitting" && (
            <>
              <span>System: analyzing</span>
              <span>
                id: {`{{`}
                {fakeId}
                {`}}`}
              </span>
              <span className="text-cyan-400/70">status: 102</span>
            </>
          )}
          {status === "success" && (
            <>
              <span>System: completed</span>
              <span>
                id: {`{{`}
                {fakeId === "________" ? "data:random:hash" : fakeId}
                {`}}`}
              </span>
              <span className="text-green-400/70">status: 200 ok</span>
            </>
          )}
          {status === "failed" && (
            <>
              <span>Code: err_upload_validation</span>
              <span>utc: {clock || "----.--.--_--:--"}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationStatusModal;
