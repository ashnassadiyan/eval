"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

const ROUTE_NAME_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Admin Control",
  create: "Create User",
  create_job: "Create New Job",
  help: "Help & Support",
  notifications: "Notifications",
  evaluate: "CV Evaluator",
  my_jobs: "My Jobs",
  myprofile: "My Profile",
  onboarding: "Onboarding",
  apply: "Job Application",
  candidates: "Candidates Pipeline",
  add_candidates: "Add Candidate",
  result: "Evaluation Report",
  login: "Login",
  signup: "Register",
};

export function Breadcrumbs({ customItems, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Do not render breadcrumbs on homepage root
  if (pathname === "/") return null;

  let items: BreadcrumbItem[] = [];

  if (customItems && customItems.length > 0) {
    items = customItems;
  } else {
    const segments = pathname.split("/").filter(Boolean);
    let accumulatedPath = "";

    items = segments.map((segment, index) => {
      accumulatedPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      let label = ROUTE_NAME_MAP[segment.toLowerCase()];

      if (!label) {
        if (segment.length > 12 || /^[0-9a-fA-F-]+$/.test(segment)) {
          label = `Item #${segment.slice(0, 6)}…`;
        } else {
          label = segment
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
        }
      }

      return {
        label,
        href: isLast ? undefined : accumulatedPath,
      };
    });
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs font-mono select-none overflow-x-auto py-2 px-1 scrollbar-none ${className}`}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors shrink-0"
        title="Dashboard Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <div key={idx} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />

            {isLast || !item.href ? (
              <span className="font-bold text-zinc-900 dark:text-white bg-zinc-200/60 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-md border border-zinc-300/50 dark:border-zinc-700/50 shadow-2xs">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
