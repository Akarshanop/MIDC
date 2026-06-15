import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-saffron">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
          {eyebrow}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className = "",
  title,
  subtitle,
  right,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card shadow-[var(--shadow-glass)] ${className}`}>
      {(title || right) && (
        <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
          <div className="min-w-0">
            {title && <div className="text-[13px] font-semibold text-foreground">{title}</div>}
            {subtitle && <div className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Stat({
  label,
  value,
  delta,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "default" | "saffron" | "midnight" | "success" | "danger";
}) {
  const toneMap = {
    default: "from-white to-secondary/40 border-border",
    saffron: "from-[var(--saffron-soft)]/60 to-white border-saffron/20",
    midnight: "from-midnight/95 to-midnight text-white border-midnight",
    success: "from-emerald-50 to-white border-emerald-100",
    danger: "from-red-50 to-white border-red-100",
  } as const;
  const fg = tone === "midnight" ? "text-white/70" : "text-muted-foreground";
  const valFg = tone === "midnight" ? "text-white" : "text-foreground";
  return (
    <div className={`flex flex-col gap-1.5 rounded-2xl border bg-gradient-to-br p-4 ${toneMap[tone]}`}>
      <div className="flex items-start justify-between">
        <span className={`text-[11px] font-medium uppercase tracking-wider ${fg}`}>{label}</span>
        {Icon && (
          <div
            className={`grid h-7 w-7 place-items-center rounded-lg ${
              tone === "midnight" ? "bg-white/10 text-saffron" : "bg-saffron/10 text-saffron"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold tabular-nums ${valFg}`}>{value}</div>
      {delta && (
        <div className={`flex items-center gap-1 text-[11px] font-medium ${tone === "midnight" ? "text-saffron" : "text-emerald-600"}`}>
          <ArrowUpRight className="h-3 w-3" />
          {delta}
        </div>
      )}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "saffron";
}) {
  const tones = {
    neutral: "bg-secondary text-foreground/70",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
    danger: "bg-red-50 text-red-700 ring-1 ring-red-200/60",
    info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60",
    saffron: "bg-saffron/10 text-saffron ring-1 ring-saffron/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
