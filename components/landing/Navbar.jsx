"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight">
          <img
            src="/logo.png"
            alt="EvalCv Logo"
            className="w-8 h-8 rounded-lg object-cover border border-border shadow-xs"
          />
          <span>EVAL</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#why-us" className="text-muted-foreground hover:text-foreground transition-colors">
            For Seekers
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            For Employers
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:flex" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="hidden sm:flex" asChild>
            <Link href="/dashboard/evaluate">Evaluate CV</Link>
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-background px-4 pb-4 pt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <a href="#why-us" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMenuOpen(false)}>
            For Seekers
          </a>
          <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMenuOpen(false)}>
            For Employers
          </a>
          <div className="pt-2 border-t border-border space-y-2">
            <Button variant="ghost" className="w-full justify-center" asChild>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            </Button>
            <Button className="w-full justify-center" asChild>
              <Link href="/dashboard/evaluate" onClick={() => setMenuOpen(false)}>Evaluate CV</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
