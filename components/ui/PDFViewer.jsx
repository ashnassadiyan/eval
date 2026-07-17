"use client";

import { useState } from "react";
import { Document, Page } from "react-pdf";
import "../lib/pdfjs"; // important: initializes worker

export default function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<p>Loading PDF...</p>}
        error={<p>Failed to load PDF</p>}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={index}
            pageNumber={index + 1}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        ))}
      </Document>
    </div>
  );
}
