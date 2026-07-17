import { pdfjs } from "react-pdf";

// IMPORTANT: Use local worker (NO CDN, avoids Turbopack issues)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default pdfjs;
