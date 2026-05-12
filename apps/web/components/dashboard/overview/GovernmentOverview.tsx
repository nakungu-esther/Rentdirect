"use client";

import Link from "next/link";
import { Building2, FileText, Shield } from "lucide-react";
import { rdGlassCard, RdSectionTitle } from "@/components/dashboard/rd/rd-dashboard-tokens";
import { RdStatStrip, type RdStatItem } from "@/components/dashboard/rd/RdStatStrip";
import { cn } from "@/lib/utils";

export function GovernmentOverview() {
  const stats: RdStatItem[] = [
    { label: "Verified listings", value: "12.4k", href: "/government/housing" },
    { label: "Tax events (MTD)", value: "842", href: "/government/tax" },
    { label: "Compliance cases", value: "14", href: "/government/compliance" },
    { label: "Districts synced", value: "134", href: "/government/districts" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Government console</h1>
        <p className="mt-1 text-sm text-slate-400">
          Read-only visibility into housing, tax, and compliance — aligned with your design board.
        </p>
      </div>

      <RdStatStrip stats={stats} />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { href: "/government/housing", title: "Housing analytics", body: "Stock, affordability, and pipeline.", Icon: Building2 },
          { href: "/government/compliance", title: "Compliance", body: "KYC and listing verification queues.", Icon: Shield },
          { href: "/government/reports", title: "Reports", body: "Exports for URA, KCCA, and internal audit.", Icon: FileText },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={cn(
              rdGlassCard,
              "group flex flex-col gap-3 p-5 transition hover:border-[#00C853]/25",
            )}
          >
            <c.Icon className="h-8 w-8 text-[#00C853]" />
            <div>
              <p className="font-bold text-white">{c.title}</p>
              <p className="mt-1 text-sm text-slate-400">{c.body}</p>
            </div>
            <span className="text-xs font-bold text-[#00C853] group-hover:underline">Open →</span>
          </Link>
        ))}
      </div>

      <section>
        <RdSectionTitle
          title="Roadmap & phases"
          subtitle="Program delivery view"
          action={
            <Link href="/government/roadmap" className="text-xs font-bold text-[#00C853] hover:underline">
              View roadmap
            </Link>
          }
        />
        <div className={cn(rdGlassCard, "p-6 text-sm text-slate-400")}>
          Connect your platform roadmap API to replace this panel with live milestones, owners, and risk flags.
        </div>
      </section>
    </div>
  );
}
