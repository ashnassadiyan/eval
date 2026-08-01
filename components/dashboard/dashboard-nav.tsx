"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useFirebaseNotifications } from "@/context/FirebaseNotificationContext";

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Evaluation", icon: "description", href: "/evaluate" },
  { label: "My Jobs", icon: "work", href: "/my_jobs" },
  { label: "Notifications", icon: "notifications", href: "/dashboard/notifications", isNotification: true },
  { label: "My Profile", icon: "person", href: "/myprofile" },
  { label: "Help & Support", icon: "help_outline", href: "/dashboard/help" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadCount } = useFirebaseNotifications();

  const finalItems = [...navItems];
  if (user?.user_type === "admin") {
    finalItems.push({ label: "Admin Panel", icon: "admin_panel_settings", href: "/dashboard/admin" });
  }

  return (
    <nav className="flex-1 space-y-1.5 py-2">
      {finalItems.map(({ label, icon, href, isNotification }) => {
        const isActive =
          href === "/dashboard/evaluate" || href === "/evaluate"
            ? pathname === "/dashboard/evaluate" || pathname === "/evaluate"
            : pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

        return (
          <Link
            key={label}
            href={href}
            className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              isActive
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-[#1a1a1e]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? "text-white dark:text-zinc-950"
                    : "text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white"
                }`}
              >
                {icon}
              </span>
              <span className="tracking-tight">{label}</span>
            </div>

            {isNotification && unreadCount > 0 && (
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white"
                    : "bg-red-500 text-white shadow-sm"
                }`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
