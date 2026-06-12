import { useMemo, useState } from "react";
import { Drawer } from "./Drawer";
import { Card, Badge } from "./ui-kit";
import { investors, docs, scenarios, compliances, plots } from "@/lib/midc-data";
import {
  Users,
  FileCheck2,
  Sparkles,
  Clock,
  ShieldAlert,
  Gauge,
  Mail,
  MessageCircle,
  MonitorSmartphone,
  TrendingUp,
  TrendingDown,
  Database,
  Building2,
  Landmark,
  FileStack,
  Globe2,
  Radio,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Legend,
} from "recharts";

/* ------------------------------------------------------------------ */
/* Platform sources                                                    */
/* ------------------------------------------------------------------ */

type PlatformKey = "MAITRI" | "MILAAP" | "SWC" | "BPAMS" | "PORTAL";

const PLATFORMS: {
  key: PlatformKey;
  name: string;
  full: string;
  url: string;
  icon: typeof Landmark;
  records: number;
  todayEvents: number;
  uptime: number;
  feeds: string[];
  contributes: string;
  spark: number[];
}[] = [
  {
    key: "MAITRI",
    name: "MAITRI 2.0",
    full: "Investment Facilitation · 119 services · 15 depts",
    url: "maitri.mahaonline.gov.in",
    icon: Landmark,
    records: 200,
    todayEvents: 47,
    uptime: 99.8,
    feeds: ["Investor Profiles", "Sector Intelligence", "Approval History"],
    contributes:
      "Investor onboarding, sector intent, EoI tracking, MAITRI registration status",
    spark: [12, 18, 22, 19, 28, 34, 31, 42, 47],
  },
  {
    key: "MILAAP",
    name: "MILAAP",
    full: "Land Allotment System · Plot data · EMD · BOP",
    url: "milaap.midcindia.org",
    icon: Building2,
    records: plots.length,
    todayEvents: 31,
    uptime: 99.9,
    feeds: ["Land / Plot Registry", "GIS / Zones", "EMD Tracker"],
    contributes:
      "Plot allotment, queue position, EMD payments, GIS coordinates, zone classification",
    spark: [8, 14, 12, 18, 22, 24, 28, 26, 31],
  },
  {
    key: "SWC",
    name: "SWC",
    full: "Single Window Clearance · Permits · NOC",
    url: "services.midcindia.org",
    icon: FileStack,
    records: compliances.length,
    todayEvents: 24,
    uptime: 99.5,
    feeds: ["Approval History", "Document Store", "Policy & GR Index"],
    contributes:
      "Multi-dept permits, Fire/Pollution/Labour NOCs, compliance renewals",
    spark: [6, 9, 11, 14, 13, 18, 20, 22, 24],
  },
  {
    key: "BPAMS",
    name: "BPAMS",
    full: "Building Plan Approval · AutoDCR · CAD",
    url: "bpams.midcindia.org",
    icon: FileCheck2,
    records: docs.length,
    todayEvents: 19,
    uptime: 99.7,
    feeds: ["Document Store", "Approval History"],
    contributes:
      "Building plans, AutoDCR scrutiny, CAD validation, layout approvals",
    spark: [4, 7, 9, 8, 12, 15, 14, 17, 19],
  },
  {
    key: "PORTAL",
    name: "Investor Portal",
    full: "customer.midcindia.org · Inquiries · Grievances",
    url: "customer.midcindia.org",
    icon: Globe2,
    records: scenarios.length,
    todayEvents: 89,
    uptime: 99.9,
    feeds: ["Investor Profiles", "Document Store"],
    contributes:
      "Helpdesk tickets, MAITRI logins, grievances, WhatsApp/chat conversations",
    spark: [22, 31, 28, 45, 52, 61, 70, 82, 89],
  },
];

type KPIKey =
  | "investors"
  | "plots"
  | "resolved"
  | "resolution"
  | "compliance"
  | "confidence"
  | "channel"
  | "sources"
  | null;

