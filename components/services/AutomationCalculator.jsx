"use client";

import { useState } from "react";
import { 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Bot, 
  CheckSquare, 
  Zap, 
  Users, 
  FileText, 
  MessageSquareCode, 
  Building2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AutomationCalculator({ onOpenInquiry }) {
  const [teamSize, setTeamSize] = useState(5);
  const [selectedModules, setSelectedModules] = useState([
    "lead_responder",
    "crm_sync",
    "invoice_gen"
  ]);

  const modules = [
    {
      id: "lead_responder",
      name: "Instant AI Lead Auto-Responder",
      description: "Responds to inbound website & social leads in under 30 seconds",
      hoursSavedPerWeek: 6,
      icon: MessageSquareCode
    },
    {
      id: "crm_sync",
      name: "Automated CRM & Contact Sync",
      description: "Eliminates manual data entry across HubSpot, Salesforce, or Sheets",
      hoursSavedPerWeek: 8,
      icon: Users
    },
    {
      id: "invoice_gen",
      name: "Automated Invoicing & Payment Reminders",
      description: "Generates PDFs, dispatches invoices, and tracks payment receipts",
      hoursSavedPerWeek: 5,
      icon: FileText
    },
    {
      id: "review_auto",
      name: "Post-Sale Review Request Workflow",
      description: "Triggers SMS/Email review requests after transaction completion",
      hoursSavedPerWeek: 4,
      icon: Sparkles
    },
    {
      id: "ai_bot",
      name: "24/7 AI Customer Support Assistant",
      description: "Handles FAQs, booking appointments, and customer inquiry routing",
      hoursSavedPerWeek: 12,
      icon: Bot
    }
  ];

  const toggleModule = (id) => {
    if (selectedModules.includes(id)) {
      if (selectedModules.length > 1) {
        setSelectedModules(selectedModules.filter((m) => m !== id));
      }
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  // Calculation formulas
  const baseHoursPerModule = selectedModules.reduce((acc, curr) => {
    const found = modules.find((m) => m.id === curr);
    return acc + (found ? found.hoursSavedPerWeek : 0);
  }, 0);

  // Scaled by team size factor
  const totalWeeklyHoursSaved = Math.round(baseHoursPerModule * (1 + (teamSize - 1) * 0.25));
  const estimatedMonthlyHoursSaved = totalWeeklyHoursSaved * 4.2;
  const estimatedHourlyRate = 35; // $35/hr average SME staff cost
  const monthlyCostSavings = Math.round(estimatedMonthlyHoursSaved * estimatedHourlyRate);
  const yearlyCostSavings = monthlyCostSavings * 12;

  return (
    <div className="w-full bg-card border border-border/80 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5 mb-2">
            <Zap className="w-3.5 h-3.5 fill-emerald-500" /> SME Efficiency Calculator
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Calculate Your Business Automation ROI
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            See how much time and operational expenses your enterprise can save every month.
          </p>
        </div>

        {/* Team Size Slider / Selector */}
        <div className="bg-muted/60 p-3 rounded-xl border border-border/60 w-full md:w-auto">
          <div className="flex items-center justify-between gap-4 mb-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary" /> Team Size:
            </span>
            <span className="text-xs font-extrabold text-primary bg-background px-2.5 py-0.5 rounded border border-border">
              {teamSize} {teamSize === 1 ? "Employee" : "Team Members"}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value))}
            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Selectable Modules (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Select Automation Modules Needed:
          </p>
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isSelected = selectedModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? "bg-primary/5 border-primary/40 shadow-sm"
                    : "bg-background/60 hover:bg-muted/40 border-border/60 opacity-80"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border bg-background"
                  }`}
                >
                  {isSelected && <CheckSquare className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      {mod.name}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap">
                      ~{mod.hoursSavedPerWeek} hrs/wk saved
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{mod.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: ROI Results Display (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-zinc-950 text-white p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Annual Impact</span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Verified SME Benchmark
              </span>
            </div>

            <div className="space-y-6 mt-6">
              {/* Hours Saved Metric */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Hours Saved / Month</p>
                    <p className="text-2xl font-black text-white">{Math.round(estimatedMonthlyHoursSaved)} hrs</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{totalWeeklyHoursSaved} hrs/wk</span>
              </div>

              {/* Monthly Cost Saved */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Monthly Operational Savings</p>
                    <p className="text-2xl font-black text-emerald-400">${monthlyCostSavings.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Annual Value Highlight */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
                <p className="text-xs text-slate-400">Estimated Yearly Total Return</p>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  ${yearlyCostSavings.toLocaleString()} / year
                </p>
                <p className="text-[11px] text-slate-400">
                  Based on eliminating {totalWeeklyHoursSaved * 52} manual hours of admin work per year.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onOpenInquiry}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6 text-sm rounded-xl shadow-lg"
          >
            Get Custom Automation Blueprint
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
