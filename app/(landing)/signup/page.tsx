"use client";

import Link from "next/link";
import { Eye, EyeOff, Terminal } from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(name, email, password);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(
        axiosError.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0a0a0a] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-zinc-800 bg-[#111111] p-8 shadow-2xl">
        <div className="text-center flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">Join EVAL CV</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Start your journey
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="full-name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Full Name
              </label>
              <input
                id="full-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full rounded-md border border-zinc-800 bg-[#1a1a1a] px-3 py-3 text-white placeholder-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-md border border-zinc-800 bg-[#1a1a1a] px-3 py-3 text-white placeholder-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-zinc-800 bg-[#1a1a1a] px-3 py-3 text-white placeholder-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-white focus:ring-offset-zinc-900"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-zinc-400">
              I agree to the <a href="#" className="font-semibold text-white hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-white hover:underline">Privacy Policy</a>.
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md border border-transparent bg-white px-4 py-3 text-sm font-bold uppercase tracking-wider text-black hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#111111] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-white hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
