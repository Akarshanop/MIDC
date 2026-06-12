import { Sparkles, X, Send, Zap, FileText, Users, BarChart3 } from "lucide-react";
import { useState } from "react";

type Msg = { role: "user" | "ai"; text: string };

const quickActions = [
  { icon: Users, label: "Summarize investor history", q: "Summarize investor INV-0001 history" },
  { icon: FileText, label: "Explain project status", q: "Explain status of project DOC-0001" },
  { icon: Zap, label: "Recommend next action", q: "What's the next best action for top-priority investors?" },
  { icon: BarChart3, label: "Sector trends this month", q: "Show me sector trends this month" },
];

const seeded: Msg[] = [
  {
    role: "ai",
    text:
      "Namaste. I am your MIDC AI Copilot. I can summarize investor histories, explain project status, recommend next actions, and retrieve any GR or policy. Try a quick action below.",
  },
];

export function CopilotPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>(seeded);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    const next: Msg[] = [...msgs, { role: "user", text }];
    // Mock AI response
    next.push({
      role: "ai",
      text:
        "Analyzing across MILAAP, SWC, BPAMS, MAITRI 2.0 and DMS… Found 3 relevant records. Assigning Engagement Agent to draft follow-up. I recommend escalating to the District Estate Officer within 24 hours.",
    });
    setMsgs(next);
    setInput("");
  }

  return (
    <aside
      className={`fixed right-0 top-0 z-40 h-screen w-full max-w-[420px] transform border-l border-border bg-white shadow-2xl transition-transform duration-300 ease-out ${
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

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-float-up`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--gradient-midnight)] text-white"
                    : "border border-border bg-secondary text-foreground"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
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
              placeholder="Ask the Copilot anything…"
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
