"use client";

import { useMemo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";
import { ROLE_MIX_CHART } from "@/lib/admin-mock-data";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export default function AdminAnalyticsPage() {
  const total = useMemo(
    () => ROLE_MIX_CHART.reduce((a, b) => a + b.value, 0),
    [],
  );

  return (
    <>
      <AdminPageHeader
        title="Analytics"
        description="Revenue, occupancy, growth, and risk signals for the marketplace. Promote tabs to Metabase or Lightdash when your warehouse is ready."
      />

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="flex h-auto min-h-10 w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="regional">Regional analytics</TabsTrigger>
          <TabsTrigger value="ai">AI insights</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <ModulePlaceholder
            title="Revenue"
            description="GMV, take rate, and rail fees once finance exports land in the warehouse."
          />
        </TabsContent>

        <TabsContent value="occupancy">
          <ModulePlaceholder
            title="Occupancy"
            description="Listing fill rates and days-on-market by cohort — wire inventory snapshots here."
          />
        </TabsContent>

        <TabsContent value="growth">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Role mix</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Indexed user base ({total.toLocaleString()} demo users).
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        name="Users"
                        data={ROLE_MIX_CHART}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={68}
                        outerRadius={100}
                        paddingAngle={3}
                      >
                        {ROLE_MIX_CHART.map((slice, i) => (
                          <Cell key={slice.name} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Interpretation</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Narrative layer for leadership reviews.
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Tenants dominate the active cohort — tune acquisition spend toward landlord supply
                  to balance marketplace liquidity.
                </p>
                <p>
                  Ops seats remain small by design; ensure break-glass access is audited and MFA
                  bound.
                </p>
                <p>
                  Swap this copy block with automated insight cards once anomaly detection is live.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Engagement</CardTitle>
              <p className="text-sm text-muted-foreground">
                Session telemetry and funnel proxies belong in this tab.
              </p>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              DAU/WAU, funnel drop-offs, and notification CTRs will populate once event pipelines land
              in BigQuery or Snowflake.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional">
          <ModulePlaceholder
            title="Regional analytics"
            description="District- and corridor-level demand maps — connect geospatial aggregates from your listings graph."
          />
        </TabsContent>

        <TabsContent value="ai">
          <ModulePlaceholder
            title="AI insights"
            description="LLM-generated summaries over KPI deltas and anomaly narratives."
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
