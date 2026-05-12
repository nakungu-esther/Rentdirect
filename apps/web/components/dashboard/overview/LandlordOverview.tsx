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
import { User } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { rdGlassCard, RdSectionTitle } from "@/components/dashboard/rd/rd-dashboard-tokens";
import { RdStatStrip, type RdStatItem } from "@/components/dashboard/rd/RdStatStrip";
import { cn } from "@/lib/utils";

const REVENUE = [
  { m: "Jan", v: 12.2 },
  { m: "Feb", v: 13.8 },
  { m: "Mar", v: 14.1 },
  { m: "Apr", v: 15.4 },
  { m: "May", v: 16.2 },
  { m: "Jun", v: 17.8 },
];

const PROPERTIES = [
  { name: "Kololo Heights", occ: 100 },
  { name: "Bunga cottages", occ: 75 },
  { name: "Ntinda block", occ: 50 },
  { name: "Muyenga villa", occ: 92 },
];

const APPLICANTS = [
  { name: "Sarah N.", unit: "Unit 4B", status: "Pending" },
  { name: "James O.", unit: "Garden flat", status: "Review" },
  { name: "Mary K.", unit: "Studio A", status: "New" },
];

export function LandlordOverview() {
  const user = getSessionUser();

  const stats: RdStatItem[] = [
    { label: "Total revenue (30d)", value: "UGX 48.2M", hint: "+6.4% vs last month", href: "/landlord/analytics" },
    { label: "Occupancy", value: "92%", href: "/landlord/analytics" },
    { label: "Active properties", value: "12", href: "/landlord/listings" },
    { label: "Pending payments", value: "3", href: "/landlord/payments" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {user?.fullName ?? "Landlord"} portfolio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Revenue, occupancy, and tenant pipeline at a glance.</p>
      </div>

      <RdStatStrip stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={cn(rdGlassCard, "p-5 lg:col-span-2")}>
          <RdSectionTitle title="Revenue overview" subtitle="Indexed millions UGX — demo series" />
          <div className="h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="m" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn(rdGlassCard, "p-5")}>
          <RdSectionTitle title="Recent applications" />
          <ul className="space-y-3">
            {APPLICANTS.map((a) => (
              <li
                key={a.name}
                className="flex items-start gap-3 rounded-lg border border-primary/15 bg-primary/5 p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.unit}</p>
                  <span className="mt-1 inline-block rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-400">
                    {a.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/landlord/applications"
            className="mt-4 block text-center text-xs font-bold text-primary hover:text-primary/80 transition-colors"
          >
            View all applications
          </Link>
        </div>
      </div>

      <section>
        <RdSectionTitle title="Property performance" subtitle="Occupancy by asset" />
        <div className={cn(rdGlassCard, "divide-y divide-white/5 p-4")}>
          {PROPERTIES.map((p) => (
            <div key={p.name} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-6">
              <div className="min-w-0 flex-1 sm:w-48">
                <p className="font-semibold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">Occupancy</p>
              </div>
              <div className="flex flex-1 items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${p.occ}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-bold tabular-nums text-primary">{p.occ}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
