import { createFileRoute } from "@tanstack/react-router";
import { docs, plots, fmtCr, fmtNum } from "@/lib/midc-data";
import { Card, SectionHeader, Stat, Badge } from "@/components/ui-kit";
import { LeafletMap } from "@/components/LeafletMap";
import { Building2, GitBranch, AlertCircle, CheckCircle2, Clock, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Project Intelligence · MIDC AI Command" },
      { name: "description", content: "Monitor every investment project from proposal to execution, across MIDC's land bank." },
    ],
  }),
  component: ProjectIntelligence,
});

const PIPELINE: { key: string; color: string; states: string[] }[] = [
  { key: "Submitted", color: "oklch(0.62 0.15 235)", states: ["Pending"] },
  { key: "Under Review", color: "oklch(0.78 0.16 80)", states: ["Under Review"] },
  { key: "Compliance Check", color: "oklch(0.7 0.19 47)", states: ["Auto-Approved"] },
  { key: "Approval", color: "oklch(0.6 0.2 42)", states: ["Partially Approved"] },
  { key: "Land Allocation", color: "oklch(0.32 0.08 260)", states: ["Approved"] },
  { key: "Execution", color: "oklch(0.68 0.15 155)", states: ["Closed"] },
];

function statusTone(s: string): "success" | "warning" | "danger" | "info" | "neutral" {
  if (s === "Approved" || s === "Auto-Approved") return "success";
  if (s === "Pending") return "warning";
  if (s === "Partially Approved") return "info";
  if (s === "Under Review") return "info";
  return "neutral";
}

