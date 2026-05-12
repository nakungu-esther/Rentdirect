"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RentDirectLogo } from "@/components/brand/RentDirectLogo";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Blocks,
  Check,
  Quote,
  Shield,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";

type ListingRow = {
  id: string;
  title: string;
  location: string;
  priceUGX: string | number;
  propertyType: string;
  bedrooms?: number;
};

type PageData = {
  data: ListingRow[];
  total: number;
};

const STATIC_FEATURED = [
  {
    id: "demo-1",
    title: "Kampala city apartment",
    location: "Nakasero",
    priceUGX: "2,800,000",
    propertyType: "Apartment",
    bedrooms: 2,
  },
  {
    id: "demo-2",
    title: "Garden family home",
    location: "Entebbe",
    priceUGX: "4,200,000",
    propertyType: "House",
    bedrooms: 4,
  },
  {
    id: "demo-3",
    title: "Executive studio",
    location: "Kololo",
    priceUGX: "1,950,000",
    propertyType: "Studio",
    bedrooms: 1,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "RentDirect gave us one place for applications, contracts, and MoMo rent — exactly what our portfolio needed.",
    name: "D. Nakato",
    role: "Landlord · Kampala",
  },
  {
    quote:
      "As a tenant I could verify the listing, sign digitally, and track payments without chasing agents on WhatsApp.",
    name: "J. Okello",
    role: "Tenant · Uganda",
  },
  {
    quote:
      "The agent workspace keeps leads and viewings organised — commission visibility is a big plus for our team.",
    name: "A. Mirembe",
    role: "Property agent",
  },
];

const PRICING = [
  {
    name: "Tenant",
    price: "Free browse",
    desc: "Search, save, and apply. Pay only when you rent.",
    features: ["Verified listings", "Applications & status", "Secure payments"],
    cta: "Create tenant account",
    href: "/register",
    highlight: false,
  },
  {
    name: "Landlord",
    price: "Scale",
    desc: "List inventory, contracts, and rent collection in one stack.",
    features: ["Listings & media", "Tenant pipeline", "Analytics & reports"],
    cta: "Start as landlord",
    href: "/register",
    highlight: true,
  },
  {
    name: "Agent",
    price: "Pro",
    desc: "Leads, schedules, and commission tracking for closing teams.",
    features: ["Lead inbox", "Deal pipeline", "Commission views"],
    cta: "Join as agent",
    href: "/register",
    highlight: false,
  },
];

function formatPrice(p: string | number) {
  if (typeof p === "number") return new Intl.NumberFormat("en-UG").format(p) + " UGX";
  return String(p) + (String(p).includes("UGX") ? "" : " UGX");
}

