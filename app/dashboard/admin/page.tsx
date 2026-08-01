"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminGuard } from "@/components/auth/AdminGuard";
import {
  Users,
  Coins,
  Activity,
  Download,
  Grid,
  Plus,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  AlertTriangle,
  X,
} from "lucide-react";

interface UserNode {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "ACTIVE" | "DISABLED";
  tokens: number;
  maxTokens: number;
  lastActive: string;
}

const initialUsers: UserNode[] = [
  {
    id: "1",
    name: "EVELYN VANCE",
    email: "e.vance@obsidian.ai",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    status: "ACTIVE",
    tokens: 1240000,
    maxTokens: 2000000,
    lastActive: "2 MINS AGO",
  },
  {
    id: "2",
    name: "MARCUS THORNE",
    email: "m.thorne@obsidian.ai",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    status: "DISABLED",
    tokens: 45200,
    maxTokens: 1000000,
    lastActive: "14 HOURS AGO",
  },
  {
    id: "3",
    name: "ALTHEA ROWEN",
    email: "a.rowen@obsidian.ai",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    status: "ACTIVE",
    tokens: 5000000,
    maxTokens: 5000000,
    lastActive: "ONLINE",
  },
  {
    id: "4",
    name: "DR. ARIS THORNE",
    email: "a.thorne@obsidian.ai",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    status: "ACTIVE",
    tokens: 850000,
    maxTokens: 2000000,
    lastActive: "3 MINS AGO",
  },
  {
    id: "5",
    name: "KARA LIN",
    email: "k.lin@obsidian.ai",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    status: "ACTIVE",
    tokens: 150000,
    maxTokens: 500000,
    lastActive: "1 DAY AGO",
  },
];

