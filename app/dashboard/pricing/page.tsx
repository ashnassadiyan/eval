import type { Metadata } from "next";
import { PricingView } from "@/components/pricing/PricingView";

export const metadata: Metadata = {
  title: "Token Pricing & Top-Up — evalcv.app",
  description:
    "Buy evaluation token packs or request custom enterprise bulk volume. 10 Tokens for ₹300, 30 Tokens for ₹800.",
};

export default function DashboardPricingPage() {
  return (
    <div className="px-4 sm:px-8 py-6">
      <PricingView showHeader={true} />
    </div>
  );
}
