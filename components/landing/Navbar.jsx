"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
          ? "bg-background/75 backdrop-blur-md border-b border-border/50 shadow-xs py-0"
          : "bg-transparent border-b border-transparent py-1"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight">
          <img
            src="/logo.png"
            alt="EvalCV.app Logo"
            className="w-8 h-8 rounded-lg object-cover border border-border/50 shadow-xs"
          />
          <span>EvalCV.app</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
