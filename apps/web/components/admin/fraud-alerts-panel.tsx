"use client";

import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type FraudAlert = {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  time: string;
};

const defaultAlerts: FraudAlert[] = [
  {
    id: "1",
    title: "Velocity check — mobile wallet",
    description:
      "Three failed OTP attempts from the same device fingerprint within 10 minutes.",
    severity: "warning",
    time: "12m ago",
  },
  {
    id: "2",
    title: "Listing price anomaly",
    description:
      "Unit posted at 0.3× district median for similar inventory. Awaiting moderator queue.",
    severity: "info",
    time: "1h ago",
  },
  {
    id: "3",
    title: "Cross-border settlement mismatch",
    description:
      "Ledger totals diverged from PSP webhook by UGX 250,000 on batch #4821.",
    severity: "critical",
    time: "3h ago",
  },
];

const severityConfig = {
  critical: {
    icon: ShieldAlert,
    badge: "destructive" as const,
    border: "border-destructive/40 bg-destructive/5",
  },
  warning: {
    icon: AlertTriangle,
    badge: "warning" as const,
    border: "border-amber-500/25 bg-amber-500/5",
  },
  info: {
    icon: ShieldCheck,
    badge: "secondary" as const,
    border: "border-border bg-muted/30",
  },
};

export function FraudAlertsPanel({ alerts = defaultAlerts }: { alerts?: FraudAlert[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Fraud & risk signals</CardTitle>
        <p className="text-sm text-muted-foreground">
          Curated queue — wire to your rules engine and PSP webhooks when ready.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px] px-6 pb-6">
          <div className="space-y-3 pr-3">
            {alerts.map((a) => {
              const cfg = severityConfig[a.severity];
              const Icon = cfg.icon;
              return (
                <div
                  key={a.id}
                  className={cn(
                    "flex gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/30",
                    cfg.border,
                  )}
                >
                  <div className="mt-0.5 text-muted-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium leading-tight">{a.title}</span>
                      <Badge variant={cfg.badge} className="uppercase">
                        {a.severity}
                      </Badge>
                      <span className="ml-auto text-xs text-muted-foreground">{a.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
