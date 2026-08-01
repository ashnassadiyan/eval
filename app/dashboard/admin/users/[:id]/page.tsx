"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, User, Shield, Coins, Calendar, Activity } from "lucide-react";
import { AdminGuard } from "@/components/auth/AdminGuard";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <AdminGuard>
      <div className="flex-1 bg-black text-white p-6 md:p-10 font-sans min-h-screen">
        <div className="mx-auto max-w-4xl space-y-6">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to User Management
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div>
              <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">
                User Details Node // ID: {resolvedParams?.id || "N/A"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                User Profile Node
              </h1>
            </div>
            <span className="inline-flex items-center px-3 py-1 text-xs font-mono font-semibold uppercase border border-white bg-white text-black">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-zinc-800/80 p-6 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-800/60 pb-2">
                User Credentials
              </h3>
              <div className="space-y-3 text-sm font-mono text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Node ID:</span>
                  <span>{resolvedParams?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Access Level:</span>
                  <span className="text-white font-bold">Administrator / Recruiter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status:</span>
                  <span className="text-emerald-400">OPERATIONAL</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-zinc-800/80 p-6 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-800/60 pb-2">
                Token Allocation & Usage
              </h3>
              <div className="space-y-3 text-sm font-mono text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Current Balance:</span>
                  <span className="text-white font-bold">1,240,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Maximum Capacity:</span>
                  <span>2,000,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Last Activity:</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
