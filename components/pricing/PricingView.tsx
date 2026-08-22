"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Building2,
  ArrowRight,
  Calculator,
  MessageSquare,
  BadgeCheck,
  Send,
  X,
  CreditCard,
  Flame,
  CheckCircle2,
  Clock,
  FileText,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function PricingView({ showHeader = true }: { showHeader?: boolean }) {
  const { user } = useAuth();
  const [selectedPack, setSelectedPack] = useState<{
    name: string;
    tokens: number;
    price: string;
  } | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Calculator state
  const [candidateCount, setCandidateCount] = useState(30);

  // Form state for Enterprise Inquiry
  const [contactForm, setContactForm] = useState({
    name: "",
    email: user?.email || "",
    company: "",
    phone: "",
    volume: "50-200 evaluations/month",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleOpenPurchase = (pack: { name: string; tokens: number; price: string }) => {
    setSelectedPack(pack);
    setShowPurchaseModal(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setContactSubmitted(true);
    }, 800);
  };

  const faqs = [
    {
      question: "How do evaluation tokens work?",
      answer:
        "1 Token equals 1 complete candidate evaluation report against a specific job description. Each evaluation parses the candidate CV, analyzes skills and experience gaps, calculates a match score, and generates a downloadable PDF report.",
    },
    {
      question: "Do evaluation tokens expire?",
      answer:
        "No! All tokens purchased on evalcv.app remain valid indefinitely. You can use them whenever you have active hiring needs without worrying about monthly reset dates.",
    },
    {
      question: "What happens if an evaluation fails due to an error?",
      answer:
        "Our system automatically verifies evaluation completeness. If any system or parsing error occurs, your token is instantly credited back to your account balance.",
    },
    {
      question: "Can I buy multiple token packs?",
      answer:
        "Yes! You can purchase multiple packs at any time. Your token balance will stack automatically.",
    },
    {
      question: "How do custom bulk or enterprise plans work?",
      answer:
        "For high-volume recruiters screening 100+ candidates per month or platforms requiring direct ATS/HRIS API integration, click 'Contact Us for More' to get custom volume discounts and dedicated SLAs.",
    },
  ];

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <section className="relative py-12 lg:py-16 overflow-hidden bg-background text-foreground transition-colors">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[250px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-4 md:px-8 relative z-10">
        {/* Section Header */}
        {showHeader && (
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-bold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Transparent Pay-As-You-Go Token Pricing</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Simple Token Packs. <br />
              <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Zero Monthly Subscriptions.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground font-medium">
              Screen candidates with precision. Pay only for the evaluations you actually perform.
            </p>
          </div>
        )}

        {/* Highlight Explainer Card: 1 Token = 1 Evaluation */}
        <div className="mb-12 p-5 sm:p-6 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary text-primary-foreground font-bold shrink-0 shadow-lg shadow-primary/20">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-foreground">
                    1 Token = 1 Candidate Evaluation
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                    No Hidden Fees
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Includes full CV parsing, job match score, skill gap analysis, strengths/weaknesses breakdown, and exportable PDF report.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground shrink-0 border-t md:border-t-0 md:border-l border-border/80 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-around">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>Tokens Never Expire</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                <span>Download PDF Reports</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Auto-refund On Error</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">

          {/* CARD 1: STARTER PACK (10 Tokens) */}
          <div className="relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                  Starter Pack
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  Individual Hiring
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                    ₹300
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    / 10 Tokens
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                  <span>₹30 per evaluation</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-6">
                Perfect for quick candidate screenings, single job roles, or individual recruiter evaluations.
              </p>

              <div className="space-y-3 pt-6 border-t border-border/80 mb-8">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>10 Evaluations</strong></span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Detailed Match Score & Fit Rating</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Strengths & Weaknesses Breakdown</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Printable & Downloadable PDF Reports</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Token Balance Never Expires</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenPurchase({ name: "Starter Pack", tokens: 10, price: "₹300" })}
              className="w-full py-3.5 px-6 rounded-2xl border border-border bg-muted/80 text-foreground font-bold text-sm hover:bg-foreground hover:text-background transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group-hover:border-foreground/30"
            >
              <span>Get 10 Tokens</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* CARD 2: PRO PACK (30 Tokens) — FEATURED / MOST POPULAR */}
          <div className="relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl border-2 border-primary bg-card/95 backdrop-blur-2xl shadow-2xl shadow-primary/10 transition-all duration-300 scale-[1.02] z-20">
            {/* Top Glow Laser Scan Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-emerald-400 to-teal-400 rounded-t-3xl" />

            {/* Popular Pill Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-emerald-600 text-white text-[11px] font-mono font-extrabold tracking-wider uppercase shadow-lg shadow-primary/30">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>MOST POPULAR • BEST VALUE</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/30">
                  Pro Pack
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Save ~11%
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                    ₹800
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    / 30 Tokens
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                  <span>₹26.6 per evaluation</span>
                  <span className="text-[10px] text-muted-foreground font-normal">(vs ₹30)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-6">
                Designed for active recruiters, growing hiring teams, and recruitment agencies with steady candidate volume.
              </p>

              <div className="space-y-3 pt-6 border-t border-border/80 mb-8">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span><strong>30 Evaluations</strong></span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Advanced AI Skill & Experience Gap Analysis</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Full PDF Export with Custom Organization Logo</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Priority AI Processing Acceleration Queue</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Permanent Token Validity (Never Expires)</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>24/7 Dedicated Support Assistance</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenPurchase({ name: "Pro Pack", tokens: 30, price: "₹800" })}
              className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm hover:bg-primary/90 transition-all duration-200 shadow-xl shadow-primary/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Get 30 Tokens</span>
              <Zap className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* CARD 3: ENTERPRISE & BULK (Contact Us for More) */}
          <div className="relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                  Enterprise
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  High Volume Bulk
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                    Custom Pricing
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                  <span>Custom Token Quota & Bulk Discounts</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-6">
                Need high-volume evaluation quotas, custom ATS API integration, or multi-user team seats?
              </p>

              <div className="space-y-3 pt-6 border-t border-border/80 mb-8">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <span><strong>Custom Token Volume (100+ to 10,000+)</strong></span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Direct ATS & HRIS API Integration</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Custom AI Match Weighting & Prompts</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Multi-User Team Workspaces & Roles</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dedicated Account Manager & SLA Guarantee</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowContactModal(true)}
              className="w-full py-3.5 px-6 rounded-2xl border-2 border-primary/80 bg-primary/5 hover:bg-primary hover:text-primary-foreground font-bold text-sm text-foreground transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Us for More</span>
            </button>
          </div>

        </div>

        {/* Interactive Token Estimator / Calculator Widget */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3 border border-primary/20">
                <Calculator className="w-3.5 h-3.5" />
                <span>Token Estimator</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                How many CV evaluations do you need per month?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">
                Adjust the slider to estimate your token needs and discover the recommended pack.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Required Evaluations:</span>
                  <span className="text-primary font-mono text-base">{candidateCount} Evaluations</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={candidateCount}
                  onChange={(e) => setCandidateCount(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span>5 Evaluations</span>
                  <span>50 Evaluations</span>
                  <span>100 Evaluations</span>
                  <span>150+ Evaluations</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full p-6 rounded-2xl bg-muted/60 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-muted-foreground tracking-wider">
                  Recommended Token Setup
                </span>
                <h4 className="text-xl font-bold text-foreground mt-1">
                  {candidateCount <= 10
                    ? "Starter Pack (10 Tokens)"
                    : candidateCount <= 30
                    ? "Pro Pack (30 Tokens)"
                    : candidateCount <= 90
                    ? `${Math.ceil(candidateCount / 30)} × Pro Packs (${Math.ceil(candidateCount / 30) * 30} Tokens)`
                    : "Enterprise Custom Bulk Plan"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {candidateCount <= 30
                    ? "Standard token pack will cover all screening needs."
                    : "Stacking Pro packs or switching to Enterprise bulk gives maximum savings."}
                </p>
              </div>

              <div className="shrink-0 text-center sm:text-right w-full sm:w-auto">
                <div className="text-2xl font-black text-foreground">
                  {candidateCount <= 10
                    ? "₹300"
                    : candidateCount <= 30
                    ? "₹800"
                    : candidateCount <= 90
                    ? `₹${Math.ceil(candidateCount / 30) * 800}`
                    : "Custom Pricing"}
                </div>
                <button
                  onClick={() => {
                    if (candidateCount > 90) {
                      setShowContactModal(true);
                    } else if (candidateCount > 10) {
                      handleOpenPurchase({ name: "Pro Pack", tokens: 30, price: "₹800" });
                    } else {
                      handleOpenPurchase({ name: "Starter Pack", tokens: 10, price: "₹300" });
                    }
                  }}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md w-full sm:w-auto"
                >
                  {candidateCount > 90 ? "Contact Sales" : "Get Recommended Pack"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              <span>Frequently Asked Questions</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Have questions about tokens, evaluations, or enterprise support?
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border/80 bg-card/90 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left font-bold text-sm sm:text-base text-foreground flex justify-between items-center gap-4 hover:bg-muted/40 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className={`text-xl transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Support Footer Prompt */}
        <div className="mt-16 text-center p-8 rounded-3xl bg-muted/40 border border-border/60">
          <h4 className="text-lg font-bold text-foreground">Need help choosing the right plan?</h4>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            Our team is available to assist you with token purchases, invoice payments, or custom volume needs.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => setShowContactModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Us for Bulk Pricing</span>
            </button>
            <Link
              href="/contact-support"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors"
            >
              <span>Visit Help & Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: PURCHASE / TOP-UP INSTRUCTION MODAL --- */}
      {showPurchaseModal && selectedPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl overflow-hidden">
            <button
              onClick={() => setShowPurchaseModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-foreground">
                  Purchase {selectedPack.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono font-semibold">
                  {selectedPack.tokens} Tokens for {selectedPack.price}
                </p>
              </div>
            </div>

            <div className="my-6 p-4 rounded-2xl bg-muted/60 border border-border space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between font-medium text-foreground">
                <span>Selected Package:</span>
                <span className="font-bold">{selectedPack.name} ({selectedPack.tokens} Tokens)</span>
              </div>
              <div className="flex justify-between font-medium text-foreground">
                <span>Total Amount:</span>
                <span className="font-bold text-primary text-sm">{selectedPack.price}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Evaluation Allowance:</span>
                <span>{selectedPack.tokens} Evaluations</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Validity:</span>
                <span className="text-emerald-500 font-bold">Never Expires</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={user ? "/myprofile" : "/login?redirect=/pricing"}
                className="w-full py-3.5 px-6 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{user ? "Proceed to Token Checkout" : "Sign In to Purchase Tokens"}</span>
              </Link>

              <button
                onClick={() => {
                  setShowPurchaseModal(false);
                  setShowContactModal(true);
                }}
                className="w-full py-3 px-6 rounded-2xl border border-border text-foreground font-bold text-xs hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span>Need Custom Billing or Bulk Invoice? Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ENTERPRISE & BULK CONTACT US MODAL --- */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => {
                setShowContactModal(false);
                setContactSubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>

            {contactSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-foreground">
                  Bulk Inquiry Submitted!
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Thank you for reaching out. Our enterprise team will review your monthly screening requirements and get back to you with custom volume pricing within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setContactSubmitted(false);
                  }}
                  className="px-6 py-3 rounded-2xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Close Dialog
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">
                      Contact Us for Enterprise & Bulk Tokens
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      Custom volume quotas, custom ATS API integration, and enterprise SLAs.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="e.g. rahul@company.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Company / Agency
                      </label>
                      <input
                        type="text"
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        placeholder="e.g. Acme Hiring Solutions"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Expected Monthly Volume
                      </label>
                      <select
                        value={contactForm.volume}
                        onChange={(e) => setContactForm({ ...contactForm, volume: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground text-xs focus:outline-none focus:border-primary font-medium"
                      >
                        <option value="50-100 evaluations/month">50 - 100 CV Evaluations/mo</option>
                        <option value="100-500 evaluations/month">100 - 500 CV Evaluations/mo</option>
                        <option value="500-2000 evaluations/month">500 - 2,000 CV Evaluations/mo</option>
                        <option value="2000+ evaluations/month">2,000+ High Volume Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Specific Requirements / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us about your team size, ATS integrations, or custom requirements..."
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground text-xs focus:outline-none focus:border-primary font-medium resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowContactModal(false)}
                      className="px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-xs hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending Inquiry...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Bulk Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
