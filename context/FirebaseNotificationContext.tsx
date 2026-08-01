"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/NotificationSlice";
import api from "@/lib/axios";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "error";
  category: "system" | "evaluation" | "candidate" | "general";
  createdAt: string;
  read: boolean;
  link?: string;
}

interface FirebaseNotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isConnected: boolean;
  isFirebaseSetup: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  sendTestNotification: (custom?: Partial<AppNotification>) => void;
  refetchNotifications: () => Promise<void>;
}

const FirebaseNotificationContext = createContext<
  FirebaseNotificationContextType | undefined
>(undefined);

const LOCAL_STORAGE_KEY = "evalcv_notifications_cache";

export function FirebaseNotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isFirebaseSetup, setIsFirebaseSetup] = useState(false);
  const prevNotificationsRef = useRef<AppNotification[]>([]);

  // Fetch real notifications from API "GET /notification/get_notification"
  const fetchApiNotifications = useCallback(async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!user || !token) {
      setNotifications([]);
      prevNotificationsRef.current = [];
      return;
    }

    try {
      const response = await api.get("/notification/get_notification");
      const resData = response.data;
      const rawList =
        resData?.notifications ||
        resData?.data ||
        resData?.results ||
        (Array.isArray(resData) ? resData : []);

      const mappedList: AppNotification[] = rawList.map((n: any) => ({
        id: String(n.id || n._id || Math.random().toString(36).substring(2, 9)),
        title: n.title || n.subject || "Notification",
        body: n.body || n.message || n.description || n.text || "",
        type: (n.type || n.notification_type || "info").toLowerCase() as any,
        category: (n.category || n.type || "general").toLowerCase() as any,
        createdAt: n.createdAt || n.created_at || n.timestamp || new Date().toISOString(),
        read: Boolean(n.read || n.is_read || n.status === "read"),
        link: n.link || n.url || undefined,
      }));

      // Check if there is a new unread notification that wasn't in previous list
      const prevIds = new Set(prevNotificationsRef.current.map((n) => n.id));
      const newestUnread = mappedList.find(
        (n) => !n.read && !prevIds.has(n.id)
      );

      if (newestUnread && prevNotificationsRef.current.length > 0) {
        dispatch(
          showNotification({
            title: newestUnread.title,
            body: newestUnread.body,
            type: newestUnread.type,
          })
        );
      }

      prevNotificationsRef.current = mappedList;
      setNotifications(mappedList);
      setIsConnected(true);

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mappedList));
      } catch (e) {}
    } catch (err) {
      console.error("Failed to fetch notifications from /notification/get_notification:", err);
    }
  }, [dispatch, user]);

  // Initialize notifications from API & local cache when user is authenticated
  useEffect(() => {
    setIsFirebaseSetup(isFirebaseConfigured());

    if (!user) {
      setNotifications([]);
      prevNotificationsRef.current = [];
      return;
    }

    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const clean = Array.isArray(parsed)
          ? parsed.filter(
              (n: any) =>
                !n.id?.startsWith("init-") && !n.id?.startsWith("test-")
            )
          : [];
        setNotifications(clean);
        prevNotificationsRef.current = clean;
      }
    } catch (e) {}

    fetchApiNotifications();
  }, [fetchApiNotifications, user]);

  // Poll API every 15 seconds & refetch on tab focus ONLY if user is logged in
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchApiNotifications();
    }, 15000);

    const handleFocus = () => {
      fetchApiNotifications();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchApiNotifications, user]);

  // FCM Signal Listener -> Triggers API fetch ONLY if user is logged in
  useEffect(() => {
    if (!user) return;
    let unsubscribeFcm: (() => void) | undefined;

    const setupFcmListener = async () => {
      try {
        const { getMessaging, onMessage, isSupported } = await import(
          "firebase/messaging"
        );
        const { app } = await import("@/lib/firebase");

        const supported = await isSupported();
        if (supported && app) {
          const messaging = getMessaging(app);
          unsubscribeFcm = onMessage(messaging, async (payload) => {
            console.log("FCM Push signal received -> Triggering API fetch /notification/get_notification", payload);
            await fetchApiNotifications();
          });
        }
      } catch (err) {
        console.warn("FCM push listener setup error:", err);
      }
    };

    setupFcmListener();

    return () => {
      if (unsubscribeFcm) unsubscribeFcm();
    };
  }, [fetchApiNotifications, user]);

  // Sync notifications to localStorage
  const updateNotifications = useCallback(
    (updater: (prev: AppNotification[]) => AppNotification[]) => {
      setNotifications((prev) => {
        const next = updater(prev);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          console.error("Error saving notifications to localStorage:", e);
        }
        return next;
      });
    },
    []
  );

  const markAsRead = useCallback(
    async (id: string) => {
      // Optimistically update state
      updateNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      const payload = { notification_ids: [id] };

      try {
        await api.put("/notification/mark_read", payload);
      } catch (err) {
        try {
          await api.post("/notification/mark_read", payload);
        } catch (err2) {
          try {
            await api.put("/notification/mark_as_read", payload);
          } catch (err3) {
            console.error("Failed to mark notification as read via API:", err3);
          }
        }
      }
    },
    [updateNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications
      .filter((n) => !n.read)
      .map((n) => n.id);
    if (unreadIds.length === 0) return;

    // Optimistically update state
    updateNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    const payload = { notification_ids: unreadIds };

    try {
      await api.put("/notification/mark_read", payload);
    } catch (err) {
      try {
        await api.post("/notification/mark_read", payload);
      } catch (err2) {
        try {
          await api.put("/notification/mark_as_read", payload);
        } catch (err3) {
          console.error("Failed to mark all notifications as read via API:", err3);
        }
      }
    }
  }, [notifications, updateNotifications]);

  const deleteNotification = useCallback(
    async (id: string) => {
      // Optimistically remove from state & local storage
      updateNotifications((prev) => prev.filter((n) => n.id !== id));

      try {
        await api.delete(`/notification/delete_notification/${id}`);
      } catch (err: any) {
        console.error(`Failed to delete notification ${id} via API:`, err);
        // Fallback retry with alternative route format if needed
        try {
          await api.delete(`/delete_notification/${id}`);
        } catch (retryErr) {
          console.error("Retry delete notification failed:", retryErr);
        }
      }
    },
    [updateNotifications]
  );

  const clearAllNotifications = useCallback(() => {
    updateNotifications(() => []);
  }, [updateNotifications]);

  const sendTestNotification = useCallback(
    async (custom?: Partial<AppNotification>) => {
      await fetchApiNotifications();
    },
    [fetchApiNotifications]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <FirebaseNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        isFirebaseSetup,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        sendTestNotification,
        refetchNotifications: fetchApiNotifications,
      }}
    >
      {children}
    </FirebaseNotificationContext.Provider>
  );
}

export function useFirebaseNotifications() {
  const context = useContext(FirebaseNotificationContext);
  if (context === undefined) {
    throw new Error(
      "useFirebaseNotifications must be used within a FirebaseNotificationProvider"
    );
  }
  return context;
}