const KPIS = [
  {
    key: "investors" as const,
    label: "Total Registered Investors",
    value: 200,
    delta: "+23% YoY",
    deltaUp: true,
    icon: Users,
    sourceTag: "MAITRI · Portal",
    spark: [142, 156, 168, 175, 188, 200],
  },
  {
    key: "plots" as const,
    label: "Active Plot Applications",
    value: 87,
    delta: "+15% MoM",
    deltaUp: true,
    icon: FileCheck2,
    sourceTag: "MILAAP · BPAMS",
    spark: [54, 61, 68, 72, 80, 87],
  },
  {
    key: "resolved" as const,
    label: "AI Queries Resolved",
    value: 210,
    delta: "95% resolution",
    deltaUp: true,
    icon: Sparkles,
    sourceTag: "All Channels",
    spark: [120, 140, 158, 172, 195, 210],
  },
  {
    key: "resolution" as const,
    label: "Avg Resolution Time",
    value: "6.2h",
    delta: "-40% vs manual",
    deltaUp: false,
    icon: Clock,
    sourceTag: "Cross-platform",
    spark: [10.4, 9.6, 8.2, 7.5, 6.8, 6.2],
  },
  {
    key: "compliance" as const,
    label: "Compliance Alerts",
    value: 47,
    delta: "12 expiring <30d",
    deltaUp: false,
    icon: ShieldAlert,
    sourceTag: "SWC · MAITRI",
    spark: [32, 38, 41, 44, 45, 47],
  },
  {
    key: "confidence" as const,
    label: "Agent Confidence",
    value: "87%",
    delta: "+3.2 pts MoM",
    deltaUp: true,
    icon: Gauge,
    sourceTag: "Inference Engine",
    spark: [78, 80, 82, 84, 85, 87],
  },
];

const CHANNELS = [
  {
    name: "Email",
    icon: Mail,
    received: 78,
    resolved: 71,
    escalated: 7,
    avgMin: 42,
    csat: 4.6,
    top: "Multi-Dept Complex",
    color: "oklch(0.62 0.15 235)",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    received: 89,
    resolved: 88,
    escalated: 1,
    avgMin: 3,
    csat: 4.8,
    top: "Quick Status Check",
    color: "oklch(0.68 0.15 155)",
  },
  {
    name: "Portal Chatbot",
    icon: MonitorSmartphone,
    received: 43,
    resolved: 40,
    escalated: 3,
    avgMin: 8,
    csat: 4.7,
    top: "Land Allotment",
    color: "oklch(0.7 0.19 47)",
  },
];

