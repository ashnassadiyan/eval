"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  FileText,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* RICH FILLED BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -left-32 -top-32 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-foreground/10 via-foreground/5 to-transparent blur-[180px] animate-pulse" />
        <div
          className="absolute -right-32 -bottom-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent blur-[180px] animate-pulse"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative w-full max-w-4xl mx-auto space-y-10 z-10">
        {/* Navigation Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
        </div>

        {/* HERO HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono font-bold text-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span>Data Protection & Privacy Standard</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
            Privacy Policy
          </h1>
          <p className="max-w-xl mx-auto text-sm text-muted-foreground font-medium">
            Effective Date: <span className="font-mono text-foreground font-bold">August 2, 2026</span> • Last Updated: <span className="font-mono text-foreground font-bold">August 2026</span>
          </p>
        </div>

        {/* SUMMARY CARD */}
        <div className="rounded-3xl border border-border bg-card/95 backdrop-blur-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-3 text-foreground">
            <Lock className="w-6 h-6 shrink-0" />
            <h2 className="text-lg font-extrabold uppercase tracking-wide">
              Our Privacy Commitment
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            At <strong className="text-foreground">EvalCV.app</strong>, we prioritize the confidentiality and integrity of your data. This Privacy Policy outlines how we collect, process, store, and safeguard your personal information and candidate evaluation documents.
          </p>
        </div>

        {/* SECTIONS GRID */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <Database className="w-4 h-4" /> 1. Information We Collect
            </h3>
            <p>
              When using the EvalCV.app Talent Intelligence Platform, we may collect the following categories of information:
            </p>
            <ul className="list-disc list-inside space-y-1.5 font-mono text-xs pl-2 text-foreground">
              <li><strong>Account Credentials:</strong> Full name, corporate email address, password hash, and user role.</li>
              <li><strong>Candidate & Resume Submissions:</strong> Uploaded CVs, resumes, portfolio documents, and job descriptions.</li>
              <li><strong>Token Credits & Analytics:</strong> Usage data, credit balance metrics, and API request logs.</li>
              <li><strong>Push Notification Tokens:</strong> Firebase Cloud Messaging (FCM) device tokens for system alerts.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4" /> 2. How We Use Your Information
            </h3>
            <p>
              We process collected information strictly for operational and service delivery purposes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 font-mono text-xs pl-2 text-foreground">
              <li>To perform AI-powered candidate resume scoring and skill match analysis.</li>
              <li>To manage user authentication, account security, and authorization controls.</li>
              <li>To deliver real-time push notifications, candidate updates, and credit balance alerts.</li>
              <li>To prevent fraudulent usage, resolve technical support tickets, and optimize platform speed.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> 3. Data Security & Isolation
            </h3>
            <p>
              We employ enterprise-grade security architecture to protect your candidate uploads and profile details:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-muted/60 border border-border">
                <p className="font-bold text-foreground text-xs uppercase">Encryption in Transit & Rest</p>
                <p className="text-xs text-muted-foreground mt-1">All data is transmitted via TLS 1.3 and stored using AES-256 encryption standards.</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/60 border border-border">
                <p className="font-bold text-foreground text-xs uppercase">AI Processing Confidentiality</p>
                <p className="text-xs text-muted-foreground mt-1">Candidate resume content is never sold or used for training third-party public AI models.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" /> 4. Data Sharing & Third-Party Services
            </h3>
            <p>
              EvalCV.app does not sell, rent, or trade your personal or candidate data to any third-party advertisers. We only share information with trusted infrastructure providers (e.g., secure cloud hosting, authentication gateways) essential to operating the platform under strict confidentiality agreements.
            </p>
          </section>

          {/* Section 5 */}
          <section className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> 5. Your Data Rights & Deletion
            </h3>
            <p>
              You maintain full ownership of your data. You have the right to request access to, rectification of, or complete deletion of your account and associated candidate files at any time.
            </p>
            <p className="text-xs font-mono text-foreground font-semibold">
              To request full account data deletion, submit a ticket via our <Link href="/contact-support" className="underline font-bold text-primary">Contact Support Page</Link>.
            </p>
          </section>
        </div>

        {/* FOOTER CTA */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 text-center space-y-4">
          <HelpCircle className="w-8 h-8 text-foreground mx-auto" />
          <h4 className="text-lg font-black uppercase text-foreground">
            Have Questions About Privacy?
          </h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Our legal and data privacy officers are available to address any compliance questions.
          </p>
          <div>
            <Link
              href="/contact-support"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-foreground text-background text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
            >
              Contact Privacy Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
