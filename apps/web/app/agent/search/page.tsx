"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
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
  page: number;
  pages: number;
};

function priceLabel(p: string | number) {
  const n = typeof p === "number" ? p : Number(String(p).replace(/,/g, ""));
  if (Number.isFinite(n)) return `UGX ${n.toLocaleString()}`;
  return String(p);
}

export default function AgentSearchPage() {
  const [res, setRes] = useState<PageData | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<PageData>("/listings", {
          params: { page: 1, limit: 30 },
        });
        if (!cancelled) setRes(data);
      } catch {
        if (!cancelled) setError("Could not load market listings.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered =
    res?.data.filter((l) => {
      if (!q.trim()) return true;
      const s = `${l.title} ${l.location} ${l.propertyType}`.toLowerCase();
      return s.includes(q.trim().toLowerCase());
    }) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Search</h1>
        <p className="mt-1 text-sm text-slate-600">
          Market inventory for comps and client shortlists. Pair with{" "}
          <Link href="/agent/leads" className="font-semibold text-[#1b4332] hover:underline">
            Leads
          </Link>{" "}
          and{" "}
          <Link href="/agent/clients" className="font-semibold text-[#1b4332] hover:underline">
            Clients
          </Link>{" "}
          in your pipeline.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter listings…"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm outline-none ring-[#1b4332]/20 placeholder:text-slate-400 focus:border-[#1b4332] focus:ring-2"
          aria-label="Search listings"
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      {!res && !error ? <p className="text-sm text-slate-500">Loading…</p> : null}

      {res ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <li className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No matches.
            </li>
          ) : (
            filtered.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/listings/${l.id}`}
                  className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-[#1b4332]/30 hover:shadow-md"
                >
                  <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-slate-100 to-amber-50/60" />
                  <h2 className="mt-3 font-bold text-slate-900">{l.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {l.location} · {l.propertyType}
                    {l.bedrooms != null ? ` · ${l.bedrooms} bed` : ""}
                  </p>
                  <p className="mt-3 text-lg font-bold text-[#1b4332]">{priceLabel(l.priceUGX)}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#1b4332]">
                    View listing
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}

      <p className="text-xs text-slate-500">
        Public listing pages open in the shared catalog. Your signed-in agent session remains;
        use the browser back button to return here.
      </p>
    </div>
  );
}
