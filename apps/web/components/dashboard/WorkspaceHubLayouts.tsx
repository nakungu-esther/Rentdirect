"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { clearSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { MESSAGES_HUB_LINKS, PAYMENT_HUB_LINKS, SETTINGS_HUB_LINKS } from "@/components/dashboard/hub-links";

export function PaymentHubLayout({
  prefix,
  children,
}: {
  prefix: "/tenant/payments" | "/landlord/payments" | "/admin/payments";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideRail = pathname.includes("/payments/new");

  return (
    <div className="space-y-6">
      {!hideRail ? (
        <nav
          className="flex flex-wrap gap-2 border-b border-white/10 pb-4"
          aria-label="Payments"
        >
          {PAYMENT_HUB_LINKS.map(({ suffix, label }) => {
            const href = `${prefix}${suffix}`;
            const active =
              pathname === href ||
              (suffix === "/transactions" &&
                (pathname === prefix || pathname === `${prefix}/transactions`));
            return (
              <Link
                key={suffix}
                href={href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-[#00C853] text-[#0B111B]"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      ) : null}
      {children}
    </div>
  );
}

export function MessagesHubLayout({
  prefix,
  children,
}: {
  prefix: "/tenant/messages" | "/landlord/messages" | "/agent/messages";
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <nav
        className="flex flex-wrap gap-2 border-b border-white/10 pb-4"
        aria-label="Messages"
      >
        {MESSAGES_HUB_LINKS.map(({ suffix, label }) => {
          const href = `${prefix}${suffix}`;
          const active =
            pathname === href ||
            (suffix === "/inbox" && pathname === prefix);
          return (
            <Link
              key={suffix}
              href={href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-[#00C853] text-[#0B111B]"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}

export function SettingsHubLayout({
  prefix,
  children,
  onLogout,
}: {
  prefix: "/tenant/settings" | "/landlord/settings" | "/agent/settings" | "/government/settings";
  children: React.ReactNode;
  onLogout?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="shrink-0 lg:w-56">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Settings</p>
        <nav className="flex flex-col gap-1" aria-label="Settings sections">
          {SETTINGS_HUB_LINKS.map(({ suffix, label }) => {
            const href = `${prefix}${suffix}`;
            const active =
              pathname === href ||
              (suffix === "/profile" && pathname === prefix);
            return (
              <Link
                key={suffix}
                href={href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#00C853] text-[#0B111B]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="mt-6 w-full rounded-lg border border-red-500/30 px-3 py-2 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            Log out
          </button>
        ) : null}
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function SettingsHubShell({
  prefix,
  children,
}: {
  prefix: "/tenant/settings" | "/landlord/settings" | "/agent/settings" | "/government/settings";
  children: React.ReactNode;
}) {
  const router = useRouter();

  const onLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    clearSession();
    router.replace("/login");
  };

  return (
    <SettingsHubLayout prefix={prefix} onLogout={onLogout}>
      {children}
    </SettingsHubLayout>
  );
}
