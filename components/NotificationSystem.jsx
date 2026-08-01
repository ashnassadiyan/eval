"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "@/store/slices/NotificationSlice";
import { playNotificationSound } from "@/lib/sound";

const typeConfig = {
  success: {
    icon: CheckCircle2,
    badgeText: "SUCCESS",
    iconColor: "text-emerald-500 dark:text-[#30d158]",
    borderColor: "border-emerald-200 dark:border-emerald-900/40",
    bgGradient:
      "bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent",
    progressBg: "bg-emerald-500 dark:bg-[#30d158]",
    glowColor: "shadow-emerald-500/10",
  },
  error: {
    icon: XCircle,
    badgeText: "ERROR",
    iconColor: "text-red-500 dark:text-[#ff453a]",
    borderColor: "border-red-200 dark:border-red-900/40",
    bgGradient:
      "bg-gradient-to-r from-red-500/5 via-transparent to-transparent",
    progressBg: "bg-red-500 dark:bg-[#ff453a]",
    glowColor: "shadow-red-500/10",
  },
  warning: {
    icon: AlertTriangle,
    badgeText: "WARNING",
    iconColor: "text-amber-500 dark:text-[#ffd60a]",
    borderColor: "border-amber-200 dark:border-amber-900/40",
    bgGradient:
      "bg-gradient-to-r from-amber-500/5 via-transparent to-transparent",
    progressBg: "bg-amber-500 dark:bg-[#ffd60a]",
    glowColor: "shadow-amber-500/10",
  },
  info: {
    icon: Info,
    badgeText: "SYSTEM",
    iconColor: "text-blue-500 dark:text-[#0a84ff]",
    borderColor: "border-blue-200 dark:border-blue-900/40",
    bgGradient:
      "bg-gradient-to-r from-blue-500/5 via-transparent to-transparent",
    progressBg: "bg-blue-500 dark:bg-[#0a84ff]",
    glowColor: "shadow-blue-500/10",
  },
};

export default function NotificationSystem() {
  const dispatch = useDispatch();
  const { title, body, type, visible } = useSelector(
    (s) => s.notification || {}
  );

  const [show, setShow] = useState(false);

  // Entry animation trigger & Sound playback
  useEffect(() => {
    if (visible) {
      playNotificationSound();
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
    }
  }, [visible]);

  // Auto close after 4 seconds
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  const onClose = () => {
    setShow(false);
    setTimeout(() => {
      dispatch(hideNotification());
    }, 300);
  };

  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm sm:max-w-md p-2 pointer-events-none select-none">
      <div
        className={`pointer-events-auto relative overflow-hidden bg-white/95 dark:bg-[#121214]/95 backdrop-blur-xl border ${config.borderColor} ${config.glowColor} shadow-2xl rounded-2xl p-4 transition-all duration-300 ease-out transform ${
          show
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-4 opacity-0 scale-95"
        }`}
      >
        {/* Subtle Background Accent Gradient */}
        <div
          className={`absolute inset-0 pointer-events-none ${config.bgGradient}`}
        />

        <div className="flex items-start gap-3.5 relative z-10">
          {/* Icon Badge */}
          <div
            className={`p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${config.iconColor} shrink-0 mt-0.5`}
          >
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md ${config.iconColor} bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 tracking-wider`}
              >
                {config.badgeText}
              </span>
            </div>
            {title && (
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight leading-snug">
                {title}
              </h4>
            )}
            {body && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed font-mono">
                {body}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-800 dark:hover:text-white p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Countdown Progress Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800/60 overflow-hidden">
          <div
            className={`h-full ${config.progressBg} transition-all ease-linear`}
            style={{
              animation: show ? "shrinkProgress 4.5s linear forwards" : "none",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrinkProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
