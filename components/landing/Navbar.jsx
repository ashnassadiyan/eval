"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, Cpu, CreditCard } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60 shadow-xs py-0"
          : "bg-background/50 backdrop-blur-xs border-b border-transparent py-1"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight">
            <img
              src="/logo.png"
              alt="evalcv.app Logo"
              className="w-8 h-8 rounded-lg object-cover border border-border/50 shadow-xs"
            />
            <span>evalcv.app</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                pathname === "/" ? "text-foreground font-semibold bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Home
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Register</Link>
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                pathname === "/" ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              Home
            </Link>
          </nav>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Button variant="outline" className="w-full justify-center" asChild>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </Button>
            <Button className="w-full justify-center" asChild>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

