"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { useSelector } from "react-redux";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { WelcomeSplashScreen } from "@/components/auth/WelcomeSplashScreen";
import { SidebarOnboardingTour } from "@/components/dashboard/SidebarOnboardingTour";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageTransition } from "@/components/ui/PageTransition";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const welcomeParam = searchParams.get("welcome");

  const { balance } = useSelector((state: any) => state.credits || {});
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      const trigger = sessionStorage.getItem("trigger_welcome_splash");
      const hasSeen = sessionStorage.getItem("has_seen_welcome_v3");

      if (trigger === "true" || welcomeParam === "true" || !hasSeen) {
        setShowWelcome(true);
      }
    }
  }, [user, welcomeParam]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("trigger_welcome_splash");
      sessionStorage.setItem("has_seen_welcome_v3", "true");
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="mb-6 px-1">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="EvalCv Logo"
            className="w-9 h-9 rounded-md object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm"
          />
          <div>
            <h1 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight leading-none">
              Recruitment AI
            </h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wider uppercase mt-1">
              Precision Engine
            </p>
          </div>
        </div>
      </div>

      <DashboardNav />

      <div className="mt-auto space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
        {user && (
          <div className="px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/50">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              Signed in as
            </p>
            <p className="text-xs font-medium text-zinc-900 dark:text-zinc-200 truncate mt-0.5">
              {user.name || user.email}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 py-2.5 px-4 rounded-xl text-xs font-semibold hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showWelcome && (
        <WelcomeSplashScreen durationSeconds={6} onComplete={handleWelcomeComplete} />
      )}

      {/* Guided Onboarding Tour for Sidebar Items (state saved in localStorage) */}
      <SidebarOnboardingTour />

      <div className="flex h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-[#e2e2e2] overflow-hidden antialiased transition-colors duration-200">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col h-screen w-64 shrink-0 bg-white dark:bg-[#0c0c0e] border-r border-zinc-200 dark:border-zinc-800/80 p-4 z-50 transition-colors duration-200">
          {sidebarContent}
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-[#0c0c0e] border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col animate-in slide-in-from-left duration-200 shadow-2xl">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Header Bar */}
          <header className="w-full h-14 md:h-16 flex justify-between items-center px-4 md:px-8 bg-white/80 dark:bg-[#111114]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/80 shrink-0 z-40 transition-colors duration-200">
            <div className="flex items-center gap-3 md:gap-6">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors -ml-1"
                aria-label="Open menu"
              >
                <span className="material-symbols-outlined text-xl">menu</span>
              </button>

              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs">
                <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 text-[16px]">
                  generating_tokens
                </span>
                <span className="hidden sm:inline text-zinc-600 dark:text-zinc-400 font-medium">
                  Token Balance:
                </span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">
                  {balance ?? 0}
                </span>
              </div>
            </div>

            {/* Right side controls: Mode toggle, Notifications & Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              <NotificationBell />
              <ThemeToggle />

              <Link
                href="/myprofile"
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all group"
                title="View Profile"
              >
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white hidden sm:inline">
                  {user?.name || user?.email?.split("@")[0] || "Profile"}
                </span>
                <div className="h-7 w-7 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs flex items-center justify-center shadow-sm">
                  {user ? (user.name || user.email || "U").charAt(0).toUpperCase() : "U"}
                </div>
              </Link>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto dashboard-scroll flex flex-col min-w-0 bg-slate-50 dark:bg-black transition-colors duration-200">
            <div className="px-4 sm:px-8 pt-2 pb-0">
              <Breadcrumbs />
            </div>
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <DashboardContent>{children}</DashboardContent>
      </Suspense>
    </AuthGuard>
  );
}
