"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import { getUserCredit } from "@/store/slices/creditSlice";
import { ensureFcmTokenSync } from "@/lib/fcm";

interface User {
  id: string | number;
  email: string;
  name?: string;
  phone?: string;
  user_type?: string;
  is_admin?: boolean;
  is_active?: boolean;
  fcm_token?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, userType?: string) => Promise<boolean>;
  logout: () => void;
  setAuthError: (err: string | null) => void;
  refetchUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

function setAuthCookie(token: string) {
  if (typeof document !== "undefined") {
    document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax;`;
  }
}

function clearAuthCredentials() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("fcm_token");
  }
  if (typeof document !== "undefined") {
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch<any>();

  // Fetch full user profile details from backend
  const fetchUserProfile = useCallback(async (): Promise<User | null> => {
    try {
      const response = await api.get("/auth/user_insights");
      const data = response.data;
      if (data) {
        const rawUser = data.user || data.data || data;
        const email = rawUser.email || rawUser.user_email || rawUser.username || "";
        const rawName =
          rawUser.name ||
          rawUser.user_name ||
          rawUser.full_name ||
          rawUser.display_name ||
          (email ? email.split("@")[0] : "");

        const formattedName = rawName
          ? rawName.charAt(0).toUpperCase() + rawName.slice(1)
          : "Member";

        const isActive =
          rawUser.is_active !== undefined
            ? Boolean(rawUser.is_active)
            : true;

        if (email || rawUser.id || rawUser._id) {
          const userObj: User = {
            id: rawUser.id || rawUser._id || rawUser.user_id || "1",
            email: email || "user@evalcv.com",
            name: formattedName,
            phone: rawUser.phone || rawUser.phone_number || undefined,
            user_type: rawUser.user_type || rawUser.role || "recruiter",
            is_admin: rawUser.is_admin || rawUser.role === "admin" || rawUser.user_type === 2 || false,
            is_active: isActive,
            fcm_token: rawUser.fcm_token || rawUser.fcm || localStorage.getItem("fcm_token") || undefined,
          };

          return userObj;
        }
      }
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        return null;
      }
      console.warn("Failed to fetch user profile from /auth/user_insights:", err);
    }
    return null;
  }, []);

  // Hydrate auth state from localStorage and fetch authentic user profile
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("access_token");
        const storedUserRaw = localStorage.getItem("user");

        if (storedToken) {
          setToken(storedToken);
          setAuthCookie(storedToken);

          let parsedUser: User | null = null;
          if (storedUserRaw) {
            try {
              parsedUser = JSON.parse(storedUserRaw);
            } catch (e) {}
          }

          // Fetch fresh user profile from backend
          const fetchedUser = await fetchUserProfile();

          if (fetchedUser) {
            if (fetchedUser.is_active === false) {
              console.warn("Backend user is inactive. Logging out.");
              clearAuthCredentials();
              setUser(null);
              setToken(null);
              setAuthError("Your account is currently inactive. Please contact support to reactivate your access.");
            } else {
              const mergedUser = { ...parsedUser, ...fetchedUser };
              setUser(mergedUser);
              localStorage.setItem("user", JSON.stringify(mergedUser));
              dispatch(getUserCredit());
              ensureFcmTokenSync(mergedUser);
            }
          } else {
            // User not found or token invalid -> clear credentials and prompt login
            console.warn("Backend user validation failed. Logging out and asking for re-login.");
            clearAuthCredentials();
            setUser(null);
            setToken(null);
            setAuthError("Session expired or user not found. Please log in again.");
          }
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (e) {
        console.error("Auth initialization error:", e);
        clearAuthCredentials();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchUserProfile, dispatch]);

  // Listen for unauthorized events emitted by Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthCredentials();
      setUser(null);
      setToken(null);
      setAuthError("Session expired or user not found. Please log in again.");
      router.push("/login");
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [router]);

  const login = useCallback(
    async (email: string, password: string) => {
      setAuthError(null);
      try {
        const response = await api.post("/auth/token", { email, password });
        const { access_token, user: userData } = response.data;

        if (!access_token) {
          throw new Error("Invalid login response from server");
        }

        // Save Token
        localStorage.setItem("access_token", access_token);
        setAuthCookie(access_token);
        setToken(access_token);

        // Fetch User profile from backend to ensure name and email are populated
        let finalUser: User | null = userData || null;
        if (!finalUser || !finalUser.email || !finalUser.name || finalUser.is_active === undefined) {
          const fetched = await fetchUserProfile();
          if (fetched) {
            finalUser = { ...finalUser, ...fetched };
          }
        }

        if (!finalUser) {
          finalUser = {
            id: "1",
            email: email,
            name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
            is_active: true,
          };
        }

        // Check if user is active
        if (finalUser.is_active === false) {
          clearAuthCredentials();
          setToken(null);
          setUser(null);
          const inactiveMsg = "Your account is currently inactive. Please contact support to reactivate your access.";
          setAuthError(inactiveMsg);
          const customErr: any = new Error(inactiveMsg);
          customErr.response = {
            data: { detail: inactiveMsg }
          };
          throw customErr;
        }

        localStorage.setItem("user", JSON.stringify(finalUser));
        setUser(finalUser);

        // Fetch user credits and sync FCM token
        dispatch(getUserCredit());
        ensureFcmTokenSync(finalUser);

        // Check for redirect query param
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const redirectPath = params.get("redirect");
          if (redirectPath && redirectPath.startsWith("/")) {
            router.push(redirectPath);
            return;
          }
        }

        router.push("/dashboard");
      } catch (err: any) {
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Failed to authenticate. Please check your credentials.";
        setAuthError(msg);
        throw err;
      }
    },
    [router, dispatch, fetchUserProfile]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string, userType: string = "recruiter"): Promise<boolean> => {
      setAuthError(null);
      try {
        await api.post("/auth/create_user", {
          name,
          email,
          password,
          user_type: userType,
        });

        return true;
      } catch (err: any) {
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Failed to create account. Please try again.";
        setAuthError(msg);
        throw err;
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearAuthCredentials();
    setToken(null);
    setUser(null);
    setAuthError(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("has_seen_welcome_v3");
      sessionStorage.removeItem("trigger_welcome_splash");
    }
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        authError,
        login,
        signup,
        logout,
        setAuthError,
        refetchUser: fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
