import type { Metadata } from "next";
import { PricingView } from "@/components/pricing/PricingView";

export const metadata: Metadata = {
  title: "Pricing — evalcv.app | Pay-As-You-Go Token Packs",
  description:
    "Transparent pay-as-you-go pricing for AI resume screening. 10 Tokens for ₹300, 30 Tokens for ₹800. 1 Token = 1 Candidate Evaluation. Tokens never expire.",
  keywords: [
    "evalcv Pricing",
    "AI Resume Screening Pricing",
    "CV Evaluation Token Packs",
    "Pay As You Go Candidate Screening",
    "Recruiter Tokens",
  ],
  openGraph: {
    title: "Pricing — evalcv.app Pay-As-You-Go Token Packs",
    description:
      "Transparent pay-as-you-go pricing for AI resume screening. 10 Tokens for ₹300, 30 Tokens for ₹800. 1 Token = 1 Candidate Evaluation.",
    url: "https://evalcv.app/pricing",
    siteName: "evalcv.app",
  },
};

export default function PricingPage() {
  return <PricingView showHeader={true} />;
}
