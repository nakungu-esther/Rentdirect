"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Search,
  Zap,
} from "lucide-react";
import { authApi } from "@/lib/api";
import { getSessionUser, clearSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DASHBOARD_HOME, DASHBOARD_ROLE_LABEL, type DashboardVariant } from "./dashboard-nav";

function topStat(variant: DashboardVariant): { label: string; value: string; href?: string } {
  switch (variant) {
    case "tenant":
      return {
        label: "Wallet balance",
        value: "UGX —",
        href: "/tenant/wallet",
      };
    case "landlord":
      return {
        label: "Revenue summary",
        value: "UGX —",
        href: "/landlord/analytics",
      };
    case "agent":
      return {
        label: "Commission summary",
        value: "UGX —",
        href: "/agent/commissions",
      };
    default:
      return { label: "Platform", value: "Live" };
  }
}

function messagesHref(v: DashboardVariant): string {
  switch (v) {
    case "tenant":
      return "/tenant/messages";
    case "landlord":
      return "/landlord/messages";
    case "agent":
      return "/agent/messages";
    default:
      return "/government";
  }
}

function notificationsHref(v: DashboardVariant): string {
  switch (v) {
    case "tenant":
      return "/tenant/notifications";
    case "landlord":
      return "/landlord/notifications";
    case "agent":
      return "/agent/notifications";
    default:
      return "/government";
  }
}

function searchHrefForVariant(v: DashboardVariant): string | undefined {
  if (v === "tenant") return "/tenant/search";
  if (v === "landlord") return "/landlord/search";
  if (v === "agent") return "/agent/search";
  return undefined;
}

function searchPlaceholderForVariant(v: DashboardVariant): string {
  if (v === "tenant") return "Search properties by area, price, type…";
  if (v === "landlord") return "Search listings, tenants, applications…";
  if (v === "agent") return "Search leads, clients, listings…";
  return "Search properties, people, or records…";
}

export function DashboardTopbar({
  variant,
  collapsed,
  onToggleCollapse,
  onOpenMobileNav,
}: {
  variant: DashboardVariant;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobileNav: () => void;
}) {
  const router = useRouter();
  const user = getSessionUser();
  const stat = topStat(variant);
  const home = DASHBOARD_HOME[variant];
  const msgHref = messagesHref(variant);
  const notifHref = notificationsHref(variant);
  const searchHref = searchHrefForVariant(variant);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    clearSession();
    router.replace("/login");
  };

  const initials =
    user?.fullName
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?";

  const searchPlaceholder = searchPlaceholderForVariant(variant);

  return (
    <header className="sticky top-0 z-30 flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b border-white/10 bg-[#0B111B]/90 px-2 py-1.5 backdrop-blur-xl sm:gap-3 sm:px-4 sm:py-0">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-slate-300 hover:bg-white/5 hover:text-white lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hidden h-9 w-9 shrink-0 text-slate-400 hover:bg-white/5 hover:text-[#00C853] lg:flex"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeft className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
      </Button>

      <div className="relative min-w-0 flex-1 basis-[min(100%,12rem)] md:max-w-md lg:max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-500" />
        {searchHref ? (
          <Link href={searchHref} className="block">
            <Input
              readOnly
              placeholder={searchPlaceholder}
              className="h-10 cursor-pointer border-white/10 bg-[#1F2937]/80 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-[#00C853]/40"
              aria-label="Open search"
            />
          </Link>
        ) : (
          <Input
            readOnly
            placeholder={searchPlaceholder}
            className="h-10 border-white/10 bg-[#1F2937]/80 pl-10 text-sm text-slate-100 placeholder:text-slate-500"
            aria-label="Search (coming soon)"
          />
        )}
      </div>

      {variant === "landlord" ? (
        <Link
          href="/landlord/listings/new"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#00C853] px-3 py-2 text-sm font-semibold text-[#0B111B] shadow-lg shadow-[#00C853]/20 transition hover:bg-[#00e05c] sm:px-4"
          aria-label="Add property"
        >
          <Plus className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Add property</span>
        </Link>
      ) : null}

      <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
        {variant === "agent" ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-400 hover:bg-white/5 hover:text-white"
              asChild
              aria-label="Notifications"
            >
              <Link href={notifHref}>
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-amber-400 hover:bg-white/5 hover:text-amber-300"
              asChild
              aria-label="Lead alerts"
              title="Lead alerts"
            >
              <Link href="/agent/leads">
                <Zap className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#00C853] ring-2 ring-[#0B111B]" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-white/5 hover:text-white" asChild aria-label="Messages">
              <Link href={msgHref}>
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
            {stat.href ? (
              <Link
                href={stat.href}
                className="flex min-w-0 max-w-[9rem] shrink-0 flex-col justify-center rounded-xl border border-white/10 bg-[#1F2937]/80 px-2 py-1 text-right transition hover:border-[#00C853]/35 sm:max-w-none sm:px-3 sm:py-1.5"
                title="Connect payouts for live commission totals"
              >
                <p className="text-[9px] font-bold uppercase leading-tight tracking-wide text-slate-400 sm:text-[10px]">
                  {stat.label}
                </p>
                <p className="text-xs font-bold tabular-nums text-[#00C853] sm:text-sm">{stat.value}</p>
              </Link>
            ) : null}
          </>
        ) : (
          <>
            {stat.href ? (
              <Link
                href={stat.href}
                className="hidden rounded-xl border border-white/10 bg-[#1F2937]/80 px-2.5 py-1 text-right transition hover:border-[#00C853]/35 sm:block sm:px-3 sm:py-1.5"
                title="Connect analytics and ledger for live figures"
              >
                <p className="text-[9px] font-bold uppercase leading-tight tracking-wide text-slate-400 sm:text-[10px]">
                  {stat.label}
                </p>
                <p className="text-xs font-bold tabular-nums text-[#00C853] sm:text-sm">{stat.value}</p>
              </Link>
            ) : (
              <div className="hidden rounded-xl border border-white/10 bg-[#1F2937]/80 px-3 py-1.5 text-right sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  {stat.label}
                </p>
                <p className="text-sm font-bold tabular-nums text-[#00C853]">{stat.value}</p>
              </div>
            )}

            <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-white/5 hover:text-white" asChild aria-label="Notifications">
              <Link href={notifHref}>
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-white/5 hover:text-white" asChild aria-label="Messages">
              <Link href={msgHref}>
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#00C853]/40 bg-[#1F2937] p-0 text-[#00C853] hover:bg-[#00C853] hover:text-[#0B111B]"
              aria-label="Profile menu"
            >
              <span className="text-xs font-bold">{initials}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-white/10 bg-[#1F2937] text-slate-100">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-white">
                  {user?.fullName ?? "User"}
                </span>
                <span className="text-xs text-slate-400">{user?.email}</span>
                <span className="text-xs font-medium capitalize text-[#00C853]">
                  {DASHBOARD_ROLE_LABEL[variant]}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            {variant === "tenant" ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/tenant/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tenant/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
              </>
            ) : null}
            {variant === "landlord" ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/landlord/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/landlord/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
              </>
            ) : null}
            {variant === "agent" ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/agent/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/agent/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
              </>
            ) : null}
            <DropdownMenuItem asChild>
              <Link href={home}>Dashboard home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/">Public site</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => void logout()}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
