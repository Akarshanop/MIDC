import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  ShieldAlert,
  Bot,
  TrendingUp,
  CheckSquare,
  Search,
  Bell,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { investors, docs, scenarios } from "@/lib/midc-data";
import { CopilotPanel } from "./CopilotPanel";

const nav = [
  { to: "/", label: "Investor Intelligence", icon: LayoutDashboard },
  { to: "/projects", label: "Project Intelligence", icon: Building2 },
  { to: "/risk", label: "Risk Intelligence", icon: ShieldAlert },
  { to: "/agents", label: "Agent Command Center", icon: Bot },
  { to: "/analytics", label: "Analytics & Trends", icon: TrendingUp },
  { to: "/actions", label: "Action Center", icon: CheckSquare },
];

function LiveMetric({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="flex flex-col items-end leading-tight">
      <span className={`text-[15px] font-semibold tabular-nums ${accent ?? "text-foreground"}`}>{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [copilotOpen, setCopilotOpen] = useState(false);

  const activeInvestors = investors.filter((i) => i.MAITRI_Reg_Status !== "Rejected").length;
  const openProjects = docs.filter((d) => d.Current_Status !== "Approved").length;
  const highPriority = investors.filter((i) => i.Priority_Sector_Flag === "Yes" && i.Growth_Indicator_Score >= 6).length;
  const atRisk = docs.filter((d) => d.Deficiency_Count >= 4).length;
  const aiPending = scenarios.filter((s) => s.Resolution_Status !== "Resolved").length;

  return (
    <div className="min-h-screen bg-[var(--surface-2)] text-foreground">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[240px] flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--gradient-saffron)] text-white shadow-lg shadow-orange-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[13px] font-bold tracking-tight">MIDC</div>
            <div className="truncate text-[10px] uppercase tracking-wider text-sidebar-foreground/60">AI Command</div>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-0.5 px-3">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${
                  active
                    ? "bg-sidebar-accent text-white shadow-inner"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-saffron" : ""}`} />
                <span className="truncate">{item.label}</span>
                {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-saffron" />}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/40 p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium text-saffron">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-saffron/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
            </span>
            All systems operational
          </div>
          <div className="mt-2 text-[10px] leading-relaxed text-sidebar-foreground/60">
            5 autonomous agents · 1,205 records under management
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-[240px]">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-border/60 bg-white/70 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-4 px-5">
            <div className="hidden text-[13px] text-muted-foreground lg:block">
              <span className="font-semibold text-foreground">AI Operational Intelligence Center</span>
              <span className="mx-2 text-border">/</span>
              <span>Maharashtra Industrial Development Corporation</span>
            </div>
            <div className="relative ml-auto hidden w-[320px] md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search investors, plots, projects…"
                className="h-9 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-[13px] outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/20"
              />
            </div>
            <button
              onClick={() => setCopilotOpen((o) => !o)}
              className="group flex h-9 items-center gap-2 rounded-lg bg-[var(--gradient-midnight)] px-3 text-[12px] font-medium text-white shadow-lg shadow-midnight/20 transition hover:shadow-xl"
            >
              <Sparkles className="h-3.5 w-3.5 text-saffron" />
              AI Copilot
            </button>
            <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-white text-muted-foreground transition hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-saffron ring-2 ring-white" />
            </button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-midnight)] text-[12px] font-bold text-white">
              RS
            </div>
          </div>
          {/* Live metrics row */}
          <div className="flex items-center gap-6 overflow-x-auto border-t border-border/60 bg-gradient-to-r from-white via-[var(--saffron-soft)]/30 to-white px-5 py-2.5">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-saffron">
              <span className="relative grid h-1.5 w-1.5 place-items-center">
                <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-saffron/70" />
                <span className="h-1 w-1 rounded-full bg-saffron" />
              </span>
              Live
            </span>
            <div className="ml-auto flex items-center gap-6">
              <LiveMetric label="Active Investors" value={activeInvestors} />
              <div className="h-6 w-px bg-border" />
              <LiveMetric label="Open Projects" value={openProjects} />
              <div className="h-6 w-px bg-border" />
              <LiveMetric label="High Priority" value={highPriority} accent="text-saffron" />
              <div className="h-6 w-px bg-border" />
              <LiveMetric label="At-Risk" value={atRisk} accent="text-destructive" />
              <div className="h-6 w-px bg-border" />
              <LiveMetric label="AI Pending" value={aiPending} accent="text-info" />
            </div>
          </div>
        </header>

        <main className="px-5 py-6">{children}</main>
      </div>

      {/* Floating copilot */}
      <CopilotPanel open={copilotOpen} onClose={() => setCopilotOpen(false)} />

      {/* Floating trigger when closed */}
      {!copilotOpen && (
        <button
          onClick={() => setCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-[var(--gradient-saffron)] text-white shadow-2xl shadow-orange-500/40 transition hover:scale-105 animate-pulse-ring"
          aria-label="Open AI Copilot"
        >
          <Sparkles className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
