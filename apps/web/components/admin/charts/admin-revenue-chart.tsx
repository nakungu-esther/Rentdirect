"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type RevenuePoint = { month: string; actual: number; forecast: number };

const defaultData: RevenuePoint[] = [
  { month: "Jan", actual: 420, forecast: 400 },
  { month: "Feb", actual: 510, forecast: 480 },
  { month: "Mar", actual: 580, forecast: 520 },
  { month: "Apr", actual: 540, forecast: 560 },
  { month: "May", actual: 620, forecast: 590 },
  { month: "Jun", actual: 710, forecast: 640 },
  { month: "Jul", actual: 780, forecast: 700 },
  { month: "Aug", actual: 820, forecast: 750 },
];

export function AdminRevenueChart({
  data = defaultData,
  title = "Platform GMV (indexed)",
  subtitle = "Illustrative series until reporting API is wired.",
}: {
  data?: RevenuePoint[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fillOpacity={0}
                dot={false}
                name="Forecast"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#fillActual)"
                name="Actual"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
