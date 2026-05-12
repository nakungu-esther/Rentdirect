"use client";

import Link from "next/link";
import { Activity, ArrowUpRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardVariant } from "@/components/dashboard/dashboard-nav";
import { rdGlassInner } from "@/components/dashboard/rd/rd-dashboard-tokens";

export function DashboardUtilityRail({ variant }: { variant: DashboardVariant }) {
  const blocks: Record<
    DashboardVariant,
    { title: string; body: string; href: string; label: string }
  > = {
    tenant: {
      title: "Recent activity",
      body: "Application updates, rent reminders, and landlord messages appear here when your notification service is connected.",
      href: "/tenant/notifications",
      label: "Open notifications",
    },
    landlord: {
      title: "Rent roll pulse",
      body: "Settlement batches and flagged payouts surface here from the payments hub.",
      href: "/landlord/payments/transactions",
      label: "Payments",
    },
    agent: {
      title: "Pipeline",
      body: "Move leads through viewings to closed deals — sync CRM webhooks for live counts.",
      href: "/agent/leads",
      label: "View leads",
    },
    government: {
      title: "Data freshness",
      body: "District aggregates refresh when warehouse sync completes — monitor compliance exports.",
      href: "/government/reports",
      label: "Reports",
    },
  };

  const b = blocks[variant];

  return (
    <aside
      className="relative hidden shrink-0 border-l border-white/10 bg-[#0B111B] px-4 py-6 xl:block xl:w-[300px] 2xl:w-[320px]"
      aria-label="Workspace utilities"
    >
      <div className={cn(rdGlassInner, "p-4")}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Activity className="h-3.5 w-3.5 text-[#00C853]" aria-hidden />
          Live workspace
        </div>
        <p className="mt-3 text-sm font-semibold text-white">{b.title}</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">{b.body}</p>
        <Link
          href={b.href}
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#00C853] hover:underline"
        >
          {b.label}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <div className="mt-4 rounded-2xl border border-[#00C853]/20 bg-[#00C853]/[0.07] p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-[#00C853]">
          <Shield className="h-4 w-4 shrink-0" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-wide">Trust layer</p>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Sui-ready receipts and Walrus attestation hooks ship behind payments and contracts.
        </p>
      </div>

      <p className="mt-6 text-[10px] leading-snug text-slate-600">
        Optional rail — swap for AI summaries, approvals, or calendar without changing the main grid.
      </p>
    </aside>
  );
}