export default function AdminPage() {
  const [users, setUsers] = useState<UserNode[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "DISABLED"
  >("ALL");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // State for Add Tokens Modal
  const [editingUser, setEditingUser] = useState<UserNode | null>(null);
  const [tokenAmountToAdd, setTokenAmountToAdd] = useState<number>(500000);

  // State for Delete User Modal
  const [deletingUser, setDeletingUser] = useState<UserNode | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Toggle user active status
  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
            }
          : user
      )
    );
  };

  // Add tokens handler
  const handleAddTokensSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (tokenAmountToAdd <= 0) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              tokens: Math.min(user.tokens + tokenAmountToAdd, user.maxTokens),
            }
          : user
      )
    );
    setEditingUser(null);
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
  const toggleSelectUser = (id: string) => {
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

  // Filtered list
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
          <div className="text-right">
            <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
              System Load: <span className="text-emerald-600 dark:text-emerald-400 font-bold">12%</span>
            </p>
            <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase mt-1 tracking-wider flex items-center justify-end gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              All Nodes Operational
            </p>
          </div>
        </div>

        {/* OVERVIEW STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800/80 p-6 rounded-xl space-y-3 transition-all hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs">
            <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-widest">
                Total Active Users
              </span>
              <Users className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                {users.length}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 uppercase tracking-wider">
                +14 this cycle
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
                {(
                  users.reduce((acc, u) => acc + u.tokens, 0) / 1000000
                ).toFixed(1)}
                M
              </p>
              <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wider">
                92% Utilization Rate
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
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center justify-between w-full md:w-auto gap-3 border border-zinc-300 dark:border-[#2c2c2e] hover:border-zinc-400 dark:hover:border-[#444] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-white transition-all bg-white dark:bg-transparent cursor-pointer"
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

        {/* TABLE */}
        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-[#222225] overflow-x-auto rounded-xl shadow-xs">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-[#222225] bg-zinc-100/80 dark:bg-transparent text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600 dark:text-[#8e8e93]">
                <th className="py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="accent-black dark:accent-[#30d158] cursor-pointer"
                  />
                </th>
                <th className="py-4 px-6">Name / Email</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Current Tokens</th>
                <th className="py-4 px-6">Last Active</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const pct = Math.min((user.tokens / user.maxTokens) * 100, 100);
                const isSelected = selectedUsers.includes(user.id);
                return (
                  <tr
                    key={user.id}
                    className={`border-b border-zinc-200 dark:border-[#1c1c1e] hover:bg-zinc-50 dark:hover:bg-[#161618] transition-colors ${
                      isSelected ? "bg-zinc-100 dark:bg-[#161618]" : ""
                    }`}
                  >
                    <td className="py-5 px-6">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectUser(user.id)}
                        className="accent-black dark:accent-[#30d158] cursor-pointer"
                      />
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="size-10 rounded-full object-cover border border-zinc-300 dark:border-[#2c2c2e]"
                        />
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                            {user.name}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-[#8e8e93] font-mono mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        {/* Toggle switch */}
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className={`relative w-12 h-6 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-500 dark:bg-[#30d158]"
                              : "bg-zinc-300 dark:bg-[#2c2c2e]"
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                              user.status === "ACTIVE"
                                ? "translate-x-6"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            user.status === "ACTIVE"
                              ? "text-emerald-600 dark:text-[#30d158] bg-emerald-500/10"
                              : "text-red-600 dark:text-[#ff453a] bg-red-500/10"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="space-y-1.5 max-w-[160px]">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
                          {user.tokens.toLocaleString()}
                        </span>
                        <div className="h-1.5 w-full bg-zinc-200 dark:bg-[#2c2c2e] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-xs font-bold text-zinc-500 dark:text-[#8e8e93] font-mono">
                        {user.lastActive}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="flex items-center gap-1.5 border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white px-3.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider text-zinc-800 dark:text-white bg-white/80 dark:bg-zinc-900 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer shadow-2xs"
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
                          title="Remove user node"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-xs text-zinc-500 dark:text-[#8e8e93]"
                  >
                    No user nodes match the specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-[#8e8e93]">
          <span>
            Showing 1-{filteredUsers.length} of {filteredUsers.length} nodes
          </span>
          <div className="flex items-center gap-2">
            <button
              className="p-2 border border-zinc-300 dark:border-[#2c2c2e] hover:border-black dark:hover:border-white bg-transparent text-zinc-800 dark:text-white rounded-lg transition-all disabled:opacity-30 disabled:hover:border-zinc-300 dark:disabled:hover:border-[#2c2c2e] cursor-pointer disabled:cursor-not-allowed"
              disabled
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button className="px-3.5 py-2 border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black rounded-lg cursor-pointer">
              1
            </button>
            <button className="px-3.5 py-2 border border-zinc-300 dark:border-[#2c2c2e] hover:border-black dark:hover:border-white bg-transparent text-zinc-800 dark:text-white rounded-lg transition-all cursor-pointer">
              2
            </button>
            <button className="px-3.5 py-2 border border-zinc-300 dark:border-[#2c2c2e] hover:border-black dark:hover:border-white bg-transparent text-zinc-800 dark:text-white rounded-lg transition-all cursor-pointer">
              3
            </button>
            <button className="p-2 border border-zinc-300 dark:border-[#2c2c2e] hover:border-black dark:hover:border-white bg-transparent text-zinc-800 dark:text-white rounded-lg transition-all cursor-pointer">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

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
                      editingUser.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-[#30d158] border border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-[#ff453a] border border-red-500/20"
                    }`}
                  >
                    {editingUser.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={editingUser.avatar}
                    alt={editingUser.name}
                    className="size-12 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wide truncate">
                      {editingUser.name}
                    </p>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
                      {editingUser.email}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                      Last Active: {editingUser.lastActive}
                    </p>
                  </div>
                </div>

                {/* Current Token Count Display */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/60 flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">
                    Current Token Count:
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {editingUser.tokens.toLocaleString()}{" "}
                    <span className="text-zinc-400 font-normal">
                      / {editingUser.maxTokens.toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleAddTokensSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex justify-between">
                    <span>Number of Tokens to Add</span>
                    <span className="font-mono text-[10px] text-zinc-500 font-normal">
                      New Total:{" "}
                      {Math.min(
                        editingUser.tokens + (tokenAmountToAdd || 0),
                        editingUser.maxTokens
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
                    className="flex-1 bg-black text-white dark:bg-white dark:text-black py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer"
                  >
                    Add
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
                    src={deletingUser.avatar}
                    alt={deletingUser.name}
                    className="size-10 rounded-full object-cover border border-red-300 dark:border-red-800"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wide truncate">
                      {deletingUser.name}
                    </p>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
                      {deletingUser.email} (ID: {deletingUser.id})
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
                <p>
                  Are you sure you want to delete this user? This operation will remove all credentials and token balances.
                </p>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  To confirm, please type <span className="font-mono text-red-600 dark:text-red-400 underline font-bold">delete</span> below:
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
                    disabled={deleteConfirmText.trim().toLowerCase() !== "delete"}
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


