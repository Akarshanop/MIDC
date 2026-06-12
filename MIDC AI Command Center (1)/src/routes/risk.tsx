import { createFileRoute } from "@tanstack/react-router";
import { docs, compliances, scenarios } from "@/lib/midc-data";
import { Card, SectionHeader, Stat, Badge } from "@/components/ui-kit";
import { ShieldAlert, AlertTriangle, Clock, TrendingDown, Activity } from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "Risk Intelligence · MIDC AI Command" },
      { name: "description", content: "Identify operational bottlenecks before they impact investors — across compliance, approval, land and documentation risk." },
    ],
  }),
  component: RiskIntelligence,
});

const RISK_CATEGORIES = [
  { name: "Compliance", values: [62, 41, 28, 18, 8] },
  { name: "Approval", values: [44, 52, 31, 12, 4] },
  { name: "Land", values: [22, 38, 48, 26, 9] },
  { name: "Documentation", values: [71, 28, 14, 6, 2] },
  { name: "Investor Attrition", values: [12, 18, 24, 19, 9] },
];
const LEVELS = ["Low", "Guarded", "Elevated", "High", "Critical"];

function heatColor(v: number, max: number) {
  const t = v / max;
  // White → saffron → red
  if (t < 0.2) return "oklch(0.95 0.02 60)";
  if (t < 0.4) return "oklch(0.88 0.08 60)";
  if (t < 0.6) return "oklch(0.78 0.14 50)";
  if (t < 0.8) return "oklch(0.68 0.18 40)";
  return "oklch(0.58 0.22 27)";
}

function RiskIntelligence() {
  const max = Math.max(...RISK_CATEGORIES.flatMap((r) => r.values));
  const highRiskDocs = docs.filter((d) => d.Deficiency_Count >= 3 || d.Queue_Position > 30).slice(0, 8);
  const escalated = scenarios.filter((s) => s.Escalated_Flag === "Yes").slice(0, 6);
  const expiringCompliance = compliances.filter((c) => c.Renewal_Pending === "Yes").slice(0, 6);

  return (
    <div>
      <SectionHeader
        eyebrow="Section 03 · Risk Intelligence"
        title="Predict bottlenecks before they hit the investor"
        description="A real-time map of every operational risk surface — modelled across MAITRI, MILAAP, BPAMS and the DMS."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="High Risk Projects" value={highRiskDocs.length + 9} icon={ShieldAlert} tone="danger" delta="-3 vs last wk" />
        <Stat label="SLA Breaches" value={14} icon={Clock} tone="saffron" />
        <Stat label="Escalations" value={escalated.length + 4} icon={AlertTriangle} />
        <Stat label="Renewals Due 30d" value={expiringCompliance.length + 11} icon={Activity} tone="midnight" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Risk Heat Map" subtitle="Risk category × severity level" right={<Badge tone="saffron">5 dimensions</Badge>}>
          <div className="overflow-x-auto">
            <div className="grid min-w-[560px] grid-cols-[160px_repeat(5,1fr)] gap-1.5">
              <div />
              {LEVELS.map((l) => (
                <div key={l} className="px-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {l}
                </div>
              ))}
              {RISK_CATEGORIES.map((cat) => (
                <>
                  <div key={`${cat.name}-l`} className="flex items-center px-2 text-[12px] font-semibold text-foreground">
                    {cat.name}
                  </div>
                  {cat.values.map((v, i) => (
                    <div
                      key={`${cat.name}-${i}`}
                      className="group relative grid h-14 place-items-center rounded-lg text-[14px] font-bold transition hover:scale-[1.03] hover:shadow-lg"
                      style={{ background: heatColor(v, max), color: v / max > 0.5 ? "white" : "oklch(0.22 0.06 265)" }}
                    >
                      {v}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Predictive Intelligence" subtitle="AI forecast gauges">
          <div className="space-y-4">
            {[
              { label: "Project Delay Probability", v: 38, tone: "oklch(0.78 0.16 80)" },
              { label: "Investor Drop-off Risk", v: 22, tone: "oklch(0.68 0.18 47)" },
              { label: "Escalation Likelihood", v: 56, tone: "oklch(0.6 0.22 27)" },
            ].map((g) => (
              <div key={g.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-foreground">{g.label}</span>
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: g.tone }}>{g.v}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${g.v}%`, background: `linear-gradient(90deg, ${g.tone}, color-mix(in oklab, ${g.tone} 60%, white))` }} />
                </div>
              </div>
            ))}
            <div className="mt-2 h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "Health", value: 72, fill: "oklch(0.7 0.19 47)" }]} startAngle={210} endAngle={-30}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" background={{ fill: "oklch(0.94 0.01 250)" }} cornerRadius={20} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="oklch(0.22 0.06 265)">
                    72
                  </text>
                  <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="oklch(0.5 0.025 260)">
                    Operational Health
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-5">
        <Card title="Risk Queue" subtitle="High-risk projects, SLA breaches and escalated cases" right={<Badge tone="danger">{highRiskDocs.length} flagged</Badge>}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 font-semibold">Doc ID</th>
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 font-semibold">Investor</th>
                  <th className="pb-2 font-semibold">Officer</th>
                  <th className="pb-2 font-semibold">Queue</th>
                  <th className="pb-2 font-semibold">Defs</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {highRiskDocs.map((d) => {
                  const risk = Math.min(100, d.Deficiency_Count * 15 + (d.Queue_Position > 30 ? 40 : 0));
                  return (
                    <tr key={d.Doc_ID} className="border-b border-border/60 transition hover:bg-secondary/40">
                      <td className="py-2.5 font-mono text-[11px] text-muted-foreground">{d.Doc_ID}</td>
                      <td className="py-2.5 font-semibold text-foreground">{d.Document_Type}</td>
                      <td className="py-2.5 font-mono text-[11px]">{d.Investor_ID}</td>
                      <td className="py-2.5">{d.Scrutiny_Officer}</td>
                      <td className="py-2.5 tabular-nums">{d.Queue_Position}</td>
                      <td className="py-2.5"><Badge tone={d.Deficiency_Count > 3 ? "danger" : "warning"}>{d.Deficiency_Count}</Badge></td>
                      <td className="py-2.5"><Badge tone={d.Current_Status === "Approved" ? "success" : "warning"}>{d.Current_Status}</Badge></td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                            <div className="h-full" style={{ width: `${risk}%`, background: heatColor(risk, 100) }} />
                          </div>
                          <span className="text-[11px] font-semibold tabular-nums">{risk}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
