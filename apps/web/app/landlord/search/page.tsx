"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { api } from "@/lib/api";

type Listing = {
  id: string;
  title: string;
  location: string;
  priceUGX: string | number;
  status: string;
};

export default function LandlordGlobalSearchPage() {
  const [rows, setRows] = useState<Listing[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const { data } = await api.get<Listing[]>("/listings/mine");
        if (!c) setRows(data);
      } catch {
        if (!c) setError("Could not load your listings.");
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  const filtered =
    rows?.filter((l) => {
      if (!q.trim()) return true;
      const s = `${l.title} ${l.location} ${l.status}`.toLowerCase();
      return s.includes(q.trim().toLowerCase());
    }) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Global search</h1>
        <p className="mt-1 text-sm text-slate-600">
          Search your published inventory. Tenants and applications open from their sidebar
          modules.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by title, area, or status…"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm outline-none ring-[#1b4332]/20 placeholder:text-slate-400 focus:border-[#1b4332] focus:ring-2"
          aria-label="Search your listings"
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {!rows && !error ? <p className="text-sm text-slate-500">Loading…</p> : null}

      {rows ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.length === 0 ? (
            <li className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No listings match.{" "}
              <Link href="/landlord/listings/new" className="font-semibold text-[#1b4332] hover:underline">
                Add a property
              </Link>
            </li>
          ) : (
            filtered.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/landlord/listings/${l.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3 shadow-sm transition hover:border-[#1b4332]/30"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{l.title}</p>
                    <p className="truncate text-xs text-slate-500">
                      {l.location} · {l.status}
                    </p>
                  </div>
                  <span className="shrink-0 text-[#1b4332]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/landlord/applications"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-[#1b4332]/40"
        >
          Applications
        </Link>
        <Link
          href="/landlord/tenants"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-[#1b4332]/40"
        >
          Tenants
        </Link>
        <Link
          href="/landlord/payments"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-[#1b4332]/40"
        >
          Collect rent
        </Link>
      </div>
    </div>
  );
}