export function ExecutiveOverview() {
  const [open, setOpen] = useState<KPIKey>(null);
  const [channel, setChannel] = useState<(typeof CHANNELS)[number] | null>(null);
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number] | null>(null);

  const totalReceived = CHANNELS.reduce((s, c) => s + c.received, 0);
  const totalResolved = CHANNELS.reduce((s, c) => s + c.resolved, 0);
  const totalEsc = CHANNELS.reduce((s, c) => s + c.escalated, 0);
  const avgCsat = (CHANNELS.reduce((s, c) => s + c.csat, 0) / CHANNELS.length).toFixed(1);

  const platformPie = PLATFORMS.map((p) => ({
    name: p.name,
    value: p.todayEvents,
    fill: `var(--color-saffron)`,
  }));
  const totalToday = PLATFORMS.reduce((s, p) => s + p.todayEvents, 0);

  return (
    <section className="mb-6">
      {/* Themed header strip — matches saffron/midnight system */}
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-[var(--gradient-midnight)] px-5 py-4 text-white shadow-[var(--shadow-glass)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-saffron">
            <Sparkles className="h-3 w-3" /> Live Snapshot
          </div>
          <h2 className="mt-2 text-[20px] font-bold tracking-tight">
            Executive Dashboard — Operational Pulse
          </h2>
          <p className="mt-0.5 text-[11px] text-white/70">
            Integrated across MAITRI · MILAAP · SWC · BPAMS · Investor Portal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen("sources")}
            className="rounded-lg border border-saffron/30 bg-saffron/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-saffron transition hover:bg-saffron/20"
          >
            <Database className="mr-1 inline h-3 w-3" /> Source Map
          </button>
          <div className="flex items-center gap-1.5 text-[11px] text-white/80">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-saffron/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
            </span>
            Streaming · 30s
          </div>
        </div>
      </div>

      {/* Platform sources */}
      <Card
        title="Live Data Sources · Today's Inflow"
        subtitle={`${totalToday} events ingested today across 5 platforms`}
        right={
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-saffron">
            <Radio className="h-3 w-3" /> Live
          </span>
        }
        className="mb-4"
      >
        <div className="grid gap-2.5 md:grid-cols-3 lg:grid-cols-5">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            const sparkData = p.spark.map((v, i) => ({ i, v }));
            const pct = Math.round((p.todayEvents / totalToday) * 100);
            return (
              <button
                key={p.key}
                onClick={() => setPlatform(p)}
                className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-white to-secondary/40 p-3 text-left transition hover:-translate-y-0.5 hover:border-saffron/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-saffron/10 text-saffron">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>
                <div className="mt-2 truncate text-[13px] font-bold text-foreground">
                  {p.name}
                </div>
                <div className="truncate text-[10px] text-muted-foreground">{p.url}</div>
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <div className="text-[20px] font-bold leading-none tabular-nums text-foreground">
                      {p.todayEvents}
                    </div>
                    <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      events · {pct}%
                    </div>
                  </div>
                  <div className="h-8 w-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData}>
                        <defs>
                          <linearGradient id={`grad-${p.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-saffron)" stopOpacity={0.55} />
                            <stop offset="100%" stopColor="var(--color-saffron)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke="var(--color-saffron)"
                          strokeWidth={1.5}
                          fill={`url(#grad-${p.key})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* KPI grid */}
      <Card title="Key Performance Indicators" subtitle="Click any KPI for a detailed brief">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {KPIS.map((k) => {
            const Icon = k.icon;
            const sparkData = k.spark.map((v, i) => ({ i, v }));
            return (
              <button
                key={k.key}
                onClick={() => setOpen(k.key)}
                className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-white to-secondary/40 p-4 text-left transition hover:-translate-y-0.5 hover:border-saffron/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                    {k.label}
                  </span>
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-saffron/10 text-saffron">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div className="text-[28px] font-bold leading-none text-foreground">
                    {k.value}
                  </div>
                  <div className="h-9 w-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkData}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke="var(--color-saffron)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 text-[10.5px] font-semibold ${
                      k.deltaUp ? "text-emerald-600" : "text-orange-600"
                    }`}
                  >
                    {k.deltaUp ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {k.delta}
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {k.sourceTag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Channel performance */}
      <Card
        title="Platform Metrics by Channel"
        subtitle="Email · WhatsApp · Portal Chatbot"
        right={
          <button
            onClick={() => setOpen("channel")}
            className="text-[10.5px] font-semibold uppercase tracking-wider text-saffron hover:underline"
          >
            Comparative chart →
          </button>
        }
        className="mt-4"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2 text-left">Channel</th>
                <th className="px-3 py-2 text-right">Received</th>
                <th className="px-3 py-2 text-right">Resolved</th>
                <th className="px-3 py-2 text-right">Escalated</th>
                <th className="px-3 py-2 text-right">Avg (min)</th>
                <th className="px-3 py-2 text-right">CSAT</th>
                <th className="px-3 py-2 text-left">Top Category</th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => {
                const Icon = c.icon;
                const pct = Math.round((c.resolved / c.received) * 100);
                return (
                  <tr
                    key={c.name}
                    onClick={() => setChannel(c)}
                    className="cursor-pointer border-b border-border/60 last:border-0 transition hover:bg-saffron/5"
                  >
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-md bg-saffron/10 text-saffron">
                          <Icon className="h-3 w-3" />
                        </span>
                        <span className="font-semibold text-foreground">{c.name}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{c.received}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-emerald-700">
                      <span className="inline-flex items-center gap-1.5">
                        {c.resolved}
                        <span className="hidden h-1 w-10 overflow-hidden rounded-full bg-emerald-100 sm:inline-block">
                          <span
                            className="block h-full rounded-full bg-emerald-500"
                            style={{ width: `${pct}%` }}
                          />
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-orange-600">
                      {c.escalated}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{c.avgMin}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-saffron">
                      {c.csat}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.top}</td>
                  </tr>
                );
              })}
              <tr className="bg-midnight text-white">
                <td className="px-3 py-2.5 font-bold">TOTAL</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-bold">{totalReceived}</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-bold">{totalResolved}</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-bold">{totalEsc}</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-bold">17.7</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-bold text-saffron">
                  {avgCsat}
                </td>
                <td className="px-3 py-2.5">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* ----- DRAWERS ----- */}

      <Drawer
        open={!!platform}
        onClose={() => setPlatform(null)}
        title={platform ? `${platform.name} · Source Detail` : ""}
        subtitle={platform ? platform.full : ""}
      >
        {platform && (
          <div className="space-y-4 text-[12px]">
            <div className="rounded-xl bg-[var(--gradient-midnight)] p-4 text-white shadow-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-saffron">
                {platform.url}
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <div className="text-[36px] font-bold leading-none">{platform.todayEvents}</div>
                  <div className="mt-1 text-[11px] text-white/80">events today</div>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-bold tabular-nums">{platform.uptime}%</div>
                  <div className="text-[10px] text-white/80">uptime</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <MiniStat label="Records" value={platform.records} />
              <MiniStat label="Status" value="Healthy" accent="text-emerald-600" />
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Inflow trend (last 9 intervals)
              </div>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={platform.spark.map((v, i) => ({ i, v }))}>
                    <defs>
                      <linearGradient id="pgrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-saffron)" stopOpacity={0.65} />
                        <stop offset="100%" stopColor="var(--color-saffron)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="i" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="var(--color-saffron)"
                      strokeWidth={2}
                      fill="url(#pgrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Feeds the Data Lake
              </div>
              <div className="flex flex-wrap gap-1.5">
                {platform.feeds.map((f) => (
                  <Badge key={f} tone="saffron">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-saffron/30 bg-saffron/5 p-3">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-saffron">
                Contribution
              </div>
              <p className="text-[12px] text-foreground">{platform.contributes}</p>
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        open={open === "sources"}
        onClose={() => setOpen(null)}
        title="MIDC Source Map"
        subtitle="How the 5 core platforms feed the Executive Dashboard"
      >
        <div className="space-y-4 text-[12px]">
          <div className="h-[220px] rounded-xl border border-border p-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {platformPie.map((_, i) => (
                    <Cell
                      key={i}
                      fill={`color-mix(in oklab, var(--color-saffron) ${100 - i * 15}%, var(--color-midnight))`}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-muted-foreground">
            Click any platform card above to inspect its inflow trend, contribution and uptime.
          </p>
          <div className="space-y-1.5">
            {PLATFORMS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPlatform(p)}
                className="flex w-full items-center justify-between rounded-lg border border-border p-2 text-left transition hover:bg-saffron/5"
              >
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-saffron" />
                  <span className="font-semibold text-foreground">{p.name}</span>
                </span>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {p.todayEvents} events · {p.uptime}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </Drawer>

      <Drawer
        open={open === "investors"}
        onClose={() => setOpen(null)}
        title="Total Registered Investors"
        subtitle="200 active records · sourced from MAITRI 2.0 + Investor Portal"
      >
        <KPIDetail
          stat="200"
          stat2={`${investors.filter((i) => i.MAITRI_Reg_Status === "Registered").length} MAITRI-registered`}
          chart={
            <SimpleBars
              data={[
                { m: "Jan", v: 142 },
                { m: "Feb", v: 156 },
                { m: "Mar", v: 168 },
                { m: "Apr", v: 175 },
                { m: "May", v: 188 },
                { m: "Jun", v: 200 },
              ]}
            />
          }
          notes="Investor base grew from 142 (Jan) to 200 (Jun). Highest growth came from EV, Pharma and IT/ITES sectors. 38 are flagged as priority-sector."
        />
      </Drawer>

      <Drawer
        open={open === "plots"}
        onClose={() => setOpen(null)}
        title="Active Plot Applications"
        subtitle="87 applications · MILAAP & BPAMS pipeline"
      >
        <KPIDetail
          stat="87"
          stat2={`${docs.filter((d) => d.Current_Status !== "Approved").length} documents in queue`}
          chart={
            <SimpleBars
              data={[
                { m: "Submitted", v: 87 },
                { m: "Scrutiny", v: 54 },
                { m: "Auto-DCR", v: 32 },
                { m: "Auth. Review", v: 19 },
                { m: "Approved", v: 11 },
              ]}
            />
          }
          notes="Pipeline conversion: 87 → 11 approvals (12.6%). Bottleneck stage = Authority Review. Auto-DCR engine cleared 32 layouts without human touch."
        />
      </Drawer>

      <Drawer
        open={open === "resolved"}
        onClose={() => setOpen(null)}
        title="AI Queries Resolved"
        subtitle={`${scenarios.length} scenarios processed across channels`}
      >
        <KPIDetail
          stat="210"
          stat2={`${scenarios.filter((s) => s.Resolution_Status === "Resolved").length} auto-resolved · 95% rate`}
          chart={<SimpleBars data={CHANNELS.map((c) => ({ m: c.name, v: c.resolved }))} />}
          notes="WhatsApp leads volume (88 resolved). Email handles complex multi-dept tickets. Portal Chatbot specialises in land allotment workflows."
        />
      </Drawer>

      <Drawer
        open={open === "resolution"}
        onClose={() => setOpen(null)}
        title="Avg Resolution Time"
        subtitle="6.2 hours — 40% faster than manual baseline"
      >
        <KPIDetail
          stat="6.2 hrs"
          stat2="vs 10.4 hrs manual baseline"
          chart={<SimpleBars data={CHANNELS.map((c) => ({ m: c.name, v: c.avgMin }))} suffix=" min" />}
          notes="WhatsApp resolves in 3 min on average (templated quick-status). Email averages 42 min due to multi-department coordination."
        />
      </Drawer>

      <Drawer
        open={open === "compliance"}
        onClose={() => setOpen(null)}
        title="Compliance Alerts"
        subtitle={`${compliances.length} compliance items tracked via SWC`}
      >
        <KPIDetail
          stat="47"
          stat2="12 expiring within 30 days"
          chart={
            <SimpleBars
              data={[
                { m: "Fire NOC", v: 14 },
                { m: "Pollution", v: 12 },
                { m: "Labour", v: 9 },
                { m: "Building Plan", v: 7 },
                { m: "Power", v: 5 },
              ]}
            />
          }
          notes="Fire NOC renewals dominate near-term workload. 3 critical items overdue across Pune & Aurangabad clusters."
        />
      </Drawer>

      <Drawer
        open={open === "confidence"}
        onClose={() => setOpen(null)}
        title="Agent Confidence Score"
        subtitle="87% — +3.2 pts this month"
      >
        <KPIDetail
          stat="87%"
          stat2="across 5 autonomous agents"
          chart={
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="60%"
                  outerRadius="100%"
                  data={[{ name: "score", value: 87, fill: "var(--color-saffron)" }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          }
          notes="Confidence is highest on Knowledge Agent (94%) and lowest on Escalation Agent (78%). Tuning targeted next sprint."
        />
      </Drawer>

      <Drawer
        open={open === "channel"}
        onClose={() => setOpen(null)}
        title="Channel Performance — Comparative"
        subtitle="All three channels side-by-side"
      >
        <div className="space-y-4">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHANNELS}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="received" name="Received" fill="var(--color-midnight)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="var(--color-saffron)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="escalated" name="Escalated" fill="oklch(0.55 0.18 30)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[12px] text-muted-foreground">
            Click any row in the table to drill into a single channel.
          </p>
        </div>
      </Drawer>

      <Drawer
        open={!!channel}
        onClose={() => setChannel(null)}
        title={channel ? `${channel.name} Channel` : ""}
        subtitle={channel ? `Top category: ${channel.top}` : ""}
      >
        {channel && (
          <div className="space-y-3 text-[12px]">
            <div className="grid grid-cols-3 gap-2">
              <MiniStat label="Received" value={channel.received} />
              <MiniStat label="Resolved" value={channel.resolved} accent="text-emerald-600" />
              <MiniStat label="Escalated" value={channel.escalated} accent="text-orange-600" />
              <MiniStat label="Avg (min)" value={channel.avgMin} />
              <MiniStat label="CSAT" value={channel.csat} accent="text-saffron" />
              <MiniStat
                label="Resolution %"
                value={`${Math.round((channel.resolved / channel.received) * 100)}%`}
              />
            </div>
            <p className="text-muted-foreground">
              {channel.name} primarily serves <strong>{channel.top}</strong> queries.
              {channel.name === "WhatsApp" && " Fastest channel — ideal for status checks & nudges."}
              {channel.name === "Email" && " Used for complex multi-department escalations."}
              {channel.name === "Portal Chatbot" &&
                " Embedded in the MAITRI portal for guided land-allotment workflows."}
            </p>
          </div>
        )}
      </Drawer>
    </section>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-2.5">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-0.5 text-[14px] font-bold tabular-nums ${accent ?? "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function SimpleBars({
  data,
  suffix,
}: {
  data: { m: string; v: number }[];
  suffix?: string;
}) {
  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="m" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip formatter={(v: number) => `${v}${suffix ?? ""}`} />
          <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="var(--color-saffron)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function KPIDetail({
  stat,
  stat2,
  chart,
  notes,
}: {
  stat: string;
  stat2: string;
  chart: React.ReactNode;
  notes: string;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-gradient-to-br from-saffron/10 to-white p-4">
        <div className="text-[42px] font-bold leading-none text-midnight">{stat}</div>
        <div className="mt-1 text-[12px] text-muted-foreground">{stat2}</div>
      </div>
      <div className="rounded-xl border border-border p-3">{chart}</div>
      <div className="rounded-xl border border-saffron/30 bg-saffron/5 p-3 text-[12px] text-foreground">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-saffron">
          AI Brief
        </div>
        {notes}
      </div>
    </div>
  );
}

// Re-export with original symbol name so existing imports keep working.
export const LiveSnapshot = ExecutiveOverview;
