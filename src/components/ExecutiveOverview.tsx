import { useState } from "react";
import { Drawer } from "./Drawer";
import { Card, Badge } from "./ui-kit";
import {
  Mail,
  MessageCircle,
  MonitorSmartphone,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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
  const [open, setOpen] = useState<string | null>(null);
  const [channel, setChannel] = useState<(typeof CHANNELS)[number] | null>(null);

  const totalReceived = CHANNELS.reduce((s, c) => s + c.received, 0);
  const totalResolved = CHANNELS.reduce((s, c) => s + c.resolved, 0);
  const totalEsc = CHANNELS.reduce((s, c) => s + c.escalated, 0);
  const avgCsat = (CHANNELS.reduce((s, c) => s + c.csat, 0) / CHANNELS.length).toFixed(1);

  return (
    <section className="mt-5">
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

export const LiveSnapshot = ExecutiveOverview;

