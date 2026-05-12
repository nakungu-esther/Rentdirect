"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

type ListingDetail = {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  priceUGX: string | number;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
};

export default function LandlordListingDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<ListingDetail>(`/listings/${id}`);
        if (!cancelled) setListing(data);
      } catch {
        if (!cancelled) setError("Listing not found or API unavailable.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-700">{error}</p>
        <Link href="/landlord/listings" className="text-sm font-semibold text-[#1b4332] hover:underline">
          ← Properties
        </Link>
      </div>
    );
  }

  if (!listing) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  const price =
    typeof listing.priceUGX === "number"
      ? listing.priceUGX
      : Number(String(listing.priceUGX).replace(/,/g, ""));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/landlord/search"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1b4332] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Global search
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/landlord/listings" className="text-sm font-semibold text-slate-600 hover:text-[#1b4332]">
          All properties
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{listing.title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {listing.location} · {listing.address}
        </p>
        <p className="mt-3 text-xl font-bold text-[#1b4332]">
          {Number.isFinite(price) ? `UGX ${price.toLocaleString()}` : listing.priceUGX} / mo
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <p className="leading-relaxed text-slate-700">{listing.description}</p>
        <p className="mt-4 text-sm text-slate-500">
          {listing.propertyType} · {listing.bedrooms ?? 0} bed · {listing.bathrooms ?? 0} bath
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/landlord/listings/new"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-[#1b4332]/40"
        >
          Add another property
        </Link>
        <Link
          href="/landlord/applications"
          className="inline-flex items-center justify-center rounded-full bg-[#1b4332] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d2818]"
        >
          Review applications
        </Link>
        <Link
          href="/landlord/tenants"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-[#1b4332]/40"
        >
          Tenants
        </Link>
        <Link
          href="/landlord/payments"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-[#1b4332]/40"
        >
          Collect rent
        </Link>
      </div>
    </div>
  );
}
