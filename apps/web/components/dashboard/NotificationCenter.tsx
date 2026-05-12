"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const NOTIFICATION_TYPES = [
  "Payments",
  "Contracts",
  "Applications",
  "Messages",
  "Fraud alerts",
  "System alerts",
] as const;

type Filter = (typeof NOTIFICATION_TYPES)[number] | "All";

export function NotificationCenter({
  className,
  intro = "Cross-cutting alerts for your account. Wire your notification service to populate this feed.",
}: {
  className?: string;
  intro?: string;
}) {
  const [filter, setFilter] = useState<Filter>("All");

  const chips = useMemo(() => ["All" as const, ...NOTIFICATION_TYPES], []);

  return (
    <div className={cn("space-y-6", className)}>
      <p className="max-w-2xl text-sm leading-relaxed text-slate-400">{intro}</p>
      <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Notification types">
        {chips.map((label) => {
          const active = filter === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setFilter(label)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-[#00C853] text-[#0B111B]"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl border border-white/[0.08] bg-[#1F2937]/85 p-8 shadow-xl shadow-black/30 backdrop-blur-xl">
        <p className="text-sm text-slate-400">
          {filter === "All"
            ? "No notifications yet. When events arrive, they will be grouped by type here."
            : `No ${filter.toLowerCase()} right now for this filter.`}
        </p>
      </div>
    </div>
  );
}
