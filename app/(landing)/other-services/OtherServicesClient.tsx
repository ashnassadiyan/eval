"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Cpu, 
  Wifi, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Zap, 
  Layers, 
  Share2, 
  Star, 
  UserCheck, 
  MessageSquare, 
  FileCheck, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown,
  Building2,
  CreditCard,
  Rocket,
  Clock,
  BarChart3,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NfcSimulator } from "@/components/services/NfcSimulator";
import { AutomationCalculator } from "@/components/services/AutomationCalculator";
import { ServiceInquiryModal } from "@/components/services/ServiceInquiryModal";

export default function OtherServicesClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryDefaultService, setInquiryDefaultService] = useState("both");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const openInquiry = (serviceType = "both") => {
    setInquiryDefaultService(serviceType);
    setInquiryModalOpen(true);
  };

  const faqs = [
    {
      question: "How do Smart NFC Cards work for business social accounts?",
      answer: "Each physical NFC card contains an embedded high-performance microchip. When tapped against any modern smartphone (iPhone or Android), it instantly opens your designated profile page—such as your 5-Star Google Review form, Instagram handle, LinkedIn page, or digital vCard—without requiring the customer to download any app."
    },
    {
      question: "Can I update the links on my NFC Card after purchasing?",
      answer: "Yes! All EvalCV NFC cards connect to our cloud dashboard. You can update your target destination URL (e.g. switch from Instagram to a Google Review form or a new menu link) at any time instantly, without replacing the physical card."
    },
    {
      question: "What small enterprise workflows can you automate?",
      answer: "We automate lead capture & response (responding to inbound leads in seconds), CRM syncing (HubSpot, Salesforce, Pipedrive), invoice generation & payment follow-ups, post-purchase review requests, WhatsApp business messaging, and custom API integrations."
    },
    {
      question: "How long does custom NFC card printing and automation setup take?",
      answer: "Custom laser-engraved or printed NFC card orders ship within 3-5 business days. Workflow automation projects typically launch within 5-10 business days following an initial setup consultation."
    },
    {
      question: "Do NFC cards require battery charging or special maintenance?",
      answer: "No batteries needed! NFC cards use passive radio frequency technology, drawing micro-power directly from the scanning smartphone upon tap. They are waterproof, durable, and built for 100,000+ taps."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-28 overflow-hidden border-b border-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-primary/10 via-indigo-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />
        
        <div className="mx-auto max-w-[1280px] px-4 md:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Evolytics Enterprise Ecosystem</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-muted-foreground">SME Solutions</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Business Automation & Smart NFC Cards for Small Enterprises
          </h1>

          <p className="mt-5 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Eliminate manual admin work with custom AI workflow automation, and accelerate your business social presence with tap-to-share NFC cards.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => openInquiry("both")}
              className="bg-primary text-primary-foreground font-bold px-8 py-6 rounded-xl hover-lift shadow-lg text-base"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const el = document.getElementById("nfc-simulator-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-bold px-8 py-6 rounded-xl border-border hover:bg-muted text-base"
            >
              <Wifi className="w-4 h-4 mr-2 text-indigo-500" />
              Try NFC Tap Simulator
            </Button>
          </div>

          {/* Hero Feature Highlights */}
          <div className="mt-12 pt-8 border-t border-border/40 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-3 rounded-xl bg-card border border-border/60 text-left space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Bot className="w-4 h-4 text-blue-500" />
                SME Workflows
              </div>
              <p className="text-xs text-muted-foreground">Auto-responder & CRM syncing</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/60 text-left space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Wifi className="w-4 h-4 text-indigo-500" />
                Tap-to-Share NFC
              </div>
              <p className="text-xs text-muted-foreground">Instagram, Google Reviews & vCard</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/60 text-left space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Clock className="w-4 h-4 text-emerald-500" />
                20+ Hrs/Wk Saved
              </div>
              <p className="text-xs text-muted-foreground">Dramatically cut manual labor</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/60 text-left space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Cloud Dashboard
              </div>
              <p className="text-xs text-muted-foreground">Manage card links anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL SERVICE OVERVIEW */}
      <section className="py-16 mx-auto max-w-[1280px] px-4 md:px-12 space-y-16">
        
        {/* SECTION A: SMALL ENTERPRISE AUTOMATION */}
        <div id="automation-section" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Solution Module 01
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-2">
                Small Enterprise Business Automation
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
                Custom intelligent workflows tailored for growing businesses. Stop drowning in repetitive manual tasks and focus on expanding revenue.
              </p>
            </div>

            <Button
              onClick={() => openInquiry("automation")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0"
            >
              Get Automation Quote
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

          {/* Automation Pillars Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-blue-500/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Instant Lead Auto-Responder</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automatically reply to website inquiries, emails, and social media leads in under 30 seconds with personalized pricing and booking links.
              </p>
              <ul className="pt-2 text-xs text-muted-foreground space-y-1.5 border-t border-border/50">
                <li className="flex items-center gap-1.5 text-foreground font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp & Email auto-dispatch
                </li>
                <li className="flex items-center gap-1.5 text-foreground font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Lead qualification scoring
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-indigo-500/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Unified CRM & Data Sync</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect your sales channels, Google Sheets, HubSpot, or Notion seamlessly. No more double data entry or misplaced client notes.
              </p>
              <ul className="pt-2 text-xs text-muted-foreground space-y-1.5 border-t border-border/50">
                <li className="flex items-center gap-1.5 text-foreground font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Bi-directional contact sync
                </li>
                <li className="flex items-center gap-1.5 text-foreground font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Automated pipeline updates
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-purple-500/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Invoicing & Review Workflows</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Trigger automated PDF invoice generation on project sign-off and request 5-star customer reviews immediately after service delivery.
              </p>
              <ul className="pt-2 text-xs text-muted-foreground space-y-1.5 border-t border-border/50">
                <li className="flex items-center gap-1.5 text-foreground font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Automated payment reminders
                </li>
                <li className="flex items-center gap-1.5 text-foreground font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Google review request sequence
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Automation ROI Calculator */}
          <AutomationCalculator onOpenInquiry={() => openInquiry("automation")} />
        </div>

        {/* SECTION B: SMART NFC SOCIAL CARDS */}
        <div id="nfc-simulator-section" className="space-y-10 pt-10 border-t border-border/50">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Wifi className="w-4 h-4 animate-pulse" /> Solution Module 02
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-2">
                Smart NFC Cards for Social Accounts & Digital Branding
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
                Elevate customer engagement instantly. Hand your team smart physical NFC cards that tap directly to your Instagram, TikTok, LinkedIn, Google 5-Star Reviews, or digital contact card.
              </p>
            </div>

            <Button
              onClick={() => openInquiry("nfc")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0"
            >
              Order NFC Cards
              <CreditCard className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

          {/* Interactive Live NFC Tap Simulator */}
          <NfcSimulator />
        </div>
      </section>

      {/* 3. PRICING & SERVICE TIERS */}
      <section className="py-16 bg-muted/40 border-t border-border/50">
        <div className="mx-auto max-w-[1280px] px-4 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
              Flexible SME Packages
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-3">
              Transparent Investment Tiers
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Choose standalone NFC Cards, custom SME Business Automation, or our bundled growth suite.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Card Tier 1: NFC Starter */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                  <CreditCard className="w-3.5 h-3.5" /> Smart NFC Pack
                </div>
                <h3 className="text-xl font-bold">NFC Executive Card</h3>
                <p className="text-xs text-muted-foreground">
                  Custom printed smart physical NFC card configured for your business social handles & Google reviews.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-foreground">$49</span>
                  <span className="text-xs text-muted-foreground ml-1">/ one-time card</span>
                </div>
                <ul className="space-y-2.5 text-xs pt-4 border-t border-border/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Custom laser engraved logo & QR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Configured for Instagram, Google Reviews or vCard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dynamic Link Cloud Dashboard included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>100,000+ Taps waterproof guarantee</span>
                  </li>
                </ul>
              </div>
              <Button onClick={() => openInquiry("nfc")} variant="outline" className="w-full font-bold">
                Order NFC Card
              </Button>
            </div>

            {/* Card Tier 2: SME Growth Automation (Featured) */}
            <div className="bg-card border-2 border-primary rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                Most Popular for SMEs
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
                  <Cpu className="w-3.5 h-3.5" /> Workflow Suite
                </div>
                <h3 className="text-xl font-bold">SME Automation Setup</h3>
                <p className="text-xs text-muted-foreground">
                  Complete custom AI workflow automation system for lead capture, CRM syncing, and automated customer follow-ups.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-foreground">$399</span>
                  <span className="text-xs text-muted-foreground ml-1">/ custom build setup</span>
                </div>
                <ul className="space-y-2.5 text-xs pt-4 border-t border-border/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-foreground">Instant Lead Auto-Responder (&lt;30 sec)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>HubSpot / Sheets / CRM data synchronization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Automated Invoicing & Payment reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>WhatsApp / Email review request sequences</span>
                  </li>
                </ul>
              </div>
              <Button onClick={() => openInquiry("automation")} className="w-full font-bold bg-primary text-primary-foreground">
                Build Automation Workflow
              </Button>
            </div>

            {/* Card Tier 3: Complete Bundle */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Complete Bundle
                </div>
                <h3 className="text-xl font-bold">Enterprise Growth Bundle</h3>
                <p className="text-xs text-muted-foreground">
                  Full SME Business Automation setup plus 5 Custom Laser-Engraved Smart NFC Cards for your staff.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-foreground">$549</span>
                  <span className="text-xs text-muted-foreground ml-1">/ complete package</span>
                </div>
                <ul className="space-y-2.5 text-xs pt-4 border-t border-border/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Full SME Automation Suite & Integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-foreground">5x Premium Laser Engraved NFC Cards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dedicated Automation Specialist Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Analytics & Tap tracking dashboard</span>
                  </li>
                </ul>
              </div>
              <Button onClick={() => openInquiry("both")} variant="outline" className="w-full font-bold">
                Get Complete Bundle
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      <section className="py-16 mx-auto max-w-3xl px-4 md:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-primary" /> Common Questions
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-card border border-border/80 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left font-bold text-sm md:text-base flex items-center justify-between gap-4"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. HIGH IMPACT CALL TO ACTION */}
      <section className="py-16 mx-auto max-w-[1280px] px-4 md:px-12 pb-20">
        <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-indigo-950 text-white rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Ready to Accelerate Growth?
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Transform Your Small Business Operations & Social Reach Today
            </h2>
            <p className="text-xs md:text-sm text-slate-300">
              Talk directly with our solutions team to build your custom automation pipeline or order custom-branded NFC cards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Button
              size="lg"
              onClick={() => openInquiry("both")}
              className="bg-white text-slate-950 font-extrabold px-8 py-6 rounded-xl hover:bg-slate-100 text-sm shadow-md"
            >
              Request Free Consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* MODAL DIALOG */}
      <ServiceInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        defaultService={inquiryDefaultService}
      />
    </div>
  );
}
