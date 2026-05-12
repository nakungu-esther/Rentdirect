"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { RentDirectLogo, RentDirectLogoChip } from "@/components/brand/RentDirectLogo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DASHBOARD_HOME,
  DASHBOARD_NAV,
  DASHBOARD_ROLE_LABEL,
  isDashboardNavActive,
  type DashboardVariant,
} from "./dashboard-nav";

export function DashboardSidebar({
  variant,
  collapsed,
  mobileOpen,
  onCloseMobile,
  onLogout,
}: {
  variant: DashboardVariant;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const home = DASHBOARD_HOME[variant];
  const sections = DASHBOARD_NAV[variant];
  const roleLabel = DASHBOARD_ROLE_LABEL[variant];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 bg-[#121a26]/95 shadow-2xl shadow-black/40 backdrop-blur-xl transition-[width,transform] duration-200 ease-out lg:static lg:translate-x-0",
        collapsed ? "w-[4.5rem]" : "w-60",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-white/10 px-3",
          collapsed ? "justify-center" : "justify-start",
        )}
      >
        {!collapsed ? (
          <Link
            href={home}
            onClick={onCloseMobile}
            className="min-w-0 truncate text-left"
          >
            <RentDirectLogo size="sm" />
            <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {roleLabel}
            </span>
          </Link>
        ) : (
          <Link
            href={home}
            onClick={onCloseMobile}
            className="flex shrink-0"
            title="RentDirect"
          >
            <RentDirectLogoChip />
          </Link>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-2 pb-3">
        {sections.map((section, si) => (
          <div key={section.title || `section-${si}`}>
            {!collapsed && section.title ? (
              <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>
            ) : collapsed && si > 0 ? (
              <div className="mx-auto mb-2 mt-1 h-px w-8 bg-white/10" aria-hidden />
            ) : null}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isDashboardNavActive(pathname, item.href);
                const Icon = item.icon;
                const link = (
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-[#00C853] text-[#0B111B] shadow-lg shadow-[#00C853]/25"
                        : "text-slate-300 hover:bg-white/5 hover:text-white",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        active ? "text-[#0B111B]" : "text-slate-500 group-hover:text-[#00C853]",
                      )}
                    />
                    {!collapsed ? (
                      <>
                        <span className="min-w-0 flex-1 truncate">{item.title}</span>
                        {item.badge != null ? (
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                              active
                                ? "bg-[#0B111B]/15 text-[#0B111B]"
                                : "bg-[#00C853]/15 text-[#00C853]",
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </Link>
                );

                if (collapsed) {
                  return (
                    <li key={item.href}>
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right" className="border-white/10 bg-[#1F2937] font-medium text-slate-100">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                }

                return <li key={item.href}>{link}</li>;
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-2">
        {collapsed ? (
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-center text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                onClick={onLogout}
              >
                <LogOut className="h-[18px] w-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="border-white/10 bg-[#1F2937] text-slate-100">
              Log out
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            onClick={onLogout}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span className="font-semibold">Log out</span>
          </Button>
        )}
      </div>
    </aside>
  );
}
