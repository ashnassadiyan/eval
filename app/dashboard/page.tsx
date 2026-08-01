import type { Metadata } from "next";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — EvalCv | Talent Intelligence & CV Screening",
  description:
    "Real-time AI talent intelligence dashboard. Track evaluation token usage, monitor recent job postings, and review candidate screening insights.",
  keywords: [
    "AI Resume Screening",
    "CV Evaluation Dashboard",
    "Talent Intelligence",
    "Candidate Analytics",
    "Recruitment AI",
    "EvalCv",
  ],
  openGraph: {
    title: "Dashboard — EvalCv Talent Intelligence",
    description:
      "Real-time AI talent intelligence dashboard. Track evaluation token usage, monitor recent job postings, and review candidate screening insights.",
    type: "website",
    url: "https://evalcv.com/dashboard",
    siteName: "EvalCv",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard — EvalCv Talent Intelligence",
    description:
      "Real-time AI talent intelligence dashboard. Track evaluation token usage, monitor recent job postings, and review candidate screening insights.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
