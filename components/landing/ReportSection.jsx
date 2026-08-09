import { Check, X, AlertTriangle, Lightbulb } from "lucide-react";

function Gauge({ value, label }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center bg-[#f2f2f2] py-6 w-full">
      <div className="relative size-[72px]">
        <svg viewBox="0 0 80 80" className="size-full -rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#ddd" strokeWidth="7" />
          <circle
            cx="40" cy="40" r={radius} fill="none" stroke="#111" strokeWidth="7"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="butt"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-black text-black" style={{ fontSize: "18px" }}>
          {value}<span style={{ fontSize: "10px" }}>%</span>
        </span>
      </div>
      <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#666]">{label}</p>
    </div>
  );
}

const technical = [
  { label: "Frontend Architecture", value: 95 },
  { label: "System Design", value: 70 },
  { label: "Data Science", value: 40 },
];
const missingSkills = ["AWS Lambda", "Terraform", "GraphQL"];
const strengths = [
  "High proficiency in React/Next.js and modern web ecosystem.",
  "Previous Fintech experience indicates domain reliability.",
  "Strong leadership qualities observed in historical team management.",
];
const weaknesses = [
  "Short tenure in recent positions may suggest low retention.",
  "Limited practical exposure to Kubernetes orchestration.",
  "Lack of professional Python development background.",
];

export function ReportSection() {
  return (
    <section className="snap-always snap-start min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] shrink-0 flex flex-col items-center justify-start border-b border-border bg-[#efefef] px-4 md:px-8 pt-6 pb-6 overflow-hidden">

      {/* Title */}
      <h2 className="text-center text-lg md:text-xl font-black uppercase tracking-[0.2em] text-black mb-5 shrink-0">
        Professional Evaluation Reports
      </h2>

      {/* Document card */}
      <div className="w-full max-w-4xl flex-1 min-h-0 bg-white border border-[#ddd] shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex flex-col">

        {/* — Header — */}
        <div className="flex flex-col sm:flex-row justify-between items-start px-4 sm:px-8 py-4 sm:py-5 gap-3 shrink-0">
          <div>
            <p className="text-[17px] font-black tracking-tight text-black">EVALCV.app</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#999] mt-1">Recruitment AI Solutions</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-black">CV Evaluation Details</p>
            <span className="inline-block mt-1 bg-[#ffe5e5] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#cc2200]">Confidential</span>
            <p className="mt-1.5 text-[10px] text-[#777]">Date: October 24, 2024</p>
          </div>
        </div>
        <div className="h-px bg-[#e0e0e0] mx-4 sm:mx-8 shrink-0" />

        {/* — Gauges — */}
        <div className="grid grid-cols-3 gap-px bg-[#ddd] shrink-0">
          <Gauge value={82} label="Overall Match" />
          <Gauge value={78} label="Selection Prob." />
          <Gauge value={92} label="ATS Compatibility" />
        </div>
        <div className="h-px bg-[#e0e0e0] mx-4 sm:mx-8 shrink-0" />

        {/* — Body — */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Left column */}
          <div className="w-full md:w-[42%] flex flex-col px-4 sm:px-8 py-5 gap-6 shrink-0">

            {/* Technical Match */}
            <div>
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-black underline underline-offset-2 mb-4">Technical Match</p>
              <div className="space-y-3">
                {technical.map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[11px] text-[#333]">{label}</span>
                      <span className="text-sm font-black text-black">{value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#e5e5e5]">
                      <div className="h-full bg-black" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-black underline underline-offset-2 mb-4">Missing Skills</p>
              <ul className="space-y-2.5">
                {missingSkills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-xs text-[#444]">
                    <X className="size-3 text-[#999] shrink-0" /> {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="hidden md:block w-px bg-[#e0e0e0] shrink-0 my-4" />

          {/* Right column */}
          <div className="flex-1 flex flex-col px-4 sm:px-8 py-5 gap-4 min-h-0">

            {/* Strengths */}
            <div className="border border-[#e8e8e8] bg-[#fafafa] p-4 flex-1">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black mb-3">
                <Check className="size-3.5" /> Strengths
              </p>
              <ul className="space-y-2 list-disc pl-4 text-xs text-[#444] marker:text-[#999]">
                {strengths.map((s, i) => <li key={i} className="leading-snug">{s}</li>)}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="border border-[#e8e8e8] bg-[#fafafa] p-4 flex-1">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black mb-3">
                <AlertTriangle className="size-3.5" /> Weaknesses
              </p>
              <ul className="space-y-2 list-disc pl-4 text-xs text-[#444] marker:text-[#999]">
                {weaknesses.map((w, i) => <li key={i} className="leading-snug">{w}</li>)}
              </ul>
            </div>

            {/* AI Recommendation */}
            <div className="bg-[#1a1a1a] p-4 shrink-0">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white mb-2">
                <Lightbulb className="size-3" /> AI Recommendation
              </p>
              <p className="text-[11px] italic leading-relaxed text-[#bbb]">
                &quot;Candidate is a strong technical fit but may require onboarding support for cloud-native infrastructure. Their frontend depth is exceptional, making them a primary choice for architectural lead roles in the current stack.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* — Footer — */}
        <div className="h-px bg-[#e0e0e0] shrink-0" />
        <div className="flex items-center gap-4 px-4 sm:px-8 py-4 shrink-0">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Candidate" className="size-10 grayscale object-cover shrink-0" />
          <div>
            <p className="text-xs font-black text-black">Evaluation ID: PR-2024-8812</p>
            <p className="text-[11px] text-[#777] mt-0.5">Subject: Senior Frontend Engineer (L6) Application</p>
          </div>
        </div>

      </div>
    </section>
  );
}
