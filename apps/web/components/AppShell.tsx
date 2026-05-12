"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

type Variant = "tenant" | "landlord" | "agent" | "admin" | "government";

export function AppShell({
  variant,
  children,
}: {
  variant: Variant;
  children: React.ReactNode;
}) {
  if (variant === "admin") {
    return <>{children}</>;
  }

  return <DashboardShell variant={variant}>{children}</DashboardShell>;
}
