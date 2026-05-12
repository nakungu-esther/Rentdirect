"use client";

import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { id: "revenue", label: "Revenue", title: "Revenue" },
  { id: "occupancy", label: "Occupancy", title: "Occupancy" },
  { id: "growth", label: "Growth", title: "Growth" },
  { id: "performance", label: "Performance", title: "Performance" },
  { id: "regional", label: "Regional analytics", title: "Regional analytics" },
  { id: "ai", label: "AI insights", title: "AI insights" },
] as const;

export function WorkspaceAnalyticsTabs({ context }: { context: "landlord" | "agent" }) {
  const scope =
    context === "landlord"
      ? "Portfolio KPIs and rent roll analytics will populate from your listings and ledger."
      : "Pipeline and commission analytics will populate from your deals and CRM sync.";

  return (
    <Tabs defaultValue="revenue" className="space-y-4">
      <TabsList className="flex h-auto min-h-10 w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
        {TABS.map((t) => (
          <TabsTrigger key={t.id} value={t.id} className="text-xs sm:text-sm">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((t) => (
        <TabsContent key={t.id} value={t.id}>
          <ModulePlaceholder title={t.title} description={scope} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
