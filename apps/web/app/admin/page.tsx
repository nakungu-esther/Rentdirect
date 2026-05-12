"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, CreditCard, Layers, Users } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/admin-kpi-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminRevenueChart } from "@/components/admin/charts/admin-revenue-chart";
import { AdminServiceStatusChart } from "@/components/admin/charts/admin-service-status-chart";
import { FraudAlertsPanel } from "@/components/admin/fraud-alerts-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminHealth, type HealthRow } from "@/lib/admin-health";
import { api } from "@/lib/api";

export default function AdminDashboardPage() {
  const [health, setHealth] = useState<HealthRow[] | null>(null);
  const [listingCount, setListingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [h, listingsRes] = await Promise.all([
        fetchAdminHealth(),
        (async () => {
          try {
            const { data } = await api.get<unknown>("/listings", {
              params: { page: 1, limit: 1 },
            });
            if (data && typeof data === "object" && "total" in data) {
              return Number((data as { total: number }).total);
            }
            if (Array.isArray(data)) return data.length;
            if (
              data &&
              typeof data === "object" &&
              "data" in data &&
              Array.isArray((data as { data: unknown }).data)
            ) {
              return (data as { data: unknown[]; total?: number }).total ??
                (data as { data: unknown[] }).data.length;
            }
            return 0;
          } catch {
            return null;
          }
        })(),
      ]);
      if (!cancelled) {
        setHealth(h);
        setListingCount(listingsRes);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const okCount = useMemo(
    () => health?.filter((r) => r.ok).length ?? 0,
    [health],
  );
  const totalChecks = health?.length ?? 0;

  return (
    <>
      <AdminPageHeader
        title="Operations overview"
        description="Cross-module health, indexed liquidity, and risk posture for RentDirect UG. Connect your warehouse and ledger APIs to replace demo slices."
        actions={
          <Button variant="outline" className="border-border/80" asChild>
            <Link href="/admin/reports">Open reports</Link>
          </Button>
        }
      />

      <Card className="border-border/80 bg-card/40">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-foreground">Admin flow</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Dashboard — monitor platform health and KPIs.</li>
            <li>Review reports — operational and financial snapshots.</li>
            <li>Moderate listings — queue in Moderation.</li>
            <li>Handle fraud cases — Fraud Detection and alerts in the top bar.</li>
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-border/80" asChild>
              <Link href="/admin/reports">Reports</Link>
            </Button>
            <Button variant="outline" size="sm" className="border-border/80" asChild>
              <Link href="/admin/moderation">Moderation</Link>
            </Button>
            <Button variant="outline" size="sm" className="border-border/80" asChild>
              <Link href="/admin/fraud">Fraud Detection</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading || !health ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AdminKpiCard
            title="Platform availability"
            value={`${Math.round((okCount / Math.max(totalChecks, 1)) * 100)}%`}
            hint={`${okCount} of ${totalChecks} monitored routes reachable`}
            delta={okCount === totalChecks ? "All systems nominal" : "Investigate failing routes"}
            deltaUp={okCount === totalChecks}
            icon={Activity}
          />
          <AdminKpiCard
            title="Catalog depth"
            value={listingCount === null ? "—" : String(listingCount)}
            hint="Public listings index (first page probe)"
            delta={
              listingCount === null
                ? "API unavailable or unauthorized"
                : "Live from /listings"
            }
            deltaUp={listingCount !== null}
            icon={Layers}
          />
          <AdminKpiCard
            title="Active tenants (demo)"
            value="1,284"
            hint="Synthetic cohort for UX — replace with warehouse fact"
            delta="+4.2% vs trailing 30d"
            icon={Users}
          />
          <AdminKpiCard
            title="Net settlements (demo)"
            value="UGX 482M"
            hint="Indexed settlement volume"
            delta="+1.1% vs forecast"
            icon={CreditCard}
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminRevenueChart />
        </div>
        <div className="lg:col-span-1">
          <FraudAlertsPanel />
        </div>
      </div>

      {health ? (
        <AdminServiceStatusChart rows={health} />
      ) : (
        <Skeleton className="h-[320px] w-full rounded-xl" />
      )}
    </>
  );
}
