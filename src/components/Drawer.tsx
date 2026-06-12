import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 520,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: number;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[2000]">
      <div className="absolute inset-0 bg-midnight/40 backdrop-blur-sm" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full overflow-y-auto bg-white shadow-2xl animate-float-up"
        style={{ width: `min(100vw, ${width}px)` }}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-white/95 px-6 py-4 backdrop-blur">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-foreground">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[12px] text-muted-foreground">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </aside>
    </div>
  );
}
