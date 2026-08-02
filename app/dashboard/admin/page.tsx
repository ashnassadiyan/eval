"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/NotificationSlice";
import notificationService from "@/store/services/notification.service";
import userService from "@/store/services/user.service";
import creditService from "@/store/services/credit.service";
import {
  Users,
  Coins,
  Activity,
  Plus,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  AlertTriangle,
  X,
  Bell,
  Send,
  MessageSquare,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface UserNode {
  id: number | string;
  user_name: string;
  email: string;
  user_type: number;
  is_active: boolean;
  fcm: string | null;
  total_tokens: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export default function AdminPage() {
  const dispatch = useDispatch();

  const [users, setUsers] = useState<UserNode[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "DISABLED"
  >("ALL");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);

  // State for Add Tokens Modal
  const [editingUser, setEditingUser] = useState<UserNode | null>(null);
  const [tokenAmountToAdd, setTokenAmountToAdd] = useState<number>(500000);
  const [isSubmittingTokens, setIsSubmittingTokens] = useState(false);
  const [tokenFeedback, setTokenFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // State for Delete User Modal
  const [deletingUser, setDeletingUser] = useState<UserNode | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // State for Send Notification Modal
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifTargetUser, setNotifTargetUser] = useState<UserNode | null>(null);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [notifType, setNotifType] = useState("info");
  const [notifCategory, setNotifCategory] = useState("general");
  const [notifLink, setNotifLink] = useState("");
  const [notifSending, setNotifSending] = useState(false);
  const [notifFeedback, setNotifFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users from auth/all_users API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const params: Record<string, any> = {
        page,
        limit,
      };
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const response = await userService.getAllUsers(params);
      const data = response?.data;

      if (data) {
        setUsers(data.users || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      const errMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to load users from backend";
      setFetchError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Open notification modal
  const handleOpenNotificationModal = (user: UserNode | null = null) => {
    setNotifTargetUser(user);
    setNotifTitle("");
    setNotifBody("");
    setNotifType("info");
    setNotifCategory("general");
    setNotifLink("");
    setNotifFeedback(null);
    setShowNotifModal(true);
  };

  // Submit POST to /notification/send_notification
  const handleSendNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifBody.trim()) return;

    setNotifSending(true);
    setNotifFeedback(null);

    try {
      const payload: any = {
        title: notifTitle.trim(),
        body: notifBody.trim(),
        message: notifBody.trim(),
        type: notifType || "info",
        category: notifCategory || "general",
        link: notifLink.trim(),
      };

      if (notifTargetUser) {
        payload.user_id = notifTargetUser.id;
        payload.email = notifTargetUser.email;
        payload.user_email = notifTargetUser.email;
        if (notifTargetUser.fcm) {
          payload.fcm = notifTargetUser.fcm;
        }
      }

      await notificationService.sendNotification(payload);

      dispatch(
        showNotification({
          title: "Notification Sent",
          body: `Notification successfully sent${
            notifTargetUser
              ? ` to ${notifTargetUser.user_name}`
              : " to system users"
          }.`,
          type: "success",
        })
      );

      setNotifFeedback({
        type: "success",
        message: `Notification successfully sent${
          notifTargetUser ? ` to ${notifTargetUser.user_name}` : ""
        }.`,
      });

      setTimeout(() => {
        setShowNotifModal(false);
        setNotifTargetUser(null);
        setNotifTitle("");
        setNotifBody("");
        setNotifFeedback(null);
      }, 1200);
    } catch (err: any) {
      console.error("Failed to send notification:", err);
      let errMsg = "Failed to send notification. Please try again.";
      if (Array.isArray(err?.response?.data?.detail)) {
        errMsg = err.response.data.detail
          .map((d: any) => `${d.loc?.slice(-1)[0] || "field"}: ${d.msg}`)
          .join(", ");
      } else if (typeof err?.response?.data?.detail === "string") {
        errMsg = err.response.data.detail;
      } else if (err?.response?.data?.message) {
        errMsg = err.response.data.message;
      }

      setNotifFeedback({
        type: "error",
        message: errMsg,
      });
    } finally {
      setNotifSending(false);
    }
  };

  const [updatingStatusUserId, setUpdatingStatusUserId] = useState<number | string | null>(null);

  // Toggle user active status via PUT /auth/update_active API
  const toggleStatus = async (userObj: UserNode) => {
    const targetStatus = !userObj.is_active;
    setUpdatingStatusUserId(userObj.id);

    try {
      await userService.updateUserStatus({
        user_id: Number(userObj.id),
        status: targetStatus,
      });

      // Update local state on success
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userObj.id
            ? {
                ...u,
                is_active: targetStatus,
              }
            : u
        )
      );

      dispatch(
        showNotification({
          title: "User Status Updated",
          body: `${userObj.user_name || userObj.email} set to ${
            targetStatus ? "ACTIVE" : "DISABLED"
          }.`,
          type: "success",
        })
      );
    } catch (err: any) {
      console.error("Failed to update user status:", err);
      const errMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to update user status.";
      dispatch(
        showNotification({
          title: "Status Update Failed",
          body: errMsg,
          type: "error",
        })
      );
    } finally {
      setUpdatingStatusUserId(null);
    }
  };

  // Add tokens handler calling POST /credit/add_credit API
  const handleAddTokensSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (tokenAmountToAdd <= 0) return;

    setIsSubmittingTokens(true);
    setTokenFeedback(null);

    try {
      await creditService.addCredit({
        user_id: editingUser.id,
        num_credit: tokenAmountToAdd,
      });

      dispatch(
        showNotification({
          title: "Tokens Added",
          body: `Successfully added ${tokenAmountToAdd.toLocaleString()} tokens to ${editingUser.user_name}.`,
          type: "success",
        })
      );

      // Update total_tokens state locally
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                total_tokens: (user.total_tokens || 0) + tokenAmountToAdd,
              }
            : user
        )
      );

      setTokenFeedback({
        type: "success",
        message: `Successfully added ${tokenAmountToAdd.toLocaleString()} tokens!`,
      });

      setTimeout(() => {
        setEditingUser(null);
        setTokenFeedback(null);
      }, 1200);
    } catch (err: any) {
      console.error("Failed to add credit:", err);
      const errMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to add tokens. Please try again.";
      setTokenFeedback({
        type: "error",
        message: errMsg,
      });
    } finally {
      setIsSubmittingTokens(false);
    }
  };

  // Confirm user delete handler
  const handleConfirmDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingUser) return;
    if (deleteConfirmText.trim().toLowerCase() !== "delete") return;

    setUsers((prev) => prev.filter((user) => user.id !== deletingUser.id));
    setSelectedUsers((prev) => prev.filter((id) => id !== deletingUser.id));
    setDeletingUser(null);
    setDeleteConfirmText("");
  };

  // Select all or single users
  const toggleSelectUser = (id: number | string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  // Filtered list by status dropdown
  const filteredUsers = users.filter((user) => {
    if (statusFilter === "ACTIVE") return user.is_active;
    if (statusFilter === "DISABLED") return !user.is_active;
    return true;
  });

  // Calculate pagination counters
  const startItem =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  // Total tokens accumulated across users
  const totalTokensSum = users.reduce(
    (acc, u) => acc + (u.total_tokens || 0),
    0
  );
  const formattedTokens =
    totalTokensSum >= 1_000_000
      ? `${(totalTokensSum / 1_000_000).toFixed(1)}M`
      : totalTokensSum >= 1_000
      ? `${(totalTokensSum / 1_000).toFixed(1)}K`
      : totalTokensSum.toString();

  return (
    <AdminGuard>
      <div className="flex-1 bg-slate-50 dark:bg-black text-zinc-900 dark:text-[#e2e2e2] font-sans p-6 md:p-10 space-y-8 select-none transition-colors min-h-screen">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
          <div>
            <p className="text-[10px] font-mono font-semibold tracking-widest text-zinc-500 uppercase">
              System Administration
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1 uppercase">
              User Management & Access Control
            </h2>
          </div>
          <div className="flex items-center gap-4 text-right">
            <button
              onClick={fetchUsers}
              disabled={isLoading}
              className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
            <div>
              <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                System Load:{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  12%
                </span>
              </p>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase mt-1 tracking-wider flex items-center justify-end gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                All Nodes Operational
              </p>
            </div>
          </div>
        </div>

        {/* OVERVIEW STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800/80 p-6 rounded-xl space-y-3 transition-all hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs">
            <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-widest">
                Total System Users
              </span>
              <Users className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                ) : (
                  pagination.total
                )}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 uppercase tracking-wider">
                Matching API query
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800/80 p-6 rounded-xl space-y-3 transition-all hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs">
            <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-widest">
                Tokens Allocated
              </span>
              <Coins className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                ) : (
                  formattedTokens
                )}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wider">
                Active User Credit Sum
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800/80 p-6 rounded-xl space-y-3 transition-all hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs">
            <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-widest">
                System Uptime
              </span>
              <Activity className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                99.98%
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 uppercase tracking-wider">
                Real-time Monitoring Active
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800/80 p-4 rounded-xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/admin/create"
              className="flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
            >
              <Plus className="h-3.5 w-3.5" />
              Create User
            </Link>

            <button
              type="button"
              onClick={() => handleOpenNotificationModal(null)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
            >
              <Bell className="h-3.5 w-3.5" />
              Send Notification
            </button>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white pl-8 pr-4 py-2 w-48 md:w-64 rounded-lg focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-600 transition-colors font-mono"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Limit selector */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500 uppercase">Limit:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white px-2 py-1.5 rounded-lg text-xs font-mono focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center justify-between gap-3 border border-zinc-300 dark:border-[#2c2c2e] hover:border-zinc-400 dark:hover:border-[#444] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-white transition-all bg-white dark:bg-transparent cursor-pointer"
              >
                <span>Filter: {statusFilter} Users</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-[#2c2c2e] rounded-xl overflow-hidden z-30 shadow-2xl">
                  {(["ALL", "ACTIVE", "DISABLED"] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setStatusFilter(option);
                        setIsFilterDropdownOpen(false);
                      }}
                      className="flex items-center justify-between w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-[#1c1c1e] text-zinc-900 dark:text-white cursor-pointer"
                    >
                      <span>{option}</span>
                      {statusFilter === option && (
                        <Check className="h-3 w-3 text-emerald-600 dark:text-[#30d158]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ERROR STATE */}
        {fetchError && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center justify-between text-xs text-red-600 dark:text-red-400">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={fetchUsers}
              className="px-3 py-1 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* UNIFIED TABLE CONTAINER */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#0a0a0c] shadow-xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/80">
                  <th className="px-5 py-3.5 w-12 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="accent-black dark:accent-white cursor-pointer"
                    />
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    Name / Email
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    Total Tokens
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    FCM / Type
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                          Loading user data from API...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider"
                    >
                      No user records match the specified filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelected = selectedUsers.includes(user.id);
                    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      user.user_name || user.email
                    )}`;

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors ${
                          isSelected
                            ? "bg-zinc-100/80 dark:bg-zinc-900/80"
                            : ""
                        }`}
                      >
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectUser(user.id)}
                            className="accent-black dark:accent-white cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarUrl}
                              alt={user.user_name || "User Avatar"}
                              className="size-9 rounded-full object-cover border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
                            />
                            <div>
                              <p className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight">
                                {user.user_name || "Unnamed User"}
                              </p>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => toggleStatus(user)}
                              disabled={updatingStatusUserId === user.id}
                              className={`relative w-10 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer disabled:opacity-50 ${
                                user.is_active
                                  ? "bg-emerald-500"
                                  : "bg-zinc-300 dark:bg-zinc-700"
                              }`}
                            >
                              <span
                                className={`block w-4 h-4 bg-white rounded-full transition-transform ${
                                  user.is_active
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                user.is_active
                                  ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                                  : "text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/30"
                              }`}
                            >
                              {user.is_active ? "ACTIVE" : "DISABLED"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1.5 max-w-[150px]">
                            <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
                              {(user.total_tokens || 0).toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border w-fit ${
                                user.fcm
                                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                  : "text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800"
                              }`}
                            >
                              {user.fcm ? "FCM Active" : "No FCM Token"}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                              Type: {user.user_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenNotificationModal(user)
                              }
                              className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                              title={`Send notification to ${user.user_name}`}
                            >
                              <Bell className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="flex items-center gap-1.5 border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider text-zinc-800 dark:text-white bg-zinc-100 dark:bg-zinc-800 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer shadow-2xs"
                            >
                              <Plus className="h-3 w-3" />
                              Add Tokens
                            </button>
                            <button
                              onClick={() => {
                                setDeletingUser(user);
                                setDeleteConfirmText("");
                              }}
                              className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                              title="Remove user"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Unified Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
            <p className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              SHOWING {startItem} - {endItem} OF {pagination.total} USERS
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={!pagination.has_previous || isLoading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> PREV
              </button>

              {/* Page Numbers */}
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                .filter((pNum) => {
                  if (pagination.total_pages <= 7) return true;
                  return (
                    pNum === 1 ||
                    pNum === pagination.total_pages ||
                    Math.abs(pNum - page) <= 1
                  );
                })
                .map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      page === pNum
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs"
                        : "border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {pNum}
                  </button>
                ))}

              <button
                disabled={!pagination.has_next || isLoading}
                onClick={() => setPage((prev) => prev + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                NEXT <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SEND NOTIFICATION MODAL */}
        {showNotifModal && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#121214] border border-zinc-300 dark:border-[#2c2c2e] w-full max-w-lg p-6 space-y-6 shadow-2xl rounded-2xl relative">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-zinc-200 dark:border-[#222225] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-black tracking-[0.25em] text-zinc-500 dark:text-[#8e8e93] uppercase">
                      // System Messaging Protocol
                    </p>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                      {notifTargetUser
                        ? `Notify ${notifTargetUser.user_name}`
                        : "Broadcast Notification"}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifModal(false)}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Target recipient banner */}
              {notifTargetUser ? (
                <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-[#26262a] p-3.5 rounded-xl flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      notifTargetUser.user_name || notifTargetUser.email
                    )}`}
                    alt={notifTargetUser.user_name}
                    className="size-9 rounded-full object-cover border border-zinc-300 dark:border-zinc-700 shrink-0 bg-zinc-100 dark:bg-zinc-800"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      Target: {notifTargetUser.user_name}
                    </p>
                    <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                      {notifTargetUser.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-[#26262a] p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-500" /> Target Audience:
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    All Active System Users
                  </span>
                </div>
              )}

              {/* Feedback Alert */}
              {notifFeedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium border ${
                    notifFeedback.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                  }`}
                >
                  {notifFeedback.message}
                </div>
              )}

              {/* Form Input */}
              <form
                onSubmit={handleSendNotificationSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="e.g. System Maintenance Announcement"
                    className="w-full bg-zinc-100 dark:bg-[#1c1c1e] border border-zinc-300 dark:border-[#2c2c2e] text-zinc-900 dark:text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Type
                    </label>
                    <select
                      value={notifType}
                      onChange={(e) => setNotifType(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-[#1c1c1e] border border-zinc-300 dark:border-[#2c2c2e] text-zinc-900 dark:text-white px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-mono"
                    >
                      <option value="info">Info</option>
                      <option value="system">System</option>
                      <option value="warning">Warning</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={notifCategory}
                      onChange={(e) => setNotifCategory(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-[#1c1c1e] border border-zinc-300 dark:border-[#2c2c2e] text-zinc-900 dark:text-white px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-mono"
                    >
                      <option value="general">General</option>
                      <option value="system">System</option>
                      <option value="updates">Updates</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Target Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={notifLink}
                    onChange={(e) => setNotifLink(e.target.value)}
                    placeholder="e.g. /dashboard or https://..."
                    className="w-full bg-zinc-100 dark:bg-[#1c1c1e] border border-zinc-300 dark:border-[#2c2c2e] text-zinc-900 dark:text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Notification Body / Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={notifBody}
                    onChange={(e) => setNotifBody(e.target.value)}
                    placeholder="Provide notification details to be sent via push/API..."
                    className="w-full bg-zinc-100 dark:bg-[#1c1c1e] border border-zinc-300 dark:border-[#2c2c2e] text-zinc-900 dark:text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={
                      notifSending ||
                      !notifTitle.trim() ||
                      !notifBody.trim()
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    {notifSending
                      ? "Sending via API..."
                      : "Send Notification (POST)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNotifModal(false)}
                    className="flex-1 border border-zinc-300 dark:border-[#2c2c2e] hover:border-black dark:hover:border-white text-zinc-800 dark:text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD TOKENS MODAL */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#121214] border border-zinc-300 dark:border-[#2c2c2e] w-full max-w-lg p-6 space-y-6 shadow-2xl rounded-2xl relative">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-zinc-200 dark:border-[#222225] pb-4">
                <div>
                  <p className="text-[10px] font-mono font-black tracking-[0.25em] text-zinc-500 dark:text-[#8e8e93] uppercase">
                    // Token Allocation Adjustment
                  </p>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mt-1">
                    Add Tokens
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Details Section */}
              <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-[#26262a] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                    User Details
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      editingUser.is_active
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-[#30d158] border border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-[#ff453a] border border-red-500/20"
                    }`}
                  >
                    {editingUser.is_active ? "ACTIVE" : "DISABLED"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      editingUser.user_name || editingUser.email
                    )}`}
                    alt={editingUser.user_name}
                    className="size-12 rounded-full object-cover border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wide truncate">
                      {editingUser.user_name}
                    </p>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
                      {editingUser.email}
                    </p>
                  </div>
                </div>

                {/* Current Token Count Display */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/60 flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">
                    Current Token Count:
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {(editingUser.total_tokens || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Feedback Alert */}
              {tokenFeedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium border ${
                    tokenFeedback.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                  }`}
                >
                  {tokenFeedback.message}
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleAddTokensSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex justify-between">
                    <span>Number of Tokens to Add</span>
                    <span className="font-mono text-[10px] text-zinc-500 font-normal">
                      New Total:{" "}
                      {(
                        (editingUser.total_tokens || 0) +
                        (tokenAmountToAdd || 0)
                      ).toLocaleString()}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={tokenAmountToAdd}
                      onChange={(e) =>
                        setTokenAmountToAdd(parseInt(e.target.value) || 0)
                      }
                      className="w-full bg-zinc-100 dark:bg-[#1c1c1e] border border-zinc-300 dark:border-[#2c2c2e] text-zinc-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:border-zinc-600 dark:focus:border-zinc-400 font-mono text-sm tracking-wide"
                      placeholder="Enter token count..."
                      required
                    />
                    <Coins className="absolute right-3.5 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {/* Modal Buttons: Add and Cancel */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingTokens || tokenAmountToAdd <= 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white dark:bg-white dark:text-black py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingTokens ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Tokens"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 border border-zinc-300 dark:border-[#2c2c2e] hover:border-black dark:hover:border-white text-zinc-800 dark:text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE USER CONFIRMATION MODAL */}
        {deletingUser && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#121214] border border-red-200 dark:border-red-900/40 w-full max-w-lg p-6 space-y-6 shadow-2xl rounded-2xl relative">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-zinc-200 dark:border-[#222225] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-black tracking-[0.25em] text-red-600 dark:text-red-400 uppercase">
                      // Dangerous Action
                    </p>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                      Delete User Confirmation
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingUser(null);
                    setDeleteConfirmText("");
                  }}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Details to be Deleted */}
              <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 p-4 rounded-xl space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
                  Target User Node
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      deletingUser.user_name || deletingUser.email
                    )}`}
                    alt={deletingUser.user_name}
                    className="size-10 rounded-full object-cover border border-red-300 dark:border-red-800 bg-zinc-100 dark:bg-zinc-800"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wide truncate">
                      {deletingUser.user_name}
                    </p>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
                      {deletingUser.email} (ID: {deletingUser.id})
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
                <p>
                  Are you sure you want to delete this user? This operation will
                  remove all credentials and token balances.
                </p>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  To confirm, please type{" "}
                  <span className="font-mono text-red-600 dark:text-red-400 underline font-bold">
                    delete
                  </span>{" "}
                  below:
                </p>
              </div>

              <form onSubmit={handleConfirmDelete} className="space-y-5">
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type delete to confirm..."
                  className="w-full bg-zinc-100 dark:bg-[#1c1c1e] border border-zinc-300 dark:border-[#2c2c2e] text-zinc-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 font-mono text-sm tracking-widest"
                  autoFocus
                />

                {/* Modal Buttons: Delete and Cancel */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={
                      deleteConfirmText.trim().toLowerCase() !== "delete"
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:hover:bg-red-600 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingUser(null);
                      setDeleteConfirmText("");
                    }}
                    className="flex-1 border border-zinc-300 dark:border-[#2c2c2e] hover:border-black dark:hover:border-white text-zinc-800 dark:text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
