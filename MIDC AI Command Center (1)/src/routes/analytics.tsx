import { createFileRoute } from "@tanstack/react-router";
import { investors, fmtCr } from "@/lib/midc-data";
import { Card, SectionHeader, Stat, Badge } from "@/components/ui-kit";
import { TrendingUp, Globe2, Sparkles, MapPin } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics & Trends · MIDC AI Command" },
      { name: "description", content: "Macro investment trends, sector demand and regional concentration across Maharashtra." },
    ],
  }),
  component: Analytics,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Analytics() {
  // Sector trend (synthetic but informed by data)
  const sectors = ["Automotive", "EV Manufacturing", "Semiconductor", "Renewable Energy", "Pharma & API"];
  const trend = MONTHS.map((m, i) => ({
    month: m,
    Automotive: 80 + Math.round(Math.sin(i / 2) * 18) + i * 2,
    "EV Manufacturing": 30 + i * 9 + Math.round(Math.cos(i / 3) * 8),
    Semiconductor: 22 + i * 6,
    "Renewable Energy": 55 + Math.round(Math.cos(i / 2) * 12) + i * 3,
    "Pharma & API": 64 + Math.round(Math.sin(i / 3) * 14),
  }));

  // Country distribution (synthetic)
  const countries = [
    { country: "India", value: 42 },
    { country: "Japan", value: 18 },
    { country: "Germany", value: 12 },
    { country: "USA", value: 10 },
    { country: "South Korea", value: 8 },
    { country: "Singapore", value: 6 },
    { country: "UAE", value: 4 },
  ];

  // Region distribution
  const regions = new Map<string, number>();
  investors.forEach((i) => {
    const r = ["Pune","Mumbai","Thane","Satara","Kolhapur","Sangli","Ratnagiri","Sindhudurg","Raigad","Palghar"].includes(i.District) ? "Western"
      : ["Nashik","Dhule","Jalgaon","Nandurbar","Ahmednagar"].includes(i.District) ? "North"
      : ["Aurangabad","Beed","Jalna","Osmanabad","Latur","Nanded","Parbhani","Hingoli"].includes(i.District) ? "Marathwada"
      : ["Nagpur","Wardha","Chandrapur","Gondia","Bhandara","Gadchiroli"].includes(i.District) ? "Vidarbha"
      : "Other";
    regions.set(r, (regions.get(r) ?? 0) + i.Proposed_Investment_Cr);
  });
  const regionData = [...regions.entries()].map(([region, value]) => ({ region, value: Math.round(value) }));

  // Investment growth
  const growth = MONTHS.map((m, i) => ({
    month: m,
    committed: 1200 + i * 240 + Math.round(Math.sin(i / 2) * 180),
    actualized: 800 + i * 180 + Math.round(Math.cos(i / 3) * 120),
  }));

  const colors = ["oklch(0.7 0.19 47)", "oklch(0.32 0.08 260)", "oklch(0.62 0.15 235)", "oklch(0.68 0.15 155)", "oklch(0.78 0.16 80)"];

  return (
    <div>
      <SectionHeader
        eyebrow="Section 05 · Analytics & Trends"
        title="Macro intelligence across sectors, regions and channels"
        description="Where capital is flowing, which industries are accelerating, and how Maharashtra compares regionally — distilled by the Analytics Agent."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Capital Committed YTD" value="₹48.2K Cr" delta="+22% YoY" icon={TrendingUp} tone="saffron" />
        <Stat label="Top Sector" value="EV Mfg" delta="+34% MoM" icon={Sparkles} />
        <Stat label="Foreign Investors" value="124" icon={Globe2} tone="midnight" />
        <Stat label="Avg Project Size" value={fmtCr(investors.reduce((s,i)=>s+i.Proposed_Investment_Cr,0)/investors.length)} icon={MapPin} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Industry Demand Trend" subtitle="Investor inquiries by sector · 12-month rolling">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  {sectors.map((s, i) => (
                    <linearGradient key={s} id={`g-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors[i]} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={colors[i]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.01 250)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.5 0.025 260)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0.025 260)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {sectors.map((s, i) => (
                  <Area key={s} type="monotone" dataKey={s} stroke={colors[i]} strokeWidth={2} fill={`url(#g-${i})`} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="AI Trend Insights">
          <div className="space-y-2.5">
            {[
              { tone: "saffron" as const, t: "Western Maharashtra absorbs 48% of all new EV investor interest." },
              { tone: "info" as const, t: "Semiconductor inquiries quadrupled since PLI scheme expansion." },
              { tone: "success" as const, t: "Renewable Energy projects show 92% on-time approval rate." },
              { tone: "warning" as const, t: "Marathwada land queue depth grew 31% — capacity review advised." },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-gradient-to-br from-white to-secondary/30 p-3">
                <Badge tone={s.tone}>Insight</Badge>
                <p className="mt-1.5 text-[12px] font-medium leading-snug text-foreground">{s.t}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card title="Investment Growth" subtitle="Committed vs Actualized (₹ Cr)" className="lg:col-span-2">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.01 250)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="committed" stroke="oklch(0.7 0.19 47)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="actualized" stroke="oklch(0.32 0.08 260)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Regional Demand" subtitle="₹ Cr by Maharashtra region">
          <div className="space-y-2">
            {regionData.sort((a,b)=>b.value-a.value).map((r, i) => {
              const pct = (r.value / Math.max(...regionData.map(x=>x.value))) * 100;
              return (
                <div key={r.region}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="font-semibold text-foreground">{r.region}</span>
                    <span className="tabular-nums text-muted-foreground">{fmtCr(r.value)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card title="Country-wise Investor Distribution">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countries}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.01 250)" vertical={false} />
                <XAxis dataKey="country" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {countries.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Channel Effectiveness" subtitle="Resolutions by channel">
          <div className="grid grid-cols-3 gap-3">
            {[
              { c: "Portal Chatbot", v: 47, color: "oklch(0.7 0.19 47)" },
              { c: "WhatsApp", v: 32, color: "oklch(0.68 0.15 155)" },
              { c: "Email", v: 21, color: "oklch(0.62 0.15 235)" },
            ].map((c) => (
              <div key={c.c} className="rounded-xl border border-border bg-gradient-to-br from-white to-secondary/40 p-4 text-center">
                <div className="text-3xl font-bold tabular-nums" style={{ color: c.color }}>{c.v}%</div>
                <div className="mt-1 text-[11px] font-semibold text-foreground">{c.c}</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full" style={{ width: `${c.v * 2}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
