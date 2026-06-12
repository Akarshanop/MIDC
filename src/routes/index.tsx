import { createFileRoute } from "@tanstack/react-router";
import { investors, fmtCr, fmtNum } from "@/lib/midc-data";
import { Card, SectionHeader, Stat, Badge } from "@/components/ui-kit";
import { MaharashtraMap } from "@/components/MaharashtraMap";
import {
  Users,
  TrendingUp,
  Globe2,
  Sparkles,
  ArrowRight,
  Activity,
  Building2,
  MapPin,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Investor Intelligence · MIDC AI Command" },
      {
        name: "description",
        content: "Complete visibility into investor engagement, intent scoring and spatial demand across Maharashtra.",
      },
    ],
  }),
  component: InvestorIntelligence,
});

const FUNNEL = [
  { stage: "Lead", count: 412, color: "oklch(0.85 0.06 60)" },
  { stage: "Interested", count: 312, color: "oklch(0.78 0.12 55)" },
  { stage: "Evaluation", count: 218, color: "oklch(0.72 0.16 50)" },
  { stage: "Site Visit", count: 156, color: "oklch(0.68 0.18 47)" },
  { stage: "Proposal", count: 98, color: "oklch(0.6 0.2 42)" },
  { stage: "Approval", count: 64, color: "oklch(0.5 0.18 38)" },
  { stage: "Confirmed", count: 41, color: "oklch(0.32 0.08 260)" },
];

const ACTIVITY = [
  { t: "2 min ago", text: "New inquiry from Bosch India — Aerospace components, Pune", tone: "saffron" as const },
  { t: "9 min ago", text: "Site visit completed at Chakan MIDC (PLOT-0085) by Tata Electronics", tone: "info" as const },
  { t: "14 min ago", text: "Meeting requested by Siemens — Renewable Energy, Aurangabad", tone: "info" as const },
  { t: "23 min ago", text: "Escalation: INV-0087 land allocation delay (Officer_5)", tone: "danger" as const },
  { t: "31 min ago", text: "Proposal submitted — Mahindra EV Manufacturing, Nashik (₹1,240 Cr)", tone: "success" as const },
  { t: "48 min ago", text: "AI generated 12 follow-up nudges via WhatsApp channel", tone: "saffron" as const },
  { t: "1 hr ago", text: "MAITRI registration approved for INV-0152 (Pharma, Satara)", tone: "success" as const },
];

