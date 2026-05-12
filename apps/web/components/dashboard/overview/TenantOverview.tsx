"use client";

import Link from "next/link";
import { ArrowRight, Calendar, CreditCard, Home } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { rdGlassCard, RdSectionTitle } from "@/components/dashboard/rd/rd-dashboard-tokens";
import { RdStatStrip, type RdStatItem } from "@/components/dashboard/rd/RdStatStrip";
import { cn } from "@/lib/utils";

const RECOMMENDED = [
  { id: "1", title: "Garden terrace · Kololo", price: "UGX 3.2M", beds: 3 },
  { id: "2", title: "Executive studio · Nakasero", price: "UGX 1.9M", beds: 1 },
  { id: "3", title: "Family duplex · Entebbe", price: "UGX 4.1M", beds: 4 },
];

const ACTIVITY = [
  { t: "2h ago", msg: "Rent receipt generated for March cycle.", tone: "pay" as const },
  { t: "Yesterday", msg: "Landlord approved your viewing request.", tone: "ok" as const },
  { t: "Mon", msg: "New listing matches your saved search.", tone: "info" as const },
];

export function TenantOverview() {
  const user = getSessionUser();
  const first = user?.fullName?.split(/\s+/)[0] ?? "there";

  const stats: RdStatItem[] = [
    { label: "Active applications", value: "2", hint: "In review", href: "/tenant/applications" },
    { label: "Saved properties", value: "6", href: "/tenant/saved" },
    { label: "Total paid (YTD)", value: "UGX —", hint: "Connect ledger", href: "/tenant/payments" },
    { label: "Unread messages", value: "1", href: "/tenant/messages/inbox" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Welcome back, {first}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Find, rent, and pay — your workspace matches the RentDirect design system.
        </p>
      </div>

      <RdStatStrip stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section>
            <RdSectionTitle
              title="Current lease"
              subtitle="Next payment and property snapshot"
              action={
                <Link
                  href="/tenant/contracts"
                  className="text-xs font-bold text-[#00C853] hover:underline"
                >
                  View contracts
                </Link>
              }
            />
            <div className={cn(rdGlassCard, "overflow-hidden")}>
              <div className="grid gap-0 md:grid-cols-5">
                <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-800 to-slate-900 md:col-span-2 md:min-h-[200px]">
                  <Home className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-slate-600" />
                </div>
                <div className="flex flex-col justify-center gap-4 p-6 md:col-span-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active unit</p>
                    <p className="mt-1 text-lg font-bold text-white">Kampala · 2 bed apartment</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="h-4 w-4 text-[#00C853]" />
                      Next rent due <span className="font-semibold text-white">Apr 5</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-2xl font-bold tabular-nums text-[#00C853]">UGX 2,800,000</p>
                    <span className="text-xs text-slate-500">/ month</span>
                  </div>
                  <Link
                    href="/tenant/payments/new"
                    className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#00C853] px-5 py-2.5 text-sm font-bold text-[#0B111B] shadow-lg shadow-[#00C853]/20 transition hover:bg-[#00e05c]"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pay rent
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section>
            <RdSectionTitle
              title="Recommended for you"
              subtitle="Based on your saves and search radius"
              action={
                <Link href="/tenant/search" className="text-xs font-bold text-[#00C853] hover:underline">
                  Browse all
                </Link>
              }
            />
            <div className="flex gap-4 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {RECOMMENDED.map((p) => (
                <Link
                  key={p.id}
                  href="/tenant/search"
                  className={cn(
                    rdGlassCard,
                    "min-w-[240px] max-w-[260px] shrink-0 p-4 transition hover:border-[#00C853]/30",
                  )}
                >
                  <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-slate-800 to-slate-900" />
                  <p className="mt-3 font-semibold text-white">{p.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{p.beds} bedrooms</p>
                  <p className="mt-2 text-sm font-bold text-[#00C853]">{p.price}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <RdSectionTitle title="Recent activity" subtitle="Live feed when events API is on" />
          <div className={cn(rdGlassCard, "divide-y divide-white/5 p-0")}>
            {ACTIVITY.map((a) => (
              <div key={a.t + a.msg} className="flex gap-3 px-4 py-3">
                <span
                  className={cn(
                    "mt-1 h-2 w-2 shrink-0 rounded-full",
                    a.tone === "pay" && "bg-[#00C853]",
                    a.tone === "ok" && "bg-sky-400",
                    a.tone === "info" && "bg-amber-400",
                  )}
                />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{a.t}</p>
                  <p className="mt-0.5 text-sm text-slate-300">{a.msg}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/tenant/notifications"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-semibold text-slate-300 transition hover:border-[#00C853]/30 hover:text-white"
          >
            View all activity
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
