import { Hero } from "@/components/landing/Hero";
import { InsightSection } from "@/components/landing/insightSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { FeaturesRow } from "@/components/landing/Features";
import { ReportSection } from "@/components/landing/ReportSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <InsightSection />
      <section id="how-it-works" className="flex flex-col gap-0 overflow-hidden">
        <ProcessSection />
        <FeaturesRow />
      </section>
      <ReportSection />
      <SocialProofSection />
      <CTASection />
    </div>
  );
}
