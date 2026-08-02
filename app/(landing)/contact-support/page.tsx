"use client";

import React, { useState, useEffect, Suspense, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  Mail,
  User,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Headphones,
  Clock,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

function ContactSupportForm() {
  const searchParams = useSearchParams();
  const reasonParam = searchParams.get("reason");
  const emailParam = searchParams.get("email");

  const isInactive = reasonParam === "inactive";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(emailParam || "");
  const [subject, setSubject] = useState(
    isInactive
      ? "Account Reactivation (Inactive Account)"
      : "General Technical Inquiry"
  );
  const [message, setMessage] = useState(
    isInactive
      ? `Hello Support Team,\n\nMy account (${
          emailParam || "email"
        }) is currently marked as inactive. I would like to request assistance with reactivating my account access.`
      : ""
  );

  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to support system
    setTimeout(() => {
      const ticketId = `EV-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket({ id: ticketId, email });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-background text-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
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

      <div className="relative w-full max-w-4xl space-y-8 z-10">
        {/* Navigation Link */}
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Login
          </Link>
        </div>

        {/* HERO HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono font-bold text-foreground">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 Premium Support Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
            Account & Technical Support
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground font-medium">
            Need help reactivating an account or have questions about your access? Submit your request below.
          </p>
        </div>

        {/* SPECIAL INACTIVE ACCOUNT ALERT BANNER */}
        {isInactive && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 backdrop-blur-xl space-y-2 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold uppercase tracking-wide">
                  Account Deactivated Notice
                </h3>
                <p className="text-xs font-medium opacity-90">
                  Your user account is currently marked as <span className="font-bold underline">inactive</span>. Logging in is disabled until an administrator reactivates your account. Submit the request form below for priority review.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: CONTACT DETAILS & METRICS */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-xl">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Support Channels
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-muted/50 border border-border/50">
                  <Mail className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Direct Support Email</p>
                    <p className="text-xs font-mono text-muted-foreground">support@evalcv.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-muted/50 border border-border/50">
                  <Clock className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Average Response Time</p>
                    <p className="text-xs font-mono text-muted-foreground">Under 2 Hours (Priority Desk)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-muted/50 border border-border/50">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-foreground">System Status</p>
                    <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">All Services Operational (99.98%)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/60 p-6 space-y-2 text-xs font-medium text-muted-foreground">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> Quick Note
              </p>
              <p>
                Account reactivation requests are automatically prioritized by our system administration team.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTACT FORM OR SUCCESS TICKET */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border bg-card/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              {submittedTicket ? (
                <div className="py-8 text-center space-y-6 animate-in fade-in duration-300">
                  <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase text-foreground">
                      Support Request Received
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      Your ticket <span className="font-mono font-bold text-foreground">#{submittedTicket.id}</span> has been dispatched. A confirmation has been logged for <span className="font-mono font-bold text-foreground">{submittedTicket.email}</span>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted border border-border text-xs font-mono text-foreground font-semibold">
                    Status: Pending Administrator Review
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setSubmittedTicket(null)}
                      className="px-6 py-3 rounded-xl border border-border hover:border-foreground text-xs font-extrabold uppercase tracking-wider text-foreground transition-all cursor-pointer"
                    >
                      Submit Another Ticket
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-border pb-3">
                    <h2 className="text-lg font-black uppercase text-foreground">
                      Submit Support Ticket
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      No account login required to contact support.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground text-xs font-medium focus:border-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Account Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground text-xs font-medium focus:border-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-foreground mb-1.5">
                        Support Topic / Category
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground text-xs font-medium focus:border-foreground focus:outline-none cursor-pointer"
                      >
                        <option value="Account Reactivation (Inactive Account)">
                          Account Reactivation (Inactive Account)
                        </option>
                        <option value="Technical Support & Bug Report">
                          Technical Support & Bug Report
                        </option>
                        <option value="Token Credits & Billing">
                          Token Credits & Billing
                        </option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Message Details
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your issue or request details..."
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground text-xs font-medium focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-3.5 text-xs font-extrabold uppercase tracking-wider shadow-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? "Submitting Ticket..." : "Dispatch Support Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactSupportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
          <div className="h-8 w-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        </div>
      }
    >
      <ContactSupportForm />
    </Suspense>
  );
}
