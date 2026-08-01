"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-1 p-1 rounded-full border transition-all duration-300 ease-out select-none shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.97] cursor-pointer ${
        theme === "dark"
          ? "bg-zinc-900/90 backdrop-blur-md border-zinc-700/80 text-zinc-200"
          : "bg-zinc-200/80 backdrop-blur-md border-zinc-300/90 text-zinc-700"
      } ${className}`}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
      aria-label="Toggle theme mode"
    >
      <div
        className={`flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
          theme === "light"
            ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/80 font-bold"
            : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
      >
        <Sun className="size-3.5 mr-1.5 stroke-[2.5]" />
        <span>Light</span>
      </div>
      <div
        className={`flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
          theme === "dark"
            ? "bg-zinc-800 text-white shadow-sm font-bold border border-zinc-700/80"
            : "text-zinc-500 hover:text-zinc-700"
        }`}
      >
        <Moon className="size-3.5 mr-1.5 stroke-[2.5]" />
        <span>Dark</span>
      </div>
    </button>
  );
}
