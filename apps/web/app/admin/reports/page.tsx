"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REPORTS_TREND } from "@/lib/admin-mock-data";

export default function AdminReportsPage() {
  return (
    <>
      <AdminPageHeader
        title="Reports"
        description="Executive-ready slices for growth and trust operations. Schedule exports to your data warehouse."
        actions={
          <>
            <Button variant="outline" className="border-border/80">
              Schedule email
            </Button>
            <Button>Download PDF</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Acquisition vs verification</CardTitle>
            <p className="text-sm text-muted-foreground">
              Demo weekly cohort — swap with warehouse facts.
            </p>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REPORTS_TREND} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                  <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} width={36} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="signups"
                    name="Signups"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="verifications"
                    name="Verifications"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quality gates</CardTitle>
            <p className="text-sm text-muted-foreground">
              SLA-style checkpoints for onboarding and payouts.
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">KYC completion</span>
                <span className="font-semibold text-emerald-400">94.2%</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">Listing moderation SLA</span>
                <span className="font-semibold text-emerald-400">6.4h p95</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">PSP reconciliation lag</span>
                <span className="font-semibold text-amber-400">18m p95</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">Contract e-sign completion</span>
                <span className="font-semibold text-emerald-400">88.0%</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
