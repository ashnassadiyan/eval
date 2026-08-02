import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

// Helper to clear stored credentials
export function clearAuthCredentials() {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  
  // Clear auth cookie for SSR / middleware
  document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

  // Dispatch global custom event so AuthContext syncs immediately
  window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
}

// Attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401, 403, or "User Not Found" responses & force redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const status = error.response?.status;
    const responseData = error.response?.data;

    const errorMessage = (
      typeof responseData === "string"
        ? responseData
        : JSON.stringify(responseData || "")
    ).toLowerCase();

    const isUserNotFound =
      errorMessage.includes("user not found") ||
      errorMessage.includes("user does not exist") ||
      errorMessage.includes("could not validate credentials") ||
      errorMessage.includes("invalid authentication token") ||
      errorMessage.includes("token expired") ||
      errorMessage.includes("unauthenticated");

    const isPublicRoute =
      window.location.pathname.startsWith("/login") ||
      window.location.pathname.startsWith("/signup") ||
      window.location.pathname.startsWith("/apply") ||
      window.location.pathname.startsWith("/contact-support") ||
      window.location.pathname.startsWith("/privacy") ||
      window.location.pathname.startsWith("/terms") ||
      window.location.pathname === "/";

    // If 401, 403, or explicit User Not Found error on a protected route or request:
    if ((status === 401 || status === 403 || isUserNotFound) && !isPublicRoute) {
      console.warn("Authorization failure detected (401/403/User Not Found). Redirecting to login...");

      // Clear credentials
      clearAuthCredentials();

      // Redirect to login with intended return URL
      const currentPath = window.location.pathname + window.location.search;
      const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;

      if (window.location.pathname !== "/login") {
        window.location.href = redirectUrl;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
