"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { rdGlassInner } from "./rd-dashboard-tokens";

export type RdStatItem = {
  label: string;
  value: string;
  hint?: string;
  href?: string;
};

export function RdStatStrip({ stats }: { stats: RdStatItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => {
        const inner = (
          <>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="mt-1 text-xl font-bold tabular-nums tracking-tight text-white">{s.value}</p>
            {s.hint ? <p className="mt-1 text-xs text-slate-500">{s.hint}</p> : null}
          </>
        );
        const cls = cn(rdGlassInner, "p-4 transition hover:border-[#00C853]/25 hover:bg-[#1F2937]/90");
        return s.href ? (
          <Link key={s.label} href={s.href} className={cn(cls, "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C853]/50")}>
            {inner}
          </Link>
        ) : (
          <div key={s.label} className={cls}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
