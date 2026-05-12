"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { getSessionUser, homePathForRole, type SessionUser } from "@/lib/session";
import { RentDirectLogo } from "@/components/brand/RentDirectLogo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLink =
  "text-sm font-semibold text-slate-600 transition-colors hover:text-[#1b4332]";

const THEME_KEY = "rd_public_theme";
const LANG_KEY = "rd_public_lang";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [lang, setLang] = useState("EN");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setUser(getSessionUser());
    try {
      const storedLang = window.localStorage.getItem(LANG_KEY);
      if (storedLang) setLang(storedLang);
      const theme = window.localStorage.getItem(THEME_KEY);
      const prefersDark =
        theme === "dark" ||
        (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
        setDark(true);
      } else {
        document.documentElement.classList.remove("dark");
        setDark(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = (nextDark: boolean) => {
    setDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      try {
        window.localStorage.setItem(THEME_KEY, "dark");
      } catch {
        /* ignore */
      }
    } else {
      document.documentElement.classList.remove("dark");
      try {
        window.localStorage.setItem(THEME_KEY, "light");
      } catch {
        /* ignore */
      }
    }
  };

  const setLanguage = (code: string) => {
    setLang(code);
    try {
      window.localStorage.setItem(LANG_KEY, code);
    } catch {
      /* ignore */
    }
  };

  const dash = user ? homePathForRole(user.role) : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="shrink-0 rounded-xl ring-1 ring-slate-900/5 transition hover:ring-sky-400/25 dark:ring-white/10"
          >
            <RentDirectLogo size="md" priority />
          </Link>

          <nav className="ml-2 hidden flex-1 flex-wrap items-center gap-x-4 gap-y-2 lg:flex lg:gap-x-5">
            <Link href="/listings" className={navLink}>
              Browse properties
            </Link>
            <Link href="/#how-it-works" className={navLink}>
              How it works
            </Link>
            <Link href="/#pricing" className={navLink}>
              Pricing
            </Link>
            <Link href="/agents" className={navLink}>
              Agents
            </Link>
            <Link href="/about" className={navLink}>
              About
            </Link>
            <Link href="/contact" className={navLink}>
              Contact
            </Link>
            <Link href="/faq" className={navLink}>
              FAQ
            </Link>
            {!user ? (
              <>
                <Link href="/login" className={navLink}>
                  Login
                </Link>
                <Link href="/register" className={navLink}>
                  Register
                </Link>
              </>
            ) : null}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {lang}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setLanguage("EN")}>English (EN)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("FR")}>Français (FR)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("SW")}>Swahili (SW)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme(!dark)}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {!user ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-slate-500 dark:text-slate-400"
                asChild
                title="Sign in to view notifications"
              >
                <Link href="/login" aria-label="Notifications — sign in to view">
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 shrink-0 text-slate-500 dark:text-slate-400"
                asChild
                title="Notifications"
              >
                <Link href={dash ?? "/tenant"} aria-label="Open dashboard for notifications">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#1b4332] dark:bg-emerald-400" />
                </Link>
              </Button>
            )}

            {user ? (
              <Link
                href={dash ?? "/tenant"}
                className="rounded-full bg-[#1b4332] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d2818] dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/register"
                className="rounded-full bg-[#1b4332] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d2818] dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Get started
              </Link>
            )}
          </div>
        </div>

        <div className="flex border-t border-slate-100 px-4 py-2 dark:border-slate-800 lg:hidden">
          <nav className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold">
            <Link href="/listings" className="text-[#1b4332] dark:text-emerald-400">
              Browse
            </Link>
            <Link href="/#how-it-works" className="text-slate-600 dark:text-slate-400">
              How it works
            </Link>
            <Link href="/#pricing" className="text-slate-600 dark:text-slate-400">
              Pricing
            </Link>
            <Link href="/faq" className="text-slate-600 dark:text-slate-400">
              FAQ
            </Link>
            {!user ? (
              <>
                <Link href="/login" className="text-slate-600 dark:text-slate-400">
                  Login
                </Link>
                <Link href="/register" className="text-slate-600 dark:text-slate-400">
                  Register
                </Link>
                <Link
                  href="/register"
                  className="ml-auto rounded-full bg-[#1b4332] px-3 py-1 text-white dark:bg-emerald-600"
                >
                  Get started
                </Link>
              </>
            ) : (
              <Link
                href={dash ?? "/tenant"}
                className="ml-auto rounded-full bg-[#1b4332] px-3 py-1 text-white dark:bg-emerald-600"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-10 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <Link href="/" className="inline-block rounded-xl ring-1 ring-slate-900/5 transition hover:ring-sky-400/20">
              <RentDirectLogo size="sm" />
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              PropTech · FinTech · Gov-ready rental infrastructure for Uganda.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Product</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/listings" className="hover:text-[#1b4332] dark:hover:text-emerald-400">
                  Browse properties
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#1b4332] dark:hover:text-emerald-400">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#1b4332] dark:hover:text-emerald-400">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#1b4332] dark:hover:text-emerald-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#1b4332] dark:hover:text-emerald-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#1b4332] dark:hover:text-emerald-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-[#1b4332] dark:hover:text-emerald-400">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#1b4332] dark:hover:text-emerald-400">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} RentDirect UG. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
