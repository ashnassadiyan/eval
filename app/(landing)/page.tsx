import { Hero } from "@/components/landing/Hero";
import { InsightSection } from "@/components/landing/insightSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { FeaturesRow } from "@/components/landing/Features";
import { ReportSection } from "@/components/landing/ReportSection";

export default function Home() {
  return (
    <>
      <Hero />
      <InsightSection />
      <section id="how-it-works" className="snap-always snap-start min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] shrink-0 flex flex-col justify-center overflow-hidden">
        <ProcessSection />
        <FeaturesRow />
      </section>
      <ReportSection />
    </>
  );
}
