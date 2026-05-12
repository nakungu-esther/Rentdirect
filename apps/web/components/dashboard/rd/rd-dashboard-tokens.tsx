import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** RentDirect workspace — matches design board (dark shell + emerald accent). */
export const rdWorkspace = cn(
  "min-h-screen bg-[#0B111B] font-[family-name:var(--font-poppins)] text-slate-100 antialiased",
);

export const rdGlassCard = cn(
  "rounded-2xl border border-white/[0.08] bg-[#1F2937]/85 shadow-xl shadow-black/30 backdrop-blur-xl",
);

export const rdGlassInner = cn(
  "rounded-xl border border-white/[0.06] bg-[#1F2937]/60 backdrop-blur-md",
);

export function RdSectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
