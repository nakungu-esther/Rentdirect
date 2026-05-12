import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** RentDirect workspace — premium dark navy + emerald green theme */
export const rdWorkspace = cn(
  "min-h-screen bg-background font-[family-name:var(--font-poppins)] text-foreground antialiased",
);

export const rdGlassCard = cn(
  "rounded-xl border border-emerald-500/20 bg-white/[0.04] shadow-lg shadow-emerald-500/10 backdrop-blur-xl hover:shadow-emerald-500/20 transition-all duration-300",
);

export const rdGlassInner = cn(
  "rounded-lg border border-emerald-500/15 bg-white/[0.02] backdrop-blur-md",
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
        <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
