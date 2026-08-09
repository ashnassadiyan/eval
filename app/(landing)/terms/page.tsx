"use client";

import Link from "next/link";
import {
  FileText,
  ShieldAlert,
  Scale,
  CreditCard,
  UserCheck,
  Ban,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";

export default function TermsOfServicePage() {
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
            <Scale className="w-4 h-4" />
            <span>Master Service Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
            Terms of Service
          </h1>
          <p className="max-w-xl mx-auto text-sm text-muted-foreground font-medium">
            Effective Date: <span className="font-mono text-foreground font-bold">August 2, 2026</span> • Last Updated: <span className="font-mono text-foreground font-bold">August 2026</span>
          </p>
        </div>

        {/* SUMMARY CARD */}
        <div className="rounded-3xl border border-border bg-card/95 backdrop-blur-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-3 text-foreground">
            <FileText className="w-6 h-6 shrink-0" />
            <h2 className="text-lg font-extrabold uppercase tracking-wide">
              Agreement Overview
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            By creating an account or accessing the <strong className="text-foreground">EvalCV.app</strong> platform, you agree to comply with and be bound by the following Terms of Service. Please read these terms carefully before utilizing our AI candidate evaluation services.
          </p>
        </div>

        {/* SECTIONS GRID */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <UserCheck className="w-4 h-4" /> 1. Account Eligibility & Responsibilities
            </h3>
            <p>
              To use EvalCV.app, you must be at least 18 years of age or possess the legal authority to represent your organization. You are responsible for maintaining the secrecy of your credentials and all actions conducted under your account.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> 2. Token Credit System & Usage Rules
            </h3>
            <p>
              Platform services (such as AI resume parsing, candidate scoring, and match reporting) consume allocated token credits.
            </p>
            <ul className="list-disc list-inside space-y-1.5 font-mono text-xs pl-2 text-foreground">
              <li>Token balances are assigned per user account and adjusted based on system activity.</li>
              <li>Tokens are non-transferable between unrelated accounts.</li>
              <li>System administrators reserve the right to audit credit allocations and adjust token limits for fair usage.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <Ban className="w-4 h-4" /> 3. Account Active Status & Deactivation
            </h3>
            <p>
              Your account status is managed by platform security controls.
            </p>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-medium space-y-1.5">
              <p className="font-bold uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Account Status Policy
              </p>
              <p>
                If an account is marked as <strong>inactive (`is_active = false`)</strong> by system administrators, sign-in access will be disabled immediately. To request account reactivation, users must submit a ticket through our public <Link href="/contact-support?reason=inactive" className="underline font-bold">Contact Support Page</Link>.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <Scale className="w-4 h-4" /> 4. Acceptable Use Policy
            </h3>
            <p>
              You agree not to upload fraudulent documents, engage in reverse-engineering of our AI models, automated scraping, or transmit malicious code through our upload interfaces. Violation of these rules will result in immediate account termination.
            </p>
          </section>

          {/* Section 5 */}
          <section className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" /> 5. Limitation of Liability
            </h3>
            <p>
              EvalCV.app provides candidate matching insight algorithms for informational recruitment support. Final hiring decisions rest solely with the recruiter or organization. EvalCV.app is not liable for indirect or consequential damages arising from recruitment outcomes.
            </p>
          </section>
        </div>

        {/* FOOTER CTA */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 text-center space-y-4">
          <HelpCircle className="w-8 h-8 text-foreground mx-auto" />
          <h4 className="text-lg font-black uppercase text-foreground">
            Questions Regarding Terms?
          </h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Our support desk is happy to clarify any terms of service or corporate licensing options.
          </p>
          <div>
            <Link
              href="/contact-support"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-foreground text-background text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
