"use client";

import React, { useState } from "react";
import { useFirebaseNotifications } from "@/context/FirebaseNotificationContext";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useFirebaseNotifications();

  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter notifications by read status & search query
  const filteredNotifications = notifications.filter((notif) => {
    // Tab filter
    if (activeTab === "unread" && notif.read) return false;
    if (activeTab === "read" && !notif.read) return false;

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const titleMatch = notif.title.toLowerCase().includes(q);
      const bodyMatch = notif.body.toLowerCase().includes(q);
      if (!titleMatch && !bodyMatch) return false;
    }

    return true;
  });

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-4 border-l-emerald-500 bg-white dark:bg-[#121215]";
      case "warning":
        return "border-l-4 border-l-amber-500 bg-white dark:bg-[#121215]";
      case "error":
        return "border-l-4 border-l-red-500 bg-white dark:bg-[#121215]";
      default:
        return "border-l-4 border-l-blue-500 bg-white dark:bg-[#121215]";
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 pt-2 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Notification Center
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your account notifications and real-time updates.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                done_all
              </span>
              Mark All Read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAllNotifications}
              className="flex items-center gap-1.5 border border-zinc-300 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:text-red-600 hover:border-red-300 dark:hover:text-red-400 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                delete_sweep
              </span>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#121215] p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Read Status Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
          {(["all", "unread", "read"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {tab}{" "}
              {tab === "unread" && unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-blue-500 text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-zinc-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 flex items-center justify-center mx-auto mb-4 border border-zinc-200 dark:border-zinc-800">
              <span className="material-symbols-outlined text-3xl">
                notifications_off
              </span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              No notifications found
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
              {searchQuery
                ? "No alerts match your search query."
                : "You're all caught up! Notifications will appear here when received."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm transition-all duration-200 hover:shadow-md ${getTypeStyle(
                notif.type
              )} ${!notif.read ? "bg-blue-50/20 dark:bg-blue-950/10" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                    <span className="material-symbols-outlined text-xl">
                      notifications
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm ${
                          !notif.read
                            ? "font-extrabold text-zinc-900 dark:text-white"
                            : "font-semibold text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {notif.title}
                      </h4>

                      {!notif.read && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white text-[9px] font-bold uppercase tracking-wider">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono">
                      {notif.body}
                    </p>

                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 pt-1 font-mono">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notif.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        check_circle
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Delete notification"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
