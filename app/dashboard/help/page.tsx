"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  BookOpen,
  ChevronDown,
  MessageSquare,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/NotificationSlice";

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
    question: "What is EvalCv and how does the AI intelligence engine work?",
    answer:
      "EvalCv is an advanced AI-powered talent intelligence platform designed for independent recruiters and job seekers. It parses resume PDFs/Word docs, extracts candidate skills, experience, and education, and compares them against specific job specifications to calculate ATS compatibility, overall match percentage, and selection probability.",
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
      "Every new account starts with 100 Free AI Evaluation Credits. 1 credit is used per full resume evaluation report. Additional token top-ups can be allocated via your Profile or Admin Panel.",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "screening" | "jobs" | "billing">("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("faq-1");

  // Contact Support State
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("General Support");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = activeCategory === "all" || f.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      dispatch(
        showNotification({
          title: "Support Ticket Sent",
          body: "Thank you! Our technical support team will review your inquiry within 24 hours.",
          type: "success",
        })
      );
      setTicketSubject("");
      setTicketMessage("");
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-zinc-900 dark:text-white px-4 sm:px-8 py-8 transition-colors">
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
              Find answers in our FAQs or send a direct message to technical support.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary w-full shadow-xs"
            />
          </div>
        </div>

        {/* Main 2-Column Grid: FAQ & Contact Support ONLY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FAQ Accordions (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Frequently Asked Questions
                </h2>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: "all", label: "All" },
                    { id: "general", label: "General" },
                    { id: "screening", label: "Screening" },
                    { id: "jobs", label: "Jobs" },
                    { id: "billing", label: "Billing" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accordion Items */}
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-zinc-900 dark:text-white hover:text-primary transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                            isOpen ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
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
                  Direct Contact
                </span>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mt-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-500" /> Contact Support
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Have a specific question or issue? Submit a message directly to technical support.
                </p>
              </div>

              <form onSubmit={handleSendTicket} className="space-y-4">
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
                  </select>
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
                    placeholder="Provide details about your question or issue..."
                    className="w-full px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? "Sending Message..." : "Submit Support Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
