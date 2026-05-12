"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { RentDirectLogoChip } from "@/components/brand/RentDirectLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "./admin-nav";

export function AdminSidebar({
  onNavigate,
  onLogout,
}: {
  onNavigate?: () => void;
  onLogout?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r border-border/80 bg-card/40 backdrop-blur-sm">
      <div className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
        <RentDirectLogoChip />
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">Admin</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Control center
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {ADMIN_NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" />
              {item.title}
              {item.badge != null ? (
                <span className="ml-auto rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border/60 p-3">
        <p className="mb-2 text-[10px] leading-relaxed text-muted-foreground">
          Role-gated admin routes. Wire audit exports to your SIEM.
        </p>
        {onLogout ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2 border-border/80 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        ) : null}
      </div>
    </div>
  );
}
