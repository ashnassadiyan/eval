"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "@/store/slices/NotificationSlice";

const styles = {
  success: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  error: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
};

export default function Notification() {
  const dispatch = useDispatch();
  const { title, body, type, visible } = useSelector((s) => s.notification);

  const [show, setShow] = useState(false);

  // Entry animation
  useEffect(() => {
    if (visible) {
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
      setShow(false);

      // Wait for exit animation before unmounting
      setTimeout(() => {
        dispatch(hideNotification());
      }, 300); // should match transition duration
    }, 4000);

    return () => clearTimeout(timer);
  }, [visible, dispatch]);

  if (!visible) return null;

  const { icon: Icon, color, bg, border } = styles[type] ?? styles.info;

  const onClose = () => {
    setShow(false);

    setTimeout(() => {
      dispatch(hideNotification());
    }, 300);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border ${bg} ${border} shadow-lg
          transition-all duration-300 ease-out
          ${show ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
      >
        <Icon className={`w-5 h-5 flex-none mt-0.5 ${color}`} />

        <div className="flex-1">
          {title && (
            <p className="text-sm font-semibold text-gray-900">{title}</p>
          )}
          {body && <p className="text-sm text-gray-600 mt-0.5">{body}</p>}
        </div>

        <button
          onClick={onClose}
          className="flex-none text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
