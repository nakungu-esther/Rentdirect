"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, RefreshCw } from "lucide-react";
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
import { api } from "@/lib/api";

type Row = {
  id: string;
  title: string;
  location?: string;
  priceUGX?: string | number;
  status?: string;
};

function extractRows(payload: unknown): Row[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Row[];
  if (typeof payload === "object" && "data" in payload && Array.isArray((payload as { data: unknown }).data)) {
    return (payload as { data: Row[] }).data;
  }
  return [];
}

export default function AdminListingsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<unknown>("/listings", {
        params: { page: 1, limit: 40 },
      });
      setRows(extractRows(data));
    } catch {
      setRows([]);
      setError("Could not load listings. Ensure the API is running and reachable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <AdminPageHeader
        title="Listings"
        description="Moderation queue and inventory telemetry. Deep links open the public listing surface."
        actions={
          <Button variant="outline" className="border-border/80" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card/40 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price (UGX)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No rows returned.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="max-w-[220px] truncate font-medium">
                      {r.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.location ?? "—"}
                    </TableCell>
                    <TableCell>
                      {r.priceUGX != null
                        ? Number(r.priceUGX).toLocaleString("en-UG")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {r.status ? (
                        <Badge variant="outline" className="capitalize">
                          {r.status}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/listings/${r.id}`}
                          className="inline-flex items-center gap-1"
                        >
                          View
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
