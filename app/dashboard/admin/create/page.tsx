"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import {
  ArrowLeft,
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export default function CreateUserPage() {
  const router = useRouter();

  // Form State
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation Errors State
  const [errors, setErrors] = useState<{
    userName?: string;
    email?: string;
    password?: string;
  }>({});

  // Confirmation Modal & Success state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors: { userName?: string; email?: string; password?: string } =
      {};

    if (!userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (userName.trim().length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit (Triggers confirmation modal if valid)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsConfirmModalOpen(true);
    }
  };

  // Final Confirmation Submit
  const handleFinalCreation = async () => {
    setIsCreating(true);
    // Simulate brief network call
    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsCreating(false);
    setIsConfirmModalOpen(false);
    setIsSuccess(true);

    // Redirect back to Admin Dashboard after success banner
    setTimeout(() => {
      router.push("/dashboard/admin");
    }, 1200);
  };

  return (
    <AdminGuard>
      <div className="flex-1 bg-slate-50 dark:bg-black text-zinc-900 dark:text-[#e2e2e2] font-sans p-6 md:p-10 select-none transition-colors min-h-screen">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* HEADER & BACK BUTTON */}
          <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to System Administration
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 rounded-xl shadow-md">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-semibold tracking-widest text-zinc-500 uppercase">
                  // Access Control Provisioning
                </p>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">
                  Create User Node
                </h1>
              </div>
            </div>
          </div>

          {/* SUCCESS BANNER */}
          {isSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold text-sm uppercase tracking-wide">
                  User Created Successfully!
                </p>
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-300">
                  Redirecting to System Administration dashboard...
                </p>
              </div>
            </div>
          )}

          {/* FORM CONTAINER */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-xs rounded-2xl">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-wide">
                User Credentials & Identity
              </h2>
              <p className="text-xs text-zinc-500 font-mono">
                Enter the details below to register a new user in the system.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      if (errors.userName)
                        setErrors((prev) => ({ ...prev, userName: undefined }));
                    }}
                    placeholder="e.g. evelyn_vance"
                    className={`w-full bg-zinc-50 dark:bg-[#121214] border ${
                      errors.userName
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-300 dark:border-zinc-800 focus:border-zinc-600 dark:focus:border-zinc-400"
                    } text-zinc-900 dark:text-white pl-10 pr-4 py-3 text-sm font-mono focus:outline-none rounded-lg transition-colors`}
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
                {errors.userName && (
                  <p className="text-xs text-red-500 font-mono flex items-center gap-1.5 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.userName}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="e.g. user@obsidian.ai"
                    className={`w-full bg-zinc-50 dark:bg-[#121214] border ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-300 dark:border-zinc-800 focus:border-zinc-600 dark:focus:border-zinc-400"
                    } text-zinc-900 dark:text-white pl-10 pr-4 py-3 text-sm font-mono focus:outline-none rounded-lg transition-colors`}
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-mono flex items-center gap-1.5 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="At least 6 characters..."
                    className={`w-full bg-zinc-50 dark:bg-[#121214] border ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-300 dark:border-zinc-800 focus:border-zinc-600 dark:focus:border-zinc-400"
                    } text-zinc-900 dark:text-white pl-10 pr-10 py-3 text-sm font-mono focus:outline-none rounded-lg transition-colors`}
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-mono flex items-center gap-1.5 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                <button
                  type="submit"
                  className="flex-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 py-3.5 px-6 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer text-center"
                >
                  Create User
                </button>
                <Link
                  href="/dashboard/admin"
                  className="flex-1 border border-zinc-300 dark:border-zinc-800 hover:border-black dark:hover:border-white text-zinc-800 dark:text-white py-3.5 px-6 rounded-lg font-bold text-xs uppercase tracking-wider transition-all text-center bg-transparent cursor-pointer"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* CONFIRMATION MODAL */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#121214] border border-zinc-300 dark:border-[#2c2c2e] w-full max-w-lg p-6 space-y-6 shadow-2xl rounded-2xl relative">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-zinc-200 dark:border-[#222225] pb-4">
                <div>
                  <p className="text-[10px] font-mono font-black tracking-[0.25em] text-zinc-500 dark:text-[#8e8e93] uppercase">
                    // Identity Provisioning Confirmation
                  </p>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mt-1">
                    Confirm User Creation
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Summary Details */}
              <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-[#26262a] p-4 rounded-xl space-y-3 font-mono text-xs">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  User Details Summary
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span className="text-zinc-500">Username:</span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {userName}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span className="text-zinc-500">Email:</span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Password Length:</span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {password.length} characters
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Are you sure you want to create this user node with the specified credentials?
              </p>

              {/* Modal Buttons: Confirm & Create and Cancel */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleFinalCreation}
                  disabled={isCreating}
                  className="flex-1 bg-black text-white dark:bg-white dark:text-black py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Confirm & Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  disabled={isCreating}
                  className="flex-1 border border-zinc-300 dark:border-[#2c2c2e] hover:border-black dark:hover:border-white text-zinc-800 dark:text-white py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
