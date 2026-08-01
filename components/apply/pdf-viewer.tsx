"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  Expand,
  FileWarning,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  fileName?: string;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.1;

export function PdfViewer({
  fileUrl = "",
  fileName = "document.pdf",
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setPageNumber(1);
      setError(null);
    },
    []
  );

  const onDocumentLoadError = useCallback(() => {
    setError("This PDF could not be loaded.");
  }, []);

  const zoomIn = () =>
    setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2)));
  const zoomOut = () =>
    setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2)));
  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages || 1, p + 1));

  const handlePrint = () => {
    const win = window.open(fileUrl, "_blank");
    win?.addEventListener("load", () => win.print());
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen?.();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "ArrowRight") nextPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPages]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0d0d0d] shadow-xs transition-colors"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-transparent px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={zoomOut}
            aria-label="Zoom out"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          >
            <ZoomOut size={15} />
          </button>
          <span className="min-w-[3.5rem] text-center text-xs font-medium tabular-nums text-neutral-600 dark:text-neutral-300">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            aria-label="Zoom in"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          >
            <ZoomIn size={15} />
          </button>

          <span className="mx-2 h-5 w-px bg-black/10 dark:bg-white/15" />

          <button
            type="button"
            onClick={prevPage}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
            Page {pageNumber} / {numPages || "–"}
          </span>
          <button
            type="button"
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            aria-label="Next page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          >
            <Printer size={16} />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          >
            <Download size={16} />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Fullscreen"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          >
            <Expand size={16} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-6 sm:p-10">
        <div className="mx-auto w-fit">
          {!fileUrl && (
            <div className="flex h-[600px] w-[480px] max-w-full flex-col items-center justify-center gap-3 rounded-lg bg-white text-neutral-400">
              <FileWarning size={28} />
              <p className="text-sm">No PDF URL provided</p>
            </div>
          )}

          {fileUrl && error && (
            <div className="flex h-[600px] w-[480px] max-w-full flex-col items-center justify-center gap-3 rounded-lg bg-white text-neutral-400">
              <FileWarning size={28} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {fileUrl && !error && (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex h-[600px] w-[480px] max-w-full items-center justify-center bg-white text-sm text-neutral-400">
                  Loading document…
                </div>
              }
              className="shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_40px_-16px_rgba(0,0,0,0.35)]"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer
              />
            </Document>
          )}
        </div>
        <p className="mt-4 text-center text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          End of page {pageNumber} — Confidential
        </p>
      </div>
    </div>
  );
}
