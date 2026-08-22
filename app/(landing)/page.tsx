import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { InsightSection } from "@/components/landing/insightSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { FeaturesRow } from "@/components/landing/Features";
import { ReportSection } from "@/components/landing/ReportSection";
import { CandidateFlowSection } from "@/components/landing/CandidateFlowSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { CTASection } from "@/components/landing/CTASection";

export const metadata: Metadata = {
  metadataBase: new URL("https://evalcv.app"),
  title: "evalcv.app — AI Resume Screening & Candidate Matching Platform",
  description:
    "Transform candidate sourcing and ATS resume screening with precision AI resume scoring, skill gap analysis, and direct candidate application flows.",
  keywords: [
    "AI Resume Screening",
    "Candidate Matching Platform",
    "ATS Resume Parser",
    "Skills Gap Analysis",
    "Direct Job Application Link",
    "Candidate Pipeline Automation",
    "evalcv.app",
  ],
  authors: [{ name: "Evolytics", url: "https://evalcv.app" }],
  creator: "Evolytics",
  publisher: "Evolytics",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "evalcv.app — AI Resume Screening & Candidate Matching Platform",
    description:
      "Precision AI talent screening, resume match scoring, and direct candidate application pipeline.",
    url: "https://evalcv.app",
    siteName: "evalcv.app",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "evalcv.app AI Talent Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "evalcv.app — AI Resume Screening & Candidate Matching Platform",
    description:
      "Precision AI talent screening, resume match scoring, and direct candidate application pipeline.",
    images: ["/og-image.png"],
  },
};

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does evalcv AI score resumes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "evalcv parses candidate CVs against target job descriptions, analyzing skill overlap, experience relevance, strengths, and weaknesses to generate a precision match score.",
      },
    },
    {
      "@type": "Question",
      name: "How do candidate direct job links work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Recruiters create a job posting on evalcv and share the unique job link. Candidates view role specs and submit their CV in 1 click without creating an account.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeFaqJsonLd),
        }}
      />
      <div className="flex flex-col min-h-screen">
        <Hero />
        <InsightSection />
        <section id="how-it-works" className="flex flex-col gap-0 overflow-hidden">
          <ProcessSection />
          <FeaturesRow />
        </section>
        <ReportSection />
        <CandidateFlowSection />
        <SocialProofSection />
        <CTASection />
      </div>
    </>
  );
}
