"use client";

import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getSessionUser } from "@/lib/session";
import { rdGlassCard, RdSectionTitle } from "@/components/dashboard/rd/rd-dashboard-tokens";
import { RdStatStrip, type RdStatItem } from "@/components/dashboard/rd/RdStatStrip";
import { cn } from "@/lib/utils";

const COMMISSION = [
  { m: "Jan", v: 2.1 },
  { m: "Feb", v: 2.8 },
  { m: "Mar", v: 3.2 },
  { m: "Apr", v: 2.9 },
  { m: "May", v: 3.6 },
  { m: "Jun", v: 4.1 },
];

const KANBAN = [
  { col: "New leads", count: 8, color: "border-sky-500/30 bg-sky-500/5" },
  { col: "Contacted", count: 5, color: "border-violet-500/30 bg-violet-500/5" },
  { col: "Viewing", count: 4, color: "border-amber-500/30 bg-amber-500/5" },
  { col: "Negotiating", count: 2, color: "border-orange-500/30 bg-orange-500/5" },
  { col: "Closed", count: 3, color: "border-[#00C853]/40 bg-[#00C853]/8" },
];

const TOP_LISTINGS = [
  { title: "Nakasero penthouse", views: "1.2k", deal: "UGX 12M" },
  { title: "Kira townhouses", views: "890", deal: "UGX 8.4M" },
  { title: "Entebbe waterfront", views: "760", deal: "UGX 15M" },
];

export function AgentOverview() {
  const user = getSessionUser();

  const stats: RdStatItem[] = [
    { label: "Total leads", value: "22", href: "/agent/leads" },
    { label: "Active deals", value: "6", href: "/agent/deals" },
    { label: "Commissions (QTD)", value: "UGX 18.4M", href: "/agent/commissions" },
    { label: "Pending payout", value: "UGX 2.1M", href: "/agent/commissions" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {user?.fullName ?? "Agent"} workspace
        </h1>
        <p className="mt-1 text-sm text-slate-400">Pipeline, commissions, and high-intent listings.</p>
      </div>

      <RdStatStrip stats={stats} />

      <section>
        <RdSectionTitle
          title="Leads pipeline"
          subtitle="Kanban-style stages — connect CRM for live cards"
          action={
            <Link href="/agent/leads" className="text-xs font-bold text-[#00C853] hover:underline">
              Open leads
            </Link>
          }
        />
        <div className="grid gap-3 overflow-x-auto pb-2 sm:grid-cols-5">
          {KANBAN.map((k) => (
            <div key={k.col} className={cn("min-w-[140px] rounded-2xl border p-3", k.color)}>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{k.col}</p>
              <p className="mt-2 text-2xl font-bold text-white">{k.count}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={cn(rdGlassCard, "p-5 lg:col-span-2")}>
          <RdSectionTitle title="Commission overview" subtitle="Millions UGX — illustrative" />
          <div className="h-[260px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={COMMISSION} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="m" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: "#1F2937",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: "#f1f5f9",
                  }}
                />
                <Line type="monotone" dataKey="v" stroke="#00C853" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn(rdGlassCard, "p-5")}>
          <RdSectionTitle title="Top properties" subtitle="By engagement" />
          <ul className="space-y-3">
            {TOP_LISTINGS.map((l) => (
              <li key={l.title} className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
                <p className="font-semibold text-white">{l.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {l.views} views · <span className="text-[#00C853]">{l.deal}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
