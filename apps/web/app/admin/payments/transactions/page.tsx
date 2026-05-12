"use client";

import { useMemo } from "react";
import { AlertTriangle, ArrowDownRight, CheckCircle2, Clock } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/admin-kpi-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEMO_ADMIN_PAYMENTS } from "@/lib/admin-mock-data";

const payStatus: Record<
  (typeof DEMO_ADMIN_PAYMENTS)[number]["status"],
  "success" | "secondary" | "destructive" | "warning"
> = {
  settled: "success",
  pending: "secondary",
  failed: "destructive",
  flagged: "warning",
};

export default function AdminPaymentTransactionsPage() {
  const totals = useMemo(() => {
    const settled = DEMO_ADMIN_PAYMENTS.filter((p) => p.status === "settled");
    const sum = settled.reduce((a, p) => a + p.amountUGX, 0);
    const flagged = DEMO_ADMIN_PAYMENTS.filter((p) => p.status === "flagged").length;
    const pending = DEMO_ADMIN_PAYMENTS.filter((p) => p.status === "pending").length;
    return { sum, flagged, pending };
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Transactions"
        description="Settlement monitoring, PSP reconciliation, and exception handling. Connect ledger webhooks to replace demo rows."
        actions={
          <Button variant="outline" className="border-border/80">
            Export ledger CSV
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminKpiCard
          title="Settled (demo batch)"
          value={`UGX ${(totals.sum / 1_000_000).toFixed(2)}M`}
          hint="Sum of demo rows in settled state"
          delta="Stable rails"
          icon={CheckCircle2}
        />
        <AdminKpiCard
          title="Pending capture"
          value={String(totals.pending)}
          hint="Awaiting PSP confirmation"
          delta="Within SLA"
          icon={Clock}
        />
        <AdminKpiCard
          title="Flagged reviews"
          value={String(totals.flagged)}
          hint="Fraud desk queue"
          delta="Manual triage"
          deltaUp={totals.flagged === 0}
          icon={AlertTriangle}
        />
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">
        <div className="flex items-start gap-2">
          <ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p>
            <strong>Chargeback watch:</strong> two wallets reused across three accounts in the last
            hour — correlate with device graph in your risk engine.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card/40 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Amount (UGX)</TableHead>
              <TableHead>Rail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO_ADMIN_PAYMENTS.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                <TableCell className="font-medium">{p.payer}</TableCell>
                <TableCell>{p.amountUGX.toLocaleString("en-UG")}</TableCell>
                <TableCell className="text-muted-foreground">{p.provider}</TableCell>
                <TableCell>
                  <Badge variant={payStatus[p.status]}>{p.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
