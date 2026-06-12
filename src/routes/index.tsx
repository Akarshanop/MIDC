import { createFileRoute, Link } from "@tanstack/react-router";
import { investors, fmtCr, fmtNum, type Investor } from "@/lib/midc-data";
import { Card, SectionHeader, Stat, Badge } from "@/components/ui-kit";
import { LeafletMap } from "@/components/LeafletMap";
import { Drawer } from "@/components/Drawer";
import { PlatformSources } from "@/components/PlatformSources";

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
import { useMemo, useState } from "react";

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

type StatDrawerKey = "total" | "pipeline" | "jobs" | "priority" | null;

function InvestorIntelligence() {
  const [statDrawer, setStatDrawer] = useState<StatDrawerKey>(null);
  const [funnelStage, setFunnelStage] = useState<string | null>(null);
  const [activeInvestor, setActiveInvestor] = useState<Investor | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [aiPanel, setAiPanel] = useState<null | "ev" | "semi">(null);

  const totalInv = investors.reduce((s, i) => s + (i.Proposed_Investment_Cr ?? 0), 0);
  const totalEmp = investors.reduce((s, i) => s + (i.Proposed_Employment ?? 0), 0);
  const priority = investors.filter((i) => i.Priority_Sector_Flag === "Yes").length;

  const sectorData = useMemo(() => {
    const m = new Map<string, number>();
    investors.forEach((i) => m.set(i.Target_Sector, (m.get(i.Target_Sector) ?? 0) + i.Proposed_Investment_Cr));
    return [...m.entries()].map(([sector, value]) => ({ sector, value: Math.round(value) })).sort((a, b) => b.value - a.value).slice(0, 7);
  }, []);

  const mapPoints = useMemo(() => {
    const m = new Map<string, number>();
    investors.forEach((i) => m.set(i.District, (m.get(i.District) ?? 0) + 1));
    return [...m.entries()].map(([district, value]) => ({ district, value }));
  }, []);

  const top = useMemo(() => [...investors].sort((a, b) => b.Growth_Indicator_Score - a.Growth_Indicator_Score).slice(0, 6), []);

  const sectorColors = ["oklch(0.7 0.19 47)", "oklch(0.32 0.08 260)", "oklch(0.62 0.15 235)", "oklch(0.68 0.15 155)", "oklch(0.78 0.16 80)", "oklch(0.55 0.18 30)", "oklch(0.45 0.1 280)"];

  // Stat-card drawer content
  const statContent = (() => {
    if (statDrawer === "total")
      return { title: "All Investors", subtitle: `${investors.length} active records`, list: investors };
    if (statDrawer === "pipeline")
      return { title: "Pipeline Value Breakdown", subtitle: fmtCr(totalInv), list: [...investors].sort((a, b) => b.Proposed_Investment_Cr - a.Proposed_Investment_Cr).slice(0, 25) };
    if (statDrawer === "jobs")
      return { title: "Employment Pledged", subtitle: `${fmtNum(totalEmp)} jobs`, list: [...investors].sort((a, b) => b.Proposed_Employment - a.Proposed_Employment).slice(0, 25) };
    if (statDrawer === "priority")
      return { title: "Priority Sector Investors", subtitle: `${priority} priority-flagged`, list: investors.filter((i) => i.Priority_Sector_Flag === "Yes") };
    return null;
  })();

  const districtInvestors = activeDistrict ? investors.filter((i) => i.District === activeDistrict) : [];
  const sectorInvestors = activeSector ? investors.filter((i) => i.Target_Sector === activeSector) : [];
  const funnelInvestors = funnelStage ? [...investors].sort(() => Math.random() - 0.5).slice(0, 12) : [];

  return (
    <div>


      <SectionHeader
        eyebrow="Section 01 · Investor Intelligence"
        title="Investor engagement lifecycle, in real time"
        description="Track every lead from first inquiry to investment confirmation across Maharashtra. Powered by Airgen.ai agents on MILAAP, SWC, BPAMS, MAITRI 2.0 and DMS."
      />

      {/* Stats — click to drill */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <button onClick={() => setStatDrawer("total")} className="text-left transition hover:-translate-y-0.5">
          <Stat label="Total Investors" value={fmtNum(investors.length)} delta="+12 this week" icon={Users} />
        </button>
        <button onClick={() => setStatDrawer("pipeline")} className="text-left transition hover:-translate-y-0.5">
          <Stat label="Pipeline Value" value={fmtCr(totalInv)} delta="+8.4% MoM" icon={TrendingUp} tone="saffron" />
        </button>
        <button onClick={() => setStatDrawer("jobs")} className="text-left transition hover:-translate-y-0.5">
          <Stat label="Employment Pledged" value={fmtNum(totalEmp)} delta="+1,340 jobs" icon={Building2} />
        </button>
        <button onClick={() => setStatDrawer("priority")} className="text-left transition hover:-translate-y-0.5">
          <Stat label="Priority Sector" value={fmtNum(priority)} delta="EV · Semi · Pharma" icon={Sparkles} tone="midnight" />
        </button>
      </div>

      {/* Live data sources */}
      <div className="mt-5">
        <PlatformSources />
      </div>


      {/* Funnel + Insight */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Investor Funnel" subtitle="Click any stage to see investors · last 90 days" right={<Badge tone="saffron">Live</Badge>}>
          <div className="space-y-2.5">
            {FUNNEL.map((f, i) => {
              const pct = (f.count / FUNNEL[0].count) * 100;
              const conv = i > 0 ? ((f.count / FUNNEL[i - 1].count) * 100).toFixed(0) : null;
              return (
                <button key={f.stage} onClick={() => setFunnelStage(f.stage)} className="group block w-full text-left">
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-foreground group-hover:text-saffron">{f.stage}</span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      {conv && <span className="text-saffron">{conv}% →</span>}
                      <span className="font-semibold text-foreground tabular-nums">{f.count}</span>
                    </span>
                  </div>
                  <div className="h-7 overflow-hidden rounded-lg bg-secondary">
                    <div
                      className="relative h-full rounded-lg transition-all duration-700 ease-out group-hover:brightness-110"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${f.color}, color-mix(in oklab, ${f.color} 70%, white))` }}
                    >
                      <div className="absolute inset-0 animate-shimmer opacity-40" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-3">
          <button onClick={() => setAiPanel("ev")} className="block w-full text-left overflow-hidden rounded-2xl border border-saffron/30 bg-gradient-to-br from-[var(--saffron-soft)] via-white to-white p-4 shadow-[var(--shadow-glass)] transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-saffron">
              <Sparkles className="h-3 w-3" /> AI Insight
            </div>
            <div className="mt-2 text-[15px] font-semibold leading-snug text-foreground">
              EV manufacturing interest <span className="text-saffron">↑ 34%</span> this month — concentrated in Pune & Aurangabad corridors.
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-midnight">
              Open sector report <ArrowRight className="h-3 w-3" />
            </span>
          </button>
          <button onClick={() => setAiPanel("semi")} className="block w-full text-left overflow-hidden rounded-2xl border border-border bg-[var(--gradient-midnight)] p-4 text-white shadow-[var(--shadow-glass)] transition hover:-translate-y-0.5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-saffron">
              <Activity className="h-3 w-3" /> Action Required
            </div>
            <div className="mt-2 text-[15px] font-semibold leading-snug">
              3 semiconductor investors require immediate follow-up to prevent drop-off in next 48 hours.
            </div>
            <span className="mt-3 inline-flex items-center gap-1 rounded-lg bg-saffron px-3 py-1.5 text-[11px] font-semibold text-white">
              Assign Engagement Agent <ArrowRight className="h-3 w-3" />
            </span>
          </button>
        </div>
      </div>

      {/* Map + Activity */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Spatial Intelligence — OpenStreetMap"
          subtitle="Click markers to inspect district pipeline · pan / zoom enabled"
          right={
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-saffron" /> Investor density</span>
            </div>
          }
        >
          <LeafletMap points={mapPoints} onSelectDistrict={(d) => setActiveDistrict(d)} />
        </Card>

        <Card title="Real-time Activity" subtitle="Stream from MAITRI 2.0 + Portal Chatbot" right={<Badge tone="success">Streaming</Badge>}>
          <div className="-mx-2 max-h-[440px] space-y-1.5 overflow-y-auto pr-1">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex gap-2.5 rounded-lg px-2 py-2 transition hover:bg-secondary/60 animate-float-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="mt-1.5 grid h-2 w-2 shrink-0 place-items-center">
                  <span className={`h-1.5 w-1.5 rounded-full ${a.tone === "saffron" ? "bg-saffron" : a.tone === "danger" ? "bg-destructive" : a.tone === "success" ? "bg-emerald-500" : "bg-info"}`} />
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
        <Card title="Pipeline Value by Sector" subtitle="Click any bar · ₹ Crore committed" className="lg:col-span-1">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical" margin={{ left: 10, right: 10 }} onClick={(e: any) => e?.activeLabel && setActiveSector(e.activeLabel)}>
                <XAxis type="number" hide />
                <YAxis dataKey="sector" type="category" axisLine={false} tickLine={false} width={88} tick={{ fontSize: 11, fill: "oklch(0.4 0.04 260)" }} />
                <Tooltip cursor={{ fill: "oklch(0.96 0.01 250)" }} contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }} formatter={(v: number) => [fmtCr(v), "Pipeline"]} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} cursor="pointer">
                  {sectorData.map((s, i) => (
                    <Cell key={i} fill={sectorColors[i % sectorColors.length]} onClick={() => setActiveSector(s.sector)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2" title="Top Investor Profiles" subtitle="Click any card for full profile" right={<Badge tone="saffron">AI scored</Badge>}>
          <div className="grid gap-3 sm:grid-cols-2">
            {top.map((i) => (
              <button key={i.Investor_ID} onClick={() => setActiveInvestor(i)} className="group rounded-xl border border-border bg-gradient-to-br from-white to-secondary/30 p-3 text-left transition hover:-translate-y-0.5 hover:border-saffron/40 hover:shadow-md">
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
                  <div><div className="text-muted-foreground">Investment</div><div className="font-semibold text-foreground">{fmtCr(i.Proposed_Investment_Cr)}</div></div>
                  <div><div className="text-muted-foreground">Jobs</div><div className="font-semibold text-foreground">{fmtNum(i.Proposed_Employment)}</div></div>
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
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Drawers */}
      <Drawer open={!!statContent} onClose={() => setStatDrawer(null)} title={statContent?.title ?? ""} subtitle={statContent?.subtitle}>
        <InvestorList list={statContent?.list ?? []} onPick={(i) => { setStatDrawer(null); setActiveInvestor(i); }} />
      </Drawer>

      <Drawer open={!!funnelStage} onClose={() => setFunnelStage(null)} title={`${funnelStage} stage`} subtitle="Investors currently at this funnel stage">
        <InvestorList list={funnelInvestors} onPick={(i) => { setFunnelStage(null); setActiveInvestor(i); }} />
      </Drawer>

      <Drawer open={!!activeDistrict} onClose={() => setActiveDistrict(null)} title={`${activeDistrict} District`} subtitle={`${districtInvestors.length} investors · ${fmtCr(districtInvestors.reduce((s, i) => s + i.Proposed_Investment_Cr, 0))} pipeline`}>
        <InvestorList list={districtInvestors} onPick={(i) => { setActiveDistrict(null); setActiveInvestor(i); }} />
      </Drawer>

      <Drawer open={!!activeSector} onClose={() => setActiveSector(null)} title={`${activeSector} sector`} subtitle={`${sectorInvestors.length} investors`}>
        <InvestorList list={sectorInvestors} onPick={(i) => { setActiveSector(null); setActiveInvestor(i); }} />
      </Drawer>

      <Drawer open={!!activeInvestor} onClose={() => setActiveInvestor(null)} title={activeInvestor?.Company_Name ?? ""} subtitle={activeInvestor?.Investor_ID}>
        {activeInvestor && <InvestorDetail inv={activeInvestor} />}
      </Drawer>

      <Drawer open={!!aiPanel} onClose={() => setAiPanel(null)} title={aiPanel === "ev" ? "AI Insight — EV Manufacturing Surge" : "AI Action Brief — Semiconductor Drop-off Risk"}>
        {aiPanel === "ev" ? <EVReport /> : aiPanel === "semi" ? <SemiReport /> : null}
      </Drawer>
    </div>
  );
}

function InvestorList({ list, onPick }: { list: Investor[]; onPick: (i: Investor) => void }) {
  return (
    <div className="space-y-2">
      {list.map((i) => (
        <button key={i.Investor_ID} onClick={() => onPick(i)} className="block w-full rounded-xl border border-border bg-white p-3 text-left transition hover:border-saffron/40 hover:bg-saffron/5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">{i.Company_Name}</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{i.Investor_ID} · {i.Target_Sector} · {i.District}</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-bold text-foreground">{fmtCr(i.Proposed_Investment_Cr)}</div>
              <div className="text-[10px] text-saffron">Score {i.Growth_Indicator_Score.toFixed(1)}</div>
            </div>
          </div>
        </button>
      ))}
      {list.length === 0 && <div className="rounded-lg border border-dashed border-border p-6 text-center text-[12px] text-muted-foreground">No records.</div>}
    </div>
  );
}

function InvestorDetail({ inv }: { inv: Investor }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {inv.Priority_Sector_Flag === "Yes" && <Badge tone="saffron">Priority Sector</Badge>}
        <Badge tone={inv.MAITRI_Reg_Status === "Registered" ? "success" : "warning"}>MAITRI: {inv.MAITRI_Reg_Status}</Badge>
        <Badge tone={inv.KYC_Status === "Complete" ? "success" : "warning"}>KYC: {inv.KYC_Status}</Badge>
        <Badge tone={inv.Grievance_Status === "None" || !inv.Grievance_Status ? "neutral" : "danger"}>Grievance: {inv.Grievance_Status || "None"}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <Field label="Sector" value={inv.Target_Sector} />
        <Field label="Sub-type" value={inv.Industry_Sub_Type} />
        <Field label="District" value={inv.District} />
        <Field label="Investment" value={fmtCr(inv.Proposed_Investment_Cr)} />
        <Field label="Employment" value={fmtNum(inv.Proposed_Employment)} />
        <Field label="EMD Paid" value={fmtCr(inv.EMD_Paid_Cr || 0)} />
        <Field label="Intent Score" value={`${inv.Growth_Indicator_Score.toFixed(1)} / 10`} />
        <Field label="Last Activity" value={(inv.Last_Activity_Date ?? "").toString().slice(0, 10)} />
      </div>
      <div className="rounded-xl border border-saffron/30 bg-saffron/5 p-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-saffron">
          <Sparkles className="h-3 w-3" /> Notes
        </div>
        <p className="mt-1 text-[12px] text-foreground">{inv.Notes}</p>
      </div>
      <div className="rounded-xl border border-midnight/20 bg-midnight/5 p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-midnight">AI Recommendation</div>
        <p className="mt-1 text-[12px] text-foreground">
          {inv.Growth_Indicator_Score >= 7
            ? "High intent — schedule executive meeting within 7 days; assign Senior Engagement Officer."
            : inv.KYC_Status !== "Complete"
            ? "KYC pending — trigger automated WhatsApp nudge from MAITRI 2.0."
            : "Maintain quarterly engagement cadence; monitor for sector triggers."}
        </p>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 rounded-lg bg-[var(--gradient-saffron)] py-2 text-[12px] font-semibold text-white hover:opacity-95">Assign Officer</button>
        <button className="flex-1 rounded-lg border border-border bg-white py-2 text-[12px] font-semibold text-foreground hover:bg-secondary">Schedule Meeting</button>
        <Link to="/actions" className="grid place-items-center rounded-lg border border-border bg-white px-3 text-[12px] font-semibold text-foreground hover:bg-secondary">Queue</Link>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-2.5">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-[12px] font-semibold text-foreground">{value || "—"}</div>
    </div>
  );
}

function EVReport() {
  const ev = investors.filter((i) => /electric|ev/i.test(i.Target_Sector) || /electric|ev/i.test(i.Industry_Sub_Type));
  const total = ev.reduce((s, i) => s + i.Proposed_Investment_Cr, 0);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Field label="Investors" value={String(ev.length)} />
        <Field label="Pipeline" value={fmtCr(total)} />
        <Field label="Growth MoM" value="+34%" />
      </div>
      <p className="text-[12px] text-muted-foreground">
        Pune and Aurangabad corridors account for ~62% of new EV interest, driven by FAME-II extension and TATA Electronics anchor effect.
        Recommend opening Phase II zoning review for Chakan MIDC and unlocking 3 priority plots in Shendra.
      </p>
      <div className="space-y-1.5">
        {ev.slice(0, 5).map((i) => (
          <div key={i.Investor_ID} className="rounded-lg border border-border p-2 text-[12px]">
            <div className="font-semibold">{i.Company_Name}</div>
            <div className="text-[10px] text-muted-foreground">{i.District} · {fmtCr(i.Proposed_Investment_Cr)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SemiReport() {
  const semi = investors.filter((i) => /semi|chip|electron/i.test(i.Target_Sector + " " + i.Industry_Sub_Type)).slice(0, 6);
  return (
    <div className="space-y-3">
      <p className="text-[12px] text-foreground">
        AI predicted drop-off risk for the following accounts based on declining response cadence and stalled MAITRI registration progress.
      </p>
      <div className="space-y-1.5">
        {semi.map((i) => (
          <div key={i.Investor_ID} className="rounded-lg border border-red-100 bg-red-50/40 p-2 text-[12px]">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{i.Company_Name}</div>
              <Badge tone="danger">Drop-off risk</Badge>
            </div>
            <div className="text-[10px] text-muted-foreground">{i.District} · last activity {(i.Last_Activity_Date ?? "").toString().slice(0, 10)}</div>
          </div>
        ))}
      </div>
      <button className="w-full rounded-lg bg-[var(--gradient-saffron)] py-2 text-[12px] font-semibold text-white">Assign Engagement Agent to all</button>
    </div>
  );
}
