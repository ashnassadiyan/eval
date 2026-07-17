import { Target, Zap, Lightbulb, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Accurate Scoring",
    desc: "Advanced NLP models understand context, not just keywords.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Full evaluation reports delivered in under 10 seconds.",
  },
  {
    icon: Lightbulb,
    title: "Actionable Recommendations",
    desc: "Clear steps to close skill gaps and improve outcomes.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Enterprise-grade encryption keeps your data protected.",
  },
];

export function FeaturesRow() {
  return (
    <div className="border-b border-border flex flex-col justify-center py-10">
      <div className="mx-auto grid w-full max-w-[1280px] gap-px bg-border px-0 grid-cols-2 md:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card p-6">
            <Icon className="size-5" strokeWidth={1.75} />
            <h3 className="mt-3 text-label-md uppercase">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
