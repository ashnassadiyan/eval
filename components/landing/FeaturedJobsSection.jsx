"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
  FileCheck,
  Send,
  Zap,
  Filter,
} from "lucide-react";
import jobService from "@/store/services/job.service";

// Curated active opportunity roles for direct candidate applications
const DEFAULT_OPEN_POSITIONS = [
  {
    id: "1",
    job_title: "Senior Full-Stack Software Engineer",
    company: "evalcv Tech Ecosystem",
    department: "Engineering & Tech",
    location: "Remote (Global)",
    type: "Full-time",
    experience: "4-7 years",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    description: "Architect high-performance web applications, candidate matching algorithms, and real-time evaluation stream APIs.",
    created: "2026-08-15",
  },
  {
    id: "2",
    job_title: "AI / ML Research & NLP Engineer",
    company: "Evolytics Intelligence Labs",
    department: "Data & AI",
    location: "Hybrid (Bangalore / Remote)",
    type: "Full-time",
    experience: "3-6 years",
    skills: ["Python", "PyTorch", "LLM Fine-tuning", "NLP", "FastAPI"],
    description: "Build domain-adapted AI models for resume parsing, skills extraction, and automated candidate suitability scoring.",
    created: "2026-08-18",
  },
  {
    id: "3",
    job_title: "Lead UI/UX & Product Designer",
    company: "evalcv Design Studio",
    department: "Product & Design",
    location: "Remote (India)",
    type: "Full-time",
    experience: "4-8 years",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research", "TailwindCSS"],
    description: "Design sleek, glassmorphic recruitment dashboards, candidate reporting interfaces, and seamless onboarding flows.",
    created: "2026-08-19",
  },
  {
    id: "4",
    job_title: "DevOps & Cloud Infrastructure Architect",
    company: "CloudCore Systems",
    department: "Engineering & Tech",
    location: "Remote",
    type: "Full-time",
    experience: "5+ years",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    description: "Manage cloud infrastructure, high-concurrency background job workers, and automated security pipelines.",
    created: "2026-08-20",
  },
  {
    id: "5",
    job_title: "Technical Product Manager",
    company: "evalcv Partner Network",
    department: "Product & Design",
    location: "Hybrid (Mumbai)",
    type: "Full-time",
    experience: "3-5 years",
    skills: ["Product Strategy", "API Design", "Agile", "User Analytics"],
    description: "Lead roadmap execution for candidate evaluation streams, recruiter collaboration tools, and enterprise integrations.",
    created: "2026-08-21",
  },
  {
    id: "6",
    job_title: "Data Analytics & Talent Intelligence Lead",
    company: "Evolytics Analytics",
    department: "Data & AI",
    location: "Remote",
    type: "Full-time",
    experience: "3-6 years",
    skills: ["SQL", "Python", "Data Pipeline", "Tableau", "Metrics"],
    description: "Analyze candidate evaluation benchmarks, skill gap trends, and recruiter funnel conversion metrics.",
    created: "2026-08-22",
  },
];

export function FeaturedJobsSection() {
  const [jobs, setJobs] = useState(DEFAULT_OPEN_POSITIONS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const res = await jobService.getMyJobs(1, "", 20);
        if (res?.data?.jobs && Array.isArray(res.data.jobs) && res.data.jobs.length > 0) {
          // Merge API jobs with default open positions
          const formattedApiJobs = res.data.jobs.map((j) => ({
            id: String(j.id),
            job_title: j.job_title || "Open Position",
            company: j.company || "evalcv Partner Network",
            department: j.category || "Engineering & Tech",
            location: j.location || "Remote",
            type: j.type || "Full-time",
            experience: j.experience || "Flexible",
            skills: j.skills || ["Resume Screening", "Candidate Matching"],
            description: j.jd_text
              ? j.jd_text.slice(0, 140) + "..."
              : "Direct job vacancy. Upload your resume to submit an application directly to the hiring manager.",
            created: j.created ? j.created.split("T")[0] : "Active",
          }));
          setJobs([...formattedApiJobs, ...DEFAULT_OPEN_POSITIONS]);
        }
      } catch (err) {
        console.log("Using default candidate job listings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const departments = ["All", "Engineering & Tech", "Product & Design", "Data & AI"];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.job_title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = selectedDept === "All" || job.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <section id="open-positions" className="relative py-16 lg:py-24 bg-background text-foreground transition-colors overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[250px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-bold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Direct Candidate Application Portal</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Explore Active Roles. <br />
            <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-400 bg-clip-text text-transparent">
              Apply Directly With Your CV.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground font-medium">
            Browse verified job opportunities. Upload your resume directly to hiring streams with instant AI candidate matching.
          </p>
        </div>

        {/* Search & Department Filter Bar */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title or skill (e.g. React, Python)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground text-xs sm:text-sm focus:outline-none focus:border-primary font-medium"
            />
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0 mr-1 hidden sm:inline" />
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedDept === dept
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group relative flex flex-col justify-between p-6 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-sm hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-[11px] font-mono font-bold border border-border">
                    <Building2 className="w-3 h-3 text-primary shrink-0" />
                    <span>{job.company}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    Active Hiring
                  </span>
                </div>

                {/* Job Title */}
                <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">
                  {job.job_title}
                </h3>

                {/* Meta location & type */}
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground font-medium flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{job.type}</span>
                  </div>
                </div>

                {/* Description snippet */}
                <p className="mt-3.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 font-medium">
                  {job.description}
                </p>

                {/* Skill Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-mono font-semibold border border-primary/15"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Posted: {job.created}
                </span>

                <Link
                  href={`/apply/${encodeURIComponent(job.job_title)}/${job.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 group-hover:scale-105"
                >
                  <span>Apply Now</span>
                  <Send className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner: Direct Resume Evaluation Prompt */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-primary/15 via-emerald-500/10 to-transparent border border-primary/30 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-primary text-primary-foreground font-bold shrink-0 shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-foreground">
                Want to know how your CV matches any job description?
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
                Run an instant AI Evaluation on your resume before applying to get deep suitability scores and skills gap analysis.
              </p>
            </div>
          </div>

          <Link
            href="/evaluate"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-foreground text-background font-extrabold text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
          >
            <span>Evaluate Your Resume</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
