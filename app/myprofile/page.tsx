"use client";

import { useAuth } from "@/context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Mail,
  Zap,
  Phone,
  Briefcase,
  Key,
  Sparkles,
  Lock,
  LogOut,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { showNotification } from "@/store/slices/NotificationSlice";
import api from "@/lib/axios";

export default function MyProfilePage() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();

  const { balance, total_added, total_used } = useSelector(
    (state: any) => state?.credits || {}
  );

  const [activeTab, setActiveTab] = useState<"general" | "security">("general");

  // General Form State
  const [name, setName] = useState(String(user?.name || ""));
  const [email, setEmail] = useState(String(user?.email || ""));
  const [phone, setPhone] = useState(String(user?.phone || "+1 (555) 234-5678"));
  const [userRole, setUserRole] = useState(
    user?.user_type === "recruiter" ? "recruiter" : user?.user_type === "admin" ? "admin" : "candidate"
  );

  // Sync state when user object loads/updates
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.user_type) {
        setUserRole(user.user_type === "recruiter" ? "recruiter" : user.user_type === "admin" ? "admin" : "candidate");
      }
    }
  }, [user]);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingGeneral(true);

      const res = await api.post("/auth/update_profile", {
        name,
        phone,
        user_type: userRole,
      });

      // Update user in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const updated = { ...parsed, name, phone, user_type: userRole };
        localStorage.setItem("user", JSON.stringify(updated));
      }

      dispatch(
        showNotification({
          title: "Profile Updated",
          body: res.data?.message || "Your profile information has been updated successfully.",
          type: "success",
        })
      );
    } catch (err: any) {
      console.error("Profile update failed:", err);
      dispatch(
        showNotification({
          title: "Update Failed",
          body: err?.response?.data?.detail || "Could not update profile information. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      dispatch(
        showNotification({
          title: "Current Password Required",
          body: "Please enter your current password to proceed.",
          type: "error",
        })
      );
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      dispatch(
        showNotification({
          title: "Invalid Password Length",
          body: "New password must be at least 8 characters long.",
          type: "error",
        })
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      dispatch(
        showNotification({
          title: "Password Mismatch",
          body: "New password and confirm password fields do not match.",
          type: "error",
        })
      );
      return;
    }

    try {
      setIsSavingSecurity(true);

      const res = await api.post("/auth/change_password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      dispatch(
        showNotification({
          title: "Password Changed",
          body: res.data?.message || "Your password has been updated successfully.",
          type: "success",
        })
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Password update failed:", err);
      dispatch(
        showNotification({
          title: "Password Update Failed",
          body: err?.response?.data?.detail || "Incorrect current password or update error.",
          type: "error",
        })
      );
    } finally {
      setIsSavingSecurity(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-zinc-900 dark:text-white px-4 sm:px-8 pt-2 pb-8 transition-colors">
      <div className="mx-auto w-full max-w-[1100px]">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="inline-block text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Account & Profile Settings
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              My Profile Settings
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your personal credentials, account persona, security passwords, and AI evaluation tokens.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-primary/30 bg-primary/10 text-primary shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              {userRole === "recruiter"
                ? "Independent Recruiter"
                : userRole === "admin"
                ? "System Administrator"
                : "Job Seeker"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Avatar Card & Token Balance Widget (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Overview Card */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-6 text-center shadow-xl space-y-5">
              <div className="relative mx-auto w-24 h-24">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary via-indigo-500 to-purple-600 text-white font-black text-3xl flex items-center justify-center shadow-xl border-4 border-white dark:border-zinc-900">
                  {(name || email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" title="Active" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {name || "User Account"}
                </h2>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                  {email}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Verified Member
                </span>
              </div>
            </div>

            {/* Token Balance Widget */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="text-xs font-mono uppercase font-bold tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  AI Credits
                </span>
                <span className="font-mono font-extrabold text-zinc-900 dark:text-white text-xl">
                  {balance ?? 100}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Allocated Tokens:</span>
                  <span className="text-zinc-900 dark:text-zinc-200 font-bold">{(total_added ?? 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Used Tokens:</span>
                  <span className="text-zinc-900 dark:text-zinc-200 font-bold">{(total_used ?? 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(10, (((balance ?? 100) / (total_added || 100)) * 100))
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-5 shadow-xl space-y-3">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of Account
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Settings Form Tabs (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111114] p-6 sm:p-8 shadow-xl">
              {/* Tab Selector */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "general"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  General Profile
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "security"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  Security & Password
                </button>
              </div>

              {/* TAB 1: GENERAL PROFILE */}
              {activeTab === "general" && (
                <form onSubmit={handleSaveGeneral} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-primary" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Email (Read Only) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-3 text-sm bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/60 rounded-xl text-zinc-500 cursor-not-allowed font-mono"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Primary User Role */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-primary" /> Account Role Persona
                      </label>
                      <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="recruiter">Independent Recruiter</option>
                        <option value="candidate">Job Seeker / Candidate</option>
                        {userRole === "admin" && <option value="admin">Administrator</option>}
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingGeneral}
                      className="inline-flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-6 py-3 rounded-xl font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSavingGeneral ? "Updating Profile..." : "Save Profile Details"}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: SECURITY & PASSWORD */}
              {activeTab === "security" && (
                <form onSubmit={handleSaveSecurity} className="space-y-6">
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-primary" /> Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-primary" /> New Password (Min 8 Chars)
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingSecurity}
                      className="inline-flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-6 py-3 rounded-xl font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSavingSecurity ? "Updating Password..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
