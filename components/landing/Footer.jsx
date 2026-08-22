import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="snap-end bg-background border-t border-border mt-auto">
      <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="evalcv.app Logo"
                className="w-8 h-8 rounded-lg object-cover border border-border shadow-xs"
              />
              <p className="text-xl font-extrabold tracking-tight">evalcv.app</p>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The intelligent layer between resumes and the right opportunities.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <a href="mailto:info@evalcv.app" className="font-medium hover:text-foreground transition-colors">
                info@evalcv.app
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Platform</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#candidate-flow" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Candidate Flow
                </a>
              </li>
              <li>
                <Link href="/dashboard/evaluate" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Evaluate CV
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Legal</p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Contact</p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/contact-support" className="text-sm text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:info@evalcv.app" className="text-sm font-semibold text-primary transition-colors hover:underline">
                  info@evalcv.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p className="text-xs tracking-wider text-muted-foreground uppercase">
              © 2026 evalcv.app. All rights reserved.
            </p>
            <span className="hidden sm:inline text-muted-foreground/40">•</span>
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">Evolytics</span>
            </p>
          </div>
          <a href="mailto:info@evalcv.app" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            info@evalcv.app
          </a>
        </div>
      </div>
    </footer>
  );
}
