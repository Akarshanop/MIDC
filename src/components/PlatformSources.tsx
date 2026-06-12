import { useState } from "react";
import { Drawer } from "./Drawer";
import { Card, Badge } from "./ui-kit";
import { plots, compliances, docs, scenarios } from "@/lib/midc-data";
import {
  Landmark,
  Building2,
  FileStack,
  FileCheck2,
  Globe2,
  Radio,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type P = {
  key: string;
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
};

const PLATFORMS: P[] = [
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
      "Investor onboarding, sector intent, EoI tracking, MAITRI registration status.",
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
      "Plot allotment, queue position, EMD payments, GIS coordinates, zone classification.",
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
    contributes: "Multi-dept permits, Fire/Pollution/Labour NOCs, compliance renewals.",
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
      "Building plans, AutoDCR scrutiny, CAD validation, layout approvals.",
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
      "Helpdesk tickets, MAITRI logins, grievances, WhatsApp/chat conversations.",
    spark: [22, 31, 28, 45, 52, 61, 70, 82, 89],
  },
];

export function PlatformSources() {
  const [active, setActive] = useState<P | null>(null);
  const totalToday = PLATFORMS.reduce((s, p) => s + p.todayEvents, 0);

  return (
    <Card
      title="Live Data Sources · Today's Inflow"
      subtitle={`${totalToday} events ingested today across 5 MIDC platforms`}
      right={
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-saffron">
          <Radio className="h-3 w-3" /> Live
        </span>
      }
    >
      <div className="grid gap-2.5 md:grid-cols-3 lg:grid-cols-5">
        {PLATFORMS.map((p) => {
          const Icon = p.icon;
          const sparkData = p.spark.map((v, i) => ({ i, v }));
          const pct = Math.round((p.todayEvents / totalToday) * 100);
          return (
            <button
              key={p.key}
              onClick={() => setActive(p)}
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
                        <linearGradient id={`psrc-${p.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-saffron)" stopOpacity={0.55} />
                          <stop offset="100%" stopColor="var(--color-saffron)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="var(--color-saffron)"
                        strokeWidth={1.5}
                        fill={`url(#psrc-${p.key})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Drawer
        open={!!active}
        onClose={() => setActive(null)}
        title={active ? `${active.name} · Source Detail` : ""}
        subtitle={active?.full}
      >
        {active && (
          <div className="space-y-4 text-[12px]">
            <div className="rounded-xl bg-[var(--gradient-midnight)] p-4 text-white shadow-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-saffron">
                {active.url}
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <div className="text-[36px] font-bold leading-none">{active.todayEvents}</div>
                  <div className="mt-1 text-[11px] text-white/80">events today</div>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-bold tabular-nums">{active.uptime}%</div>
                  <div className="text-[10px] text-white/80">uptime</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Inflow trend (last 9 intervals)
              </div>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={active.spark.map((v, i) => ({ i, v }))}>
                    <defs>
                      <linearGradient id="psrc-d" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#psrc-d)"
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
                {active.feeds.map((f) => (
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
              <p className="text-[12px] text-foreground">{active.contributes}</p>
            </div>
          </div>
        )}
      </Drawer>
    </Card>
  );
}
