import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AdminKpiCardProps = {
  title: string;
  value: string;
  hint?: string;
  delta?: string;
  deltaUp?: boolean;
  icon: LucideIcon;
  className?: string;
};

export function AdminKpiCard({
  title,
  value,
  hint,
  delta,
  deltaUp = true,
  icon: Icon,
  className,
}: AdminKpiCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-transform duration-300 hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-lg border border-border/60 bg-secondary/50 p-2 text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
        {delta ? (
          <p
            className={cn(
              "mt-2 text-xs font-medium",
              deltaUp ? "text-emerald-400" : "text-amber-400",
            )}
          >
            {delta}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
