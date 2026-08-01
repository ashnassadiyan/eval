"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Star, ShieldCheck, Sparkles, Quote } from "lucide-react";

const stats = [
  { value: "50K+", label: "Resumes Analyzed", subtext: "Processed across 40+ industries" },
  { value: "92%", label: "ATS Pass Rate", subtext: "For candidates following recommendations" },
  { value: "3.5x", label: "Faster Candidate Screening", subtext: "Average time saved by talent teams" },
  { value: "98%", label: "Recruiter Satisfaction", subtext: "Based on 1,200+ feedback surveys" },
];

const testimonials = [
  {
    quote: "EvalCv transformed our talent acquisition process. We screened over 400 applicants for a Senior Tech Lead role in under 20 minutes with zero guesswork.",
    name: "Sarah Mitchell",
    role: "Head of Talent, Finova Financial",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    badge: "Verified Recruiter",
  },
  {
    quote: "I was applying for senior frontend roles for 3 months with no callbacks. EvalCv flagged missing skills I didn't even realize were critical. 2 weeks later, I accepted an offer!",
    name: "Daniel Osei",
    role: "Senior Frontend Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    badge: "Job Seeker",
  },
  {
    quote: "The Match Score breakdown and automated skill gap analysis are phenomenal. We now only interview candidates with an 80%+ fit rating, and our hire rate has skyrocketed.",
    name: "Priya Nair",
    role: "Engineering Director, Looptify",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    badge: "Verified Recruiter",
  },
];

export function SocialProofSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="relative border-b border-border overflow-hidden py-20 sm:py-28 md:py-36"
    >
      {/* Background blobs */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[140px] animate-pulse" />
        <div
          className="absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[140px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      <motion.div style={{ y: contentY }} className="relative mx-auto max-w-[1280px] px-4 sm:px-6 md:px-12">
        {/* Stats Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-extrabold text-primary mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Proven Data & Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Impact in Numbers
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-24">
          {stats.map(({ value, label, subtext }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="group text-center p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <p className="text-4xl sm:text-5xl font-black text-foreground group-hover:scale-105 transition-transform">
                  {value}
                </p>
                <p className="mt-3 text-sm font-extrabold text-foreground">{label}</p>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground font-medium">{subtext}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-extrabold text-primary mb-3">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Verified User Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Loved by Job Seekers & Hiring Leaders
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map(({ quote, name, role, avatar, rating, badge }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="relative group p-7 sm:p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Top ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                {/* Header: Stars & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex gap-1 text-primary">
                    {[...Array(rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {badge}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-primary/20 mb-3" />

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium italic mb-6">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>

              {/* User Info Footer */}
              <div className="flex items-center gap-3.5 pt-5 border-t border-border/80">
                <img
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/30 shadow-md"
                />
                <div>
                  <p className="text-sm font-extrabold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