function ProjectIntelligence() {
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const active = docs.find((d) => d.Doc_ID === openDoc);

  // Bucket projects into pipeline columns
  const cols = PIPELINE.map((c, i) => {
    const items = docs.filter((d) => c.states.includes(d.Current_Status));
    return { ...c, items: items.slice(0, 6 + i) };
  });

  // Map points: investments concentrated by district from plots
  const districtMap = new Map<string, number>();
  plots.forEach((p) => districtMap.set(p.District, (districtMap.get(p.District) ?? 0) + (p.Plot_Area_Acres || 0)));
  const mapPoints = [...districtMap.entries()].map(([district, value]) => ({ district, value }));

  const totalProjects = docs.length;
  const approved = docs.filter((d) => d.Current_Status === "Approved" || d.Current_Status === "Auto-Approved").length;
  const inQueue = docs.filter((d) => d.In_Queue_Flag === "Yes").length;
  const avgQueue = Math.round(docs.reduce((s, d) => s + (d.Queue_Position || 0), 0) / docs.length);

  const recommendations = [
    { tone: "warning" as const, title: "Land allocation delay predicted", body: "12 plots in Chakan MIDC show queue growth >40% — recommend opening Phase II zoning review.", action: "Open zoning brief" },
    { tone: "danger" as const, title: "Compliance documentation incomplete", body: "INV-0087 Factory Act License pending 18 days; deficiency codes D89/D64 unresolved.", action: "Nudge Officer" },
    { tone: "info" as const, title: "Auto-approval eligible", body: "23 layout plans match AutoDCR threshold — Knowledge Agent can clear in batch.", action: "Run batch" },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="Section 02 · Project Intelligence"
        title="From proposal to execution, mapped end-to-end"
        description="Drag projects across the pipeline. Drill into compliance, land allocation, and assigned scrutiny officers — backed by MILAAP, BPAMS and DMS."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total Projects" value={fmtNum(totalProjects)} icon={Building2} />
        <Stat label="Approved" value={fmtNum(approved)} delta={`${Math.round((approved / totalProjects) * 100)}% conversion`} icon={CheckCircle2} tone="success" />
        <Stat label="In Queue" value={fmtNum(inQueue)} icon={Clock} tone="saffron" />
        <Stat label="Avg Queue Depth" value={avgQueue} icon={GitBranch} tone="midnight" />
      </div>

      {/* Kanban */}
      <div className="mt-5">
        <Card title="Project Pipeline" subtitle="Drag to update stage · auto-syncs to SWC" right={<Badge tone="saffron">Kanban</Badge>}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {cols.map((c) => (
              <div key={c.key} className="flex flex-col rounded-xl border border-border bg-secondary/30 p-2">
                <div className="mb-2 flex items-center justify-between px-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-[11px] font-semibold text-foreground">{c.key}</span>
                  </div>
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                    {c.items.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {c.items.map((d) => (
                    <button
                      key={d.Doc_ID}
                      onClick={() => setOpenDoc(d.Doc_ID)}
                      className="group w-full rounded-lg border border-border bg-white p-2 text-left transition hover:-translate-y-0.5 hover:border-saffron/40 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-muted-foreground">{d.Doc_ID}</span>
                        {d.Deficiency_Count > 0 && (
                          <span className="rounded bg-red-50 px-1 text-destructive">{d.Deficiency_Count} def</span>
                        )}
                      </div>
                      <div className="mt-1 truncate text-[12px] font-semibold text-foreground">{d.Document_Type}</div>
                      <div className="mt-0.5 truncate text-[10px] text-muted-foreground">{d.Investor_ID} · {d.Plot_ID}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Project Distribution Map" subtitle="Bubble size = land allocated (acres)">
          <LeafletMap points={mapPoints} />
        </Card>
        <Card title="AI Recommendations" subtitle="Generated by Analytics + Knowledge agents">
          <div className="space-y-2.5">
            {recommendations.map((r, i) => (
              <div key={i} className="rounded-xl border border-border bg-gradient-to-br from-white to-secondary/40 p-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-saffron" />
                  <Badge tone={r.tone}>{r.tone === "danger" ? "Critical" : r.tone === "warning" ? "Attention" : "Optimization"}</Badge>
                </div>
                <div className="mt-1.5 text-[13px] font-semibold text-foreground">{r.title}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{r.body}</p>
                <button className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-saffron">
                  {r.action} <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detail drawer */}
      {active && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-midnight/30 backdrop-blur-sm" onClick={() => setOpenDoc(null)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-[480px] overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground">{active.Doc_ID}</div>
                <h2 className="mt-1 text-xl font-bold text-foreground">{active.Document_Type}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <Badge tone={statusTone(active.Current_Status)}>{active.Current_Status}</Badge>
                  <Badge>{active.Source_System}</Badge>
                  {active.Deficiency_Count > 0 && <Badge tone="danger">{active.Deficiency_Count} deficiencies</Badge>}
                </div>
              </div>
              <button onClick={() => setOpenDoc(null)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary">✕</button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-[12px]">
              <Field label="Investor" value={active.Investor_ID} />
              <Field label="Plot" value={active.Plot_ID} />
              <Field label="Approval Auth." value={active.Approval_Auth} />
              <Field label="Scrutiny Officer" value={active.Scrutiny_Officer} />
              <Field label="Queue Position" value={String(active.Queue_Position)} />
              <Field label="Expected Closure" value={(active.Expected_Closure_Date ?? "").toString().slice(0,10)} />
            </div>

            <div className="mt-5 rounded-xl border border-saffron/30 bg-saffron/5 p-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-saffron">
                <Sparkles className="h-3 w-3" /> Officer remarks
              </div>
              <p className="mt-1 text-[12px] text-foreground">{active.Remarks_by_Officer}</p>
            </div>

            <div className="mt-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Compliance progress</div>
              <div className="mt-2 space-y-2">
                {["Application Received", "OCR + KYC", "Compliance Check", "Land Allocation", "Approval Letter"].map((s, i) => {
                  const done = i < 3;
                  return (
                    <div key={s} className="flex items-center gap-2 text-[12px]">
                      <div className={`grid h-5 w-5 place-items-center rounded-full ${done ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground"}`}>
                        {done ? <CheckCircle2 className="h-3 w-3" /> : <span className="text-[10px]">{i + 1}</span>}
                      </div>
                      <span className={done ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-lg bg-[var(--gradient-saffron)] py-2 text-[12px] font-semibold text-white">Assign Officer</button>
              <button className="flex-1 rounded-lg border border-border bg-white py-2 text-[12px] font-semibold text-foreground hover:bg-secondary">Escalate</button>
            </div>
          </aside>
        </div>
      )}
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
