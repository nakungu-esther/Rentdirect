"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Inbox,
  LogOut,
  Menu,
  PanelLeftClose,
  Search,
  User,
  Zap,
} from "lucide-react";
import { authApi } from "@/lib/api";
import { RentDirectLogoChip } from "@/components/brand/RentDirectLogo";
import { clearSession, getSessionUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "./admin-sidebar";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = getSessionUser();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="dark flex min-h-screen flex-col bg-background font-sans text-foreground lg:flex-row">
      <header className="flex h-14 items-center justify-between border-b border-border/80 bg-card/30 px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
          <RentDirectLogoChip className="h-8 w-8" />
          <span className="text-sm">Admin</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => void logout()} aria-label="Sign out">
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border/80 bg-background transition-transform duration-200 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <AdminSidebar
          onNavigate={() => setMobileOpen(false)}
          onLogout={() => void logout()}
        />
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col lg:min-h-screen">
        <header className="sticky top-0 z-20 hidden min-h-14 flex-wrap items-center gap-2 border-b border-border/80 bg-background/80 px-4 py-1.5 backdrop-blur-md lg:flex lg:px-6">
          <Link
            href="/admin/search"
            className="relative min-w-0 max-w-md flex-1 basis-[min(100%,10rem)]"
            aria-label="Open global search"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Global search</span>
            <input
              readOnly
              placeholder="Global search — users, listings, payments…"
              className="h-9 w-full cursor-pointer rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground"
              tabIndex={-1}
            />
          </Link>

          <Link
            href="/admin"
            className="hidden shrink-0 items-center gap-2 rounded-lg border border-border/80 bg-card/40 px-3 py-1.5 text-xs font-medium transition hover:bg-muted/40 xl:flex"
            title="Live service checks on the dashboard"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="whitespace-nowrap text-muted-foreground">Platform status</span>
            <span className="font-semibold text-emerald-400">Live</span>
          </Link>

          <Separator orientation="vertical" className="hidden h-6 xl:block" />

          <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="text-amber-500" asChild title="Alerts">
              <Link href="/admin/moderation" aria-label="Alerts — moderation queue">
                <AlertTriangle className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="text-muted-foreground" asChild title="Notifications">
              <Link href="/admin/notifications" aria-label="Notifications">
                <Inbox className="h-5 w-5" />
              </Link>
            </Button>

            <Separator orientation="vertical" className="mx-0.5 hidden h-6 sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 border-border/80 px-2 sm:gap-2 sm:px-3">
                  <Zap className="h-4 w-4 shrink-0 text-primary" />
                  <span className="hidden sm:inline">Quick actions</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/moderation">Moderation queue</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/fraud">Fraud desk</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/users">User directory</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/reports">Reports</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/system">System diagnostics</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-border/80">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="max-w-[120px] truncate sm:max-w-[160px]">
                    {user?.fullName ?? "Admin"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <p className="text-xs capitalize text-muted-foreground">{user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">System Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/">Public site</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => void logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px] space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
