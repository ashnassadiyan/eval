"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  BookOpen,
  ChevronDown,
  MessageSquare,
  Send,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/NotificationSlice";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

interface FAQItem {
  id: string;
  category: "general" | "screening" | "jobs" | "billing";
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "faq-1",
    category: "general",
    question: "What is EvalCV.app and how does the AI intelligence engine work?",
    answer:
      "EvalCV.app is an advanced AI-powered talent intelligence platform designed for independent recruiters and job seekers. It parses resume PDFs/Word docs, extracts candidate skills, experience, and education, and compares them against specific job specifications to calculate ATS compatibility, overall match percentage, and selection probability.",
  },
  {
    id: "faq-2",
    category: "screening",
    question: "What is the difference between ATS Score and Overall Match Score?",
    answer:
      "The ATS Compatibility Score evaluates raw keyword alignment, formatting standards, and structural compliance expected by Applicant Tracking Systems. The Overall Match Score uses contextual NLP models to understand transferable experience, domain depth, and actual job suitability beyond literal keywords.",
  },
  {
    id: "faq-3",
    category: "screening",
    question: "How long does a resume evaluation take?",
    answer:
      "Evaluations finish in under 10 seconds. You receive instant real-time notification popups as soon as the candidate report is generated.",
  },
  {
    id: "faq-4",
    category: "jobs",
    question: "How do Independent Recruiters create and share job links?",
    answer:
      "Navigate to 'My Jobs' from the sidebar, click 'Create New Job', and enter the position requirements. Once saved, you can share the public application link directly with candidates to collect and screen resumes automatically.",
  },
  {
    id: "faq-5",
    category: "billing",
    question: "How does the AI Credit system work?",
    answer:
      "Every new account starts with 20 Free AI Evaluation Credits. 1 credit is used per full resume evaluation report. Additional token top-ups can be allocated via your Profile or Admin Panel.",
  },
  {
    id: "faq-6",
    category: "general",
    question: "Is candidate resume data secure and private?",
    answer:
      "Yes. All uploaded files and candidate metadata are processed with enterprise-grade SSL/TLS encryption and stored in compliance with GDPR and SOC2 standards.",
  },
];

export default function HelpPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "screening" | "jobs" | "billing">("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("faq-1");

  // Contact Support / Feedback State
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("General Support");
  const [ticketMessage, setTicketMessage] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [isSending, setIsSending] = useState(false);

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = activeCategory === "all" || f.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;

    try {
      setIsSending(true);

      await api.post("/feedback", {
        name: user?.name || user?.email?.split("@")[0] || "Recruiter",
        email: user?.email || "info@evalcv.app",
        category: ticketCategory,
        subject: ticketSubject || "Support Inquiry",
        feedback: ticketMessage.trim(),
        rating: rating,
      });

      dispatch(
        showNotification({
          title: "Support Message Delivered!",
          body: "Thank you! Your ticket & feedback have been emailed to info@evalcv.app and recorded.",
          type: "success",
        })
      );

      setTicketSubject("");
      setTicketMessage("");
    } catch (err: any) {
      console.error("Support submission failed:", err);
      dispatch(
        showNotification({
          title: "Submission Error",
          body: err?.response?.data?.detail || "Failed to send support message. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-zinc-900 dark:text-white px-4 sm:px-8 pt-2 pb-8 transition-colors">
      <div className="mx-auto w-full max-w-[1100px]">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="inline-block text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary" /> Support Center
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Help & Support
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Browse platform documentation or send direct feedback & support inquiries to our engineering team.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="mailto:info@evalcv.app"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              ✉️ info@evalcv.app
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQ Accordion Section (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  Knowledge Base
                </span>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mt-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Frequently Asked Questions
                </h3>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQ guides..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Topics" },
                  { id: "general", label: "General" },
                  { id: "screening", label: "AI Screening" },
                  { id: "jobs", label: "My Jobs" },
                  { id: "billing", label: "Tokens & Billing" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveCategory(id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeCategory === id
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* FAQ Accordion List */}
              <div className="space-y-3 pt-2">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-zinc-900 dark:text-white cursor-pointer select-none"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-3 font-medium"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {filteredFaqs.length === 0 && (
                  <div className="py-12 text-center text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase">
                    No FAQs match your search query.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Support Form (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Direct Contact & Feedback
                </span>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mt-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-500" /> Contact Support
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Have a specific question or issue? Submit a message directly or email us at{" "}
                  <a href="mailto:info@evalcv.app" className="text-primary font-bold hover:underline">
                    info@evalcv.app
                  </a>.
                </p>
              </div>

              <form onSubmit={handleSendTicket} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="General Support">General Support</option>
                      <option value="Evaluation Issue">Evaluation & Report Issue</option>
                      <option value="Job Pipeline">Job Pipeline Query</option>
                      <option value="Billing & Credits">Billing & Token Credits</option>
                      <option value="Platform Feedback">Platform Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                      <option value={3}>⭐⭐⭐ (3/5)</option>
                      <option value={2}>⭐⭐ (2/5)</option>
                      <option value={1}>⭐ (1/5)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief subject of your question"
                    className="w-full px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide details about your question or feedback..."
                    className="w-full px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? "Sending Message & Email..." : "Submit Support Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
