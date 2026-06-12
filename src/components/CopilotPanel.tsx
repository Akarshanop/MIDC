import { Sparkles, X, Send, Zap, FileText, Users, BarChart3, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { investors, docs, scenarios, plots, fmtCr, fmtNum } from "@/lib/midc-data";

type Msg = { role: "user" | "ai"; text: string; rich?: any };

const quickActions = [
  { icon: Users, label: "Top investors", q: "Show top investors" },
  { icon: FileText, label: "At-risk projects", q: "Show at-risk projects" },
  { icon: Zap, label: "Pune sector trends", q: "Sector trends in Pune" },
  { icon: BarChart3, label: "Pipeline value", q: "Total pipeline value" },
];

const seeded: Msg[] = [
  {
    role: "ai",
    text:
      "Namaste 🙏 I'm the MIDC AI Copilot. Ask me about investors (e.g. INV-0001 or 'Tata'), districts (e.g. 'Pune'), sectors ('EV', 'Pharma'), projects (DOC-0001) or pipeline metrics. Try a quick action below.",
  },
];

function answer(q: string): string {
  const Q = q.trim().toLowerCase();
  if (!Q) return "Please type a question.";

  // Investor ID lookup
  const idMatch = q.match(/INV[-_]?\d+/i);
  if (idMatch) {
    const inv = investors.find((i) => i.Investor_ID.toLowerCase() === idMatch[0].toLowerCase().replace("_", "-"));
    if (inv) {
      return `**${inv.Company_Name}** (${inv.Investor_ID})\n• Sector: ${inv.Target_Sector} / ${inv.Industry_Sub_Type}\n• District: ${inv.District}\n• Investment pledged: ${fmtCr(inv.Proposed_Investment_Cr)} · Jobs: ${fmtNum(inv.Proposed_Employment)}\n• Intent score: ${inv.Growth_Indicator_Score.toFixed(1)}/10 · MAITRI: ${inv.MAITRI_Reg_Status} · KYC: ${inv.KYC_Status}\n• Last activity: ${(inv.Last_Activity_Date ?? "").toString().slice(0,10)}\n📝 ${inv.Notes}\n\n**Recommended:** ${inv.Growth_Indicator_Score >= 7 ? "Schedule executive meeting within 7 days." : inv.KYC_Status !== "Complete" ? "Trigger KYC completion nudge via WhatsApp." : "Continue routine engagement cadence."}`;
    }
    return `No investor matches ${idMatch[0]}.`;
  }

  // Doc lookup
  const dMatch = q.match(/DOC[-_]?\d+/i);
  if (dMatch) {
    const d = docs.find((x) => x.Doc_ID.toLowerCase() === dMatch[0].toLowerCase().replace("_", "-"));
    if (d) {
      return `**${d.Document_Type}** (${d.Doc_ID})\n• Investor: ${d.Investor_ID} · Plot: ${d.Plot_ID}\n• Status: ${d.Current_Status} · Queue position: ${d.Queue_Position}\n• Officer: ${d.Scrutiny_Officer} · Authority: ${d.Approval_Auth}\n• Deficiencies: ${d.Deficiency_Count}\n• Expected closure: ${(d.Expected_Closure_Date ?? "").toString().slice(0,10)}\n📝 ${d.Remarks_by_Officer}`;
    }
  }

  // District
  const districts = [...new Set(investors.map((i) => i.District))];
  const district = districts.find((d) => Q.includes(d.toLowerCase()));
  if (district) {
    const list = investors.filter((i) => i.District === district);
    const total = list.reduce((s, i) => s + i.Proposed_Investment_Cr, 0);
    const sectors = [...new Set(list.map((i) => i.Target_Sector))];
    const top = [...list].sort((a, b) => b.Proposed_Investment_Cr - a.Proposed_Investment_Cr).slice(0, 3);
    return `**${district} District** — ${list.length} active investors, ${fmtCr(total)} pipeline.\n• Active sectors: ${sectors.slice(0, 5).join(", ")}\n• Top investors:\n${top.map((i) => `  - ${i.Company_Name} · ${fmtCr(i.Proposed_Investment_Cr)} · ${i.Target_Sector}`).join("\n")}\n\n**Recommended:** Assign Engagement Agent to nurture the ${top.length} highlighted accounts.`;
  }

  // Sector
  const sectors = [...new Set(investors.map((i) => i.Target_Sector))];
  const sector = sectors.find((s) => Q.includes(s.toLowerCase())) ||
    (Q.includes("ev") ? sectors.find((s) => s.toLowerCase().includes("electric") || s.toLowerCase().includes("ev")) : null);
  if (sector) {
    const list = investors.filter((i) => i.Target_Sector === sector);
    const total = list.reduce((s, i) => s + i.Proposed_Investment_Cr, 0);
    const districts = [...new Set(list.map((i) => i.District))];
    return `**${sector}** — ${list.length} investors · ${fmtCr(total)} pipeline.\n• Hotspot districts: ${districts.slice(0, 5).join(", ")}\n• Priority-flagged: ${list.filter((i) => i.Priority_Sector_Flag === "Yes").length}\n• Avg intent score: ${(list.reduce((s, i) => s + i.Growth_Indicator_Score, 0) / list.length).toFixed(1)}/10`;
  }

  if (Q.includes("at-risk") || Q.includes("risk") || Q.includes("delay")) {
    const risky = docs.filter((d) => d.Deficiency_Count >= 3).slice(0, 5);
    return `**At-risk projects:** ${risky.length} files with 3+ deficiencies.\n${risky.map((d) => `• ${d.Doc_ID} (${d.Investor_ID}) — ${d.Document_Type} · ${d.Deficiency_Count} deficiencies · officer ${d.Scrutiny_Officer}`).join("\n")}\n\n**Recommended:** Escalate top 3 to District Estate Officer.`;
  }

  if (Q.includes("top") && (Q.includes("invest") || Q.includes("company"))) {
    const top = [...investors].sort((a, b) => b.Growth_Indicator_Score - a.Growth_Indicator_Score).slice(0, 5);
    return `**Top investors by intent score:**\n${top.map((i, n) => `${n + 1}. ${i.Company_Name} · ${i.Target_Sector} · ${fmtCr(i.Proposed_Investment_Cr)} · score ${i.Growth_Indicator_Score.toFixed(1)}`).join("\n")}`;
  }

  if (Q.includes("pipeline") || Q.includes("total invest")) {
    const total = investors.reduce((s, i) => s + i.Proposed_Investment_Cr, 0);
    const jobs = investors.reduce((s, i) => s + i.Proposed_Employment, 0);
    return `**Total Pipeline:** ${fmtCr(total)} across ${investors.length} investors.\n• Jobs pledged: ${fmtNum(jobs)}\n• Priority sector flagged: ${investors.filter((i) => i.Priority_Sector_Flag === "Yes").length}\n• Active plots in MIDC bank: ${plots.length}`;
  }

  if (Q.includes("plot") || Q.includes("land")) {
    const avail = plots.filter((p) => p.Allotment_Status !== "Allotted").length;
    return `**Land bank:** ${plots.length} plots tracked, ${avail} available for allotment. Average rate ₹${Math.round(plots.reduce((s, p) => s + (p.Plot_Rate_Per_SqM_INR || 0), 0) / plots.length)}/sqm.`;
  }

  if (Q.includes("agent") || Q.includes("scenario")) {
    const resolved = scenarios.filter((s) => s.Resolution_Status === "Resolved").length;
    return `**Agent mesh:** ${scenarios.length} scenarios processed; ${resolved} auto-resolved (${Math.round(resolved/scenarios.length*100)}%). Avg feedback score ${(scenarios.reduce((s, x) => s + (x.Feedback_Score || 0), 0) / scenarios.length).toFixed(1)}/5.`;
  }

  if (Q.includes("policy") || Q.includes("gr") || Q.includes("regulation")) {
    return "Retrieved 3 relevant Government Resolutions:\n• GR-IND-2024-217 — EV Manufacturing incentive package\n• GR-IND-2023-091 — Priority sector land rate concession\n• GR-MIDC-2024-014 — Auto-DCR for layouts < 5 acres\n\nOpen the Knowledge Hub for full text.";
  }

  if (Q.includes("hello") || Q.includes("hi") || Q.includes("namaste")) {
    return "Namaste 🙏 How can I assist — try asking about an investor (e.g. 'INV-0001'), a district ('Pune'), or 'top investors'.";
  }

  // Fallback: try to match company name
  const match = investors.find((i) => i.Company_Name.toLowerCase().includes(Q));
  if (match) return answer(match.Investor_ID);

  return `I searched investors, projects, plots, sectors and scenarios for "${q}" but didn't find a direct match. Try an investor ID (INV-0001), a district name, a sector, or use a quick action below.`;
}

export function CopilotPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>(seeded);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = answer(text);
      setMsgs((m) => [...m, { role: "ai", text: reply }]);
      setTyping(false);
    }, 450);
  }

  return (
    <aside
      className={`fixed right-0 top-0 z-40 h-screen w-full max-w-[440px] transform border-l border-border bg-white shadow-2xl transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-border bg-[var(--gradient-midnight)] px-4 py-4 text-white">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-saffron)] shadow-lg">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-[14px] font-semibold">MIDC AI Copilot</div>
            <div className="text-[11px] text-white/60">Orchestrator · Online · 5 agents ready</div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"} animate-float-up`}>
              {m.role === "ai" && (
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--gradient-saffron)] text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--gradient-midnight)] text-white"
                    : "border border-border bg-secondary/60 text-foreground"
                }`}
              >
                {m.text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={idx} className="font-bold">{part.slice(2, -2)}</strong>
                  ) : (
                    <span key={idx}>{part}</span>
                  ),
                )}
              </div>
              {m.role === "user" && (
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-midnight text-white">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex gap-2">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--gradient-saffron)] text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-2xl border border-border bg-secondary/60 px-3.5 py-2.5">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-saffron [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-saffron [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-saffron" />
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-secondary/50 px-3 py-3">
          <div className="mb-2 grid grid-cols-2 gap-2">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={() => send(a.q)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-2 text-left text-[11px] font-medium text-foreground transition hover:border-saffron hover:bg-saffron/5"
                >
                  <Icon className="h-3.5 w-3.5 text-saffron" />
                  <span className="truncate">{a.label}</span>
                </button>
              );
            })}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-1.5 shadow-sm focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about investors, districts, sectors…"
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-saffron)] text-white">
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
