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
        className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-card via-card/95 to-card px-6 py-16 shadow-lg shadow-emerald-500/10 dark:border-emerald-500/20 dark:from-card dark:via-card dark:to-card sm:px-10 sm:py-20 lg:px-14"
      >
        <div
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-emerald-500/[0.08] blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
          <div className="flex justify-center">
            <RentDirectLogo size="md" />
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Premium rentals, contracts &amp; payments — one platform.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Enterprise-style workflows for tenants, landlords, and agents — with optional
            on-chain verification and Walrus-ready document storage as you scale.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition hover:shadow-lg hover:shadow-primary/60 hover:brightness-110"
            >
              Browse properties
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-card/50 px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/50 hover:bg-primary/5"
            >
              How it works
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline hover:text-primary/80"
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
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Featured properties
            </h2>
            <p className="mt-1 text-muted-foreground">
              Curated from live inventory when your API is online — demo cards otherwise.
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
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
              className="group flex flex-col rounded-xl border border-primary/20 bg-card p-5 shadow-md shadow-primary/10 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-secondary to-secondary/50" />
              <h3 className="mt-4 font-bold text-foreground group-hover:text-primary transition-colors">
                {l.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {l.location} · {l.propertyType}
                {l.bedrooms != null ? ` · ${l.bedrooms} bed` : ""}
              </p>
              <p className="mt-3 text-lg font-bold text-primary">{formatPrice(l.priceUGX)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 pt-20">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">How it works</h2>
        <p className="mt-1 max-w-2xl text-muted-foreground">
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
              className="rounded-xl border border-primary/20 bg-card p-6 shadow-md shadow-primary/10"
            >
              <span className="text-xs font-black text-primary/60">{s.step}</span>
              <h3 className="mt-2 text-lg font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blockchain security */}
      <section id="onchain" className="scroll-mt-24 pt-20">
        <div className="overflow-hidden rounded-xl border border-primary/30 bg-card px-6 py-14 text-foreground sm:px-10 shadow-lg shadow-primary/10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Blocks className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Blockchain-ready security
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sui smart contracts for lease attestation, Walrus for durable document storage, and
              cryptographic receipts for high-trust rent events — designed for auditability without
              sacrificing UX.
            </p>
            <ul className="mx-auto mt-8 flex max-w-lg flex-col gap-3 text-left text-sm text-muted-foreground">
              {[
                "On-chain lease verification hooks",
                "Walrus-backed document vaults",
                "Wallet-native payment receipts (roadmap)",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="scroll-mt-24 pt-20">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Trusted by operators</h2>
        <p className="mt-1 text-muted-foreground">Early design partners across Uganda&apos;s rental market.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-xl border border-primary/20 bg-card p-6 shadow-md shadow-primary/10"
            >
              <Quote className="h-8 w-8 text-primary/25" aria-hidden />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-4 border-t border-border/50 pt-4">
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 pb-8 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Plans</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Role-based workspaces. Final billing tiers connect to your subscription service.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={
                "flex flex-col rounded-xl border p-8 shadow-md transition " +
                (plan.highlight
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "border-primary/20 bg-card shadow-primary/10")
              }
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  className={
                    plan.highlight ? "h-5 w-5 text-primary-foreground" : "h-5 w-5 text-primary"
                  }
                />
                <h3 className="text-lg font-bold">{plan.highlight ? "text-primary-foreground" : "text-foreground"}</h3>
              </div>
              <p
                className={
                  "mt-2 text-3xl font-extrabold tracking-tight " +
                  (plan.highlight ? "text-primary-foreground" : "text-foreground")
                }
              >
                {plan.price}
              </p>
              <p
                className={
                  "mt-2 text-sm " + (plan.highlight ? "text-primary-foreground/90" : "text-muted-foreground")
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
                        (plan.highlight ? "text-primary-foreground" : "text-primary")
                      }
                    />
                    <span className={plan.highlight ? "text-primary-foreground" : "text-muted-foreground"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={
                  "mt-8 inline-flex justify-center rounded-lg px-5 py-2.5 text-center text-sm font-bold transition " +
                  (plan.highlight
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-md"
                    : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/40 shadow-md shadow-primary/20")
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
