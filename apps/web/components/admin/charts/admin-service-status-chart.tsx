"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HealthRow } from "@/lib/admin-health";

export function AdminServiceStatusChart({ rows }: { rows: HealthRow[] }) {
  const data = rows.map((r) => ({
    name: r.label,
    score: r.ok ? 100 : 0,
    ok: r.ok,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Service plane</CardTitle>
        <p className="text-sm text-muted-foreground">
          Live health probes — full width = OK, empty = unreachable.
        </p>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[280px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/60" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={92}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.12)" }}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(_value, _name, item) => [
                  item?.payload?.ok ? "Reachable" : "Unreachable",
                  "Status",
                ]}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={14}>
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      entry.ok ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
