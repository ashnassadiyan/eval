"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, ShieldCheck, Sparkles, Quote, MessageSquarePlus, X, Send } from "lucide-react";
import api from "@/lib/axios";

export function SocialProofSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const [stats, setStats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Recruiter");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/feedback");
      if (res.data) {
        if (res.data.stats && Array.isArray(res.data.stats)) {
          setStats(res.data.stats);
        } else {
          setStats([]);
        }
        if (res.data.testimonials && Array.isArray(res.data.testimonials)) {
          const formatted = res.data.testimonials.map((item, idx) => ({
            quote: item.quote,
            name: item.name || "Verified User",
            role: item.role || "Recruiter",
            avatar: `https://images.unsplash.com/photo-${
              idx % 3 === 0
                ? "1573496359142-b8d87734a5a2"
                : idx % 3 === 1
                ? "1534528741775-53994a69daeb"
                : "1580489944761-15a19d654956"
            }?w=150&auto=format&fit=crop&q=80`,
            rating: item.rating || 5,
            badge: item.role || "Verified User",
          }));
          setTestimonials(formatted);
        } else {
          setTestimonials([]);
        }
      }
    } catch (err) {
      console.warn("Could not fetch feedback from backend:", err);
      setStats([]);
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedback || feedback.trim().length < 5) return;

    try {
      setIsSubmitting(true);
      await api.post("/feedback", {
        name,
        email,
        role,
        rating,
        feedback: feedback.trim(),
        subject: "Landing Page Review Submission",
        category: "Testimonial",
      });

      setSuccessMsg("Thank you! Your feedback has been submitted successfully.");
      setTimeout(() => {
        setSuccessMsg("");
        setShowFeedbackModal(false);
        setFeedback("");
        fetchData();
      }, 2500);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no data returned from backend and loading finished, do not render this section at all!
  if (!isLoading && stats.length === 0 && testimonials.length === 0) {
    return null;
  }

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
        {/* Dynamic Stats Grid (Only shown if data exists in backend) */}
        {stats.length > 0 && (
          <>
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
          </>
        )}

        {/* Dynamic Testimonials Grid (Only shown if data exists in backend) */}
        {testimonials.length > 0 && (
          <>
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

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Leave Your Review</span>
                </button>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map(({ quote, name, role, avatar, rating, badge }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  whileHover={{ y: -6 }}
                  className="relative group p-7 sm:p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex gap-1 text-primary">
                        {[...Array(rating || 5)].map((_, j) => (
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
          </>
        )}
      </motion.div>

      {/* SUBMIT FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-5 text-foreground">
            <button
              type="button"
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl border border-border bg-muted hover:bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Share Your Experience
              </span>
              <h3 className="text-xl font-extrabold text-foreground mt-2">
                Leave a Review & Feedback
              </h3>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold text-center">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-2.5 text-xs bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 text-xs bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Recruiter"
                      className="w-full px-4 py-2.5 text-xs bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1">
                      Star Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-xs bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    >
                      <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                      <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                      <option value={3}>3 Stars ⭐⭐⭐</option>
                      <option value={2}>2 Stars ⭐⭐</option>
                      <option value={1}>1 Star ⭐</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1">
                    Feedback / Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us about your experience with EvalCV.app..."
                    className="w-full px-4 py-2.5 text-xs bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-extrabold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </motion.section>
  );
}
