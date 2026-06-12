import { createFileRoute } from "@tanstack/react-router";
import { Card, SectionHeader, Stat, Badge } from "@/components/ui-kit";
import { Bot, Network, Activity, Zap, Brain, Send, BarChart3, GitBranch, ArrowRight } from "lucide-react";
import { ExecutiveOverview } from "@/components/ExecutiveOverview";
import { scenarios } from "@/lib/midc-data";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Agent Command Center · MIDC AI Command" },
      { name: "description", content: "Visualize the autonomous AI agents resolving investor queries end-to-end on Airgen.ai." },
    ],
  }),
  component: AgentCommand,
});

const AGENTS = [
  { id: "orchestrator", name: "Orchestrator", icon: Network, role: "Routes & coordinates", tasks: 1284, ms: 142, success: 99.2, color: "oklch(0.7 0.19 47)" },
  { id: "intent", name: "Intent Agent", icon: Brain, role: "Classifies query intent", tasks: 1284, ms: 86, success: 97.8, color: "oklch(0.62 0.15 235)" },
  { id: "knowledge", name: "Knowledge Agent", icon: BarChart3, role: "Retrieves from KBs", tasks: 1102, ms: 312, success: 96.4, color: "oklch(0.32 0.08 260)" },
  { id: "engagement", name: "Engagement Agent", icon: Send, role: "Email · WhatsApp · Chat", tasks: 942, ms: 198, success: 98.6, color: "oklch(0.68 0.15 155)" },
  { id: "analytics", name: "Analytics Agent", icon: Activity, role: "Dashboards & alerts", tasks: 386, ms: 412, success: 99.5, color: "oklch(0.78 0.16 80)" },
];

const FLOW = [
  { step: "Investor Query", who: "Channel" },
  { step: "Intent Agent", who: "intent" },
  { step: "Knowledge Agent", who: "knowledge" },
  { step: "Engagement Agent", who: "engagement" },
  { step: "Officer Assignment", who: "Orchestrator" },
  { step: "Dashboard Update", who: "analytics" },
];

function AgentCommand() {
  const recent = scenarios.slice(0, 7);

  return (
    <div>
      <ExecutiveOverview />

      <SectionHeader
        eyebrow="Section 04 · Agent Command Center"
        title="Autonomous agents, observable end-to-end"
        description="Every investor query flows through a coordinated mesh of AI agents on Airgen.ai. Monitor health, throughput and decisions in real time."
      />


      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Agents Online" value="5 / 5" icon={Bot} tone="success" />
        <Stat label="Tasks Today" value="4,998" delta="+12.4%" icon={Zap} tone="saffron" />
        <Stat label="Avg Response" value="190ms" icon={Activity} />
        <Stat label="Success Rate" value="98.3%" icon={GitBranch} tone="midnight" />
      </div>

      {/* Topology */}
      <div className="mt-5">
        <Card title="Agent Topology" subtitle="Live mesh — Orchestrator coordinating 4 specialized agents">
          <div className="relative h-[360px] w-full">
            {/* Connecting lines */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {[{x:25,y:25},{x:75,y:25},{x:25,y:75},{x:75,y:75}].map((p, i) => (
                <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} stroke="oklch(0.7 0.19 47 / 0.3)" strokeWidth="0.25" strokeDasharray="0.6 0.6">
                  <animate attributeName="stroke-dashoffset" from="0" to="-2.4" dur="2s" repeatCount="indefinite" />
                </line>
              ))}
            </svg>
            {/* Orchestrator center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <AgentNode agent={AGENTS[0]} primary />
            </div>
            {[
              { agent: AGENTS[1], pos: "left-[20%] top-[18%]" },
              { agent: AGENTS[2], pos: "right-[20%] top-[18%]" },
              { agent: AGENTS[3], pos: "left-[20%] bottom-[18%]" },
              { agent: AGENTS[4], pos: "right-[20%] bottom-[18%]" },
            ].map((n) => (
              <div key={n.agent.id} className={`absolute ${n.pos} -translate-x-1/2 -translate-y-1/2`}>
                <AgentNode agent={n.agent} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Live Workflow" subtitle="Investor query → resolution pipeline" right={<Badge tone="success">Streaming</Badge>}>
          <div className="flex flex-wrap items-center gap-2">
            {FLOW.map((f, i) => (
              <>
                <div key={f.step} className="flex items-center gap-2 rounded-xl border border-border bg-gradient-to-br from-white to-secondary/50 px-3 py-2 shadow-sm">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-saffron/10 text-saffron">
                    <span className="text-[11px] font-bold">{i + 1}</span>
                  </div>
                  <div className="leading-tight">
                    <div className="text-[12px] font-semibold text-foreground">{f.step}</div>
                    <div className="text-[10px] text-muted-foreground">{f.who}</div>
                  </div>
                </div>
                {i < FLOW.length - 1 && <ArrowRight key={`${i}-arrow`} className="h-3.5 w-3.5 text-saffron" />}
              </>
            ))}
          </div>

          <div className="mt-5 space-y-2">
            {recent.map((s) => (
              <div key={s.Scenario_ID} className="flex items-start gap-3 rounded-xl border border-border bg-white p-3 transition hover:border-saffron/40">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--gradient-midnight)] text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-mono text-muted-foreground">{s.Scenario_ID}</span>
                    <Badge tone={s.Complexity_Level === "High" ? "danger" : s.Complexity_Level === "Medium" ? "warning" : "success"}>{s.Complexity_Level}</Badge>
                    <Badge tone="info">{s.Target_Platform}</Badge>
                    {s.Escalated_Flag === "Yes" && <Badge tone="danger">Escalated</Badge>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] font-medium text-foreground">{s.User_Query_EN}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] italic text-muted-foreground">
                    → {s.AI_Resolution_Summary}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold tabular-nums text-saffron">{s.Feedback_Score?.toFixed(1) ?? "—"}</div>
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">CSAT</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Agent Health" subtitle="Last 24 hours">
          <div className="space-y-2.5">
            {AGENTS.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.id} className="rounded-xl border border-border bg-white p-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${a.color}20`, color: a.color }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-semibold text-foreground">{a.name}</div>
                      <div className="truncate text-[10px] text-muted-foreground">{a.role}</div>
                    </div>
                    <span className="grid h-2 w-2 place-items-center">
                      <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/60" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1 text-center">
                    <Mini label="Tasks" value={a.tasks.toLocaleString()} />
                    <Mini label="Avg ms" value={`${a.ms}`} />
                    <Mini label="Success" value={`${a.success}%`} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary/60 py-1">
      <div className="text-[11px] font-bold tabular-nums text-foreground">{value}</div>
      <div className="text-[8px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function AgentNode({ agent, primary }: { agent: (typeof AGENTS)[number]; primary?: boolean }) {
  const Icon = agent.icon;
  return (
    <div className={`relative w-[140px] rounded-2xl border bg-white p-3 text-center shadow-lg transition hover:scale-105 ${primary ? "border-saffron/40 shadow-orange-500/20" : "border-border"}`}>
      {primary && <span className="absolute -inset-0.5 -z-10 rounded-2xl bg-[var(--gradient-saffron)] opacity-30 blur-md" />}
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${agent.color}20`, color: agent.color }}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-1.5 text-[12px] font-bold text-foreground">{agent.name}</div>
      <div className="text-[9px] text-muted-foreground">{agent.role}</div>
      <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-emerald-600">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        {agent.success}%
      </div>
    </div>
  );
}
