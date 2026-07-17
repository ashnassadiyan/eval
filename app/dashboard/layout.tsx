"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { balance, total_added, total_used, loadingCredits } = useSelector(
    (state: any) => state.credits
  );

  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Recruitment AI</h1>
        <p className="text-sm text-[#c4c7c8] opacity-60">Precision Engine</p>
      </div>

      <DashboardNav />

      <div className="mt-auto space-y-3 pt-4 border-t border-[#444748]">
        {user && (
          <div className="px-2 py-1">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
              Signed in as
            </p>
            <p className="text-sm text-white truncate">
              {user.name || user.email}
            </p>
          </div>
        )}
        <Link
          href="/dashboard/evaluate"
          className="block w-full bg-white text-black py-3 text-center font-bold hover:opacity-90 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        >
          New Evaluation
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 border border-[#444748] text-[#c4c7c8] py-2.5 text-sm font-semibold hover:border-white hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-black text-[#e2e2e2] overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col h-screen w-64 shrink-0 bg-[#0e0e0e] border-r border-[#444748] p-4 z-50">
          {sidebarContent}
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <aside className="absolute left-0 top-0 h-full w-72 bg-[#0e0e0e] border-r border-[#444748] p-4 flex flex-col animate-in slide-in-from-left duration-200">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1 text-[#c4c7c8] hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Header */}
          <header className="w-full h-14 md:h-16 flex justify-between items-center px-4 md:px-12 bg-[#131313] border-b border-[#444748] shrink-0 z-40">
            <div className="flex items-center gap-3 md:gap-6">
              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-1.5 text-[#c4c7c8] hover:text-white transition-colors -ml-1"
                aria-label="Open menu"
              >
                <span className="material-symbols-outlined text-xl">menu</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-[#c4c7c8]">
                  Token Balance:
                </span>
                <span className="font-bold text-white text-sm md:text-base">
                  {balance}
                </span>
              </div>
              {/* <button
                type="button"
                className="hidden sm:inline-flex border border-white text-white px-4 py-1.5 text-sm hover:bg-white hover:text-black transition-colors"
              >
                Buy Tokens
              </button> */}
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <button
                type="button"
                className="p-2 text-[#c4c7c8] hover:bg-[#2a2a2a] transition-colors"
              >
                <span className="material-symbols-outlined">toll</span>
              </button>
              <div className="h-8 w-8 bg-[#353535] border border-[#444748] overflow-hidden flex items-center justify-center">
                {user ? (
                  <span className="text-xs font-bold text-white">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-white">U</span>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto dashboard-scroll flex flex-col min-w-0">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
