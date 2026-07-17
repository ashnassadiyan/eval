"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: "groups", href: "/dashboard" },
  { label: "Evaluation", icon: "dashboard", href: "/evaluate" },
  { label: "My Jobs", icon: "groups", href: "/my_jobs" },
  // { label: "Assessments", icon: "analytics", href: "#" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1">
      {navItems.map(({ label, icon, href }) => {
        const isActive =
          href === "/dashboard/evaluate"
            ? pathname === "/dashboard/evaluate" || pathname === "/evaluate"
            : pathname === href;

        return (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all ${
              isActive
                ? "bg-white text-black font-bold"
                : "text-[#c4c7c8] hover:bg-[#353535]"
            }`}
          >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
