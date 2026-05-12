"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { clearSession } from "@/lib/session";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { DashboardUtilityRail } from "./DashboardUtilityRail";
import { rdWorkspace } from "./rd/rd-dashboard-tokens";
import type { DashboardVariant } from "./dashboard-nav";

const COLLAPSE_LS = "rd_dashboard_sidebar_collapsed";

export function DashboardShell({
  variant,
  children,
}: {
  variant: DashboardVariant;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_LS) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const persistCollapse = (next: boolean) => {
    setCollapsed(next);
    try {
      window.localStorage.setItem(COLLAPSE_LS, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    clearSession();
    router.replace("/login");
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn(rdWorkspace, "flex min-h-screen")}>
        <DashboardSidebar
          variant={variant}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={() => void logout()}
        />

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:min-h-screen">
          <DashboardTopbar
            variant={variant}
            collapsed={collapsed}
            onToggleCollapse={() => persistCollapse(!collapsed)}
            onOpenMobileNav={() => setMobileOpen(true)}
          />
          <div className="flex min-h-0 flex-1">
            <main
              data-rd-workspace
              className="min-h-0 flex-1 overflow-y-auto bg-[#0B111B] px-4 py-6 sm:px-6 lg:px-8 [&_h1]:!text-white [&_h1+p]:!text-slate-400"
            >
              <div className="mx-auto max-w-[1400px]">{children}</div>
            </main>
            <DashboardUtilityRail variant={variant} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