export function MarketingLanding() {
  const [featured, setFeatured] = useState<ListingRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<PageData>("/listings", {
          params: { page: 1, limit: 3 },
        });
        if (!cancelled && data?.data?.length) setFeatured(data.data.slice(0, 3));
      } catch {
        if (!cancelled) setFeatured(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = featured?.length ? featured : STATIC_FEATURED;

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section
        id="hero"
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-[#f0fdf4]/80 to-white px-6 py-16 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 sm:px-10 sm:py-20 lg:px-14"
      >
        <div
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#1b4332]/[0.06] blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
          <div className="flex justify-center">
            <RentDirectLogo size="md" />
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Premium rentals, contracts &amp; payments — one platform.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Enterprise-style workflows for tenants, landlords, and agents — with optional
            on-chain verification and Walrus-ready document storage as you scale.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 rounded-full bg-[#1b4332] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0d2818]"
            >
              Browse properties
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-[#1b4332]/40 hover:text-[#1b4332]"
            >
              How it works
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-[#1b4332] underline-offset-4 hover:underline"
            >
              Create free account
            </Link>
          </div>
          </motion.div>
        </div>
      </section>

      {/* Featured properties */}
      <section id="featured" className="scroll-mt-24 pt-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Featured properties
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Curated from live inventory when your API is online — demo cards otherwise.
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-[#1b4332] hover:underline"
          >
            View all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((l) => (
            <Link
              key={l.id}
              href={l.id.startsWith("demo") ? "/listings" : `/listings/${l.id}`}
              className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-[#1b4332]/25 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-slate-100 to-[#ecfdf5]" />
              <h3 className="mt-4 font-bold text-slate-900 group-hover:text-[#1b4332] dark:text-white dark:group-hover:text-emerald-400">
                {l.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {l.location} · {l.propertyType}
                {l.bedrooms != null ? ` · ${l.bedrooms} bed` : ""}
              </p>
              <p className="mt-3 text-lg font-bold text-[#1b4332]">{formatPrice(l.priceUGX)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 pt-20">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">How it works</h2>
        <p className="mt-1 max-w-2xl text-slate-600">
          From discovery to move-in — a clear path for every role.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Discover",
              body: "Search verified listings with filters, media, and transparent pricing.",
            },
            {
              step: "02",
              title: "Commit",
              body: "Apply, sign leases digitally, and align on terms with landlords or agents.",
            },
            {
              step: "03",
              title: "Pay & live",
              body: "Settle rent with MoMo, Airtel, or cards — receipts and history in one wallet.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
            >
              <span className="text-xs font-black text-[#1b4332]/60">{s.step}</span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blockchain security */}
      <section id="onchain" className="scroll-mt-24 pt-20">
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-900 px-6 py-14 text-white sm:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
              <Blocks className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
              Blockchain-ready security
            </h2>
            <p className="mt-4 text-slate-300">
              Sui smart contracts for lease attestation, Walrus for durable document storage, and
              cryptographic receipts for high-trust rent events — designed for auditability without
              sacrificing UX.
            </p>
            <ul className="mx-auto mt-8 flex max-w-lg flex-col gap-3 text-left text-sm text-slate-200">
              {[
                "On-chain lease verification hooks",
                "Walrus-backed document vaults",
                "Wallet-native payment receipts (roadmap)",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="scroll-mt-24 pt-20">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Trusted by operators</h2>
        <p className="mt-1 text-slate-600">Early design partners across Uganda&apos;s rental market.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
            >
              <Quote className="h-8 w-8 text-[#1b4332]/25" aria-hidden />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 border-t border-slate-100 pt-4">
                <p className="font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 pb-8 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Plans</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-600">
            Role-based workspaces. Final billing tiers connect to your subscription service.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={
                "flex flex-col rounded-2xl border p-8 shadow-sm " +
                (plan.highlight
                  ? "border-[#1b4332] bg-[#1b4332] text-white shadow-lg shadow-[#1b4332]/20"
                  : "border-slate-200/90 bg-white")
              }
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  className={
                    plan.highlight ? "h-5 w-5 text-emerald-200" : "h-5 w-5 text-[#1b4332]"
                  }
                />
                <h3 className="text-lg font-bold">{plan.name}</h3>
              </div>
              <p
                className={
                  "mt-2 text-3xl font-extrabold tracking-tight " +
                  (plan.highlight ? "text-white" : "text-slate-900")
                }
              >
                {plan.price}
              </p>
              <p
                className={
                  "mt-2 text-sm " + (plan.highlight ? "text-emerald-100" : "text-slate-600")
                }
              >
                {plan.desc}
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check
                      className={
                        "h-4 w-4 shrink-0 " +
                        (plan.highlight ? "text-emerald-300" : "text-[#1b4332]")
                      }
                    />
                    <span className={plan.highlight ? "text-emerald-50" : "text-slate-700"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={
                  "mt-8 inline-flex justify-center rounded-full px-5 py-2.5 text-center text-sm font-bold transition " +
                  (plan.highlight
                    ? "bg-white text-[#1b4332] hover:bg-emerald-50"
                    : "bg-[#1b4332] text-white hover:bg-[#0d2818]")
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