function InvestorIntelligence() {
  const totalInv = investors.reduce((s, i) => s + (i.Proposed_Investment_Cr ?? 0), 0);
  const totalEmp = investors.reduce((s, i) => s + (i.Proposed_Employment ?? 0), 0);
  const priority = investors.filter((i) => i.Priority_Sector_Flag === "Yes").length;

  // Sector breakdown
  const sectorMap = new Map<string, number>();
  investors.forEach((i) => sectorMap.set(i.Target_Sector, (sectorMap.get(i.Target_Sector) ?? 0) + i.Proposed_Investment_Cr));
  const sectorData = [...sectorMap.entries()]
    .map(([sector, value]) => ({ sector, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  // District heatmap
  const districtMap = new Map<string, number>();
  investors.forEach((i) => districtMap.set(i.District, (districtMap.get(i.District) ?? 0) + 1));
  const mapPoints = [...districtMap.entries()].map(([district, value]) => ({ district, value }));

  // Top investor cards
  const top = [...investors]
    .sort((a, b) => b.Growth_Indicator_Score - a.Growth_Indicator_Score)
    .slice(0, 6);

  const sectorColors = ["oklch(0.7 0.19 47)", "oklch(0.32 0.08 260)", "oklch(0.62 0.15 235)", "oklch(0.68 0.15 155)", "oklch(0.78 0.16 80)", "oklch(0.55 0.18 30)", "oklch(0.45 0.1 280)"];

  return (
    <div>
      <SectionHeader
        eyebrow="Section 01 · Investor Intelligence"
        title="Investor engagement lifecycle, in real time"
        description="Track every lead from first inquiry to investment confirmation across Maharashtra. Powered by Airgen.ai agents on MILAAP, SWC, BPAMS, MAITRI 2.0 and DMS."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total Investors" value={fmtNum(investors.length)} delta="+12 this week" icon={Users} />
        <Stat label="Pipeline Value" value={fmtCr(totalInv)} delta="+8.4% MoM" icon={TrendingUp} tone="saffron" />
        <Stat label="Employment Pledged" value={fmtNum(totalEmp)} delta="+1,340 jobs" icon={Building2} />
        <Stat label="Priority Sector" value={fmtNum(priority)} delta="EV · Semi · Pharma" icon={Sparkles} tone="midnight" />
      </div>

      {/* Funnel + Insight cards */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Investor Funnel" subtitle="Lead → Confirmed · last 90 days" right={<Badge tone="saffron">Live</Badge>}>
          <div className="space-y-2.5">
            {FUNNEL.map((f, i) => {
              const pct = (f.count / FUNNEL[0].count) * 100;
              const conv = i > 0 ? ((f.count / FUNNEL[i - 1].count) * 100).toFixed(0) : null;
              return (
                <div key={f.stage} className="group">
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-foreground">{f.stage}</span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      {conv && <span className="text-saffron">{conv}% →</span>}
                      <span className="font-semibold text-foreground tabular-nums">{f.count}</span>
                    </span>
                  </div>
                  <div className="h-7 overflow-hidden rounded-lg bg-secondary">
                    <div
                      className="relative h-full rounded-lg transition-all duration-700 ease-out"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${f.color}, color-mix(in oklab, ${f.color} 70%, white))` }}
                    >
                      <div className="absolute inset-0 animate-shimmer opacity-40" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-saffron/30 bg-gradient-to-br from-[var(--saffron-soft)] via-white to-white p-4 shadow-[var(--shadow-glass)]">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-saffron">
              <Sparkles className="h-3 w-3" /> AI Insight
            </div>
            <div className="mt-2 text-[15px] font-semibold leading-snug text-foreground">
              EV manufacturing interest <span className="text-saffron">↑ 34%</span> this month — concentrated in Pune & Aurangabad corridors.
            </div>
            <button className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-midnight hover:text-saffron">
              Open sector report <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-[var(--gradient-midnight)] p-4 text-white shadow-[var(--shadow-glass)]">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-saffron">
              <Activity className="h-3 w-3" /> Action Required
            </div>
            <div className="mt-2 text-[15px] font-semibold leading-snug">
              3 semiconductor investors require immediate follow-up to prevent drop-off in next 48 hours.
            </div>
            <button className="mt-3 inline-flex items-center gap-1 rounded-lg bg-saffron px-3 py-1.5 text-[11px] font-semibold text-white">
              Assign Engagement Agent <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Map + Activity */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Spatial Intelligence"
          subtitle="Investor interest density by district"
          right={
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-saffron" /> High</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-midnight" /> Active</span>
            </div>
          }
        >
          <MaharashtraMap points={mapPoints} highlight={["Pune", "Mumbai", "Nashik", "Aurangabad", "Nagpur"]} />
        </Card>

        <Card title="Real-time Activity" subtitle="Stream from MAITRI 2.0 + Portal Chatbot" right={<Badge tone="success">Streaming</Badge>}>
          <div className="-mx-2 max-h-[440px] space-y-1.5 overflow-y-auto pr-1">
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex gap-2.5 rounded-lg px-2 py-2 transition hover:bg-secondary/60 animate-float-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="mt-1.5 grid h-2 w-2 shrink-0 place-items-center">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-saffron/40" />
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      a.tone === "saffron"
                        ? "bg-saffron"
                        : a.tone === "danger"
                        ? "bg-destructive"
                        : a.tone === "success"
                        ? "bg-emerald-500"
                        : "bg-info"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] leading-snug text-foreground">{a.text}</p>
                  <span className="text-[10px] text-muted-foreground">{a.t}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sectors + Investor cards */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card title="Pipeline Value by Sector" subtitle="₹ Crore committed" className="lg:col-span-1">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="sector" type="category" axisLine={false} tickLine={false} width={88} tick={{ fontSize: 11, fill: "oklch(0.4 0.04 260)" }} />
                <Tooltip
                  cursor={{ fill: "oklch(0.96 0.01 250)" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }}
                  formatter={(v: number) => [fmtCr(v), "Pipeline"]}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {sectorData.map((_, i) => (
                    <Cell key={i} fill={sectorColors[i % sectorColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2" title="Top Investor Profiles" subtitle="Ranked by Growth Indicator Score" right={<Badge tone="saffron">AI scored</Badge>}>
          <div className="grid gap-3 sm:grid-cols-2">
            {top.map((i) => (
              <div key={i.Investor_ID} className="group rounded-xl border border-border bg-gradient-to-br from-white to-secondary/30 p-3 transition hover:border-saffron/40 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-foreground">{i.Company_Name}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Globe2 className="h-3 w-3" /> {i.Target_Sector}
                      <span className="text-border">·</span>
                      <MapPin className="h-3 w-3" /> {i.District}
                    </div>
                  </div>
                  <div className="shrink-0 rounded-lg bg-saffron/10 px-2 py-1 text-center">
                    <div className="text-[14px] font-bold leading-none text-saffron">{i.Growth_Indicator_Score.toFixed(1)}</div>
                    <div className="text-[8px] uppercase tracking-wider text-saffron/70">Intent</div>
                  </div>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <div className="text-muted-foreground">Investment</div>
                    <div className="font-semibold text-foreground">{fmtCr(i.Proposed_Investment_Cr)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Jobs</div>
                    <div className="font-semibold text-foreground">{fmtNum(i.Proposed_Employment)}</div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {i.Priority_Sector_Flag === "Yes" && <Badge tone="saffron">Priority Sector</Badge>}
                  <Badge tone={i.MAITRI_Reg_Status === "Registered" ? "success" : "warning"}>{i.MAITRI_Reg_Status}</Badge>
                  <Badge tone={i.KYC_Status === "Complete" ? "success" : "warning"}>KYC: {i.KYC_Status}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] italic text-muted-foreground">
                  <Sparkles className="mr-1 inline h-2.5 w-2.5 text-saffron" />
                  {i.Notes}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
