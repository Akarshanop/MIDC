import { createFileRoute } from "@tanstack/react-router";
import { Card, SectionHeader, Stat, Badge } from "@/components/ui-kit";
import { scenarios, docs, investors } from "@/lib/midc-data";
import { CheckSquare, Clock, AlertTriangle, UserPlus, Calendar, ArrowUpRight, Flame } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/actions")({
  head: () => ({
    meta: [
      { title: "Action Center · MIDC AI Command" },
      { name: "description", content: "Officer follow-up queue with AI-prioritized recommendations and one-click actions." },
    ],
  }),
  component: ActionCenter,
});

type Action = {
  id: string;
  priority: number;
  title: string;
  reason: string;
  due: string;
  assignee: string;
  category: "Follow-up" | "Escalation" | "Approval" | "Site Visit" | "Compliance";
  investor?: string;
};

function buildActions(): Action[] {
  const out: Action[] = [];
  scenarios.slice(0, 12).forEach((s, i) => {
    out.push({
      id: `A-${s.Scenario_ID}`,
      priority: Math.min(100, 50 + (s.Escalated_Flag === "Yes" ? 30 : 0) + (10 - (s.Feedback_Score ?? 5)) * 4),
      title: s.User_Query_EN.slice(0, 80),
      reason: s.AI_Resolution_Summary?.slice(0, 110) ?? "AI flagged for follow-up",
      due: i < 4 ? "Today" : i < 8 ? "Tomorrow" : "This week",
      assignee: `Officer_${(i % 12) + 1}`,
      category: s.Escalated_Flag === "Yes" ? "Escalation" : s.Category.includes("Land") ? "Site Visit" : s.Category.includes("Compliance") ? "Compliance" : "Follow-up",
      investor: s.Investor_ID_Ref,
    });
  });
  docs.filter((d) => d.Deficiency_Count >= 3).slice(0, 4).forEach((d, i) => {
    out.push({
      id: `A-${d.Doc_ID}`,
      priority: 70 + d.Deficiency_Count * 4,
      title: `Resolve ${d.Document_Type} for ${d.Investor_ID}`,
      reason: d.Remarks_by_Officer || `${d.Deficiency_Count} deficiencies pending closure`,
      due: i < 2 ? "Today" : "Tomorrow",
      assignee: d.Scrutiny_Officer,
      category: "Approval",
      investor: d.Investor_ID,
    });
  });
  return out.sort((a, b) => b.priority - a.priority);
}

const tabs = ["All", "Today", "Escalation", "Approval", "Follow-up", "Compliance"] as const;

function ActionCenter() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [done, setDone] = useState<Set<string>>(new Set());

  const all = useMemo(buildActions, []);
  const filtered = all.filter((a) => {
    if (tab === "All") return true;
    if (tab === "Today") return a.due === "Today";
    return a.category === tab;
  });

  function markDone(id: string) {
    setDone((d) => new Set(d).add(id));
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Action Center"
        title="Your prioritized officer queue"
        description="The Orchestrator Agent surfaces the work that matters most — assign, schedule, or escalate in one click."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Open Actions" value={all.length - done.size} icon={CheckSquare} tone="saffron" />
        <Stat label="Due Today" value={all.filter((a) => a.due === "Today").length} icon={Clock} />
        <Stat label="Escalations" value={all.filter((a) => a.category === "Escalation").length} icon={AlertTriangle} tone="danger" />
        <Stat label="Completed Today" value={done.size} icon={CheckSquare} tone="success" />
      </div>

      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition ${
              tab === t
                ? "border-saffron bg-saffron/10 text-saffron"
                : "border-border bg-white text-muted-foreground hover:border-saffron/40 hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card className="mt-3">
        <div className="space-y-2">
          {filtered.map((a) => {
            const isDone = done.has(a.id);
            const inv = investors.find((i) => i.Investor_ID === a.investor);
            return (
              <div
                key={a.id}
                className={`group flex flex-col gap-3 rounded-xl border bg-gradient-to-br p-3 transition lg:flex-row lg:items-center ${
                  isDone
                    ? "border-emerald-200 from-emerald-50/40 to-white opacity-60"
                    : a.priority > 80
                    ? "border-saffron/30 from-[var(--saffron-soft)]/40 to-white hover:shadow-md"
                    : "border-border from-white to-secondary/30 hover:border-saffron/30 hover:shadow-sm"
                }`}
              >
                <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {a.priority > 80 && <Flame className="h-3 w-3 text-saffron" />} Priority
                  </div>
                  <div className={`text-xl font-bold tabular-nums ${a.priority > 80 ? "text-saffron" : "text-foreground"}`}>{a.priority}</div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={a.category === "Escalation" ? "danger" : a.category === "Approval" ? "info" : "saffron"}>{a.category}</Badge>
                    <Badge>{a.due}</Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">{a.id}</span>
                    {inv && <span className="text-[11px] font-semibold text-foreground">· {inv.Company_Name}</span>}
                  </div>
                  <div className={`mt-1 line-clamp-1 text-[13px] font-semibold ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {a.title}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] italic text-muted-foreground">{a.reason}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 text-[11px] font-semibold text-foreground transition hover:border-saffron hover:text-saffron">
                    <UserPlus className="h-3 w-3" /> Assign
                  </button>
                  <button className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 text-[11px] font-semibold text-foreground transition hover:border-saffron hover:text-saffron">
                    <Calendar className="h-3 w-3" /> Schedule
                  </button>
                  <button className="flex h-8 items-center gap-1.5 rounded-lg border border-destructive/20 bg-red-50 px-2.5 text-[11px] font-semibold text-destructive transition hover:bg-red-100">
                    <ArrowUpRight className="h-3 w-3" /> Escalate
                  </button>
                  <button
                    onClick={() => markDone(a.id)}
                    disabled={isDone}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-[var(--gradient-saffron)] px-3 text-[11px] font-semibold text-white shadow disabled:opacity-50"
                  >
                    <CheckSquare className="h-3 w-3" /> {isDone ? "Done" : "Resolve"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
