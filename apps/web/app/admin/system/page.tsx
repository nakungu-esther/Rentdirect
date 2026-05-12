"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAdminHealth, type HealthRow } from "@/lib/admin-health";

export default function AdminSystemPage() {
  const [rows, setRows] = useState<HealthRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await fetchAdminHealth();
      if (!cancelled) setRows(r);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <AdminPageHeader
        title="System status"
        description="Parallel health probes against the RentDirect API surface. Use this board before releases and incident drills."
        actions={
          <Button variant="outline" className="border-border/80" onClick={() => window.location.reload()}>
            Re-run checks
          </Button>
        }
      />

      {!rows ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card/40 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Sample response</TableHead>
                <TableHead className="text-right">State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.label}>
                  <TableCell className="font-medium">{r.label}</TableCell>
                  <TableCell className="max-w-[520px] truncate font-mono text-xs text-muted-foreground">
                    {r.detail}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={r.ok ? "success" : "destructive"}>{r.ok ? "OK" : "DOWN"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
