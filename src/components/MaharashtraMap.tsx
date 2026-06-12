import { districtCoords } from "@/lib/midc-data";

type Point = {
  district: string;
  value: number;
  label?: string;
  color?: string;
};

export function MaharashtraMap({
  points,
  highlight,
  maxValue,
}: {
  points: Point[];
  highlight?: string[];
  maxValue?: number;
}) {
  const max = maxValue ?? Math.max(...points.map((p) => p.value), 1);
  // Stylized Maharashtra outline (approximate)
  const outline =
    "M 8 50 L 14 38 L 22 26 L 32 22 L 44 24 L 56 26 L 68 28 L 82 30 L 92 36 L 94 48 L 90 56 L 86 62 L 82 70 L 70 72 L 60 70 L 52 76 L 44 82 L 36 88 L 26 92 L 18 88 L 12 78 L 10 66 Z";

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[var(--saffron-soft)]/40 via-white to-[var(--surface-2)]">
      {/* Subtle grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="mhFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.96 0.02 250)" />
            <stop offset="100%" stopColor="oklch(0.92 0.03 260)" />
          </linearGradient>
          <radialGradient id="dot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.7 0.19 47 / 0.9)" />
            <stop offset="100%" stopColor="oklch(0.7 0.19 47 / 0)" />
          </radialGradient>
        </defs>
        <path d={outline} fill="url(#mhFill)" stroke="oklch(0.22 0.06 265 / 0.25)" strokeWidth="0.5" />

        {/* District points */}
        {points.map((p) => {
          const c = districtCoords[p.district];
          if (!c) return null;
          const r = 1.2 + (p.value / max) * 4.5;
          const isHi = highlight?.includes(p.district);
          return (
            <g key={p.district}>
              <circle cx={c.x} cy={c.y} r={r * 2.2} fill="url(#dot)" opacity={0.5} />
              <circle
                cx={c.x}
                cy={c.y}
                r={r}
                fill={p.color ?? (isHi ? "oklch(0.7 0.19 47)" : "oklch(0.32 0.08 260)")}
                stroke="white"
                strokeWidth="0.4"
              />
            </g>
          );
        })}

        {/* Major city labels */}
        {["Mumbai", "Pune", "Nashik", "Nagpur", "Aurangabad"].map((city) => {
          const c = districtCoords[city];
          if (!c) return null;
          return (
            <text
              key={city}
              x={c.x + 2.5}
              y={c.y + 1}
              fontSize="2.4"
              fontWeight="600"
              fill="oklch(0.22 0.06 265)"
              className="select-none"
            >
              {city}
            </text>
          );
        })}
      </svg>

      <div className="absolute bottom-3 left-3 rounded-lg border border-border/60 bg-white/80 px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground backdrop-blur">
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-saffron" /> Density heatmap · Maharashtra
      </div>
    </div>
  );
}
